import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Products } from "@prisma/client";
import { parseUrl } from "@/utils/urls";
import moment from "moment";
import "moment/locale/es"

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const today = new Date(moment().format("yyyy-MM-DD"))
  console.log(today)

  try {
    const { skip, take, filterColumn, filter, filterIsString, orderBy } =
      parseUrl(pathname, "/api/products/");
    if (!take) {
      return NextResponse.json(
        { message: "Error al cargar la paginación" },
        { status: 500 }
      );
    }

    let orderByObject = {};
    if (orderBy) {
      const splited = orderBy.split(":");
      orderByObject = {
        [splited[0]]: splited[1],
      };
    } else {
      orderByObject = {
        updatedAt: "desc",
      };
    }

    const include = {
      type: {
        select: {
          name: true,
        }
      },
      enterprise: {
        select: {
          name: true
        }
      },
      discounts: {
        select: {
          value: true,
          startDate: true,
          endDate: true
        },
      }

    }

    if (filterColumn && filter) {
      const data = await prisma.products.findMany({
        take,
        skip,
        orderBy: orderByObject,
        where: {
          [filterColumn]: filterIsString
            ? {
              contains: filter,
              mode: "insensitive",
            }
            : {
              equals: Number(filter),
            },
        },
        include
      });
      return NextResponse.json(data, { status: 200 });
    }

    const data = await prisma.products.findMany({
      take,
      skip,
      orderBy: orderByObject,
      include
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

