import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const whereClause: any = { doctorId: doctor.id };
    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: { name: true, email: true, phone: true, image: true }
        }
      },
      orderBy: [
        { slotDate: 'desc' },
        { slotTime: 'desc' }
      ]
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
