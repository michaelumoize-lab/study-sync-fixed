// lib/ratelimit.ts — final production version
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const readRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "10 s"),
  analytics: true,
  prefix: "rl_read",
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "rl_write",
});
