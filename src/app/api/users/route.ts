import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcript from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, password } = await req.json();

    const user = await prisma.users.findUnique({
        where: {
        name,
        },
    });

    if(user){
        return NextResponse.json({ message: "El usuario ya existe" }, { status: 401 });
    }

    const hashedPassword = await bcript.hash(password, 10);

    const newUser = await prisma.users.create({
        data: {
            name,
            password: hashedPassword,
        },
    });

    return NextResponse.json({ message: "Usuario creado" }, { status: 200 });
  
}