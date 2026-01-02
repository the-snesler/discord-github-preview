import { UserFlagsBitField, UserFlags } from "discord.js";

export type BadgeName =
  | "Staff"
  | "Partner"
  | "Hypesquad"
  | "HypeSquadOnlineHouse1"
  | "HypeSquadOnlineHouse2"
  | "HypeSquadOnlineHouse3"
  | "BugHunterLevel1"
  | "BugHunterLevel2"
  | "ActiveDeveloper"
  | "VerifiedDeveloper"
  | "CertifiedModerator"
  | "PremiumEarlySupporter"
  | "Nitro";

// Map of Discord flag names to display-friendly badge names
const BADGE_DISPLAY_ORDER: { flag: keyof typeof UserFlags; badge: BadgeName }[] = [
  { flag: "Staff", badge: "Staff" },
  { flag: "CertifiedModerator", badge: "CertifiedModerator" },
  { flag: "Partner", badge: "Partner" },
  { flag: "Hypesquad", badge: "Hypesquad" },
  { flag: "HypeSquadOnlineHouse1", badge: "HypeSquadOnlineHouse1" },
  { flag: "HypeSquadOnlineHouse2", badge: "HypeSquadOnlineHouse2" },
  { flag: "HypeSquadOnlineHouse3", badge: "HypeSquadOnlineHouse3" },
  { flag: "BugHunterLevel1", badge: "BugHunterLevel1" },
  { flag: "BugHunterLevel2", badge: "BugHunterLevel2" },
  { flag: "ActiveDeveloper", badge: "ActiveDeveloper" },
  { flag: "VerifiedDeveloper", badge: "VerifiedDeveloper" },
  { flag: "PremiumEarlySupporter", badge: "PremiumEarlySupporter" },
];

/**
 * Gets the list of badges that should be displayed for a user
 * Returns badges in the order they should appear on the profile
 */
export function getDisplayableBadges(flags: UserFlagsBitField | null, hasAnimatedAvatar: boolean): BadgeName[] {
  if (!flags) return [];

  const badges: BadgeName[] = [];

  // Check each flag in display order
  for (const { flag, badge } of BADGE_DISPLAY_ORDER) {
    if (flags.has(UserFlags[flag])) {
      badges.push(badge);
    }
  }

  // Add Nitro badge if user has an animated avatar
  if (hasAnimatedAvatar) {
    badges.push("Nitro");
  }

  return badges;
}
