import { Facts } from "@/_generated/prisma";
import {
  factErrorResponseSchema,
  FactErrorResponseType,
} from "@/entities/facts";
import { NextRequest, NextResponse } from "next/server";

type SendFn = (payload: Facts[]) => void;
export const dynamic = "force-dynamic";
export const revalidate = 0;
const subscribers = new Map<string, Set<SendFn>>();

export async function GET(req: NextRequest) {
  console.log("sse route start");
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

      const send: SendFn = (payload) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );
        } catch (e) {
          // ignore enqueue errors
        }
      };

      // сохраняем отправку для этого user
      if (!subscribers.has(userId)) {
        subscribers.set(userId, new Set());
      }
      subscribers.get(userId)!.add(send);
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`:ping\n\n`)); // комментарий в SSE
        } catch {}
      }, 30000);
      // при закрытии соединения удаляем подписчика
      req.signal.addEventListener("abort", () => {
        subscribers.get(userId)?.delete(send);
        if (subscribers.get(userId)?.size === 0) {
          subscribers.delete(userId);
        }
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export function pushToSubscriber(userId: string, payload: Facts[]) {
  console.log("pushing facts to subscriber", userId, payload);
  const set = subscribers.get(userId);
  if (!set) return;
  for (const send of set) {
    send(payload);
  }
}
