import { useState, useEffect } from 'react';
import { Account, getAccounts, createAccount, updateAccount, deleteAccount } from '@/services/accounts';
import { toast } from "sonner"

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await getAccounts();
            setAccounts(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
            toast.error("Lỗi", {
                description: err instanceof Error ? err.message : 'Có lỗi xảy ra',
            });
        } finally {
            setLoading(false);
        }
    };

    const addAccount = async (accountData: { username: string; password: string; role: 'admin' | 'user' }) => {
        try {
            const newAccount = await createAccount(accountData);
            setAccounts(prev => [...prev, newAccount]);
            toast.success("Thành công", {
                description: "Đã thêm tài khoản mới",
            });
            return newAccount;
        } catch (err) {
            toast.error("Lỗi", {
                description: err instanceof Error ? err.message : 'Có lỗi xảy ra',
            });
            throw err;
        }
    };

    const editAccount = async (account_id: string, accountData: Partial<Account>) => {
        try {
            const updatedAccount = await updateAccount(account_id, accountData);
            setAccounts(prev => prev.map(acc => acc.account_id === account_id ? updatedAccount : acc));
            toast.success("Thành công", {
                description: "Đã cập nhật thông tin tài khoản",
            });
            return updatedAccount;
        } catch (err) {
            toast.error("Lỗi", {
                description: err instanceof Error ? err.message : 'Có lỗi xảy ra',
            });
            throw err;
        }
    };

    const removeAccount = async (account_id: string) => {
        try {
            await deleteAccount(account_id);
            setAccounts(prev => prev.filter(acc => acc.account_id !== account_id));
            toast.success("Thành công", {
                description: "Đã xóa tài khoản",
            });
        } catch (err) {
            toast.error("Lỗi", {
                description: err instanceof Error ? err.message : 'Có lỗi xảy ra',
            });
            throw err;
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return {
        accounts,
        loading,
        error,
        fetchAccounts,
        addAccount,
        editAccount,
        removeAccount,
    };
} 