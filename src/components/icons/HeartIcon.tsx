// components/icons/HeartIcon.tsx

/** Solid heart. Colour comes from the current text colour. */
const HeartIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="-9.6 -14.5 219.1 194.5" preserveAspectRatio="xMidYMid meet" aria-hidden className={className}>
    <path
      d="M199.326,44.459c-11.27-57.967-81.908-58.936-99.326-4.746C82.582-14.476,11.942-13.508,0.674,44.459C-9.551,97.051,100,180.024,100,180.024S209.55,97.051,199.326,44.459z"
      fill="currentColor"
    />
  </svg>
);

export default HeartIcon;
