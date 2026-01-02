# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Discord GitHub Preview is a web application that generates SVG representations of Discord user profiles for embedding in GitHub READMEs and websites. The application uses a Discord bot to fetch real-time user presence data and renders it as customizable SVG cards.

## Core Architecture

### Application Flow
1. **Bot Layer** (`src/bot.ts`): Discord.js client that maintains a connection to Discord's gateway and provides user presence data
2. **Express Server** (`src/server.ts`, `src/app.ts`): HTTP server with caching middleware that serves the web interface and API endpoints
3. **API Layer** (`src/api/index.ts`): Request handlers that validate parameters, fetch user data, and generate SVG responses
4. **Rendering Pipeline** (`src/helpers/card.ts`): React-based SVG rendering system that transforms user data into styled SVG markup
5. **Component System**: Modular "displayables" that render different aspects of user profiles

### Key Architectural Patterns

**Displayable Components** (`src/displayables/`, `src/types.ts`):
- Each displayable implements the `DisplayableComponent<T>` interface
- `matches()`: Determines if the component should render (e.g., Spotify activity only shows when user is listening to Spotify)
- `fetchServerProp()`: Async function to fetch data needed for rendering (e.g., app icons, images)
- `render`: React functional component that produces SVG markup
- The system processes displayables in order, calculating Y positions dynamically based on component heights

**SVG Generation Flow**:
1. User data fetched via Discord.js from the guild member cache
2. Displayables are matched against user activities
3. All async resources (avatar, banner, decoration, app icons) are fetched in parallel and converted to base64
4. React components render to static SVG markup using `renderToStaticMarkup`
5. SVG is served with appropriate headers and caching

**Image Handling**:
- All external images are converted to base64 via `URItoBase64()` helper to make SVGs self-contained
- Discord CDN images are fetched at appropriate sizes based on the `width` parameter
- Avatar decorations use custom URL building since discord.js doesn't support all parameters

### Environment Variables
Required in `.env`:
- `DISCORD_TOKEN`: Bot token for Discord API access
- `DISCORD_GUILD_ID`: The guild where the bot monitors user presence
- `DISCORD_GUILD_INVITE`: Invite link shown to users in the web interface
- `DEFAULT_USER_ID`: Fallback user ID for the web interface demo

## Common Commands

### Development
```bash
pnpm dev              # Run development server with hot reload (uses tsx watch)
pnpm build            # Clean, compile TypeScript, and copy static assets
pnpm start            # Run production server from dist/
pnpm clean            # Remove dist/ directory
```

### Testing & Quality
```bash
pnpm test             # Run Jest test suite
pnpm lint             # Run ESLint on TypeScript files
```

### Docker
```bash
docker-compose up     # Run containerized instance (see README for details)
```

## Development Notes

### Discord Bot Requirements
- The bot must be in the guild specified by `DISCORD_GUILD_ID`
- Users must have "Activity Privacy" enabled for the guild to allow the bot to see their activities
- The bot requires these intents: `Guilds`, `GuildMembers`, `GuildPresences`
- User IDs are validated to be 17+ digit numbers (Discord snowflake IDs)

### API Caching
- Development mode: 1 second cache (`NODE_ENV=development`)
- Production mode: 30 second cache (default)
- Caching is handled by `apicache` middleware on the `/api/user/:id` and `/api/username/:id` endpoints

### Parameter Validation
- URL parameters are validated using Zod v4 schemas in `src/api/index.ts`
- Theme-specific color requirements are enforced via Zod `.check()` method
- Hex colors must be provided without `#` prefix and are automatically transformed
- Invalid parameters return error SVGs with status 400

### Adding New Displayables
1. Create a new file in `src/displayables/` implementing `DisplayableComponent<T>`
2. Add the displayable to either `singleMatchers` (for non-activity components) or `activityMatchers` (for activity-based components) in `src/helpers/card.ts`
3. Components are rendered in array order, which determines visual stacking

### TypeScript Configuration
- Target: ES2020, Module: node16
- React JSX is enabled for TSX files
- Output directory: `./dist`
- Strict mode is enabled
