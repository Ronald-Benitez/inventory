import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { parseUrl } from "@/utils/urls"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    try {
        const pathname = req.nextUrl.pathname
        const { skip, take, filterColumn, filter } = parseUrl(pathname, "/api/orders/")

        const flag = filter === "true"
        const data = await prisma.orders.findMany({
            where: {
                [filterColumn]: {
                    equals: flag
                }
            },
            include: {
                sales: true
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        
        return NextResponse.json(data, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error la cargar las ordenes" },
            { status: 500 }
        )
    }

}