// components/icons/DiamondRule.tsx

import type { IconProps } from "../../types";

/** Rule, centre diamond, rule. Sits under a heading. */
const DiamondRule = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 160 8" aria-hidden className={`text-secondary ${className}`}>
    <line x1="0" y1="4" x2="70" y2="4" stroke="currentColor" strokeWidth="1" />
    <line x1="90" y1="4" x2="160" y2="4" stroke="currentColor" strokeWidth="1" />
    <rect x="76" y="0" width="8" height="8" transform="rotate(45 80 4)" fill="currentColor" />
  </svg>
);

export default DiamondRule;
