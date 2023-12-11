import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    const {skip, take} = parseUrl(pathname);

    if (!take) {
      return NextResponse.json(
        { message: "Error al cargar la paginación" },
        { status: 500 }
      );
    }

    const data = await prisma.inventory.findMany({
      take,
      skip,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

const parseUrl = (url: string) => {
  url = url.replace("/api/inventory/", "");
  const urlArray = url.split("/");
  const json = {
    skip: parseInt(urlArray[0]) || 0,
    take: parseInt(urlArray[1]),
  };
  return json;
};
