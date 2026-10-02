import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Online fee submission is not available. Please pay at the school office." },
    { status: 410 }
  );
}
