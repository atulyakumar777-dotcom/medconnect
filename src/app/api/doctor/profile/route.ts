import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { name: true, email: true, image: true, phone: true }
        }
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Doctor profile GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, specialty, degree, experience, about, fees, addressLine, available } = body;

    // Update User name if provided
    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { userId: session.user.id },
      data: {
        specialty,
        degree,
        experience: Number(experience),
        about,
        fees: Number(fees),
        addressLine,
        available: Boolean(available)
      }
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("Doctor profile PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
