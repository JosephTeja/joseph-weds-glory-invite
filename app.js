// Personalize these details when you have the names, dates, and venue information.
const invite = {
  couple: ["Joseph", "Glory"],
  events: [
    { name: "The Marriage", date: "2026-12-04", time: "10:00 AM", venue: "S Convention Hall", area: "PALAKOLLU · ANDHRA PRADESH", address: "Bypass Rd, beside HOTEL S-INN, Brodipet, Palakollu, Andhra Pradesh 534260", photo: "images/s-convention-hall.png" },
    { name: "The Reception", date: "2026-12-06", time: "4:00 PM", venue: "I Convention A/C", area: "AMEENPUR · TELANGANA", address: "Plot No. 2, Survey Nos. 465 & 466, ODF Colony, Ameenpur, Sangareddy, Hyderabad, Telangana 502032", photo: "images/i-convention-ac.png" },
  ],
  photos: [
    { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=80", caption: "A favourite little moment" },
    { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80", caption: "Us, being us" },
    { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80", caption: "The best kind of forever" },
  ],
};

const wedding = invite.events[0];
const coupleNames = invite.couple.join(" & ");
document.title = `${coupleNames} | Our Wedding Celebration`;
document.querySelector('meta[name="description"]').content = `Join ${coupleNames} for their wedding and reception.`;
document.getElementById("monogram").innerHTML = `${escapeHtml(invite.couple[0][0])} <span>♡</span> ${escapeHtml(invite.couple[1][0])}`;
document.getElementById("hero-names").innerHTML = `${escapeHtml(invite.couple[0])} <span>＆</span> ${escapeHtml(invite.couple[1])}`;
document.getElementById("footer-names").textContent = coupleNames;

const validWeddingDate = parseEventDate(wedding.date, wedding.time);
if (validWeddingDate) {
  document.getElementById("hero-date").textContent = formatDate(wedding.date);
  runCountdown(validWeddingDate);
} else {
  document.getElementById("countdown-note").textContent = "Our countdown starts as soon as we pick the date.";
}

document.getElementById("event-grid").innerHTML = invite.events.map((event, index) => {
  const photo = event.photo
    ? `<img src="${escapeAttr(event.photo)}" alt="${escapeAttr(event.venue)} venue" loading="lazy" />`
    : `<div class="venue-photo-empty">${escapeHtml(event.area || "OUR GATHERING PLACE")}</div>`;
  const mapQuery = encodeURIComponent(`${event.venue}, ${event.address}`);
  const map = `<div class="map-preview"><div class="map-preview-label"><span aria-hidden="true">⌖</span> LOCATION MAP <small>GOOGLE MAPS</small></div><iframe title="Map showing ${escapeAttr(event.venue)}" src="https://maps.google.com/maps?q=${mapQuery}&amp;t=m&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  const visual = `<div class="venue-photo venue-photo-${index + 1}">${photo}<div class="venue-photo-shade"></div><span class="venue-photo-area">${escapeHtml(event.area || "OUR GATHERING PLACE")}</span></div>`;
  return `<article class="event-card"><div class="event-number">0${index + 1}</div>${visual}<div class="event-content"><p class="eyebrow">${index === 0 ? "A SACRED PROMISE" : "A JOYFUL GATHERING"}</p><h3>${escapeHtml(event.name)}</h3><div class="event-when"><span class="event-calendar" aria-hidden="true">♡</span><div><strong>${escapeHtml(event.date && formatDate(event.date))}</strong><span>${escapeHtml(event.time)}</span></div></div><div class="event-venue"><strong>${escapeHtml(event.venue)}</strong><span>${escapeHtml(event.address)}</span></div>${map}</div></article>`;
}).join("");

document.getElementById("gallery").innerHTML = invite.photos.map((photo) =>
  `<div class="gallery-item" role="img" aria-label="${escapeAttr(photo.caption)}" data-label="${escapeAttr(photo.caption)}" style="background-image:url('${escapeAttr(photo.url)}')"></div>`
).join("");

function parseEventDate(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return null;
  const match = String(time || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  const parsed = new Date(`${date}T${String(hour).padStart(2, "0")}:${match[2]}:00+05:30`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function runCountdown(target) {
  const note = document.getElementById("countdown-note");
  const tick = () => {
    const remaining = target.getTime() - Date.now();
    if (remaining <= 0) { note.textContent = "Today is the day! We can’t wait to celebrate."; return; }
    const units = { days: Math.floor(remaining / 86400000), hours: Math.floor((remaining / 3600000) % 24), minutes: Math.floor((remaining / 60000) % 60), seconds: Math.floor((remaining / 1000) % 60) };
    Object.entries(units).forEach(([key, value]) => { document.getElementById(key).textContent = String(value).padStart(2, "0"); });
    note.textContent = "Counting down to our wedding day";
  };
  tick(); setInterval(tick, 1000);
}
function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return value || "";
  return new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
function escapeAttr(value) { return escapeHtml(value); }

const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");
document.getElementById("envelope-open").addEventListener("click", (event) => {
  event.currentTarget.setAttribute("aria-expanded", "true");
  event.currentTarget.hidden = true;
  document.getElementById("envelope-wrap").classList.add("is-open");
  form.hidden = false;
  form.querySelector("[name='guestName']").focus();
});

const reactions = {
  weddingAttendance: {
    yes: "Awww, our hearts just did a little happy prayer! We’re so blessed you’ll be there ♡",
    no: "Aww, we’ll miss you, but we’ll be keeping you close in our hearts and prayers ♡",
  },
  receptionAttendance: {
    yes: "Yay! More time together, more happy memories. We can’t wait to see you! ♡",
    no: "Aww, we’ll miss having you there. Sending love and a big blessing your way ♡",
  },
};
Object.entries(reactions).forEach(([field, answers]) => {
  form.querySelectorAll(`input[name="${field}"]`).forEach((input) => input.addEventListener("change", () => {
    document.getElementById(field === "weddingAttendance" ? "wedding-reaction" : "reception-reaction").textContent = answers[input.value];
  }));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  status.className = "form-status";
  status.textContent = "Sending your happy little note…";
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "We couldn’t save your reply just now.");
    status.textContent = "Your RSVP is in! We’re already smiling. Thank you ♡";
    form.reset();
    document.getElementById("wedding-reaction").textContent = "";
    document.getElementById("reception-reaction").textContent = "";
  } catch (error) {
    status.classList.add("error");
    status.textContent = error.message.includes("Failed to fetch")
      ? "We couldn’t reach our RSVP book just yet. Please try again in a moment."
      : error.message;
  } finally { button.disabled = false; }
});
