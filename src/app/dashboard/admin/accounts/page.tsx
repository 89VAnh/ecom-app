"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, UserCog, Trash2 } from "lucide-react"
import { useAccounts } from "@/hooks/useAccounts"
import { AddAccountDialog } from "@/components/accounts/add-account-dialog"
import { EditAccountDialog } from "@/components/accounts/edit-account-dialog"
import { DeleteAccountDialog } from "@/components/accounts/delete-account-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Account } from "@/services/accounts"

export default function AccountsPage() {
    const { accounts, loading, addAccount, editAccount, removeAccount } = useAccounts();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const handleAdd = async (accountData: Account) => {
        await addAccount(accountData);
        setIsAddDialogOpen(false);
    };

    const handleEdit = (account: Account) => {
        setSelectedAccount(account);
        setIsEditDialogOpen(true);
    };

    const handleSave = async (accountData: Partial<Account>) => {
        if (selectedAccount) {
            await editAccount(selectedAccount.account_id, accountData);
            setIsEditDialogOpen(false);
            setSelectedAccount(null);
        }
    };

    const handleDelete = (account: Account) => {
        setSelectedAccount(account);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedAccount) {
            await removeAccount(selectedAccount.account_id);
            setIsDeleteDialogOpen(false);
            setSelectedAccount(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Tài khoản</h1>
                    <p className="text-muted-foreground">Quản lý tài khoản người dùng</p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm tài khoản
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên đăng nhập</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.account_id}>
                                        <TableCell className="font-medium">
                                            {account.username}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={account.role === "admin" ? "default" : "outline"}
                                            >
                                                {account.role === "admin" ? "Quản trị viên" : "Người dùng"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(account.created_at).toLocaleDateString("vi-VN")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(account)}
                                                >
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => handleDelete(account)}
                                                    disabled={account.role === "admin"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {accounts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Chưa có tài khoản nào
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddAccountDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdd={handleAdd}
            />

            <EditAccountDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                account={selectedAccount}
                onSave={handleSave}
            />

            <DeleteAccountDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                account={selectedAccount}
                onDelete={handleConfirmDelete}
            />
        </div>
    )
}
