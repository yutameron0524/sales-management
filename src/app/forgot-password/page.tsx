"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {

const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);

const handleResetPassword = async () => {
  if (!email) {
    alert("メールアドレスを入力してください");
    return;
  }

  setLoading(true);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/update-password",
  });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("パスワードリセットメールを送信しました。メールをご確認ください。");
};

return (

  <main className="flex min-h-screen items-center justify-center bg-slate-100">

<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

<h1 className="mb-6 text-2xl font-bold">
  パスワードを忘れた方
</h1>

<p className="mb-6 text-slate-600">
登録したメールアドレスを入力してください。
</p>

<input
  className="mb-6 w-full rounded border p-3"
  type="email"
  placeholder="メールアドレス"
  value={email}
  onChange={(e) => setEmail(e.target.value)}

/>

<button
  onClick={handleResetPassword}
  disabled={loading}
  className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
>
  {loading ? "送信中..." : "メールを送信"}
</button>

</div>

</main>

);

}
