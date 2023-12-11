"use server";

import { cookies } from "next/headers";

export async function getCookies(cookie: string) {
  const token = cookies().get(cookie);
  return token as string | undefined;
}

export async function getDecodedCookies(cookie: string) {
  const token = cookies().get(cookie)?.value;
  if (!token) return undefined;
  const decodedToken = Buffer.from(token, "base64").toString("utf-8");
  return decodedToken;
}