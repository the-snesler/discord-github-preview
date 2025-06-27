import { ColorTheme } from "../.."
import { UserProperties } from "../discord"
import { FONT_FAMILY } from "../fonts"
import { URItoBase64 } from "../utils";

export const nameSVG = async (user: UserProperties, colors: ColorTheme, bannerHeight: number): Promise<string> => {
  let clanBadge = null;
  if (
    user.serverTag &&
    user.serverTag.identity_guild_id &&
    user.serverTag.badge
  ) {
    clanBadge = await URItoBase64(
      `https://cdn.discordapp.com/clan-badges/${user.serverTag.identity_guild_id}/${user.serverTag.badge}.png?size=32`
    );
  }
  const badgeSVG = `
  <image xlink:href="${clanBadge}" x="100" y="${bannerHeight + 93 + 40}" height="30" width="30" clip-path="inset(0% round 5px)" />
`
  return `
<text style="fill: ${colors.colorT1}; font-family:${FONT_FAMILY}; font-size: 44px; font-weight: 800; white-space: pre;" x="40" y="${bannerHeight + 93 + 40}">${user.displayName}</text>
<text style="fill: ${colors.colorT2}; font-family:${FONT_FAMILY}; font-size: 22px; white-space: pre;" x="40" y="${bannerHeight + 93 + 40 + 30}">${user.username}</text>
`
}
