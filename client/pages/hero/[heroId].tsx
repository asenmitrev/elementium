import { GetServerSideProps } from "next";
import { Hero as IHero, Unit } from "../../../types";
import SoldierList from "@/components/soldier-list";
import Hero from "@/components/hero";
import ProtectedRoute from "@/components/protected-route";
import { HeroService } from "@/services/hero.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import RecruitModal from "@/components/recruit-modal";

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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUnit = () => {
    setIsModalOpen(true);
  };

  const handleTravelToMap = () => {
    setIsModalOpen(false);
    router.push("/map");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div>
          <Hero
            hero={hero.type}
            units={hero.units}
            showArmy={false}
            link={"/heroes"}
          />
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-8">Army</h2>
        {/* Hero Card */}
        {/* Soldiers List */}
        {hero.units.length > 0 ? (
          <SoldierList
            soldiers={hero.units}
            heroId={hero._id}
            maxSlots={hero.type.leadership}
            onAddUnit={handleAddUnit}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No units in your army yet.</p>
            <Button onClick={handleAddUnit}>Recruit Units</Button>
          </div>
        )}

        <RecruitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTravel={handleTravelToMap}
        />
      </div>
    </ProtectedRoute>
  );
}
