import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OrderSave } from "@/interfaces/tables"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const { orderData, salesData } = await req.json() as OrderSave

        const orderResult = await prisma.orders.create({
            data: orderData
        })

        const sales = salesData.map((item) => ({
            ...item,
            ordersId: orderResult.id
        }))

        const salesResult = await prisma.sales.createMany({
            data: sales
        })

        return NextResponse.json({ salesResult, orderResult }, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error al resitrar el pedido" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, ...send } = await req.json()
        const result = await prisma.orders.update({
            where: { id },
            data: send
        })

        return NextResponse.json(result, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error al editar el pedido" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        const result = await prisma.orders.delete({
            where: { id }
        })
        return NextResponse.json(result, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error al eliminar el producto" },
            { status: 500 }
        )
    }
}
