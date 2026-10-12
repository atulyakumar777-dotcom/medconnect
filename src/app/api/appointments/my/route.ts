import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: session.user.id,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              }
            }
          }
        }
      },
      orderBy: [
        { slotDate: "desc" },
        { slotTime: "desc" }
      ]
    });
    
    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
