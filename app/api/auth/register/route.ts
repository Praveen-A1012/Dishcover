// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
  const { email, password, name, age, heightCm, weightKg, diet } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    // server-side password rule: min 8, one upper, one lower, one digit, one special
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!strongPw.test(password)) {
      return NextResponse.json({ error: "Weak password. Include upper, lower, number, special and min 8 chars." }, { status: 400 });
    }
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const parsedHeight = typeof heightCm === 'number' ? heightCm : heightCm ? parseInt(String(heightCm), 10) : null;
    const parsedWeight = typeof weightKg === 'number' ? weightKg : weightKg ? parseInt(String(weightKg), 10) : null;
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || null,
        heightCm: Number.isFinite(parsedHeight as any) ? (parsedHeight as number) : null,
        weightKg: Number.isFinite(parsedWeight as any) ? (parsedWeight as number) : null,
        diet: diet || null,
      },
      select: { id: true, email: true, name: true, heightCm: true, weightKg: true, diet: true, createdAt: true },
    });

    // Return userId instead of id for consistency
  return NextResponse.json({ user: { userId: user.id, email: user.email, name: user.name, heightCm: user.heightCm, weightKg: user.weightKg, diet: user.diet, createdAt: user.createdAt } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
