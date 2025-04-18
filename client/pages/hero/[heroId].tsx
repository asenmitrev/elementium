import { GetServerSideProps } from "next";
import { Hero as IHero, Unit } from "../../../types";
import SoldierList from "@/components/soldier-list";
import Hero from "@/components/hero";
import ProtectedRoute from "@/components/protected-route";
import { HeroService } from "@/services/hero.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface HeroPageProps {
  hero: IHero & { units: Unit[] };
}

export const getServerSideProps: GetServerSideProps<HeroPageProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const heroId = context.params?.heroId as string;

  try {
    const hero = await HeroService.getHero(
      heroId,
      session?.user.accessToken || ""
    );

    return {
      props: {
        hero,
      },
    };
  } catch (error) {
    console.error("Error fetching hero:", error);
    return {
      redirect: {
        destination: "/heroes",
        permanent: false,
      },
    };
  }
};

export default function HeroPage({ hero }: HeroPageProps) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div>
          <Hero
            hero={hero.type}
            units={hero.units.map((unit) => unit.type)}
            showArmy={false}
            link={"/heroes"}
          />
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-8">Army</h2>
        {/* Hero Card */}
        {/* Soldiers List */}
        {hero.units.length > 0 ? (
          <SoldierList soldiers={hero.units.map((unit) => unit.type)} />
        ) : (
          <div className="flex text-gray-500 py-4">
            This hero does not have an army.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
