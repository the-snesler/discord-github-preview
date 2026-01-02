import React, { ReactNode } from "react";

import { ColorTheme } from "../types";
import { sanitizeString } from "../helpers/card";
import { fontFamily } from "../helpers/fonts";

interface Props {
  content: string;
  colors: ColorTheme;
  startY: number;
}

export function aboutMeHeight(text: string) {
  const lines = text.split("\n");
  let lineCount = 0;
  for (const line of lines) {
    lineCount += Math.max(1, Math.ceil(line.length / 60));
  }
  return 45 + lineCount * 26;
}

export default function AboutMe({ content, colors, startY }: Props): ReactNode {
  if (!content) return null;

  const sanitizedText = sanitizeString(content);

  return (
    <foreignObject
      x="20"
      y={startY}
      width={660}
      height={aboutMeHeight(sanitizedText)}
      style={{ overflow: "visible" }}
    >
      <div
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          background: colors.colorB2,
          fontFamily: fontFamily,
          padding: "7px 20px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "15px",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            color: colors.colorT1,
            fontSize: "24px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          About Me
        </p>

        <p
          style={{
            color: colors.colorT2,
            margin: 0,
            fontSize: "18px",
            lineHeight: "1.4em",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
          }}
        >
          {sanitizedText}
        </p>
      </div>
    </foreignObject>
  );
}
