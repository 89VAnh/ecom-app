"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("ECC_user")
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="animate-pulse text-gray-500">Đang chuyển hướng...</div>
    </div>
  )
}
