"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Toaster, toast } from "sonner";

const codeExamples = {
  curl: `curl -X POST https://ngebeng-payment.com/api/transactions \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "order_id": "ORDER-001",
    "gross_amount": 50000,
    "customer_details": {
      "first_name": "Budi",
      "email": "budi@example.com"
    }
  }'`,
  nodejs: `const axios = require('axios');

const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://ngebeng-payment.com';

// 1. Buat transaksi
async function createTransaction() {
  const response = await axios.post(
    \`\${BASE_URL}/api/transactions\`,
    {
      order_id: 'ORDER-001',
      gross_amount: 50000,
      customer_details: {
        first_name: 'Budi',
        email: 'budi@example.com'
      }
    },
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );
  return response.data;
}

// 2. Cek status transaksi
async function checkStatus(orderId) {
  const response = await axios.get(
    \`\${BASE_URL}/api/transactions?order_id=\${orderId}\`,
    {
      headers: { 'X-API-Key': API_KEY }
    }
  );
  return response.data;
}`,
  python: `import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://ngebeng-payment.com'

# 1. Buat transaksi
def create_transaction():
    response = requests.post(
        f'{BASE_URL}/api/transactions',
        json={
            'order_id': 'ORDER-001',
            'gross_amount': 50000,
            'customer_details': {
                'first_name': 'Budi',
                'email': 'budi@example.com'
            }
        },
        headers={'X-API-Key': API_KEY}
    )
    return response.json()

# 2. Cek status transaksi
def check_status(order_id):
    response = requests.get(
        f'{BASE_URL}/api/transactions',
        params={'order_id': order_id},
        headers={'X-API-Key': API_KEY}
    )
    return response.json()`,
  php: `<?php
$apiKey = 'YOUR_API_KEY';
$baseUrl = 'https://ngebeng-payment.com';

// 1. Buat transaksi
function createTransaction($apiKey, $baseUrl) {
    $ch = curl_init("$baseUrl/api/transactions");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "X-API-Key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'order_id' => 'ORDER-001',
        'gross_amount' => 50000,
        'customer_details' => [
            'first_name' => 'Budi',
            'email' => 'budi@example.com'
        ]
    ]));
    return json_decode(curl_exec($ch), true);
}

// 2. Cek status transaksi
function checkStatus($apiKey, $baseUrl, $orderId) {
    $ch = curl_init("$baseUrl/api/transactions?order_id=$orderId");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "X-API-Key: $apiKey"
    ]);
    return json_decode(curl_exec($ch), true);
}
?>`,
};

const tabs = [
  { id: "curl", label: "cURL" },
  { id: "nodejs", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "php", label: "PHP" },
];

export default function DokumentasiPage() {
  const [activeTab, setActiveTab] = useState("curl");
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    toast.success("Code copied!");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <DashboardLayout>
      <Toaster richColors />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Dokumentasi API</h1>
          <p className="text-gray-500 mt-1">
            Panduan lengkap integrasi aplikasi Anda dengan Ngebeng Payment
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-4">Mulai Cepat</h2>
            <p className="text-blue-100 mb-6">
              Ikuti 2 langkah mudah untuk mengintegrasikan aplikasi Anda
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  step: "1",
                  title: "Daftarkan Aplikasi",
                  desc: "Buat aplikasi baru di dashboard untuk mendapatkan API Key",
                },
                {
                  step: "2",
                  title: "Integrasi API",
                  desc: "Gunakan API Key untuk membuat & cek transaksi",
                },
              ].map((item) => (
                <div key={item.step} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Setup Webhook Midtrans (Kami yang setup) */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            1. Webhook Midtrans (Sudah Siap)
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-base font-semibold text-green-800">Tidak perlu setup apapun!</p>
                <p className="text-sm text-green-700 mt-1">
                  Webhook Midtrans sudah kami siapkan di server kami. 
                  Anda tidak perlu mengatur atau mengkonfigurasi Midtrans sama sekali.
                </p>
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Cara kerja:</strong> Kami telah mengintegrasikan akun Midtrans kami sendiri 
                dengan endpoint <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs font-mono">/api/midtrans/webhook</code>. 
                Setiap kali ada pembayaran dari aplikasi Anda, Midtrans akan otomatis 
                mengirim notifikasi ke webhook kami, dan kami akan memperbarui status 
                transaksi di database.
              </p>
            </div>
          </div>
        </section>

        {/* API Key */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            2. API Key Authentication
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-4">
              Setiap aplikasi yang terdaftar memiliki API Key unik. 
              API Key ini digunakan untuk autentikasi semua request ke API.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Penting!</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    API Key bersifat rahasia. Jangan pernah membagikan API Key 
                    Anda di public repository atau client-side code.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <strong className="text-gray-900">Header:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">X-API-Key</code>
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-900">Value:</strong> API Key aplikasi Anda (dapatkan dari halaman Applications)
              </p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            3. API Endpoints
          </h2>

          {/* Create Transaction */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-md">POST</span>
              <code className="text-sm font-mono text-gray-800">/api/transactions</code>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Membuat transaksi baru dan mendapatkan redirect URL pembayaran.
            </p>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "order_id": "ORDER-001",        // required - ID unik pesanan
  "gross_amount": 50000,          // required - Jumlah pembayaran (Rp)
  "customer_details": {           // optional - Data pelanggan
    "first_name": "Budi",
    "last_name": "Santoso",
    "email": "budi@example.com",
    "phone": "08123456789"
  }
}`}</pre>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response:</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "success": true,
  "transaction": {
    "id": 1,
    "order_id": "ORDER-001",
    "gross_amount": 50000,
    "status": "pending",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v4/redirection/...",
    "created_at": "2026-06-13T08:00:00Z"
  }
}`}</pre>
            </div>
          </div>

          {/* Check Transaction */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-md">GET</span>
              <code className="text-sm font-mono text-gray-800">/api/transactions?order_id=ORDER-001</code>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Mengecek status transaksi berdasarkan order_id.
            </p>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response:</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "success": true,
  "transaction": {
    "id": 1,
    "order_id": "ORDER-001",
    "gross_amount": 50000,
    "status": "settlement",    // pending | settlement | capture | deny | cancel | expire | failure
    "payment_type": "bank_transfer",
    "bank": "bca",
    "va_number": "1234567890",
    "transaction_time": "2026-06-13T08:00:00Z",
    "settlement_time": "2026-06-13T08:05:00Z",
    "app": {
      "name": "APK1",
      "api_key": "ngb_..."
    }
  }
}`}</pre>
            </div>
          </div>

          {/* Register App */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-md">POST</span>
              <code className="text-sm font-mono text-gray-800">/api/apps/register</code>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Mendaftarkan aplikasi baru (bisa juga dilakukan dari dashboard).
            </p>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body:</h4>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "name": "APK1",               // required - Nama aplikasi
  "description": "Aplikasi 1"   // optional - Deskripsi
}`}</pre>
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response:</h4>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "success": true,
  "app": {
    "id": 1,
    "name": "APK1",
    "api_key": "ngb_a1b2c3d4e5f6...",
    "is_active": true,
    "created_at": "2026-06-13T08:00:00Z"
  }
}`}</pre>
            </div>
          </div>
        </section>

        {/* Status Transaksi */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            4. Status Transaksi
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { status: "pending", desc: "Menunggu pembayaran dari pelanggan" },
                  { status: "settlement", desc: "Pembayaran berhasil (dana masuk)" },
                  { status: "capture", desc: "Pembayaran berhasil (kartu kredit)" },
                  { status: "deny", desc: "Pembayaran ditolak" },
                  { status: "cancel", desc: "Pembayaran dibatalkan" },
                  { status: "expire", desc: "Waktu pembayaran habis" },
                  { status: "failure", desc: "Pembayaran gagal" },
                ].map((item) => (
                  <tr key={item.status} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "settlement" || item.status === "capture"
                          ? "bg-green-100 text-green-800"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            5. Contoh Kode
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="ml-auto flex items-center pr-3">
                <button
                  onClick={() => copyCode(codeExamples[activeTab as keyof typeof codeExamples], activeTab)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {copied === activeTab ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Code */}
            <div className="bg-gray-900 p-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
                {codeExamples[activeTab as keyof typeof codeExamples]}
              </pre>
            </div>
          </div>
        </section>

        {/* Webhook Forward ke Aplikasi Anda */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            6. Webhook Forward (Notifikasi Real-time ke Aplikasi Anda)
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-4">
              Setiap kali ada perubahan status transaksi (pembayaran berhasil, gagal, dll), 
              sistem kami akan <strong className="text-gray-900">mengirim POST request</strong> 
              ke Webhook URL aplikasi Anda secara otomatis.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Cara Setup</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Cukup isi field <strong>Webhook URL</strong> saat mendaftarkan aplikasi (atau edit nanti dari halaman Applications).
                    Kami akan kirim POST ke URL tersebut setiap ada update status transaksi.
                  </p>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 mb-2">Payload yang kami POST ke aplikasi Anda:</h4>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`{
  "order_id": "APK1-ORDER-001",
  "transaction_status": "settlement"
}`}</pre>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Payload sederhana: hanya <code className="bg-gray-200 px-1 py-0.5 rounded">order_id</code> dan <code className="bg-gray-200 px-1 py-0.5 rounded">transaction_status</code>. 
              Untuk detail lengkap, gunakan <code className="bg-gray-200 px-1 py-0.5 rounded">GET /api/transactions?order_id=xxx</code>.
            </p>

            <h4 className="text-sm font-semibold text-gray-900 mb-2">Contoh endpoint di aplikasi Anda (Node.js):</h4>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs leading-relaxed">{`// Aplikasi Anda (APK1) - endpoint untuk menerima notifikasi
app.post('/api/payment/callback', (req, res) => {
  const { order_id, transaction_status } = req.body;
  
  // Update status pesanan di database Anda
  if (transaction_status === 'settlement') {
    // Pembayaran berhasil, update status pesanan
    await updateOrderStatus(order_id, 'paid');
  }
  
  // Harus respond 200 agar kami tahu notifikasi diterima
  res.status(200).json({ success: true });
});`}</pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Penting!</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Endpoint Anda harus merespon dengan status <strong>200 OK</strong> dalam waktu singkat. 
                    Jika tidak, kami akan menganggap notifikasi gagal dikirim (tapi data tetap aman di database kami).
                    Gunakan header <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">X-API-Key</code> 
                    untuk verifikasi bahwa notifikasi benar-benar dari kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alur Lengkap */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            7. Alur Integrasi Lengkap
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="space-y-6">
              {[
                {
                  num: "1",
                  title: "Daftarkan aplikasi Anda di dashboard",
                  desc: "Buat aplikasi baru, dapatkan API Key, dan isi Webhook URL endpoint Anda",
                },
                {
                  num: "2",
                  title: "User memilih pembayaran di aplikasi Anda (APK1)",
                  desc: "Aplikasi Anda menampilkan halaman checkout dengan berbagai metode pembayaran",
                },
                {
                  num: "3",
                  title: "Aplikasi Anda panggil API /api/transactions",
                  desc: "Kirim order_id, gross_amount, dan customer_details dengan API Key",
                },
                {
                  num: "4",
                  title: "Dapatkan redirect_url dari response",
                  desc: "Arahkan user ke halaman pembayaran Midtrans Snap",
                },
                {
                  num: "5",
                  title: "User membayar via Midtrans",
                  desc: "User memilih metode pembayaran (BCA, Mandiri, GoPay, dll) dan menyelesaikan pembayaran",
                },
                {
                  num: "6",
                  title: "Midtrans kirim notifikasi ke webhook kami",
                  desc: "Kami terima notifikasi, verifikasi signature, update status transaksi di database",
                },
                {
                  num: "7",
                  title: "Kami forward notifikasi ke aplikasi Anda",
                  desc: "Kami kirim POST request ke Webhook URL aplikasi Anda dengan data status transaksi terbaru",
                },
                {
                  num: "8",
                  title: "Aplikasi Anda cek status via GET /api/transactions",
                  desc: "Polling atau cek status transaksi untuk konfirmasi pembayaran berhasil",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catatan Penting */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            8. Catatan Penting
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">order_id</strong> harus unik untuk setiap transaksi. 
                Gunakan kombinasi timestamp + random string atau increment ID.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">API Key</strong> disimpan di server-side, 
                jangan pernah ekspos di frontend JavaScript.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600">
                Gunakan <strong className="text-gray-900">Polling</strong> atau 
                <strong className="text-gray-900"> WebSocket</strong> untuk mengecek status transaksi 
                secara real-time di aplikasi Anda.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600">
                Semua transaksi dicatat dengan <strong className="text-gray-900">logging</strong> lengkap 
                untuk keperluan audit dan debugging.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
