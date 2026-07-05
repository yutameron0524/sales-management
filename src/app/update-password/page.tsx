"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password) {
      alert("新しいパスワードを入力してください");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("パスワードを変更しました。");

    window.location.href = "/login";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-6 text-2xl font-bold">
          パスワード変更
        </h1>

        <p className="mb-6 text-slate-600">
          新しいパスワードを入力してください。
        </p>

        <input
          className="mb-6 w-full rounded border p-3"
          type="password"
          placeholder="新しいパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full rounded bg-green-600 p-3 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "変更中..." : "パスワードを変更"}
        </button>

      </div>
    </main>
  );
}
