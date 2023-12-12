import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const types = await prisma.types.findMany({
    orderBy: {
      name: "asc"
    }
  });
  return NextResponse.json(types);
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const data = await prisma.types.create({
      data: {
        name
      }
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error al registrar el tipo de producto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const data = await prisma.types.delete({
      where: {
        id
      }
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error al eliminar el tipo de producto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    const data = await prisma.types.update({
      where: {
        id
      },
      data: {
        name
      }
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error al actualizar el tipo de producto" }, { status: 500 });
  }
}