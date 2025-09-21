"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons/arrow";
import Image from "next/image";
import { bear, coin, highVoltage, notcoin, rocket, trophy } from "./images";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Game() {
  const queryClient = useQueryClient();
  const [energy, setEnergy] = useState(1000);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pendingPoints, setPendingPoints] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingRef = useRef(0);
  const pointsToAdd = 1;
  const energyToReduce = 1;
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user", { cache: "no-store" });
      return res.json();
    },
  });
  const addPointsMutation = useMutation({
    mutationFn: async (points: number) => {
      const res = await fetch("/api/user/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
      });
      return res.json();
    },
    onMutate: async (points) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const prevUser = queryClient.getQueryData<{ user: { points: number } }>(["user"]);

      if (prevUser?.user) {
        queryClient.setQueryData(["user"], {
          ...prevUser,
          user: {
            ...prevUser.user,
            points: prevUser.user.points + points,
          },
        });
      }

      return { prevUser };
    },
    onError: (_err, _points, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["user"], context.prevUser);
      }
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["user"] });
    // },
  });
  const flushPoints = () => {
    if (pendingRef.current > 0) {
      addPointsMutation.mutate(pendingRef.current);
      pendingRef.current = 0;
      setPendingPoints(0);
    }
  };
  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy - energyToReduce < 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPendingPoints((prev) => {
      const next = prev + pointsToAdd;
      pendingRef.current = next; // синхронизируем ref
      return next;
    });

    setEnergy((prev) => (prev - energyToReduce < 0 ? 0 : prev - energyToReduce));
    setClicks([...clicks, { id: Date.now(), x, y }]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log(pendingPoints);
      console.log(pendingRef.current);
      flushPoints();
    }, 400);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  // Восстановление энергии
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, 6500));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const user = "user" in (data || {}) ? data.user : null;
  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">
                {user?.first_name}
                <Arrow size={18} className="ml-0 mb-1 inline-block" />
              </p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <Image alt="coin" src={coin} width={44} height={44} />
            <span className="ml-2"> {((user?.points ?? 0) + pendingPoints).toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <Image alt="trophy" src={trophy} width={24} height={24} />
            <span className="ml-1">
              Gold <Arrow size={18} className="ml-0 mb-1 inline-block" />
            </span>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <Image src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1">
                  <Image src={bear} width={24} height={24} alt="High Voltage" />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <Image src={coin} width={24} height={24} alt="High Voltage" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <Image src={rocket} width={24} height={24} alt="High Voltage" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div
              className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full"
              style={{ width: `${(energy / 6500) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <Image src={notcoin} width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                +{pointsToAdd}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
