import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        dob: true,
        gender: true,
        address: true,
        image: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { name, phone, dob, gender, address } = body;
    
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        dob: dob !== undefined ? dob : undefined,
        gender: gender !== undefined ? gender : undefined,
        address: address !== undefined ? address : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        dob: true,
        gender: true,
        address: true,
        image: true,
      }
    });
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
