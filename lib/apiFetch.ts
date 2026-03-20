// lib/apiFetch.ts
import toast from "react-hot-toast";

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 429) {
    toast.error("You're going too fast — please slow down.", {
      id: "rate-limit",
      duration: 4000,
    });
  }

  return res;
}
