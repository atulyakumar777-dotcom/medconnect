import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const doctorId = doctor.id;
    const todayStr = format(new Date(), "yyyy-MM-dd");

    // Get all appointments for stats
    const allAppointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: { id: true, name: true, email: true, image: true }
        }
      },
      orderBy: [
        { slotDate: 'desc' },
        { slotTime: 'desc' }
      ]
    });

    const totalAppointments = allAppointments.length;
    
    const todayAppointments = allAppointments.filter(
      apt => apt.slotDate === todayStr
    ).length;

    const totalEarnings = allAppointments
      .filter(apt => apt.status === 'COMPLETED' && apt.paymentStatus === 'PAID')
      .reduce((sum, apt) => sum + apt.amount, 0);

    const uniquePatientIds = new Set(allAppointments.map(apt => apt.patientId));
    const totalPatients = uniquePatientIds.size;

    const latestAppointments = allAppointments.slice(0, 5);

    return NextResponse.json({
      totalAppointments,
      todayAppointments,
      totalEarnings,
      totalPatients,
      latestAppointments,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
