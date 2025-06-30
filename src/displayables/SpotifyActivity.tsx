import React from "react";
import { DisplayableComponent } from "../types";
import { sanitizeString } from "../helpers/card";
import { spotifyGreen } from "../helpers/themes";
import { URItoBase64, truncate, formatDuration } from "../helpers/utils";
import AnimatedDuration from "../components/AnimatedDuration";
import { fontFamily } from "../helpers/fonts";

// Spotify-specific activity handler with album art and progress bar
export const spotifyActivity: DisplayableComponent<string | null> = {
  height: 140,
  matches: ({ activity }) => activity?.name === "Spotify",
  fetchServerProp: async ({ activity }) => {
    // Fetch album art if available
    const albumArtURL = activity?.assets?.largeImageURL({ size: 256, extension: "webp" });
    return albumArtURL ? URItoBase64(albumArtURL) : null;
  },
  render: ({ activity, colors, y, serverProp: albumArtBase64 }) => {
    if (!activity) return;
    const songName = truncate(activity.details || "Unknown Song", 25);
    const artistName = truncate(activity.state || "Unknown Artist", 30);
    const albumName = truncate(activity.assets?.largeText || "Unknown Album", 35);
    const uniqueId = `spotify-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // avoid SVG conflicts
    const textY = y + 35;
    const textX = 170;
    // Calculate progress bar if timestamps are available
    const timestamps = activity.timestamps;
    const hasTimestamps = timestamps && timestamps.start && timestamps.end;
    let progressBar = <></>;
    let progress = 0;

    if (hasTimestamps) {
      const startTime = timestamps.start?.getTime() || 0;
      const endTime = timestamps.end?.getTime() || 0;
      const currentTime = Date.now();
      progress = Math.min((currentTime - startTime) / (endTime - startTime), 1);
      const totalDuration = formatDuration(endTime - startTime);
      const durationValues: string[] = [];
      for (let i = 0; i < 30; i++) {
        const futureTime = currentTime - startTime + i * 1000;
        durationValues.push(`${formatDuration(futureTime)} / ${totalDuration}`);
        if (futureTime > endTime - startTime) break; // allow one extra second so we can get to 100%
      }
      progressBar = (
        <>
          <rect
            x={textX}
            y={textY + 65}
            width="490"
            height="4"
            rx="2"
            style={{ fill: colors.colorB3 }}
          />
          <rect
            x={textX}
            y={textY + 65}
            width={490 * progress}
            height="4"
            rx="2"
            style={{ fill: spotifyGreen }}
          >
            <animate
              attributeName="width"
              from={490 * progress}
              to="490"
              begin="0s"
              dur={`${Math.max((endTime - currentTime) / 1000, 0)}s`}
              fill="freeze"
            />
          </rect>
          <AnimatedDuration strings={durationValues} x={textX} y={textY + 90} colors={colors} />
        </>
      );
    }
    const smallCenter = [140, 115];
    return (
      <g>
        <rect x="20" y={y} width="660" height="140" rx="15" style={{ fill: colors.colorB2 }} />
        {albumArtBase64 ? (
          <>
            <clipPath id={`albumArtClip-${uniqueId}`}>
              <rect x="30" y={y + 10} width="120" height="120" rx="6" />
            </clipPath>
            <g clipPath={`url(#albumArtClip-${uniqueId})`}>
              <image xlinkHref={albumArtBase64} x="30" y="${y + 10}" height="120" width="120" />
            </g>
          </>
        ) : (
          <rect x="30" y="${y + 10}" width="120" height="120" rx="6" style={{ fill: "#333;" }} />
        )}
        <rect
          x={smallCenter[0] - 22}
          y={y + smallCenter[1] - 22}
          width="44"
          height="44"
          rx="100%"
          style={{ fill: colors.colorB2 }}
        />
        <circle cx={smallCenter[0]} cy={y + smallCenter[1]} r="19" fill={spotifyGreen} />
        <path
          transform={`translate(${smallCenter[0]} ${y + smallCenter[1]}) scale(3.5) translate(-41.8 -1.5)`}
          d="M44.9 1c-1.6-1-4.3-1.1-5.8-0.6-0.3 0.1-0.5-0.1-0.6-0.3-0.1-0.3 0.1-0.5 0.3-0.6 1.8-0.5 4.7-0.4 6.6 0.7 0.2 0.1 0.3 0.4 0.2 0.6-0.1 0.2-0.4 0.3-0.7 0.2zm-0.3 1.5c-0.1 0.2-0.4 0.3-0.6 0.1-1.3-0.8-3.4-1.1-4.9-0.6-0.2 0-0.5 0-0.5-0.2-0.1-0.2 0-0.5 0.2-0.5 1.8-0.6 4.2-0.3 5.8 0.7 0.1 0.1 0.1 0.4 0 0.5zm-0.7 1.5c-0.1 0.1-0.3 0.2-0.5 0.1-1.2-0.7-2.6-0.9-4.3-0.5-0.2 0-0.3-0.1-0.4-0.2-0.1-0.2 0.1-0.4 0.2-0.4 1.9-0.4 3.6-0.2 4.9 0.6 0.3 0.1 0.3 0.3 0.1 0.4z"
          fill={colors.colorB1}
        />
        <text
          style={{
            fill: colors.colorT1,
            fontFamily,
            fontSize: "22px",
            fontWeight: 600,
            whiteSpace: "pre",
          }}
          x={textX}
          y={textY}
        >
          ${sanitizeString(songName)}
        </text>
        <text
          style={{ fill: colors.colorT2, fontFamily, fontSize: "18px", whiteSpace: "pre" }}
          x="${textX}"
          y="${textY + 30}"
        >
          by ${sanitizeString(artistName)}
        </text>
        <text
          style={{
            fill: colors.colorT2,
            fontFamily,
            fontSize: "16px",
            whiteSpace: "pre",
            fontStyle: "italic",
          }}
          x={textX}
          y={textY + 52}
        >
          on ${sanitizeString(albumName)}
        </text>
        ${progressBar}
      </g>
    );
  },
};
