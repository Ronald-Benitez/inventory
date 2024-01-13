import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PrismaFunction = (options: any) => Promise<any>

interface Mapping {
    get: PrismaFunction,
    delete: PrismaFunction,
    put: PrismaFunction,
    post: PrismaFunction
}

const getMapping: Record<string, Mapping> = {
    categories: {
        get: prisma.categories.findMany,
        delete: prisma.categories.delete,
        put: prisma.categories.update,
        post: prisma.categories.create
    },
    types: {
        get: prisma.types.findMany,
        delete: prisma.types.delete,
        put: prisma.types.update,
        post: prisma.types.create
    }
}

export async function GET() {
    const data = await prisma.categories.findMany({
        orderBy: {
            name: "asc"
        }
    });
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const result = await prisma.categories.create({
            data
        });
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al registrar la categoria" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        const data = await prisma.categories.delete({
            where: {
                id
            }
        });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error al eliminar la categoria" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, name } = await req.json();
        const data = await prisma.categories.update({
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