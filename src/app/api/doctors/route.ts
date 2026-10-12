import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    const whereClause: any = {
      available: true,
    };

    if (specialty && specialty !== "all") {
      whereClause.specialty = {
        contains: specialty, 
        mode: 'insensitive'
      };
    }

    if (search) {
      whereClause.user = {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      };
    }

    const takeCount = limit ? parseInt(limit) : undefined;

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        },
        slots: true,
      },
      orderBy: {
        experience: 'desc'
      },
      take: takeCount,
    });

    return NextResponse.json(doctors);
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Error fetching doctors" }, { status: 500 });
  }
}
