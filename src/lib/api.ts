const BASE_URL = "https://rbslot.onrender.com/api/admin";

// Store the token in memory (you can also use localStorage)
let authToken: string | null = localStorage.getItem("admin_token");

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem("admin_token", token);
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem("admin_token");
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

export interface Transaction {
  orderId: string;
  userId: string;
  amount: number;
  type: "credit" | "debit";
  status: "pending" | "completed" | "failed";
  createdAt: string;
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

export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalBalance: number;
}

// API Functions
export const fetchStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${BASE_URL}/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
};

export const fetchUsers = async (page: number = 1): Promise<PaginatedResponse<User> & { users: User[] }> => {
  const response = await fetch(`${BASE_URL}/users?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const fetchLinkedAccounts = async (userId: string): Promise<{ userId: string; linkedAccounts: LinkedAccount[] }> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/linked`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch linked accounts");
  return response.json();
};

export const fetchTransactions = async (page: number = 1): Promise<PaginatedResponse<Transaction> & { transactions: Transaction[] }> => {
  const response = await fetch(`${BASE_URL}/transactions?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};

export const fetchDevices = async (page: number = 1): Promise<PaginatedResponse<DeviceLog> & { devices: DeviceLog[] }> => {
  const response = await fetch(`${BASE_URL}/devices?page=${page}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch devices");
  return response.json();
};
