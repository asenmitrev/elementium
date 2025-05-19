"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { HeroType, Unit } from "types";
import { HeroService } from "@/services/hero.service";
import HeroCard from "@/components/hero";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { BattleService } from "@/services/battle.service";
interface BattleNeutralProps {
  initialNeutrals: HeroType & { units: Unit[] };
}

export const getServerSideProps: GetServerSideProps<
  BattleNeutralProps
> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  try {
    const neutrals = await HeroService.getPredefinedNeutrals(
      session?.user.accessToken || ""
    );
    return {
      props: {
        initialNeutrals: neutrals,
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

export default function BattleNeutral({ initialNeutrals }: BattleNeutralProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleNeutralBattle = async () => {
    setIsSubmitting(true);
    try {
      // await HeroService.createPredefinedHero(
      //   initialNeutrals.name,
      //   session?.user.accessToken || ""
      // );
      const battle = await BattleService.startNeutralBattle(
        session?.user.accessToken || ""
      );
      toast.success("Your battle has started!");
      console.log(battle);
      router.push(`/battle/${battle._id}`);
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
            You Are Fighting Against
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A neutral hero has attacked your hero. Press the battle button to
            fight them!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 md:gap-8 mb-12 justify-center items-center">
          <motion.div
            key={initialNeutrals.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center items-center"
          >
            <HeroCard
              hero={initialNeutrals}
              units={initialNeutrals.units}
              noLink
            />
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={isSubmitting}
            onClick={handleNeutralBattle}
            className="text-lg px-8 py-6"
          >
            {isSubmitting ? "Fighting..." : "Fight"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
