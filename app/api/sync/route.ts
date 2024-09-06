import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const GET = async (request: NextRequest) => {
  const lang = request.nextUrl.searchParams.get("lang");

  if (lang) {
    cookies().set("lang", lang);
    return new Response("success", {
      status: 200,
      headers: { "Set-Cookie": `lang=${lang}` },
    });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing lang to sync",
  });
};
