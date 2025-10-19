import { Facts } from "@/_generated/prisma";
import { factErrorResponseSchema, FactErrorResponseType } from "@/entities/facts";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const redis_conf = {
  host: "localhost",
  port: 6379,
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const redis = new Redis(redis_conf);

export async function GET(req: NextRequest) {
  console.log("sse route start");
  console.log("✅ SSE route loaded, process.versions.node =", process.versions.node);
  console.log("✅ SSE route environment =", process.env.NEXT_RUNTIME ?? "unknown");
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
  console.log("new subscriber for userId", userId);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: Facts[]) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          console.error(e);
        }
      };
      // подключаемся к Redis

      const sub = new Redis(redis_conf);
      await sub.subscribe(`user:${userId}`, (err, count) => {
        if (err) console.error("Redis subscribe error:", err);
        else console.log(`Subscribed to ${count} channel(s) for user ${userId}`);
      });

      sub.on("message", (_, message) => {
        console.log("🔔 SSE received from Redis:", message);
        try {
          const payload: Facts[] = JSON.parse(message);
          send(payload);
        } catch (e) {
          console.error("SSE parse error:", e);
        }
      });
      controller.enqueue(encoder.encode(`event: connected\ndata: ok\n\n`));
      // keep-alive ping
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`:ping\n\n`));
      }, 30000);
      // при закрытии соединения удаляем подписчика
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

export function pushToSubscriber(userId: string, payload: Facts[]) {
  console.log("userId", userId);
  console.log("payload", payload);
  redis.publish(`user:${userId}`, JSON.stringify(payload));
}
