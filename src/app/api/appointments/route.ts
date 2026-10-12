import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "PATIENT") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { doctorId, slotDate, slotTime, paymentMethod } = body;
    
    if (!doctorId || !slotDate || !slotTime || !paymentMethod) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    
    if (!doctor || !doctor.available) {
      return NextResponse.json({ success: false, message: "Doctor not available" }, { status: 400 });
    }
    
    // Check if slot is already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        slotDate,
        slotTime,
        status: { not: "CANCELLED" },
      }
    });
    
    if (existingAppointment) {
      return NextResponse.json({ success: false, message: "Slot already booked" }, { status: 400 });
    }
    
    const paymentStatus = paymentMethod === "ONLINE" ? "PAID" : "PENDING";
    
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        slotDate,
        slotTime,
        status: "PENDING",
        paymentMethod,
        paymentStatus,
        amount: doctor.fees,
      }
    });
    
    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
