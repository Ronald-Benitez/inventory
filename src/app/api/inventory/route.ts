import { type Inventory } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const result = await prisma.inventory.create({ data });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al registrar el producto" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        const data = await prisma.inventory.delete({
            where: { id }
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al eliminar el producto" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, ...send } = await req.json();

        const data = await prisma.inventory.update({
            where: { id },
            data: send
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al actualizar el producto" }, { status: 500 });
    }
}