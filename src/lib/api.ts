const BASE_URL = "https://rbslot.onrender.com/api";

// Store the token in memory and localStorage
let authToken: string | null = localStorage.getItem("admin_token") || null;
const storedUser = localStorage.getItem("admin_user");
let adminUser: AdminUser | null = storedUser && storedUser !== "undefined" && storedUser !== "null" 
  ? JSON.parse(storedUser) 
  : null;

export interface AdminUser {
  userId: string;
  mobileNumber: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const setAuthData = (token: string, user: AdminUser) => {
  authToken = token;
  adminUser = user;
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(user));
};

export const getAuthToken = () => authToken;
export const getAdminUser = () => adminUser;

export const clearAuthToken = () => {
  authToken = null;
  adminUser = null;
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// Types
export interface User {
  userId: string;
  mobileNumber: string;
  role: string;
  balance: number;
  createdAt: string;
}

export interface LinkedAccount {
  userId: string;
  mobileNumber: string;
  role: string;
  balance: number;
}

export interface BankAccount {
  holderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

export interface Transaction {
  orderId: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal";
  status: "pending" | "completed" | "failed";
  createdAt: string;
  meta?: {
    bankAccount?: BankAccount;
  };
}

export interface DeviceLog {
  id: string;
  userId: string;
  deviceId: string;
  ip: string;
  adId: string;
  ua: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  page: number;
  totalPages: number;
  totalRecords: number;
  [key: string]: T[] | number;
}

// Deposit Types
export interface Deposit {
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  utr: string;
  created_at: string;
  gateway_order_no?: string;
}

export interface DepositResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  deposits: Deposit[];
}

export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalBalance: number;
}

// Auth API
export const adminLogin = async (mobileNumber: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobileNumber, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  
  return data;
};

// Admin API Functions
export const fetchStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch stats");
  }
  return response.json();
};

export const fetchUsers = async (page: number = 1): Promise<PaginatedResponse<User> & { users: User[] }> => {
  const response = await fetch(`${BASE_URL}/admin/users?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const fetchLinkedAccounts = async (userId: string): Promise<{ userId: string; linkedAccounts: LinkedAccount[] }> => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/linked`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch linked accounts");
  }
  return response.json();
};

export const fetchTransactions = async (page: number = 1): Promise<PaginatedResponse<Transaction> & { transactions: Transaction[] }> => {
  const response = await fetch(`${BASE_URL}/admin/transactions?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
};

export const fetchDevices = async (page: number = 1): Promise<PaginatedResponse<DeviceLog> & { devices: DeviceLog[] }> => {
  const response = await fetch(`${BASE_URL}/admin/devices?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch devices");
  }
  return response.json();
};


// Admin: approve or reject transaction
export const updateTransactionStatus = async (
  orderId: string,
  status: "completed" | "failed"
): Promise<Transaction> => {
  const response = await fetch(`${BASE_URL}/transactions/${orderId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error(data.error || "Failed to update transaction status");
  }

  return data;
};

// Deposit API Functions
const DEPOSIT_BASE_URL = "https://rbslot.onrender.com/api/deposit/admin";

export const fetchDeposits = async (
  page: number = 1,
  userId?: string,
  orderId?: string
): Promise<DepositResponse> => {
  let url = `${DEPOSIT_BASE_URL}/find?page=${page}`;
  
  if (userId) {
    url = `${DEPOSIT_BASE_URL}/find?user_id=${userId}&page=${page}`;
  }
  if (orderId) {
    url = `${DEPOSIT_BASE_URL}/find?order_id=${orderId}`;
  }

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch deposits");
  }

  return response.json();
};

export const updateDepositStatus = async (
  orderId: string,
  status: "SUCCESS" | "FAILED",
  note: string
): Promise<{ success: boolean; order_id: string; status: string }> => {
  const response = await fetch(`${DEPOSIT_BASE_URL}/${orderId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status, note }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
    throw new Error(data.error || "Failed to update deposit status");
  }

  return data;
};
