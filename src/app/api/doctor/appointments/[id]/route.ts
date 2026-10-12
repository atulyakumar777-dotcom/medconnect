import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    const { status, notes } = body;

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment || appointment.doctorId !== doctor.id) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;

    if (status === 'COMPLETED' && appointment.paymentMethod === 'CASH') {
      updateData.paymentStatus = 'PAID';
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
