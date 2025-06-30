import React from "react";
import { DisplayableComponent } from "../types";
import { fetchAppIconURL } from "../helpers/discord";
import { fontFamily } from "../helpers/fonts";
import TimestampSVG from "../components/Timestamp";

export const genericActivity: DisplayableComponent<string | null> = {
  height: 140,
  fetchServerProp: async ({ activity }) =>
    activity?.applicationId ? await fetchAppIconURL(activity.applicationId) : null,
  render: ({ activity, colors, y, serverProp: iconBase64 }) => {
    if (!activity) return;
    const placeholderPath = (
      <path
        transform= {`translate(40 ${y + 20}) scale(${100 / 512})`
  }
        fill={ colors.colorT1 }
        d="M384 32H64C28.654 32 0 60.654 0 96V416C0 451.346 28.654 480 64 480H384C419.346 480 448 451.346 448 416V96C448 60.654 419.346 32 384 32ZM224 400C206 400 192 386 192 368S206 336 224 336C242 336 256 350 256 368S242 400 224 400ZM294 258L248 286V288C248 301 237 312 224 312S200 301 200 288V272C200 264 204 256 212 251L269 217C276 213 280 206 280 198C280 186 270 176 258 176H206C194 176 184 186 184 198C184 211 173 222 160 222S136 211 136 198C136 159 167 128 206 128H258C297 128 328 159 328 198C328 222 315 245 294 258Z"
  />
    );
const textY = y + 65;
const textX = 170;
return (
  <g>
  <rect x= "20" y = { y } width = "660" height = "140" rx = "15" style = {{ fill: colors.colorB2 }} />
    < text
style = {{
  fill: colors.colorT2,
    fontFamily: fontFamily,
      fontSize: "24px",
        fontWeight: 600,
          }}
x = { textX }
y = { textY }
  >
  { activity.name }
  </text>
{
  iconBase64 ? (
    <image
            xlinkHref= { iconBase64 }
            x = "30"
  y = { y + 10
}
height = "120"
width = "120"
clipPath = "inset(0% round 5px)"
  />
        ) : (
  placeholderPath
)}
<TimestampSVG
          x={ textX }
y = { textY }
colors = { colors }
timeStart = { activity.timestamps?.start?.getTime() || activity.createdTimestamp }
  />
  </g>
    );
  },
};
