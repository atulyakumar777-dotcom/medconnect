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

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
