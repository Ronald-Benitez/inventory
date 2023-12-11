import { type Inventory } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const {
            name,
            unit,
            quantity,
            price,
            unitPrice,
            type
        } = await req.json();

        const data = await prisma.inventory.create({
            data: {
                name,
                unit,
                quantity,
                price,
                unitPrice,
                type
            }
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al registrar el producto" }, { status: 500 });
    }
}


