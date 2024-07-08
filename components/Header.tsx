"use client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
export default function Header() {
  const router = useRouter();
  return (
    <header>
      <div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
        <Button onClick={() => router.push("/")}>Home</Button>
        <Button onClick={() => router.push("/login")}>Login</Button>
      </div>
    </header>
  );
}
