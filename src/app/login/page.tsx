"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("ログイン成功！");
    window.location.href = "/deals";
  };
const handleDemoLogin = async () => {
  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email: "demo@example.com",
    password: "demo1234",
  });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("デモログインしました");

  window.location.href = "/deals";
};
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

        <input
          className="mb-3 w-full rounded border p-3"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded border p-3"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded bg-green-600 p-3 text-white hover:bg-green-700"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>

        <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="mt-4 w-full rounded bg-gray-700 p-3 text-white hover:bg-gray-800"
        >
        デモログイン
        </button>
        <Link
         href="/forgot-password"
         className="mt-4 block text-center text-blue-600 hover:underline"
          >
        パスワードを忘れた方
        </Link>
      </div>
    </main>
  );
}