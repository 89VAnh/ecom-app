"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
    ShoppingBag,
    LogOut,
    Menu,
    ChevronDown,
    Bot,
    Activity,
    Store,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface NavItemProps {
    href: string
    icon: React.ReactNode
    title: string
    isActive: boolean
}

const NavItem = ({ href, icon, title, isActive }: NavItemProps) => (
    <Link href={href}>
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start mb-2 transition-all duration-200 hover:translate-x-1 hover:bg-gray-100"
        >
            {icon}
            <span className="ml-2">{title}</span>
        </Button>
    </Link>
)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const { user, loading, logout } = useAuth()

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    // Only redirect if not loading and no user
    if (!loading && !user) {
        router.push('/auth')
        return null
    }

    const navItems = [
        ...(user?.role === "admin" ? [{ href: "/dashboard/admin/accounts", icon: <Users size={20} />, title: "Tài khoản" }] : []),
        { href: "/dashboard", icon: <Activity size={20} />, title: "Phân tích" },
        { href: "/dashboard/products", icon: <ShoppingBag size={20} />, title: "Sản phẩm" },
        { href: "/dashboard/platforms", icon: <Store size={20} />, title: "Sàn thương mại" },
        { href: "/dashboard/crawlers", icon: <Bot size={20} />, title: "Bộ thu thập" },
    ]

    const renderNavItems = () => (
        <>
            {navItems.map((item) => (
                <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href}
                />
            ))}
        </>
    )

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col bg-white p-4 shadow-sm md:flex">
                <div className="mb-8 flex items-center space-x-2 px-2">
                    <Image src="/imgs/logo.png" alt="logo" width={32} height={32} />
                    <h1 className="text-xl font-bold">E-com Center</h1>
                </div>

                <nav className="flex-1 space-y-2">{renderNavItems()}</nav>

                <div className="border-t pt-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer hover:translate-x-1"
                        onClick={logout}
                    >
                        <LogOut size={20} />
                        <span className="ml-2">Đăng xuất</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                        <div className="mb-8 flex items-center space-x-2 p-4">
                            <Image src="/imgs/logo.png" alt="logo" width={32} height={32} />
                            <h1 className="text-xl font-bold">E-com Center</h1>
                        </div>

                        <nav className="flex-1 space-y-2 p-4">{renderNavItems()}</nav>

                        <div className="border-t p-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer hover:translate-x-1"
                                onClick={() => {
                                    setIsMobileNavOpen(false)
                                    logout()
                                }}
                            >
                                <LogOut size={20} />
                                <span className="ml-2">Đăng xuất</span>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
                <SheetTrigger asChild className="md:hidden cursor-pointer">
                    <Button variant="ghost" size="icon" className="absolute left-4 top-4 hover:bg-gray-100">
                        <Menu />
                    </Button>
                </SheetTrigger>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden cursor-pointer hover:bg-gray-100 mr-2"
                            onClick={() => setIsMobileNavOpen(true)}
                        >
                            <Menu />
                        </Button>
                    </div>

                    {/* User Account Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {user?.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">
                                        {user?.username}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {user?.username}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {user?.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
