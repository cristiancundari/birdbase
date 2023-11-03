import { RedirectType, redirect } from "next/navigation";
import React from "react";

function AppPage() {
  return redirect("/app/home", RedirectType.replace);
}

export default AppPage;
