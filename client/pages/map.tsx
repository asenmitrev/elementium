import { GetServerSideProps } from "next";
import ProtectedRoute from "@/components/protected-route";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { requireAuth } from "@/utils/check-onboarding";
import { default as MapVibe, TerrainType } from "@/components/map";
import { HeroService } from "@/services/hero.service";
import type { Hero as IHero, Unit } from "types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BattleService } from "@/services/battle.service";
import BattleNotificationModal from "@/components/battle-notification-modal";

interface MapProps {
  myHero: IHero & { units: Unit[] };
}

export const getServerSideProps: GetServerSideProps<MapProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const auth = await requireAuth(context);
  if ("redirect" in auth) {
    return auth;
  }

  try {
    const myHeroes = await HeroService.getHeroes(
      session?.user.accessToken || ""
    );

    return {
      props: {
        myHero: myHeroes[0],
      },
    };
  } catch (error) {
    console.error("Error fetching hero for map:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Map({ myHero: initialHero }: MapProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [myHero, setMyHero] = useState(initialHero);
  const [battleModalOpen, setBattleModalOpen] = useState(false);
  const [currentBattleId, setCurrentBattleId] = useState<string | null>(null);

  const handleHeroMove = async (x: number, y: number) => {
    if (!session?.user.accessToken || !myHero) return;

    try {
      const updatedHero = await HeroService.updateHero(
        myHero._id,
        { x, y },
        session.user.accessToken
      );

      // Update the hero's position in state
      setMyHero((prev) => ({
        ...prev!,
        x,
        y,
      }));

      // Check for battle and start it if it occurs
      const battleResult = await BattleService.startMapBattle(
        myHero._id,
        session.user.accessToken,
        TerrainType.EARTH
      );

      if (battleResult.battleOccurred) {
        // Show battle notification
        setCurrentBattleId(battleResult.battle._id);
        setBattleModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to move hero:", error);
      throw error;
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">World Map</h1>
        <MapVibe myHero={myHero} onHeroMove={handleHeroMove} />

        {currentBattleId && (
          <BattleNotificationModal
            isOpen={battleModalOpen}
            onClose={() => setBattleModalOpen(false)}
            battleId={currentBattleId}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
