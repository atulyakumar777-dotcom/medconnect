import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Fetch doctors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      specialty,
      degree,
      experience,
      fees,
      about,
      address,
      workingDays,
      startTime,
      endTime,
    } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const doctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "DOCTOR",
        },
      });

      const doc = await tx.doctor.create({
        data: {
          userId: user.id,
          specialty,
          degree,
          experience: Number(experience),
          fees: Number(fees),
          about,
          addressLine: address,
          available: true,
        },
      });

      const slots = [];
      for (const day of workingDays) {
        let currentH = parseInt(startTime.split(":")[0]);
        let currentM = parseInt(startTime.split(":")[1]);
        const endH = parseInt(endTime.split(":")[0]);
        const endM = parseInt(endTime.split(":")[1]);
        const startTotalMins = currentH * 60 + currentM;
        const endTotalMins = endH * 60 + endM;

        let curMins = startTotalMins;

        while (curMins + 30 <= endTotalMins) {
          const sH = Math.floor(curMins / 60).toString().padStart(2, "0");
          const sM = (curMins % 60).toString().padStart(2, "0");
          const nextMins = curMins + 30;
          const eH = Math.floor(nextMins / 60).toString().padStart(2, "0");
          const eM = (nextMins % 60).toString().padStart(2, "0");

          slots.push({
            doctorId: doc.id,
            day,
            startTime: `${sH}:${sM}`,
            endTime: `${eH}:${eM}`,
          });

          curMins += 30;
        }
      }

      if (slots.length > 0) {
        await tx.slot.createMany({ data: slots });
      }

      return doc;
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Create doctor error:", error);
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
