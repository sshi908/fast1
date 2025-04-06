// app/api/seedwords/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.seedWord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Seed word deleted successfully" });
  } catch (error) {
    console.error("Failed to delete seed word:", error);
    return NextResponse.json({ error: "Failed to delete seed word" }, { status: 500 });
  }
}
