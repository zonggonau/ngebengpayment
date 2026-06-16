import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          404
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-400 mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
