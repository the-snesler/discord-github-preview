import React from "react";
import { DisplayableComponent } from "../types";
import { fontFamily } from "../helpers/fonts";
import { URItoBase64 } from "../helpers/utils";

export const name: DisplayableComponent<string | null> = {
  fetchServerProp: async ({ user }) => {
    // Server tags
    let clanBadge: Promise<string | null> = Promise.resolve(null);
    if (user.serverTag && user.serverTag.identity_guild_id && user.serverTag.badge) {
      clanBadge = URItoBase64(
        `https://cdn.discordapp.com/clan-badges/${user.serverTag.identity_guild_id}/${user.serverTag.badge}.png?size=32`
      );
    }
    return clanBadge;
  },
  render: ({ user, colors, y, bannerHeight, serverProp: clanBadge }) => {
    return (
      <g>
        <text
          style={{
            fill: colors.colorT1,
            fontFamily: fontFamily,
            fontSize: "44px",
            fontWeight: 800,
            whiteSpace: "pre",
          }}
          x="40"
          y={y + bannerHeight + 93 + 40}
        >
          {user.displayName}
        </text>
        <foreignObject x={40} y={y + bannerHeight + 93 + 50} height={30} width={620}>
          <div
            // @ts-ignore
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              color: colors.colorT2,
              fontFamily: fontFamily,
              fontSize: "22px",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            {user.username}
            {clanBadge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "0.75rem",
                  padding: "0 0.5rem",
                  border: "2px solid rgba(108, 111, 121, 0.65)",
                  fontSize: "20px",
                }}
              >
                <img
                  src={clanBadge}
                  height="20"
                  width="20"
                  style={{ clipPath: "inset(0% round 5px)" }}
                />
                <span style={{ fontWeight: "600" }}>{user.serverTag?.tag}</span>
              </span>
            )}
          </div>
        </foreignObject>
      </g>
    );
  },
};
