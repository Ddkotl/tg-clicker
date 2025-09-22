"use client";

import { User, Skull, Flame, Gem, Sword, Shield, Package, Heart, Clock } from "lucide-react";

export function HeaderStats() {
  return (
    <div className="flex flex-wrap gap-3 justify-self-auto items-center bg-card border border-border shadow-md rounded-lg p-2">
      <div className="flex items-center gap-2 font-semibold">
        <User className="h-4 w-4 text-muted-foreground" />
        викинг15[20]
      </div>
      <div className="flex items-center gap-1">
        <Skull className="h-4 w-4 text-red-500" /> 3 957
      </div>
      <div className="flex items-center gap-1">
        <Flame className="h-4 w-4 text-orange-500" /> 8 037
      </div>
      <div className="flex items-center gap-1">
        <Gem className="h-4 w-4 text-cyan-400" /> 61 208
      </div>
      <div className="flex items-center gap-1">
        <Sword className="h-4 w-4 text-yellow-400" /> 7 561
      </div>
      <div className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-blue-400" /> 4 177
      </div>
      <div className="flex items-center gap-1">
        <Package className="h-4 w-4 text-emerald-400" /> 2 076
      </div>
      <div className="flex items-center gap-1">
        <Heart className="h-4 w-4 text-pink-500" /> 14/24
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-gray-400" /> 08:38
      </div>
    </div>
  );
}
