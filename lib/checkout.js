export async function goToCheckout(items, setError) {
  setError("");
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || "Não foi possível iniciar o pagamento.");
    }
    window.location.href = data.url;
  } catch (err) {
    setError(err.message || "Não foi possível iniciar o pagamento.");
  }
}
