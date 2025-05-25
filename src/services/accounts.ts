export interface Account {
  account_id: string;
  username: string;
  password: string;
  role: "admin" | "user";
  created_at: Date;
}

export async function getAccounts() {
  const response = await fetch("/api/accounts");
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data as Account[];
}

export async function createAccount(account: {
  username: string;
  password: string;
  role: "admin" | "user";
}) {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Account;
}

export async function updateAccount(
  account_id: string,
  account: Partial<Omit<Account, "account_id" | "created_at">>
) {
  const response = await fetch(`/api/accounts/${account_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      Array.isArray(data.error) ? data.error[0].message : data.error
    );
  }

  return data.data as Account;
}

export async function deleteAccount(account_id: string) {
  const response = await fetch(`/api/accounts/${account_id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return true;
}
