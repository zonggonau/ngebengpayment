"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface App {
  id: number;
  name: string;
  appCode: string;
  apiKey: string;
  webhookUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { transactions: number };
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [appCode, setAppCode] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [registering, setRegistering] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<number | null>(null);
  const [editWebhookUrl, setEditWebhookUrl] = useState("");
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ id: number; name: string } | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      const res = await fetch("/api/dashboard/apps");
      if (res.ok) {
        const data = await res.json();
        setApps(data.apps);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegistering(true);

    try {
      const res = await fetch("/api/apps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          appCode,
          ...(webhookUrl.trim() ? { webhookUrl: webhookUrl.trim() } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to register app");
        return;
      }

      toast.success("App registered successfully!");
      setShowRegister(false);
      setName("");
      setAppCode("");
      setWebhookUrl("");
      fetchApps();
    } catch {
      toast.error("Connection error");
    } finally {
      setRegistering(false);
    }
  }

  async function toggleAppStatus(appId: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/apps/${appId}/toggle`, {
        method: "PATCH",
      });

      if (res.ok) {
        toast.success(`App ${isActive ? "disabled" : "enabled"} successfully`);
        fetchApps();
      } else {
        toast.error("Failed to toggle app status");
      }
    } catch {
      toast.error("Connection error");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-500 mt-1">{apps.length} registered apps</p>
          </div>
          <Button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? "Cancel" : "Register New App"}
          </Button>
        </div>

        {showRegister && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Register New Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">App Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Aplikasi 1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appCode">App Code</Label>
                  <Input
                    id="appCode"
                    placeholder="e.g. APK1"
                    value={appCode}
                    onChange={(e) => setAppCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">
                    Webhook URL <span className="text-gray-400 font-normal">(opsional)</span>
                  </Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="e.g. https://apk1.com/api/payment/callback"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    URL endpoint aplikasi Anda untuk menerima notifikasi status transaksi secara real-time
                  </p>
                </div>
                <Button type="submit" disabled={registering}>
                  {registering ? "Registering..." : "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : apps.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.appCode}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          className={
                            app.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {app.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors data-open:bg-gray-100" title="More actions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="5" r="1"/>
                              <circle cx="12" cy="12" r="1"/>
                              <circle cx="12" cy="19" r="1"/>
                            </svg>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                setDeleteDialog({ id: app.id, name: app.name });
                                setDeleteConfirmName("");
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              </svg>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">API Key: </span>
                        <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {app.apiKey.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(app.apiKey);
                            toast.success("API Key copied!");
                          }}
                          className="ml-1.5 text-gray-400 hover:text-gray-600 inline-flex items-center"
                          title="Copy API Key"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        </button>
                      </div>
                      <div>
                        <span className="text-gray-500">Transactions: </span>
                        <span className="font-medium">{app._count.transactions}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Created: </span>
                        <span>
                          {new Date(app.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Webhook URL: </span>
                        {editingWebhook === app.id ? (
                          <div className="mt-1 space-y-2">
                            <Input
                              type="url"
                              placeholder="https://apk1.com/api/payment/callback"
                              value={editWebhookUrl}
                              onChange={(e) => setEditWebhookUrl(e.target.value)}
                              className="text-xs"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="text-xs h-7 px-3"
                                disabled={savingWebhook}
                                onClick={async () => {
                                  setSavingWebhook(true);
                                  try {
                                    const res = await fetch(`/api/apps/${app.id}/webhook`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ webhookUrl: editWebhookUrl.trim() || null }),
                                    });
                                    if (res.ok) {
                                      toast.success("Webhook URL updated");
                                      setEditingWebhook(null);
                                      fetchApps();
                                    } else {
                                      const data = await res.json();
                                      toast.error(data.error || "Failed to update");
                                    }
                                  } catch {
                                    toast.error("Connection error");
                                  } finally {
                                    setSavingWebhook(false);
                                  }
                                }}
                              >
                                {savingWebhook ? "Saving..." : "Save"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 px-3"
                                onClick={() => setEditingWebhook(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            {app.webhookUrl ? (
                              <>
                                <code className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded truncate max-w-[180px] inline-block">
                                  {app.webhookUrl}
                                </code>
                                <button
                                  onClick={() => {
                                    setEditingWebhook(app.id);
                                    setEditWebhookUrl(app.webhookUrl || "");
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  edit
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-400 italic">Not set</span>
                                <button
                                  onClick={() => {
                                    setEditingWebhook(app.id);
                                    setEditWebhookUrl("");
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                >
                                  + Add
                                </button>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAppStatus(app.id, app.isActive)}
                      >
                        {app.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog(null);
            setDeleteConfirmName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Application</DialogTitle>
            <DialogDescription>
              This action <strong>cannot be undone</strong>. This will permanently delete
              the app <strong>"{deleteDialog?.name}"</strong> and all its transactions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please type <strong className="text-gray-900">{deleteDialog?.name}</strong> to confirm:
            </p>
            <Input
              placeholder={deleteDialog?.name || ""}
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              className={
                deleteConfirmName && deleteConfirmName !== deleteDialog?.name
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialog(null);
                setDeleteConfirmName("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmName !== deleteDialog?.name || deleting}
              onClick={async () => {
                if (!deleteDialog) return;
                setDeleting(true);
                try {
                  const res = await fetch(`/api/apps/${deleteDialog.id}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    toast.success(`"${deleteDialog.name}" deleted successfully`);
                    setDeleteDialog(null);
                    setDeleteConfirmName("");
                    fetchApps();
                  } else {
                    const data = await res.json();
                    toast.error(data.error || "Failed to delete app");
                  }
                } catch {
                  toast.error("Connection error");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
