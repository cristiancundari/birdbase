import React from "react";
import Login from "./login";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

async function LoginPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/app/home");
  }

  return <Login />;
}

export default LoginPage;
