import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "yuta.yone.1021@gmail.com",
      subject: "営業管理アプリ",
      text: "今日フォローする案件があります。",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}