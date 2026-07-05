import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1 style={{ color: "#2e7d32" }}>Arisa Nutrition API</h1>
      <p>Backend is running. All endpoints are under <code>/api/</code>.</p>
      <h2>Quick links</h2>
      <ul>
        <li><Link href="/api/blogs">/api/blogs</Link> — Public blog listing</li>
        <li><Link href="/api/reviews">/api/reviews</Link> — Approved reviews</li>
        <li><Link href="/api/gallery">/api/gallery</Link> — Gallery images</li>
        <li><Link href="/api/dashboard">/api/dashboard</Link> — Admin dashboard (auth required)</li>
      </ul>
    </main>
  );
}
