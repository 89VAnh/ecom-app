"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/auth')
            toast.success("Đã đăng xuất")
        } catch {
            toast.error("Lỗi đăng xuất")
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
        </Button>
    )
} 