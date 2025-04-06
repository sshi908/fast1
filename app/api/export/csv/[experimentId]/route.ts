import { PrismaClient } from "@prisma/client";

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

  const csvRows = [
    ["content", "createdAt"],
    ...words.map((word) => [word.content, word.createdAt.toISOString()]),
  ];

  const csv = csvRows.map((row) => row.join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="experiment-${experimentId}.csv"`,
    },
  });
}
