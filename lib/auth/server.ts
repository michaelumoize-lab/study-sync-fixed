import { auth as baseAuth } from "@/lib/auth";
import { headers } from "next/headers";

export const auth = new Proxy(baseAuth, {
  get(target, prop, receiver) {
    if (prop === "getSession") {
      return async () => {
        const session = await baseAuth.api.getSession({
          headers: await headers(),
        });
        return { data: session };
      };
    }
    return Reflect.get(target, prop, receiver);
  },
}) as typeof baseAuth & {
  getSession: () => Promise<{
    data: Awaited<ReturnType<typeof baseAuth.api.getSession>>;
  }>;
};
