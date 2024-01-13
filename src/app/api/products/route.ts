import { PrismaClient, Products } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await prisma.products.create({
      data,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al registrar la empresa" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const { id, ...send } = data
    const response = await prisma.products.update({
      where: { id },
      data: send
    })
    return NextResponse.json(
      { response },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: "Error al editar el producto" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const response = await prisma.products.delete({
      where: { id }
    })
    return NextResponse.json({ response }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Error al eliminar el producto" }, { status: 500 })
  }


}