import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { available } = body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: params.id },
      data: { available },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("Toggle doctor error:", error);
    return NextResponse.json(
      { error: "Failed to update doctor status" },
      { status: 500 }
    );
  }
}
