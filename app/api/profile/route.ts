import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// ✅ Fetch profile
export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = payload.userId || payload.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        heightCm: true,
        weightKg: true,
        diet: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: { ...user, userId: user.id } });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// ✅ Update profile
export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = payload.userId || payload.id;
    const body = await req.json();
    const { name, phone, address, heightCm, weightKg, diet } = body;

    function parseNumberField(val: any) {
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }

    const parsedHeight = parseNumberField(heightCm);
    const parsedWeight = parseNumberField(weightKg);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        heightCm: parsedHeight,
        weightKg: parsedWeight,
        diet,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        heightCm: true,
        weightKg: true,
        diet: true,
      },
    });

    return NextResponse.json({ user: { ...user, userId: user.id } });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
