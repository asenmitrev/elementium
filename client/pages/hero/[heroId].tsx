import { useState } from "react";
import { Hero as IHero } from "@/types";
import { mockHeroes } from "@/mocks/heroes";

import SoldierList from "@/components/soldier-list";
import Hero from "@/components/hero";
import { useRouter } from "next/router";
export default function HeroPage() {
  // This would normally come from an API or props
  const router = useRouter();
  const heroId = router.query.heroId as string;
  console.log(heroId);
  const hero = mockHeroes.find((hero) => hero._id === heroId);

  if (!hero) {
    return <div>Hero not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <Hero hero={hero} showArmy={false} link={"/heroes"} />
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-8">Army</h2>
      {/* Hero Card */}
      {/* Soldiers List */}
      {hero.units.length > 0 ? (
        <SoldierList soldiers={hero.units} />
      ) : (
        <div className="flex text-gray-500 py-4">
          This hero does not have an army.
        </div>
      )}
    </div>
  );
}
