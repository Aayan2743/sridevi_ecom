"use client";

import AppErrorScreen from "@/components/AppErrorScreen";

export default function Error({ error, reset }) {
  return <AppErrorScreen error={error} reset={reset} />;
}
