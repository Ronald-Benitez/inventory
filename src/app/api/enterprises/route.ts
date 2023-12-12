import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(){
    const enterprises = await prisma.enterprises.findMany({
        orderBy: {
            name: "asc"
        }
    });
    return NextResponse.json(enterprises);
}

export async function POST(req: NextRequest){
    try{
        const { name } = await req.json();
        const data = await prisma.enterprises.create({
            data: {
                name
            }
        });
        return NextResponse.json(data, { status: 200 });
    } catch(error){
        console.log(error);
        return NextResponse.json({ message: "Error al registrar la empresa" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest){
    try{
        const { id } = await req.json();
        const data = await prisma.enterprises.delete({
            where: {
                id
            }
        });
        return NextResponse.json(data, { status: 200 });
    } catch(error){
        console.log(error);
        return NextResponse.json({ message: "Error al eliminar la empresa" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest){
    try{
        const { id, name } = await req.json();
        const data = await prisma.enterprises.update({
            where: {
                id
            },
            data: {
                name
            }
        });
        return NextResponse.json(data, { status: 200 });
    } catch(error){
        console.log(error);
        return NextResponse.json({ message: "Error al actualizar la empresa" }, { status: 500 });
    }
}