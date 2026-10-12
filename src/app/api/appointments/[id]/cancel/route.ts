import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const appointmentId = params.id;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
    }
    
    if (appointment.patientId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
    
    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      return NextResponse.json({ success: false, message: "Cannot cancel this appointment" }, { status: 400 });
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });
    
    return NextResponse.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
