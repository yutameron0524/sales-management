import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL:", supabaseUrl);
console.log("SERVICE_ROLE_KEY:", !!serviceRoleKey);

const supabase = createClient(
  supabaseUrl!,
  serviceRoleKey!
);

// Resend
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(apiKey); 
// 🔵 GET（データ取得）
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const { data, error } = await supabase
      .from("deals")
      .select("*")

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

  
    const targetDeals = data.filter((deal) => {
  const followDate = new Date(deal.next_follow_date);
  followDate.setHours(0, 0, 0, 0);

  const notifyDate = new Date(followDate);
  notifyDate.setDate(
    notifyDate.getDate() - deal.reminder_days
  );

  return notifyDate.getTime() === today.getTime();
});
if (targetDeals.length === 0) {
      return NextResponse.json({
        success: true,
        message: "今日の案件はありません。",
      });
    }

    const message = targetDeals
  .map(
    (deal) =>
      `案件名：${deal.title}
会社名：${deal.company}
フォロー日：${deal.next_follow_date}`
  )
  .join("\n\n--------------------\n\n");

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yuta.yone.1021@gmail.com",
      subject: "営業管理アプリ",
      text: `今日フォローする案件は ${targetDeals.length} 件あります。

      ${message}`,

    });

    return NextResponse.json({
      success: true,
      message: "メールを送信しました。",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
     