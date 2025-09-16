import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { targetUrl, method } = await req.json();

    if (!targetUrl || !method) {
      return NextResponse.json(
        { success: false, error: "URL dan metode wajib diisi." },
        { status: 400 }
      );
    }

    try {
      new URL(targetUrl);
    } catch (_) {
      return NextResponse.json(
        { success: false, error: "Format URL tidak valid." },
        { status: 400 }
      );
    }

    const response = await fetch(targetUrl, {
      method: method,
      headers: {
        "User-Agent": "Vercel-API-Checker/1.0",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(
        `API eksternal merespons dengan status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("Error di API route:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan di server.",
      },
      { status: 500 }
    );
  }
}
