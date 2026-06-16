import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ngebeng Payment - Payment Gateway untuk Semua Aplikasi",
  description:
    "Satu webhook payment untuk melayani banyak aplikasi. Daftarkan Aplikasi Anda dan kelola semua transaksi dari satu dashboard terpusat.",
  openGraph: {
    title: "Ngebeng Payment - Payment Gateway untuk Semua Aplikasi",
    description:
      "Satu webhook payment untuk melayani banyak aplikasi. Daftarkan Aplikasi Anda dan kelola semua transaksi dari satu dashboard terpusat.",
  },
};

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Multi Aplikasi",
    desc: "Satu webhook untuk banyak aplikasi. Setiap aplikasi punya API Key sendiri.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Aman & Terpercaya",
    desc: "Signature verification Midtrans, API Key authentication, dan logging lengkap.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Real-time Notifikasi",
    desc: "Terima notifikasi pembayaran secara real-time dari Midtrans.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Dashboard Lengkap",
    desc: "Pantau semua transaksi, revenue, dan status pembayaran dalam satu dashboard.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "Pull API",
    desc: "Aplikasi Anda bisa cek status transaksi kapan saja via API.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Keamanan Data",
    desc: "Semua data transaksi tersimpan aman di database PostgreSQL.",
    color: "from-indigo-500 to-violet-500",
  },
];

const steps = [
  {
    number: "01",
    title: "Daftarkan Aplikasi",
    desc: "Register aplikasi Anda (APK1, APK2, APK3, dll) melalui dashboard",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Dapatkan API Key",
    desc: "Setiap aplikasi mendapat API Key unik untuk autentikasi",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Setup Webhook",
    desc: "Arahkan webhook Midtrans ke endpoint kami",
    color: "from-green-500 to-emerald-500",
  },
  {
    number: "04",
    title: "Monitor Transaksi",
    desc: "Pantau semua transaksi dari satu dashboard terpusat",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Ngebeng</span>
                <span className="text-xl font-bold text-blue-400">Payment</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Fitur</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">Cara Kerja</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Harga</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-600/25"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-blue-300 text-sm font-medium">Payment Gateway Siap Digunakan</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Kelola Semua Pembayaran
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                dari Satu Dashboard
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Daftarkan aplikasi Anda dan terima pembayaran 
              melalui satu webhook terpusat. Pantau, kelola, dan analisis semua 
              transaksi dari dashboard yang intuitif.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-2xl hover:shadow-blue-600/30"
              >
                Daftarkan Aplikasi Anda
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lihat Demo
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
              { label: "Aplikasi Terdaftar", value: "3+", desc: "APK1, APK2, APK3" },
              { label: "Metode Pembayaran", value: "All Channel", desc: "Midtrans terintegrasi" },
              { label: "Response Time", value: "< 1 detik", desc: "Webhook real-time" },
            ].map((stat, i) => (
              <div key={i} className="bg-black/50 backdrop-blur-sm p-8 text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-gray-600 text-xs">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Fitur Unggulan</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Kenapa Memilih Ngebeng Payment?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Solusi payment gateway yang dirancang untuk kemudahan integrasi 
              dan pengelolaan multi-aplikasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-500"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">Cara Kerja</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Mulai dalam 4 Langkah Mudah
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Integrasi yang cepat dan tanpa ribet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-pink-400 text-sm font-semibold tracking-wider uppercase">Harga</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
              Harga yang Transparan
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Mulai gratis, skalakan sesuai kebutuhan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk memulai</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Gratis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 aplikasi", "100 transaksi/bulan", "Webhook & API", "Dashboard dasar"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                POPULER
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk bisnis berkembang</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Rp 99k</span>
                <span className="text-gray-400 text-sm">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["10 aplikasi", "10.000 transaksi/bulan", "Webhook & API", "Dashboard lengkap", "Prioritas support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Pilih Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-6">Untuk skala besar</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited aplikasi", "Unlimited transaksi", "Webhook & API", "Dashboard custom", "Dedicated support", "SLA 99.9%"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                Siap Mengelola Pembayaran?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Daftarkan aplikasi Anda sekarang dan kelola semua transaksi 
                dari satu dashboard terpusat. Gratis untuk memulai!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-100 transition-all hover:shadow-2xl"
                >
                  Daftarkan Aplikasi
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition-all"
                >
                  Masuk ke Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">Ngebeng Payment</span>
              </Link>
              <p className="text-gray-500 text-sm">
                Payment gateway untuk semua aplikasi Anda.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2">
                {["Fitur", "Harga", "API", "Integrasi"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                {["Tentang", "Blog", "Karir", "Kontak"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Dukungan</h4>
              <ul className="space-y-2">
                {["Dokumentasi", "FAQ", "Status", "Legal"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Ngebeng Payment. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
