// components/icons/LeafDivider.tsx

/** Two wheat sprigs leaning toward a centre diamond. Closes a section. */
const LeafDivider = () => (
  <svg viewBox="0 0 220 24" fill="none" aria-hidden className="text-secondary h-5 w-52">
    <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      {/* left sprig, tip pointing outward, growing toward the centre */}
      <path d="M14 16q38-9 82-4" />
      <path d="M30 13q4-6 11-5M46 11q4-6 11-5M62 10q4-6 11-5M78 9q4-6 11-5" />
      <path d="M38 14q5 5 12 4M54 12q5 5 12 4M70 11q5 5 12 4" />
      {/* right sprig, mirrored */}
      <path d="M206 16q-38-9-82-4" />
      <path d="M190 13q-4-6-11-5M174 11q-4-6-11-5M158 10q-4-6-11-5M142 9q-4-6-11-5" />
      <path d="M182 14q-5 5-12 4M166 12q-5 5-12 4M150 11q-5 5-12 4" />
    </g>
    <rect x="106" y="8" width="8" height="8" transform="rotate(45 110 12)" fill="currentColor" />
  </svg>
);

export default LeafDivider;
