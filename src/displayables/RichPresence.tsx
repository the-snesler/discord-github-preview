import React from "react";
import { DisplayableComponent } from "../types";
import { sanitizeString } from "../helpers/card";
import { bundlePromises, URItoBase64 } from "../helpers/utils";
import { roundImageSize } from "../helpers/discord";
import { fontFamily } from "../helpers/fonts";
import TimestampSVG from "../components/Timestamp";

export const richPresence: DisplayableComponent<{
  largeImage: string | null;
  smallImage: string | null;
}> = {
  height: 140,
  matches: ({ activity }) =>
    activity ? !!(activity.details || activity.state || activity.assets) : false,
  fetchServerProp: async ({ activity, options }) => {
    if (!activity) return { largeImage: null, smallImage: null };
    const width = options.width;
    // Fetch large and small image URLs, if they exist
    const largeImageURL = activity.assets?.largeImageURL({
      size: roundImageSize(width / 4),
      extension: "webp",
    });
    const smallImageURL = activity.assets?.smallImageURL({
      size: roundImageSize(width / 16),
      extension: "webp",
    });
    let largeImage = largeImageURL ? URItoBase64(largeImageURL) : Promise.resolve(null);
    let smallImage = smallImageURL ? URItoBase64(smallImageURL) : Promise.resolve(null);
    return bundlePromises({
      largeImage,
      smallImage,
    });
  },
  render: ({ activity, colors, y, serverProp }) => {
    if (!activity) return;
    let { largeImage, smallImage } = serverProp;
    const timestamps = activity.timestamps;
    const detailLines = [activity.details, activity.state].filter(Boolean);
    const textY = y + 30;
    const textX = 170;
    const smallCenter = [140, 115];
    if (!largeImage && smallImage) {
      // If only small image exists, use it as large image
      largeImage = smallImage;
      smallImage = null;
    }

    return (
      <g>
        <rect x="20" y={y} width="660" height="140" rx="15" style={{ fill: colors.colorB2 }} />
        <text
          style={{
            fill: colors.colorT2,
            fontFamily: fontFamily,
            fontSize: "24px",
            fontWeight: 600,
          }}
          x={textX}
          y={textY}
        >
          {sanitizeString(activity.name)}
        </text>
        {detailLines.map((line, i) => (
          <text
            key={i}
            style={{
              fill: colors.colorT2,
              fontFamily: fontFamily,
              fontSize: "20px",
            }}
            x={textX}
            y={textY + 30 + i * 30}
          >
            {sanitizeString(line || "")}
          </text>
        ))}
        {timestamps && (
          <TimestampSVG
            x={textX}
            y={textY + detailLines.length * 30}
            colors={colors}
            timeStart={timestamps.start?.getTime() || activity.createdTimestamp}
            timeEnd={timestamps.end?.getTime()}
            progressBar={true}
          />
        )}
        {largeImage && (
          <image
            xlinkHref={largeImage}
            x="30"
            y={y + 10}
            height="120"
            width="120"
            clipPath="inset(0% round 5px)"
          />
        )}
        {smallImage && (
          <>
            <rect
              x={smallCenter[0] - 22}
              y={y + smallCenter[1] - 22}
              width="44"
              height="44"
              rx="100%"
              style={{ fill: colors.colorB2 }}
            />
            <image
              xlinkHref={smallImage}
              x={smallCenter[0] - 19}
              y={y + smallCenter[1] - 19}
              height="38"
              width="38"
              clipPath="circle()"
            />
          </>
        )}
      </g>
    );
  },
};
