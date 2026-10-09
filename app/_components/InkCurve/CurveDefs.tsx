import { CURVES } from "@/app/_lib/curves";

/**
 * Shared pitch-contour library, referenced by <InkCurve curve="c-…" />.
 * Render once per page.
 */
export function CurveDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {/* a slight wobble so the curves look pen-drawn */}
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
        {Object.entries(CURVES).map(([id, curve]) => (
          <g key={id} id={id}>
            {curve.paths.map((d) => (
              <path key={d} d={d} />
            ))}
            {curve.dot && <circle {...curve.dot} fill="currentColor" stroke="none" />}
          </g>
        ))}
      </defs>
    </svg>
  );
}
