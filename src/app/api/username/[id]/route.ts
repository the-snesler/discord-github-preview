import readyClient from "@/lib/bot";
import { validateId, fetchUserInfo } from "@/lib/discord";

export const dynamic = 'force-dynamic'
export const revalidate = 60;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = await readyClient;
  const id = (await params).id;

  if (!validateId(id)) return Response.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const user = await fetchUserInfo(client, id, false, 0);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ username: user.username }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

