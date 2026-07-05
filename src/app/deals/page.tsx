"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Deal = {
  id: number;
  title: string;
  company: string | null;
  next_follow_date: string | null;
  reminder_days: number;
};

export default function DealsPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [nextFollowDate, setNextFollowDate] = useState("");
  const [reminderDays, setReminderDays] = useState(3);
  const [deals, setDeals] = useState<Deal[]>([]);

  const getStatus = (date: string | null) => {
  if (!date) {
    return "none";
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(date);

  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) {
    return "today";
  }

  if (target.getTime() === tomorrow.getTime()) {
    return "tomorrow";
  }

  if (target < today) {
    return "expired";
  }

  return "future";
};

const addDeal = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("ログインしてください");
    return;
  }

  const { error } = await supabase.from("deals").insert({
    title,
    company,
    next_follow_date: nextFollowDate,
    reminder_days: reminderDays,
    user_id: user.id,

  });

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  setTitle("");
  setCompany("");
  setNextFollowDate("");
  setReminderDays(3);

  fetchDeals();
};
const fetchDeals = async () => {
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("next_follow_date", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  setDeals(data ?? []);
};

useEffect(() => {
  fetchDeals();
}, []);
return (
  <main className="min-h-screen bg-slate-100">
    <div className="mx-auto max-w-3xl p-8">

      <h1 className="mb-6 text-3xl font-bold">
        営業管理アプリ
      </h1>
    <Link
  href="/dashboard"
  className="inline-block mb-6 rounded-lg bg-slate-700 px-5 py-3 text-white hover:bg-slate-800"
>
  ダッシュボードへ
</Link>
      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="案件名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          placeholder="会社名"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="mb-4 w-full rounded-lg border p-3"
          type="date"
          value={nextFollowDate}
          onChange={(e) => setNextFollowDate(e.target.value)}
        />
        <label className="mb-2 block font-semibold">
         通知する日
        </label>

        <select
         value={reminderDays}
         onChange={(e) => setReminderDays(Number(e.target.value))}
         className="mb-6 w-full rounded border p-3"
        >
        <option value={1}>1日前</option>
        <option value={3}>3日前</option>
        <option value={7}>7日前</option>
        <option value={14}>14日前</option>

        </select>

        <button
          onClick={addDeal}
          className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
        >
          案件追加
        </button>

      </div>

     <div className="space-y-4">
  {deals.map((deal) => {
    const status = getStatus(deal.next_follow_date);
    
    let statusClass = "";
let statusText = "";

switch (status) {
  case "today":
    statusClass = "bg-green-100 text-green-700";
    statusText = "🟢 今日";
    break;

  case "tomorrow":
    statusClass = "bg-yellow-100 text-yellow-700";
    statusText = "🟡 明日";
    break;

  case "future":
    statusClass = "bg-red-100 text-red-700";
    statusText = "🔴 期限切れ";
    break;

  default:
    statusClass = "bg-slate-100 text-slate-700";
    statusText = "⚪ 予定あり";
}

    return (
      <div
        key={deal.id}
        className="rounded-xl bg-white p-5 shadow"
      >
        <h2 className="text-xl font-semibold">
          {deal.title}
        </h2>

        <p className="text-slate-600">
          {deal.company}
        </p>

        <p className="text-sm text-slate-500">
          次回フォロー：
          {deal.next_follow_date}
        </p>

    <p
    className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}>
  {statusText}
</p>
      </div>
    );
  })}
</div>


    </div>
  </main>
);
}