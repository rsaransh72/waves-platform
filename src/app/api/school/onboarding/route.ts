import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "School workspaces are invitation-only. Ask your platform administrator for an invitation." },
    { status: 410 }
  );
}
