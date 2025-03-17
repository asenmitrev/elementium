import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CastleService } from "@/services/castle.service";
import axios from "axios";

const elements = [
  {
    id: "fire" as const,
    name: "Fire",
    description: "Masters of offensive magic and powerful attacks",
    color: "bg-red-500",
  },
  {
    id: "water" as const,
    name: "Water",
    description: "Experts in healing and defensive strategies",
    color: "bg-blue-500",
  },
  {
    id: "earth" as const,
    name: "Earth",
    description: "Specialists in fortification and resource generation",
    color: "bg-green-500",
  },
];

export default function ChooseElement() {
  const [selectedElement, setSelectedElement] = useState<
    "fire" | "water" | "earth" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleElementChoice = async () => {
    if (!selectedElement) {
      toast.error("Please select an element");
      return;
    }

    setIsSubmitting(true);
    try {
      await CastleService.createCapitalCastle(selectedElement);
      toast.success("Your capital castle has been created!");
      router.push("/");
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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Choose Your Element
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {elements.map((element) => (
            <div
              key={element.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedElement === element.id
                    ? "border-blue-500 scale-105"
                    : "border-gray-200"
                }
                hover:border-blue-300`}
              onClick={() => setSelectedElement(element.id)}
            >
              <div
                className={`w-16 h-16 rounded-full ${element.color} mb-4`}
              ></div>
              <h2 className="text-xl font-bold mb-2">{element.name}</h2>
              <p className="text-gray-600">{element.description}</p>
            </div>
          ))}
        </div>

        <Button
          onClick={handleElementChoice}
          disabled={!selectedElement || isSubmitting}
          className="mt-8 w-full max-w-md mx-auto block"
        >
          {isSubmitting ? "Creating your castle..." : "Confirm Selection"}
        </Button>
      </div>
    </div>
  );
}
