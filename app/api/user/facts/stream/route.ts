import { Facts } from "@/_generated/prisma";
import { factErrorResponseSchema, FactErrorResponseType } from "@/entities/facts";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";
import { redis, redis_conf } from "@/shared/connect/redis_connect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    const response: FactErrorResponseType = {
      data: {},
      message: "User not authenticated",
    };
    factErrorResponseSchema.parse(response);
    return NextResponse.json(response, { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: Facts["type"]) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          console.error(e);
        }
      };
      const sub = new Redis(redis_conf);
      await sub.subscribe(`user:${userId}`, (err, count) => {
        if (err) console.error("Redis subscribe error:", err);
        else console.log(`Subscribed to ${count} channel(s) for user ${userId}`);
      });

      sub.on("message", (_, message) => {
        console.log("🔔 SSE received from Redis:", message);
        try {
          const payload: Facts["type"] = JSON.parse(message);
          send(payload);
        } catch (e) {
          console.error("SSE parse error:", e);
        }
      });

      controller.enqueue(encoder.encode(`event: connected\ndata: ok\n\n`));

      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`:ping\n\n`));
      }, 30000);
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        sub.disconnect();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Transfer-Encoding": "chunked",
    },
  });
}

export async function pushToSubscriber(userId: string, payload: Facts["type"]) {
  console.log("payload", payload);
  await redis.publish(`user:${userId}`, JSON.stringify(payload));
}
