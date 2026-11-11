export default async function handler(request, response) {
  response.setHeader("Allow", "POST");
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Please send your RSVP using the form." });

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return response.status(503).json({ error: "Our RSVP book is being set up. Please check back soon." });
  }

  const body = request.body || {};
  const guestName = clean(body.guestName, 120);
  const weddingAttendance = body.weddingAttendance;
  const receptionAttendance = body.receptionAttendance;
  if (!guestName) return response.status(400).json({ error: "Please add your name so we know who’s coming." });
  if (!["yes", "no"].includes(weddingAttendance) || !["yes", "no"].includes(receptionAttendance)) {
    return response.status(400).json({ error: "Please answer both event questions." });
  }

  const record = {
    guest_name: guestName,
    wedding_attendance: weddingAttendance === "yes",
    reception_attendance: receptionAttendance === "yes",
    message: clean(body.message, 1000) || null,
  };
  try {
    const result = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rsvps`, {
      method: "POST",
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(record),
    });
    if (!result.ok) {
      console.error("RSVP storage returned status", result.status);
      return response.status(502).json({ error: "We couldn’t save your reply just now. Please try again shortly." });
    }
    return response.status(201).json({ ok: true });
  } catch (error) {
    console.error("RSVP storage request failed", error.message);
    return response.status(502).json({ error: "We couldn’t save your reply just now. Please try again shortly." });
  }
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
