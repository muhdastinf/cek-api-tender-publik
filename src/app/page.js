"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUrl: url, method }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Gagal mendapatkan respons dari server."
        );
      }

      const result = await response.json();
      const blob = new Blob([result.data], {
        type: "text/plain;charset=utf-8",
      });

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "hasil-tender.txt";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            API Tender Checker
          </h1>
          <p className="mt-2 text-gray-600">
            Uji aksesibilitas API dari server Vercel dan unduh hasilnya sebagai
            .txt
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL API Target
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="https://contoh-website-tender.go.id/api/v1/data"
              required
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="method"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Metode Request
            </label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="GET" className="text-black">
                GET
              </option>
              <option value="POST" className="text-black">
                POST
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Hasilkan & Unduh .txt"}
          </button>
        </form>

        {error && (
          <div
            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
      </div>
    </main>
  );
}
