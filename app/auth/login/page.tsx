import React from "react";
import Login from "./login";
import { RedirectType, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function LoginPage({
  searchParams: { callbackUrl },
}: {
  searchParams: { callbackUrl: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const url = callbackUrl || "/app/home";
    return redirect(url, RedirectType.replace);
  }

  return <Login />;
}

export default LoginPage;
