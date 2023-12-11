import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcript from "bcryptjs";
import { cookies } from "next/headers";

import {type Users} from "@/interfaces/Users";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: {
      name,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "No se encontro el usuario" }, { status: 401 });
  }
 
  const isPasswordValid = await bcript.compare(password, user.password);
  
  if (!isPasswordValid) {
    return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = generateToken(user);

  cookies().set("token", token);

  return NextResponse.json({ token }, { status: 200} );
}

const generateToken = (user: Users) => {
 
  const encodedToken = Buffer.from(JSON.stringify(user)).toString("base64");
  return encodedToken;
}

export async function DELETE() {
  try{
    cookies().delete("token");
  return NextResponse.json({ message: "Sesión cerrada" }, { status: 200 });
  }catch(error){
    console.log(error);
    NextResponse.json({ message: "Error al cerrar sesión" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { name, password, id } = await req.json();

  console.log(name, password, id);

  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "No se encontro el usuario" }, { status: 401 });
  }

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No se encontro el token" }, { status: 401 });
  }

  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  const parsedToken = JSON.parse(decodedToken);

  if (parsedToken.id !== id) {
    return NextResponse.json({ message: "No se encontro el usuario" }, { status: 401 });
  }

  const isNameValid = await prisma.users.findUnique({
    where: {
      name,
    },
  });

  if (isNameValid && isNameValid.id !== id) {
    return NextResponse.json({ message: "El nombre de usuario ya existe" }, { status: 401 });
  }

  const data = password ? { name, password } : { name };

  const updatedUser = await prisma.users.update({
    where: {
      id,
    },
    data
  });

  const newToken = generateToken(updatedUser);
  cookies().set("token", newToken);

  return NextResponse.json({ token }, { status: 200} );
}
