import React from "react";
import { DisplayableComponent } from "../types";
import { setOpacity, URItoBase64 } from "../helpers/utils";
import { fontFamily } from "../helpers/fonts";

export const customStatus: DisplayableComponent<string | null> = {
  height: 0,
  matches: ({ activity }) => activity?.type === 4,
  fetchServerProp: async ({ activity }) => {
    if (!activity) return null;
    const hasCustomEmoji = activity.emoji !== null && activity.emoji.id !== null;
    const emojiUrl = hasCustomEmoji ? activity.emoji?.imageURL({ size: 64 }) : null;
    return URItoBase64(emojiUrl as string);
  },
  render: ({ activity, colors, y, bannerHeight, serverProp }) => {
    if (!activity) return;
    const hasEmoji = activity.emoji !== null;
    const hasText = activity.state !== null;
    const hasCustomEmoji = activity.emoji !== null && activity.emoji.id !== null;
    const emojiSize = hasEmoji && !hasText ? 70 : 30;
    const emojiName = activity.emoji?.name;
    const background = setOpacity(colors.colorB2, 1);

    return (
      <>
      <circle cx= "220" cy = { bannerHeight - 30
  } r="15" style={{ fill: background }} />
    < circle cx = "250" cy = { bannerHeight + 5} r = "25" style = {{ fill: background }} />
      < foreignObject x = "200" y = { bannerHeight + 5} width = { 480} height = { 120} >
        <div
            // @ts-ignore
            xmlns="http://www.w3.org/1999/xhtml"
style = {{
  backgroundColor: background,
    borderRadius: "25px",
      padding: "1rem",
        display: "flex",
          alignItems: "center",
            gap: "10px",
              boxSizing: "border-box",
                width: "max-content",
            }}
          >
  { hasCustomEmoji && (
    <img
                src={ serverProp as string }
style = {{
  height: `${emojiSize}px`,
    width: `${emojiSize}px`,
                }}
alt = "emoji"
  />
            )}
{
  hasEmoji && !hasCustomEmoji && (
    <span
                style={
    {
      color: colors.colorT1,
        fontFamily: fontFamily,
          fontSize: `${emojiSize - 4}px`,
                }
  }
              >
    { emojiName }
    </span>
            )
}
{
  hasText && (
    <p
                style={
    {
      color: colors.colorT2,
        margin: 0,
          fontFamily: fontFamily,
            fontSize: "22px",
              fontStyle: "italic",
                lineHeight: "1.2em",
                  flex: 1,
                }
  }
              >
    { activity.state }
    </p>
            )
}
</div>
  </foreignObject>
  </>
    );
  },
};
