import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <h1 className="mb-2 text-3xl font-bold">
          営業管理アプリ
        </h1>

        <p className="mb-8 text-slate-600">
          顧客・案件・フォローをまとめて管理
        </p>

        <div className="space-y-4">
          <Link
            href="/signup"
            className="block rounded-lg border border-slate-300 px-4 py-3 hover:bg-slate-100"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="block rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            ログイン
          </Link>
        </div>
      </div>
    </main>
  );
}