import readyClient from "@/lib/bot";
import { makeCard } from "@/lib/card";
import { CardOptions } from "@/index";
import { fetchUserInfo } from "@/lib/discord";
import '@/lib/env.ts'

export const dynamic = 'force-dynamic'
export const revalidate = 60;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = await readyClient;
  const id = process.env.TEST_USER_ID || "214167454291722241";

  try {
    // Fetch the user first
    let user = await fetchUserInfo(client, id);
    if (!user) return Response.json("User not found", { status: 404 });

    // Force add the About Me for testing
    const options: CardOptions = {
      animate: false,
      width: 500,
      aboutMe: "This is a test about me section",
      theme: "nitroDark",
      primaryColor: "#7289DA", // Discord blue
      accentColor: "#99AAB5", // Discord grey
      hideDecoration: false,
      hideSpotify: false,
    }

    const card = await makeCard(user, options);
    return new Response(card, {
      headers: { 'Content-Type': 'image/svg+xml' },
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
