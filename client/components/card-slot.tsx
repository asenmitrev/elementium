"use client";

import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardSlotProps {
  className?: string;
  onClick?: () => void;
}

export default function CardSlot({ className, onClick }: CardSlotProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-full h-full rounded-lg overflow-hidden cursor-pointer transition-all duration-300 group",
        "bg-gradient-to-br from-gray-800/80 to-gray-900/90",
        "border border-gray-700/50 hover:border-amber-500/50",
        "shadow-lg hover:shadow-amber-900/20",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('/dark-fantasy-smoke.png')] opacity-10 bg-cover bg-center" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="p-4 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 group-hover:border-amber-500/30 transition-all duration-300">
          <PlusCircle className="w-10 h-10 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
        </div>
        <p className="mt-4 text-gray-500 group-hover:text-amber-400 font-medium text-sm transition-colors duration-300">
          Add Card
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-70" />

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-300" />
    </div>
  );
}
