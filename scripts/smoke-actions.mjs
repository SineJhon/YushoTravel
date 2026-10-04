const ACTIONS = {
  login: "40e94ce15572eade68944b9a0e44e9ca04492d7a5f",
  register: "40dde28e846b50d28b3cc22d9aec9019707b554fdf",
  booking: "408a94c5230c478999f4e8107a48632b6b9aa4433a",
  eventBooking: "40bf864495f0f2872e9cebf2a73a145e1a9d1e4a48",
  cancelBooking: "40bbcec051c0b53c47abac72aa20b93a6c54d9e1eb",
  save: "407b8a9242d06779aba5b941401dc241594572b30d",
  logout: "0004074043159b5e7afb517fd98fbdba54c20d6a01",
};

const BASE = "http://localhost:3100";

async function action(endpoint, id, args, cookie) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Next-Action": id,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify([args]),
    redirect: "manual",
  });
  const text = await res.text();
  return { status: res.status, text: text.slice(0, 300), setCookie: res.headers.get("set-cookie") ?? "" };
}

async function main() {
  // 1) Login as demo user
  let r = await action("/login", ACTIONS.login, { email: "demo.yusho@example.com", password: "Demo@2026" });
  console.log("LOGIN:", r.status, r.text.slice(0, 120));
  const cookie = r.setCookie.split(";")[0];
  console.log("COOKIE:", cookie ? "set" : "MISSING");

  // 2) Try creating a booking (object args)
  const bookingArgs = {
    destinationId: "x",
    packageId: "y",
    date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
    numberOfPeople: 2,
    mode: "GROUP",
    addOns: [],
    customerName: "Test User",
    customerPhone: "+251911111111",
    customerEmail: "demo.yusho@example.com",
    specialRequest: "",
  };
  r = await action("/book", ACTIONS.booking, bookingArgs, cookie);
  console.log("BOOKING:", r.status, r.text.slice(0, 200));
}

main().catch((e) => {
  console.error("HARNESS ERROR", e);
  process.exit(1);
});