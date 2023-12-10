"use server"

import { type User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers() {
  return prisma.user.findMany();
}