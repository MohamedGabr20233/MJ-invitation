import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { COUPLES_NAMES } from "../constants";
import { useComingAuthStore } from "../store/comingAuthStore";

const MESSAGES = {
  rejected: "Wrong username or password.",
  unconfigured: "This build has no sign-in credentials set. Add them to the environment and redeploy.",
} as const;

/**
 * The sign-in standing in front of the guest list. Deliberately plain — it is
 * seen by one person, and only ever on the way to somewhere else.
 */
const ComingLogin = () => {
  const status = useComingAuthStore((state) => state.status);
  const submit = useComingAuthStore((state) => state.signIn);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isChecking = status === "checking";
  const hint = status === "rejected" || status === "unconfigured" ? MESSAGES[status] : null;

  return (
    <div className="mx-auto grid min-h-dvh w-full place-items-center bg-surface px-4 md:max-w-150">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(username, password);
        }}
        className="w-full max-w-80 rounded-2xl border-2 border-secondary-light bg-surface-raised px-5 py-7 shadow-card"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-on-media">
            <Lock className="size-5" />
          </span>

          <h1 className="mt-3 font-alex text-4xl text-primary">
            {COUPLES_NAMES.MALE} &amp; {COUPLES_NAMES.FEMALE}
          </h1>

          <p className="mt-1 font-sans text-[0.625rem] uppercase tracking-[0.3em] text-secondary-dark">guest list · sign in</p>
        </div>

        <label className="mt-6 block font-sans text-xs font-bold uppercase tracking-widest text-secondary-dark" htmlFor="coming-username">
          username
        </label>
        <input
          id="coming-username"
          name="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className="mt-1 w-full rounded-xl border-2 border-secondary-light bg-surface px-3 py-2 font-sans text-sm text-primary outline-none focus:border-secondary-dark"
        />

        <label className="mt-4 block font-sans text-xs font-bold uppercase tracking-widest text-secondary-dark" htmlFor="coming-password">
          password
        </label>
        <input
          id="coming-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-xl border-2 border-secondary-light bg-surface px-3 py-2 font-sans text-sm text-primary outline-none focus:border-secondary-dark"
        />

        {/* one line, whatever went wrong — the form has no room for more */}
        {hint && (
          <p role="alert" className="mt-3 font-sans text-xs text-accent">
            {hint}
          </p>
        )}

        <button
          type="submit"
          disabled={isChecking || status === "unconfigured"}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2 font-sans text-sm font-bold text-on-media transition-transform duration-200 active:scale-95 disabled:opacity-50"
        >
          {isChecking && <Loader2 className="size-4 animate-spin" />}
          {isChecking ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default ComingLogin;
