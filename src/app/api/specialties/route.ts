import { NextResponse } from "next/server";
import { SPECIALTIES } from "@/lib/utils";

export async function GET() {
  return NextResponse.json(SPECIALTIES);
}
