/**
 * ElmOriginLogo
 * Official brand mark extracted from "elm origin logo.svg".
 * Renders only the icon mark (no white background, no embedded text).
 *
 * Usage:
 *   <ElmOriginLogo />                    // light bg, 32 px icon, wordmark shown
 *   <ElmOriginLogo light />              // dark bg — paths rendered white
 *   <ElmOriginLogo size={28} light />    // custom icon size
 *   <ElmOriginLogo showWordmark={false}  // icon-only
 */

import { cn } from "@/app/components/ui/utils";

interface ElmOriginLogoProps {
  /** Icon square size in px. Defaults to 32. */
  size?: number;
  /** White paths for dark backgrounds. Defaults to false (#003566 on light bg). */
  light?: boolean;
  /** Show the "Elm Origin" wordmark beside the icon. Defaults to true. */
  showWordmark?: boolean;
  /** Wordmark font-size in px. Defaults to 20. */
  wordmarkSize?: number;
  /** Extra class on the wrapper div. */
  className?: string;
  /** Wrapper element type. Defaults to "div". */
  as?: React.ElementType;
}

export function ElmOriginLogo({
  size = 32,
  light = false,
  showWordmark = true,
  wordmarkSize = 20,
  className,
  as: Tag = "div",
}: ElmOriginLogoProps) {
  const iconFill  = light ? "#ffffff" : "#003566";
  const textColor = light ? "#ffffff" : "#003566";

  return (
    <Tag className={cn("inline-flex items-center gap-2.5 shrink-0", className)}>
      {/* Icon mark — viewBox cropped to the symbol only, no white rect, no text */}
      <svg
        width={size}
        height={size}
        viewBox="44 108 125 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Elm Origin"
        role="img"
        style={{ flexShrink: 0, display: "block" }}
      >
        {/* Main body — the angular arrow/cursor shape */}
        <path
          fill={iconFill}
          d="M59.95,171.11c-1.49-1.49-0.87-4.12,1.17-4.99l27.78-11.79
             c1.55-0.66,2.78-1.89,3.43-3.44l11.61-27.57c0.87-2.05,3.5-2.68,5-1.18
             l42.04,42.04c4.3,4.3,11.64,1.25,11.64-4.82v-33.93
             c0-7.98-6.47-14.46-14.46-14.46H63.25c-7.98,0-14.46,6.47-14.46,14.46
             v84.92c0,7.98,6.47,14.46,14.46,14.46h34.22
             c5.97,0,8.96-7.22,4.74-11.44L59.95,171.11z"
        />
        {/* Accent highlight */}
        <path
          fill={iconFill}
          d="M103.08,168.44l14.99,50.4c0.78,2.62,4.3,3.14,5.5,0.81
             l9.47-18.39c1.58-3.08,4.09-5.58,7.17-7.17l18.39-9.47
             c2.32-1.2,1.8-4.72-0.81-5.5l-50.4-14.99
             C104.75,163.35,102.29,165.81,103.08,168.44z"
        />
        {/* Thin decorative stroke */}
        <path
          fill={iconFill}
          d="M95.98,150.97l10.13-25.4c0.27-0.68,1.16-0.86,1.67-0.33
             l41.22,41.9l-41.22-38.86c-0.21-0.19-0.55-0.13-0.68,0.13
             L95.98,150.97z"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: "'Righteous', sans-serif",
            fontSize: wordmarkSize,
            color: textColor,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Elm Origin
        </span>
      )}
    </Tag>
  );
}
