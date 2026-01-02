import React from "react";
import { DisplayableComponent } from "../types";
import { fontFamily } from "../helpers/fonts";
import { URItoBase64 } from "../helpers/utils";
import { getDisplayableBadges, BadgeName } from "../helpers/badges";
import * as path from "path";
import * as fs from "fs/promises";

interface NameServerProps {
  clanBadge: string | null;
  badges: string[];
}

export const name: DisplayableComponent<NameServerProps> = {
  fetchServerProp: async ({ user }) => {
    // Server tags
    let clanBadge: string | null = null;
    if (user.serverTag && user.serverTag.identity_guild_id && user.serverTag.badge) {
      clanBadge = await URItoBase64(
        `https://cdn.discordapp.com/clan-badges/${user.serverTag.identity_guild_id}/${user.serverTag.badge}.png?size=32`
      );
    }

    // Profile badges
    const userBadges = getDisplayableBadges(user.flags, user.isAvatarAnimated);

    const badgePromises = userBadges.map(async (badgeName) => {
      const badgePath = path.join(process.cwd(), "src", "assets", "badges", `${badgeName}.svg`);
      // it would be silly to turn badge svgs into base64, only to embed them into an svg later. let's just read the raw svg content.
      const badgeData = await fs.readFile(path.resolve(badgePath), 'utf-8');
      return badgeData;
    });

    const badges = await Promise.all(badgePromises);

    return { clanBadge, badges };
  },
  render: ({ user, colors, y, bannerHeight, serverProp }) => {
    const { clanBadge, badges } = serverProp || { clanBadge: null, badges: [] };

    // Calculate approximate width of display name for badge positioning
    const displayNameWidth = user.displayName.length * 27; // Approximate character width
    const badgeSize = 32;
    const badgeGap = 8;

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
        <foreignObject x={40} y={y + bannerHeight + 93 + 50} height={40} width={620}>
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
            <style>
              {`.badge-container svg {
                width: 100%;
                height: 100%;
              }`}
            </style>
            <div style={{display: "flex",}}>
              {badges.map((badgeRawSVG, index) => {
                return (
                  <span
                    key={index}
                    className="badge-container"
                    style={{ width: `${badgeSize}px`, height: `${badgeSize}px`, display: "inline-block" }}
                    dangerouslySetInnerHTML={{ __html: badgeRawSVG }}
                  />
                );
              })}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  },
};
