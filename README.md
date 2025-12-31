# Discord GitHub Preview

"We heard you liked profiles, so we put a profile in your profile so you can be online while you're online"

Generates an SVG representing your current activity state in Discord. You can embed this SVG most anywhere external images are allowed, like your personal website or a GitHub README!

Right now, it'll display:

- Profile photo, avatar decorations, and banner
- Online, idle, DND, and offline states
- Display name and username
- Current activity and custom status
- Avatar decorations (but they won't animate)
- A custom About Me section and one of a number of color themes (Bots aren't allowed to see your bio or Nitro colors).

## Screenshots

<p align="center">
  <img width="400" src="https://github.com/user-attachments/assets/f4c9b564-e24e-4749-ac93-866562393cb7"></img>
  <img width="400" src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https%3A%2F%2Ftsuni.dev%2Fimages%2Fsobanner.png&theme=nitroLight&primaryColor=8080FF&accentColor=FF80C0"></img>

_A screenshot and actual instance of the program, side-by-side (in case I'm offline or doing something boring)_

</p>

# How do I get this set up?

The simplest way is by using my hosted instance, but you can also host your own. Look at the [Self-Hosting](#self-hosting) section for more details.

1. You need to be in the same server as the bot for it to work, so you should [join my Discord server](https://discord.gg/W59fcbydeG)
2. Right-click on the server icon and navigate to "Privacy settings". Make sure your "activity privacy" is set to ON for the server or else the bot won't be able to see your game activity, just your custom status.
3. Visit the web interface at https://dsc-readme.tsuni.dev
4. Enter your Discord username in the input field and press the "Lookup" button
5. Customize your profile preview with the available options
6. Copy the generated URL using the "Copy URL" button
7. Paste the URL into your GitHub profile README or website

> [Here's a guide on how to add a README to your GitHub profile.](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) Once you've gotten to the text editor, paste in the "Markdown URL"
>
> You can also add the image link part ("Raw URL") to any service that accepts image URLs like... Wordpress?

### How to get your Discord User ID

If you're making your URL manually, you'll need your Discord User ID. It's a number that looks like 214167454291722241. There are three ways to find this:

- The web UI has a lookup feature to help find your User ID, but you need to be in the same guild as the bot. Just enter your Discord username and press "Lookup", and it should fill in your User ID for you.
- Mention yourself in a message, but put a backslash (`\`) before the mention. Then send the message and copy the numbers:<br />
  ![Discord_lYicGfP1qd](https://github.com/user-attachments/assets/12aacd86-fd3a-421d-a45e-e8b20c2c5c4a)
- In the Discord settings, turn on User Settings > Advanced > Developer Mode, then click on your profile picture in the bottom-left corner of the client and press "Copy User ID"

## Customizations

You can customize your profile preview in two ways:

1. ✨ Visually, using the [Web Interface](https://dsc-readme.tsuni.dev)
2. Manually, using URL parameters (as shown below)

### URL Parameter Customizations

- **Center the profile:** surround the `<img>` tags with `<p align="center">` and `</p>`, like so:

  ```md
  <p align="center">
    <img src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=400">
  </p>
  ```

  <p align="center">
    <img src="https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=300">
  </p>

- **Change the banner:** provide an image URL after your user ID, for example:

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png)
```

![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https://tsuni.dev/images/sobanner.png)

- **Add an About Me section:** use the `aboutMe` parameter, for example:

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?aboutMe=Hello%20world!%20I'm%20a%20developer%20who%20loves%20to%20code.)
```

- **Hide avatar decoration:** use the `hideDecoration` parameter:

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?hideDecoration=true&width=400)
```

- **Hide Spotify activity:** use the `hideSpotify` parameter to hide Spotify listening status:

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?hideSpotify=true&width=400)
```

- **Display animated avatar/banner/decoration:** use the `animate` parameter:
  Before turning this on, please read the note in the [A note on animated avatars, banners, and decorations](#a-note-on-animated-avatars-banners-and-decorations) section. It might not do what you think it does!

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?animate=true&width=400)
```

- **Set the width:** use the `width` parameter to set the width of the image. The default is 512px, but you can set it to any value you like. This affects the resolution of embedded images, so thinner previews will be faster to load, and vice versa.

```md
![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?width=400)
```

- **Theme Customizations**
  - Set the theme via the `theme` parameter, choosing one of: `dark`, `light`, `nitroDark`, `nitroLight`, or `custom`.
  - For **Nitro themes** (`nitroDark` or `nitroLight`):
    - Use the parameters `primaryColor` and `accentColor` with hex values provided **without** a `#`.  
      Example:
      ```md
      ![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?theme=nitroDark&primaryColor=5865F2&accentColor=99AAB5&width=400)
      ```
  - For the **Custom theme**:
    - Use the parameters `colorB1`, `colorB2`, `colorB3`, `colorT1`, and `colorT2` with hex values provided **without** a `#`.  
      Example:
      ```md
      ![](https://dsc-readme.tsuni.dev/api/user/214167454291722241?theme=custom&colorB1=111214&colorB2=313338&colorB3=505059&colorT1=FFFFFF&colorT2=D2D6D8)
      ```

## A note on animated avatars, banners, and decorations:

Animated avatars, banners, and decorations **will not animate on GitHub**, most Markdown renderers, or when placed in an `<img>` tag. If you want to see the animation, you need to place the SVG in an `<object>` tag, like so:

```html
<object
  data="https://dsc-readme.tsuni.dev/api/user/214167454291722241?banner=https%3A%2F%2Ftsuni.dev%2Fimages%2Fsobanner.png&amp;theme=nitroLight&amp;primaryColor=8080FF&amp;accentColor=FF80C0"
  class="mx-auto my-2 max-w-full"
  width="500"
>
  Discord status
</object>
```

Obviously, this will only work on platforms where you can write HTML, like your personal website. GitHub does not allow `<object>` tags in Markdown. Additionally, embedding animated images significantly increases the filesize of the resulting SVG, resulting in slower load times and more work for my server. So really think about whether this needs to be turned on!

## Self-Hosting

If you prefer to host your own instance, follow these steps:

1. Clone this repository
2. Create a `.env` file with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_GUILD_ID=your_discord_guild_id
   DISCORD_GUILD_INVITE=your_discord_guild_invite_link
   DEFAULT_USER_ID=your_default_user_id
   ```
   - `DISCORD_TOKEN`: Your Discord bot token (you can create a bot at the [Discord Developer Portal](https://discord.com/developers/applications))
   - `DISCORD_GUILD_ID`: The ID of the server where the bot will be used (you can find this by right-clicking the server icon in Discord and selecting "Copy Server ID")
   - `DISCORD_GUILD_INVITE`: An invite link to the server where the bot is (so users can join if they want to use it)
   - `DEFAULT_USER_ID`: A default user ID to use in the web interface when no user ID is provided (you should set this to your own user ID or the bot's user ID)

> if you want to run a dockerized instance, run `docker-compose up` here, and skip to step 6.

3. Install dependencies: `pnpm install`
4. Build the project: `pnpm build`
5. Run the server: `pnpm start`
6. Visit `http://localhost:3000` to access the web interface

You can substitute `pnpm` with `npm` or `yarn` if you prefer.
