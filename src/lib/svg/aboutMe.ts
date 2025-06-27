import { ColorTheme } from "../..";
import { sanitizeString } from "../card";
import { FONT_FAMILY } from "../fonts";

export function aboutMeHeight(text: string) {
  return Math.max(120, 70 + Math.ceil(text.length / 40) * 24);
};

export function aboutMe(aboutMe: string, colors: ColorTheme, startY: number): string {
  if (!aboutMe) return '';
  const sanitizedText = sanitizeString(aboutMe);
  const estimatedHeight = aboutMeHeight(sanitizedText);
  return `
  <g>
    <rect x="20" y="${startY}" width="660" height="${estimatedHeight}" rx="15" style="fill:${colors.colorB2};"/>
    <text style="fill:${colors.colorT1};font-family:${FONT_FAMILY};font-size:24px;font-weight:600;" x="40" y="${startY + 40}">About Me</text>
    <foreignObject x="40" y="${startY + 48}" width="620" height="${estimatedHeight - 50}">
      <div xmlns="http://www.w3.org/1999/xhtml" 
      style="color: ${colors.colorT2}; margin: 0; font-family:${FONT_FAMILY}; font-size: 18px; line-height: 1.4em; word-wrap: break-word; white-space: pre-wrap; overflow: hidden;">
      ${sanitizedText}</div>
    </foreignObject>
  </g>`;
}
