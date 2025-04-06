import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { experimentId: string } }
) {
  const { experimentId } = params;

  const words = await prisma.word.findMany({
    where: { experimentId },
    select: { content: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(words);
}
