"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { HeroType, Unit, UnitType } from "types";
import { HeroService } from "@/services/hero.service";
import HeroCard from "@/components/hero";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

interface ChooseHeroProps {
  initialHeroes: (HeroType & { units: Unit[] })[];
}

export const getServerSideProps: GetServerSideProps<ChooseHeroProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  try {
    // Fetch predefined heroes on the server
    const heroes = await HeroService.getPredefinedHeroes(
      session?.user.accessToken || ""
    );

    return {
      props: {
        initialHeroes: heroes,
      },
    };
  } catch (error) {
    console.error("Error fetching heroes:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function ChooseHero({ initialHeroes }: ChooseHeroProps) {
  const [selectedHero, setSelectedHero] = useState<HeroType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const handleHeroChoice = async () => {
    if (!selectedHero) {
      toast.error("Please select a hero");
      return;
    }

    setIsSubmitting(true);
    try {
      await HeroService.createPredefinedHero(
        selectedHero.name,
        session?.user.accessToken || ""
      );
      toast.success("Your hero has been chosen!");
      router.push("/neutral-battle");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Failed to select your hero"
        );
      } else {
        toast.error("Failed to select your hero. Please try again.");
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
            Choose Your Hero
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select a hero to lead your forces into battle. Each hero has unique
            abilities and strengths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {initialHeroes.map((hero) => (
            <motion.div
              key={hero.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedHero(hero)}
            >
              <HeroCard
                hero={hero}
                units={hero.units}
                link={`?heroId=${hero.name}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={!selectedHero || isSubmitting}
            onClick={handleHeroChoice}
            className="text-lg px-8 py-6"
          >
            {isSubmitting
              ? "Selecting hero..."
              : selectedHero
              ? `Select ${selectedHero.name}`
              : "Select a Hero"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
