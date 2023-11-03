import React from "react";
import Login from "./login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/app/home");
  }

  return <Login />;
}

export default LoginPage;
