"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: number;
  orderId: string;
  grossAmount: string;
  transactionStatus: string;
  paymentType: string | null;
  transactionTime: string | null;
  settlementTime: string | null;
  bank: string | null;
  vaNumber: string | null;
  createdAt: string;
  app: { name: string; appCode: string };
}

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/dashboard/transactions");
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filtered = transactions.filter(
    (tx) =>
      tx.orderId.toLowerCase().includes(search.toLowerCase()) ||
      tx.app.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.transactionStatus.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1">
              {transactions.length} total transactions
            </p>
          </div>
          <Input
            placeholder="Search transactions..."
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left bg-gray-50">
                      <th className="p-4 font-medium text-gray-500">Order ID</th>
                      <th className="p-4 font-medium text-gray-500">App</th>
                      <th className="p-4 font-medium text-gray-500">Amount</th>
                      <th className="p-4 font-medium text-gray-500">Status</th>
                      <th className="p-4 font-medium text-gray-500">Payment</th>
                      <th className="p-4 font-medium text-gray-500">Bank/VA</th>
                      <th className="p-4 font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx) => (
                      <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4 font-mono text-xs">{tx.orderId}</td>
                        <td className="p-4">
                          <div>
                            <span className="font-medium">{tx.app.name}</span>
                            <span className="text-gray-400 ml-1">({tx.app.appCode})</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          Rp {parseFloat(tx.grossAmount).toLocaleString("id-ID")}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              statusColors[tx.transactionStatus] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {tx.transactionStatus}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-600">{tx.paymentType || "-"}</td>
                        <td className="p-4 text-gray-600">
                          {tx.bank && tx.vaNumber
                            ? `${tx.bank} - ${tx.vaNumber}`
                            : "-"}
                        </td>
                        <td className="p-4 text-gray-500 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          {search ? "No transactions match your search" : "No transactions yet"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
