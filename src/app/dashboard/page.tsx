"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalTransactions: number;
  totalApps: number;
  totalRevenue: number;
  recentTransactions: Array<{
    id: number;
    orderId: string;
    grossAmount: string;
    transactionStatus: string;
    paymentType: string | null;
    createdAt: string;
    app: { name: string };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statusColors: Record<string, string> = {
    settlement: "bg-green-100 text-green-800",
    capture: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    deny: "bg-red-100 text-red-800",
    expire: "bg-gray-100 text-gray-800",
    cancel: "bg-red-100 text-red-800",
    refund: "bg-orange-100 text-orange-800",
    partial_refund: "bg-orange-100 text-orange-800",
    authorize: "bg-purple-100 text-purple-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome to Ngebeng Payment Dashboard</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalTransactions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    Rp {stats.totalRevenue.toLocaleString("id-ID")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Registered Apps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalApps}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium text-gray-500">Order ID</th>
                        <th className="pb-3 font-medium text-gray-500">App</th>
                        <th className="pb-3 font-medium text-gray-500">Amount</th>
                        <th className="pb-3 font-medium text-gray-500">Status</th>
                        <th className="pb-3 font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b last:border-0">
                          <td className="py-3 font-mono text-xs">{tx.orderId}</td>
                          <td className="py-3">{tx.app.name}</td>
                          <td className="py-3">
                            Rp {parseFloat(tx.grossAmount).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3">
                            <Badge
                              className={
                                statusColors[tx.transactionStatus] ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {tx.transactionStatus}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                          </td>
                        </tr>
                      ))}
                      {stats.recentTransactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No transactions yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-center text-gray-400 py-12">Failed to load dashboard data</p>
        )}
      </div>
    </DashboardLayout>
  );
}
