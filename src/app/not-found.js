import Link from "next/link";

export const metadata = {
  title: "Lost at sea · Nouka Baich",
};

export default function NotFound() {
  return (
    <main className="relative grid h-[100dvh] w-full place-items-center overflow-hidden px-4">
      <div className="glass-hi animate-slide-up flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
        <span className="text-5xl">🧭</span>
        <div>
          <div className="font-mono text-6xl font-black leading-none text-white">404</div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white">Lost at sea</h1>
        </div>
        <p className="text-sm text-[color:var(--text-1)]">
          This stretch of river doesn&apos;t exist. Let&apos;s get you back to the start line.
        </p>
        <Link className="btn btn-primary mt-1 px-6 py-3" href="/">
          ▶ Back to the race
        </Link>
      </div>
    </main>
  );
}
