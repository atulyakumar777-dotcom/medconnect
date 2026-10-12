import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const revenueResult = await prisma.appointment.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "PAID" },
    });
    const totalRevenue = revenueResult._sum.amount || 0;

    const totalDoctors = await prisma.doctor.count();
    const totalPatients = await prisma.user.count({
      where: { role: "PATIENT" },
    });
    const totalAppointments = await prisma.appointment.count();

    const recentAppointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      totalRevenue,
      totalDoctors,
      totalPatients,
      totalAppointments,
      recentAppointments,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
