import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        console.log(data)
        const result = await prisma.discounts.createMany({
            data
        })
        return NextResponse.json(result, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error al registrar los descuentos" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        const result = await prisma.discounts.delete({
            where: {
                id
            }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error al eliminar el descuento" },
            { status: 500 }
        )
    }

}