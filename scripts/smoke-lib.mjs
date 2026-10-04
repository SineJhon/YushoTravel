export const BASE = "http://localhost:3100";

export const A = {
  login: "40e94ce15572eade68944b9a0e44e9ca04492d7a5f",
  register: "40dde28e846b50d28b3cc22d9aec9019707b554fdf",
  logout: "0004074043159b5e7afb517fd98fbdba54c20d6a01",
  booking: "408a94c5230c478999f4e8107a48632b6b9aa4433a",
  eventBooking: "40bf864495f0f2872e9cebf2a73a145e1a9d1e4a48",
  cancelBooking: "40bbcec051c0b53c47abac72aa20b93a6c54d9e1eb",
  save: "407b8a9242d06779aba5b941401dc241594572b30d",
  privateTour: "400aa2e88f0265dae681bcf5632284907ba86c9c96",
  studentService: "40865e6129544e64f53a77264ee125cbff52d07f34",
  contact: "40d597565f1af3060db24ba2e9af0eec412fb8686e",
  review: "4008e3a9157b79dcc2691d61afa0d5247ae991616a",
  resetRequest: "40a1e0446183e3460ff6b9f32ad6e515c237a1e8e0",
  resetConfirm: "40be42716b2cc2b4b2688374db4fd65fd26cc3e6f9",
  adminStatus: "409d5c36d653507f4416116a9bfdb96810a8ded3d5",
  moderateReview: "40d21378282d3ea343e87c067ba0ebb7fa86e8b81f",
  studentStatus: "4019920808504b98dc323ee4a388e3b22066d9681c",
  createDestination: "4047513843c0a68ae2637a5a950fea9c018a3b5ab8",
  deleteDestination: "40566c430abe2a626594829b3d799aa8163f0f76f5",
  addGallery: "40b77ec40579c3f75f3f8f887e2e888f68d42e4879",
  deleteGallery: "40270acb828716175c2420f543f91db1d9f67f11ae",
  messageStatus: "405f56c5429180d5a4465bc5ba21e421dc3b2e4493",
};

export let passed = 0;
export let failed = 0;

export function check(name, ok, detail = "") {
  if (ok) {
    passed += 1;
    console.log(`  \u2713 ${name}`);
  } else {
    failed += 1;
    console.log(`  \u2717 ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

export async function call(id, args, cookie = "") {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Next-Action": id,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify([args]),
  });
  const text = await res.text();
  let result = null;
  for (const line of text.split("\n")) {
    const m = line.match(/^1:(.+)$/);
    if (m) {
      try {
        result = JSON.parse(m[1]);
      } catch {
        /* keep raw */
      }
    }
  }
  return { status: res.status, result, text: text.slice(0, 140), setCookie: res.headers.get("set-cookie") ?? "" };
}

export function futureDate(days = 10) {
  return new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
}