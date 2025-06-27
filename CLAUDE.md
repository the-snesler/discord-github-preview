# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server with hot reload using nodemon and tsx
- `pnpm run build` - Clean, compile TypeScript, and copy font files to dist/
- `pnpm run start` - Run production server from compiled files
- `pnpm run lint` - Run ESLint on TypeScript files
- `pnpm run test` - Run Jest tests
- `pnpm run clean` - Remove dist/ directory

The project uses pnpm as the package manager but npm/yarn can be substituted.

## Architecture Overview

This is a Discord GitHub Preview service that generates SVG cards showing Discord user status/activity. It's built with Express.js, Discord.js, and TypeScript.

### Core Components

- **Express Server** (`src/server.ts`, `src/app.ts`) - Serves web interface and API endpoints
- **Discord Bot** (`src/bot.ts`) - Connects to Discord API using Discord.js client with guild presence intents
- **API Layer** (`src/api/index.ts`) - Three main endpoints:
  - `/api/ping` - Bot status check
  - `/api/user/:id` - Generate SVG card for Discord user (main endpoint)
  - `/api/username/:id` - Get username for Discord user ID
- **Card Generation** (`src/helpers/card.ts`) - Core SVG generation logic with theme/customization support
- **Activity Displayables** (`src/helpers/displayables/`) - Modular components for different Discord activity types:
  - Custom status messages
  - Spotify listening activity  
  - Rich presence (games/apps)
  - Generic activities

### Key Architecture Patterns

- **Modular Activity System**: Each activity type has its own displayable component that returns Promise<string> for SVG content
- **Theme System** (`src/helpers/themes.ts`): Supports dark/light/custom/nitro themes with color customization
- **SVG Component System** (`src/helpers/svg/`): Reusable SVG building blocks (backgrounds, names, badges, etc.)
- **Caching**: API responses cached for 30 seconds in production, 1 second in development using apicache
- **Font Handling**: Custom Discord fonts (GG Sans) embedded as base64 in SVG output

### Environment Setup

Required environment variables:
- `DISCORD_TOKEN` - Discord bot token
- `DISCORD_GUILD_ID` - Guild ID where bot operates
- `NODE_ENV` - Controls caching behavior
- `PORT` - Server port (defaults to 3000)

### Testing

- Uses Jest with ts-jest preset
- Test files in `tests/` directory
- Path aliases configured: `@/` maps to `src/`

### Key Dependencies

- `discord.js` - Discord API client with guild presence intents
- `express` - Web server
- `apicache` - Response caching middleware
- Font files stored in `src/fonts/` and copied to build output