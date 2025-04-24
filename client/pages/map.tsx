import { GetServerSideProps } from "next";
import ProtectedRoute from "@/components/protected-route";
import { HeroService } from "@/services/hero.service";
import type { Hero as IHero, Unit } from "types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { requireAuth } from "@/utils/check-onboarding";
import Hero from "@/components/hero";
import { BattleService } from "@/services/battle.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
interface MapProps {
  allHeroes: (IHero & { units: Unit[] })[];
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
    // Fetch all heroes on the map
    const allHeroes = await HeroService.getAllMapHeroes(
      session?.user.accessToken || ""
    );

    const myHeroes = await HeroService.getHeroes(
      session?.user.accessToken || ""
    );

    return {
      props: {
        allHeroes,
        myHero: myHeroes[0],
      },
    };
  } catch (error) {
    console.error("Error fetching heroes for map:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Map({ allHeroes, myHero }: MapProps) {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(myHero);

  const handleBattle = async (
    attackerHeroId: string,
    defenderHeroId: string
  ) => {
    const battle = await BattleService.startBattle(
      attackerHeroId,
      defenderHeroId,
      session?.user.accessToken || ""
    );
    console.log(battle);
    router.push(`/battle/${battle._id}`);
  };
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">World Map Heroes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allHeroes.map((hero, index) => (
            <div className="flex flex-col items-center justify-center">
              <Hero
                key={index}
                hero={hero.type}
                units={hero.units?.map((unit) => unit.type) ?? []}
                heroId={hero._id}
              />
              <button
                onClick={() => handleBattle(myHero._id, hero._id)}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Battle
              </button>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
