// actions/submitRsvp.ts

import { RSVP_LIMITS } from "../constants";
import { RSVP_PHOTO_BUCKET, supabaseClient } from "../lib/supabase";
import type { RsvpDraft, RsvpSubmitResult } from "../types";

/** `photo.jpeg` → `jpeg`. Falls back to `jpg` when the name carries no suffix. */
const fileExtensionOf = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension && extension.length <= 5 ? extension : "jpg";
};

/**
 * Uploads the photo and hands back its object path.
 *
 * A failed upload returns `null` instead of throwing: the answer matters more
 * than the picture, so a rejected file must not cost us the RSVP.
 */
const uploadRsvpPhoto = async (photoFile: File) => {
  if (!supabaseClient) return null;

  const photoObjectPath = `${crypto.randomUUID()}.${fileExtensionOf(photoFile.name)}`;

  const { error: uploadError } = await supabaseClient.storage.from(RSVP_PHOTO_BUCKET).upload(photoObjectPath, photoFile, {
    contentType: photoFile.type || "image/jpeg",
    upsert: false,
  });

  return uploadError ? null : photoObjectPath;
};

/**
 * Sends one RSVP, or rewrites the one this browser already sent when the draft
 * carries an `rsvpId`.
 *
 * Never throws — every failure comes back as a status the section can render,
 * because the only thing worse than a broken form is a broken form that looks
 * like it worked.
 */
export const submitRsvp = async (rsvpDraft: RsvpDraft): Promise<RsvpSubmitResult> => {
  const trimmedName = rsvpDraft.guestName.trim();

  if (trimmedName.length < RSVP_LIMITS.MIN_NAME_LENGTH) return { status: "invalid", hint: "Add your name first" };
  if (trimmedName.length > RSVP_LIMITS.MAX_NAME_LENGTH) return { status: "invalid", hint: "That name is a little too long" };

  // Missing env keys land here too, and read to the guest as an outage.
  if (!supabaseClient) return { status: "unavailable" };

  const clampedGuestCount = rsvpDraft.isAttending ? Math.min(Math.max(Math.round(rsvpDraft.guestCount), RSVP_LIMITS.MIN_GUESTS), RSVP_LIMITS.MAX_GUESTS) : RSVP_LIMITS.MIN_GUESTS;

  const trimmedMessage = rsvpDraft.message.trim().slice(0, RSVP_LIMITS.MAX_MESSAGE_LENGTH);

  // The id is minted here rather than read back from the insert: there is no
  // select policy, so `.insert().select()` would come back empty.
  const rsvpId = rsvpDraft.rsvpId ?? crypto.randomUUID();
  const isChangingAnswer = rsvpDraft.rsvpId !== null;

  try {
    // A fresh pick wins; with no pick the path already on the row rides along,
    // which is what keeps the photo alive through a change of answer.
    const uploadedPhotoPath = rsvpDraft.photoFile ? await uploadRsvpPhoto(rsvpDraft.photoFile) : null;
    const photoPath = uploadedPhotoPath ?? rsvpDraft.photoPath;

    const answerFields = {
      guest_name: trimmedName,
      is_attending: rsvpDraft.isAttending,
      guest_count: clampedGuestCount,
      message: trimmedMessage || null,
    };

    if (isChangingAnswer) {
      const { error: updateError } = await supabaseClient
        .from("rsvp_responses")
        .update({
          ...answerFields,
          updated_at: new Date().toISOString(),
          photo_path: photoPath,
        })
        .eq("id", rsvpId);

      if (updateError) return { status: "unavailable" };

      return { status: "sent", rsvpId, photoPath };
    }

    const { error: insertError } = await supabaseClient.from("rsvp_responses").insert({ id: rsvpId, ...answerFields, photo_path: photoPath });

    if (insertError) return { status: "unavailable" };

    return { status: "sent", rsvpId, photoPath };
  } catch {
    // Offline, DNS, CORS, a paused project — all the same to the guest.
    return { status: "unavailable" };
  }
};
