import styles from "./Teddy.module.css";

export type TeddyPose = "walk" | "wave" | "happy" | "sad";

export type TeddyProps = {
  pose?: TeddyPose;
  size?: number;
  className?: string;
};

// Brand palette for the mascot. Fixed in both themes. TODO(figma): replace with the exported SVG.
const C = {
  earOuter: "#C99A6E",
  earInner: "#F3CDA6",
  fur: "#D4A373",
  muzzle: "#F6DCC0",
  dark: "#4A3426",
  cheek: "#FF9EB1",
  limb: "#C08B5C",
  bow: "#B79CF0",
  button: "#FFE7A3",
} as const;

/**
 * Sapere's mascot. Decorative only: always pair it with a text message.
 * Limbs sit in their own <g> so CSS animates the group while the shape keeps its own rotate().
 */
export function Teddy({ pose = "wave", size = 64, className }: TeddyProps) {
  const sad = pose === "sad";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-pose={pose}
      className={[styles.teddy, styles[pose], className].filter(Boolean).join(" ")}
    >
      <g className={styles.whole}>
        <g className={styles.bounce}>
          <g className={styles.legL}>
            <ellipse cx="26" cy="57.5" rx="4.6" ry="3.8" fill={C.limb} />
          </g>
          <g className={styles.legR}>
            <ellipse cx="38" cy="57.5" rx="4.6" ry="3.8" fill={C.limb} />
          </g>

          <ellipse cx="32" cy="46" rx="11.5" ry="12" fill={C.fur} />
          <ellipse cx="32" cy="48.5" rx="7.5" ry="8" fill={C.muzzle} />

          <g className={styles.armL}>
            <ellipse
              cx="21.5"
              cy="43"
              rx="3.4"
              ry="6.5"
              transform="rotate(18 21.5 43)"
              fill={C.limb}
            />
          </g>
          <g className={styles.armR}>
            {pose === "wave" ? (
              <ellipse
                cx="46.5"
                cy="32"
                rx="3.4"
                ry="6.5"
                transform="rotate(35 46.5 32)"
                fill={C.limb}
              />
            ) : (
              <ellipse
                cx="42.5"
                cy="43"
                rx="3.4"
                ry="6.5"
                transform="rotate(-18 42.5 43)"
                fill={C.limb}
              />
            )}
          </g>

          <g transform={sad ? "rotate(-8 23 17)" : undefined}>
            <circle cx="20" cy="12" r="6" fill={C.earOuter} />
            <circle cx="20" cy="12" r="3.2" fill={C.earInner} />
          </g>
          <g transform={sad ? "rotate(8 41 17)" : undefined}>
            <circle cx="44" cy="12" r="6" fill={C.earOuter} />
            <circle cx="44" cy="12" r="3.2" fill={C.earInner} />
          </g>

          <circle cx="32" cy="22" r="14" fill={C.fur} />
          <circle cx="22.5" cy="26" r="2.6" fill={C.cheek} opacity="0.7" />
          <circle cx="41.5" cy="26" r="2.6" fill={C.cheek} opacity="0.7" />

          <Eyes pose={pose} />

          <ellipse cx="32" cy="27.5" rx="7" ry="5" fill={C.muzzle} />
          <ellipse cx="32" cy="25.6" rx="2.6" ry="1.9" fill={C.dark} />
          <path
            d={
              sad
                ? "M29.5 30.6 Q32 28.8 34.5 30.6"
                : pose === "happy"
                  ? "M29 28.6 Q32 32.2 35 28.6"
                  : "M29.6 29 Q32 31 34.4 29"
            }
            stroke={C.dark}
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />

          <path d="M32 35.5 L26.4 32.4 L26.4 38.6 Z" fill={C.bow} />
          <path d="M32 35.5 L37.6 32.4 L37.6 38.6 Z" fill={C.bow} />
          <circle cx="32" cy="35.5" r="1.8" fill={C.button} />
        </g>
      </g>
    </svg>
  );
}

function Eyes({ pose }: { pose: TeddyPose }) {
  if (pose === "happy") {
    return (
      <g stroke={C.dark} strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M24.4 20.6 Q26.5 17.8 28.6 20.6" />
        <path d="M35.4 20.6 Q37.5 17.8 39.6 20.6" />
      </g>
    );
  }

  return (
    <g>
      {[26.5, 37.5].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="20" r="2.1" fill={C.dark} />
          <circle cx={cx + 0.7} cy="19.3" r="0.7" fill="#FFFFFF" />
          {pose === "sad" && (
            <>
              {/* Half-closed lid in fur colour plus a lid line. */}
              <path d={`M${cx - 2.4} 20 A2.4 2.4 0 0 1 ${cx + 2.4} 20 Z`} fill={C.fur} />
              <path
                d={`M${cx - 2.4} 20 L${cx + 2.4} 20`}
                stroke={C.dark}
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      ))}
    </g>
  );
}
