"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error)
            }

            // Save user data to context and localStorage
            login(data.data)

            toast.success("Đăng nhập thành công")

            // Đợi một chút để đảm bảo cookie đã được set
            setTimeout(() => {
                // Chuyển hướng dựa trên role
                if (data.data.role === 'admin') {
                    router.push('/dashboard/admin/accounts')
                } else {
                    router.push('/dashboard')
                }
                router.refresh() // Refresh để cập nhật trạng thái
            }, 100)

        } catch (error) {
            toast.error("Lỗi đăng nhập", {
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Đăng nhập</CardTitle>
                    <CardDescription>
                        Đăng nhập để truy cập hệ thống quản lý
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên đăng nhập</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
