"use server";

import { cookies } from "next/headers";

export async function logarAction(
  usuario: string,
  senha: string
) {
  if (!usuario || !senha) {
    return {
      success: false,
      message: "Usuário e senha são obrigatórios.",
    };
  }

  try {
    const res = await fetch("http://172.16.0.17:3133/login/acessoteste", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ USUARIO: usuario, SENHA: senha }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Falha ao autenticar (status ${res.status}).`);
    }

    const setCookie = res.headers.get("set-cookie") ?? "";

    const match = setCookie.match(/token=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (rawToken) {
      const decoded = decodeURIComponent(rawToken); 

      const token = decoded.replace(/^Bearer\s+/i, "");

      (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    }

  } catch (err: any) {
    console.error("Erro no logarAction:", err);

    return {
      success: false,
      message: err?.message || "Erro ao tentar logar.",
    };
  }
}
