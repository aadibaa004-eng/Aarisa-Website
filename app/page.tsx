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
        <li><a href="/api/blogs">/api/blogs</a> — Public blog listing</li>
        <li><a href="/api/reviews">/api/reviews</a> — Approved reviews</li>
        <li><a href="/api/gallery">/api/gallery</a> — Gallery images</li>
        <li><a href="/api/dashboard">/api/dashboard</a> — Admin dashboard (auth required)</li>
      </ul>
    </main>
  );
}
