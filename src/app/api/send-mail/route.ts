import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Resend
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(apiKey); 
// 🔵 GET（データ取得）
export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("next_follow_date", today);

  return NextResponse.json({ data, error });
}

// 🔴 POST（メール送信）
export async function POST() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("deals")
      .select("*")
      .eq("next_follow_date", today);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "あなたのメールアドレス",
      subject: "営業管理アプリ",
      text: `今日の案件があります：\n${JSON.stringify(data, null, 2)}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}