import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseUrl } from "@/app/services/urls";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    const { skip, take } = parseUrl(pathname, "/api/products/");

    if (!take) {
      return NextResponse.json(
        { message: "Error al cargar la paginación" },
        { status: 500 }
      );
    }

    const data = await prisma.products.findMany({
      take,
      skip,
      orderBy: {
        updatedAt: "asc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
