import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUrlData } from "@/utils/urls";

const prisma = new PrismaClient();

const tableMappings: Record<string, (options: any) => Promise<any[]>> = {
  categories: prisma.categories.findMany,
  types: prisma.types.findMany,
};

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  try {
    const { table, skip, take } = getUrlData(pathname, "/api/dynamic/");

    if (!isValidTableName(table)) {
      return NextResponse.json(
        { message: "Nombre de tabla no válido" },
        { status: 400 }
      );
    }

    if (!take) {
      return NextResponse.json(
        { message: "Error al cargar la paginación" },
        { status: 500 }
      );
    }

    const data = await tableMappings[table]({
      take,
      skip,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function isValidTableName(tableName: string): boolean {
  // Implementa lógica de validación aquí
  // Por ejemplo, podrías tener una lista de nombres de tablas permitidos
  // y verificar si el nombre de la tabla proporcionado está en esa lista.
  return true;
}
