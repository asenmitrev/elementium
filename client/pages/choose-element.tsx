"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CastleService } from "@/services/castle.service";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
const elements = [
  {
    id: "fire" as const,
    name: "Fire",
    image: "/images/elements/fire.jpg",
    description: "Masters of offensive magic and powerful attacks",
    color: "from-orange-500/20 to-red-700/20",
    borderColor: "border-orange-500",
    hoverColor: "group-hover:border-orange-400",
    textColor: "text-orange-500",
  },
  {
    id: "water" as const,
    name: "Water",
    image: "/images/elements/water.jpg",
    description: "Experts in healing and defensive strategies",
    color: "from-blue-500/20 to-cyan-700/20",
    borderColor: "border-blue-500",
    hoverColor: "group-hover:border-blue-400",
    textColor: "text-blue-500",
  },
  {
    id: "earth" as const,
    name: "Earth",
    image: "/images/elements/earth.jpg",
    description: "Specialists in fortification and resource generation",
    color: "from-green-500/20 to-emerald-700/20",
    borderColor: "border-green-500",
    hoverColor: "group-hover:border-green-400",
    textColor: "text-green-500",
  },
];

export default function ChooseElement() {
  const [selectedElement, setSelectedElement] = useState<
    "fire" | "water" | "earth" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const handleElementChoice = async () => {
    if (!selectedElement) {
      toast.error("Please select an element");
      return;
    }

    setIsSubmitting(true);
    try {
      await CastleService.createCapitalCastle(
        selectedElement,
        session?.user.accessToken || ""
      );
      toast.success("Your capital castle has been created!");
      router.push("/castles");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Failed to create your castle"
        );
      } else {
        toast.error("Failed to create your castle. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Choose Your Element
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select the elemental power that resonates with your spirit and
            defines your path. This will define your castle's element.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {elements.map((element) => (
            <motion.div
              key={element.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`group relative h-full overflow-hidden border-2 transition-all duration-300 ${
                  selectedElement === element.id
                    ? element.borderColor
                    : "border-gray-800"
                } bg-gradient-to-b ${
                  element.color
                } hover:shadow-lg hover:shadow-${
                  element.id === "fire"
                    ? "orange"
                    : element.id === "water"
                    ? "blue"
                    : "green"
                }-900/20`}
                onClick={() => setSelectedElement(element.id)}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                  <Image
                    src={element.image}
                    alt={element.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>

                <div className="relative z-20 p-6 flex flex-col h-full min-h-[320px] justify-end">
                  {selectedElement === element.id && (
                    <div className="absolute top-4 right-4">
                      <Sparkles className={`h-6 w-6 ${element.textColor}`} />
                    </div>
                  )}
                  <h2
                    className={`text-3xl font-bold mb-2 ${element.textColor}`}
                  >
                    {element.name}
                  </h2>
                  <p className="text-gray-300 mb-4">{element.description}</p>
                  <div
                    className={`h-1 w-16 ${
                      element.textColor
                    } rounded-full mb-2 transition-all duration-300 ${
                      selectedElement === element.id ? "w-24" : "w-16"
                    }`}
                  ></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedElement || isSubmitting}
            onClick={handleElementChoice}
            className={`text-lg px-8 py-6 transition-all duration-300 ${
              selectedElement === "fire"
                ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                : selectedElement === "water"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                : selectedElement === "earth"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {isSubmitting
              ? "Creating your castle..."
              : selectedElement
              ? `Confirm ${
                  selectedElement.charAt(0).toUpperCase() +
                  selectedElement.slice(1)
                } Selection`
              : "Confirm Selection"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
