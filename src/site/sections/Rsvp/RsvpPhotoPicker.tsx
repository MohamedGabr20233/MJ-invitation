import { useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";

import { RSVP_LIMITS } from "../../../constants";
import type { RsvpPhotoPickerProps } from "../../../types";

const RsvpPhotoPicker = ({ photoFile, storedPhotoUrl, onPick, onRemoveStored, onReject }: RsvpPhotoPickerProps) => {
  /** Blob url for the thumbnail — derived, so no state to fall out of step. */
  const previewUrl = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : null), [photoFile]);

  // Released on the next pick and on unmount, or the blob lives for the session.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFile = event.target.files?.[0] ?? null;

    // Lets the same file be picked again after a remove — the input keeps its
    // value otherwise and never fires a second change event.
    event.target.value = "";

    if (!pickedFile) return;

    if (!pickedFile.type.startsWith("image/")) {
      onReject("Pictures only, please");
      return;
    }

    if (pickedFile.size > RSVP_LIMITS.MAX_PHOTO_BYTES) {
      onReject("That photo is over 5 MB");
      return;
    }

    onPick(pickedFile);
  };

  /* A fresh pick shows first; otherwise the photo already on the row, which is
     what a re-opened form has instead of a File. */
  const shownPhotoUrl = (photoFile && previewUrl) || storedPhotoUrl;

  if (shownPhotoUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-secondary-light/70">
        <img src={shownPhotoUrl} alt={photoFile ? `Photo you attached: ${photoFile.name}` : "The photo you sent with your answer"} className="h-32 w-full object-cover" />

        <button
          type="button"
          onClick={() => (photoFile ? onPick(null) : onRemoveStored())}
          aria-label="Remove the photo"
          className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-scrim/40 text-on-media transition-transform duration-200 active:scale-90"
        >
          <X className="size-4" />
        </button>

        {/* swapping is a second pick, so the label sits over the thumbnail */}
        <label className="absolute bottom-2 left-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-scrim/40 px-3 py-1 font-sans text-xs text-on-media">
          <ImagePlus className="size-3.5" />
          Change photo
          <input type="file" name="photo" accept={RSVP_LIMITS.ACCEPTED_PHOTO_TYPES} onChange={handleFileChange} className="sr-only" />
        </label>
      </div>
    );
  }

  return (
    /* the label is the whole target — the input itself stays out of the layout */
    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-secondary-light/70 py-3 font-sans text-sm text-on-media/80 transition-colors duration-200 active:bg-scrim/10">
      <ImagePlus className="size-5" />
      Add a photo (optional)
      <input type="file" name="photo" accept={RSVP_LIMITS.ACCEPTED_PHOTO_TYPES} onChange={handleFileChange} className="sr-only" />
    </label>
  );
};

export default RsvpPhotoPicker;
