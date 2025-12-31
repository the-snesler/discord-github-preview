import express from "express";
import apicache from "apicache";
import { discordSelf, discordUser, discordUsername } from "./api";
import 'dotenv/config';
import readyClient from "./bot";

const app = express();
const cache = apicache.middleware;

let fallbackUserId = "879917497959219250";
readyClient.then((client) => (fallbackUserId = client.user.id));

app.set("view engine", "ejs");
app.set("views", "./public");
app.get("/", (req, res) => {
  res.render("index", {
    defaultUserId: process.env.DEFAULT_USER_ID || fallbackUserId,
    inviteUrl: process.env.DISCORD_GUILD_INVITE || "https://discord.gg/W59fcbydeG",
  });
});
app.use(express.static("./public"));

app.get("/api/ping", discordSelf);
app.get("/api/user/:id", cache(process.env.NODE_ENV === 'development' ? '1 second' : '30 seconds'), discordUser);
app.get("/api/username/:id", cache(process.env.NODE_ENV === 'development' ? '1 second' : '30 seconds'), discordUsername);

export default app;
