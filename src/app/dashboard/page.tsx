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

export default function DashboardPage() {
  // ログインユーザー
  const [email, setEmail] = useState("");

  // 今日やること
  const [todayDeals, setTodayDeals] = useState<Deal[]>([]);

  // 期限切れ案件
  const [expiredDeals, setExpiredDeals] = useState<Deal[]>([]);

  // 案件数
  const [dealCount, setDealCount] = useState(0);

  // 次はここに
  const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    setEmail(user.email ?? "");
  }
};
const fetchTodayDeals = async () => {

  const {data, error} = await supabase
.from("deals")
.select("*")

  if (error) {
    alert(error.message);
    return;
  }

  const today = new Date();
today.setHours(0, 0, 0, 0);

const notificationDeals =
  (data ?? []).filter((deal) => {
    if (!deal.next_follow_date) return false;

    const followDate = new Date(deal.next_follow_date);
    followDate.setHours(0, 0, 0, 0);

    const notifyDate = new Date(followDate);
    notifyDate.setDate(
      notifyDate.getDate() - deal.reminder_days
    );

    return today >= notifyDate;
  });

setTodayDeals(notificationDeals);
};
  
  const fetchExpiredDeals = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .lt("next_follow_date", today);

  if (error) {
    alert(error.message);
    return;
  }

  setExpiredDeals(data ?? []);
};
const fetchDealCount = async () => {
  const { count, error } = await supabase
    .from("deals")
    .select("*", {
      count: "exact",
      head: true,
    });


  if (error) {
    alert(error.message);
    return;
  }

  setDealCount(count ?? 0);
};



const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login";
};
useEffect(() => {
  getUser();
  fetchTodayDeals();
  fetchExpiredDeals();
  fetchDealCount();
}, []);
  return (
  <main className="min-h-screen bg-slate-100 p-8">
    <div className="mx-auto max-w-4xl">

      <h1 className="mb-6 text-3xl font-bold">
        営業管理アプリ
      </h1>
        <Link
  href="/deals"
  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
>
  案件管理へ
</Link>
      <p className="mb-8 text-slate-600">
        ログイン中：
        <span className="font-semibold">{email}</span>
      </p>
    
      <div className="grid gap-6 md:grid-cols-3">

        {/* 今日やること */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            今日やること
          </h2>

       {todayDeals.length === 0 ? (
  <p>今日はありません。</p>
) : (
  todayDeals.map((deal) => (
    <div
      key={deal.id}
      className="mb-3 rounded-lg border p-3"
    >
      <p className="font-semibold">
        {deal.title}
      </p>

      <p className="text-sm text-slate-500">
        {deal.company}
      </p>

      <p className="text-sm text-slate-500">
        次回フォロー：
        {deal.next_follow_date}
      </p>

      <p className="text-blue-600 text-sm">
        {deal.reminder_days}日前から通知
      </p>
    </div>
  ))
)}
        </div>

        {/* 期限切れ案件 */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            期限切れ案件
          </h2>

          {expiredDeals.length === 0 ? (
            <p>ありません。</p>
          ) : (
            expiredDeals.map((deal) => (
              <div key={deal.id} className="mb-3">
                <p className="font-semibold">{deal.title}</p>
                <p className="text-sm text-red-500">
                  {deal.next_follow_date}
                </p>
              </div>
            ))
          )}
        </div>

        {/* 案件数 */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            案件数
          </h2>

          <p className="text-4xl font-bold">
            {dealCount}
          </p>
        </div>

      </div>
     
      <button
        onClick={logout}
        className="mt-8 rounded-lg bg-red-500 px-6 py-3 text-white hover:bg-red-600"
      >
        ログアウト
      </button>

    </div>
  </main>
);
}
