import { Activity, GuildMember, User } from "discord.js";

interface LanyardResponse {
  success: boolean;
  data: {
    active_on_discord_mobile: boolean;
    active_on_discord_desktop: boolean;
    listening_to_spotify: boolean;
    kv: Record<string, string>;
    spotify: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    } | null;
    discord_user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string;
    };
    discord_status: string;
    activities: Activity[];
  };
}

const filterStatusValues = (obj: Record<string, any>) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== "buttons"));
}

export const discordMemberToLanyard = (status: GuildMember): LanyardResponse => {
  return {
    success: true,
    data: {
      active_on_discord_desktop: false,
      active_on_discord_mobile: false,
      listening_to_spotify: false,
      kv: {},
      spotify: null,
      discord_user: {
        username: status.user.username,
        public_flags: status.user.flags?.bitfield || 0,
        id: status.id,
        discriminator: status.user.discriminator,
        avatar: status.user.avatar || "",
      },
      discord_status: status.presence?.status || "offline",
      activities: status.presence?.activities.map(filterStatusValues) as Activity[] || [],
    }
  }
}
