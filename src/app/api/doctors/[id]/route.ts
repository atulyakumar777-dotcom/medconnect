import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = params.id;

    // Get date 14 days from now
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    const isoDateStr = twoWeeksFromNow.toISOString().split('T')[0];

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        slots: true,
        appointments: {
          where: {
            slotDate: {
              lte: isoDateStr
            },
            status: {
              not: 'CANCELLED'
            }
          },
          select: {
            slotDate: true,
            slotTime: true
          }
        }
      }
    });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const result = {
      ...doctor,
      bookedAppointments: doctor.appointments,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json({ message: "Error fetching doctor details" }, { status: 500 });
  }
}
