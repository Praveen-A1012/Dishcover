import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { oldPassword, newPassword } = await req.json();
  if (!oldPassword || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return NextResponse.json({ error: "Old password incorrect" }, { status: 403 });
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const hashed = await bcrypt.hash(newPassword, saltRounds);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  return NextResponse.json({ ok: true });
}