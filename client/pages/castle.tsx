"use client";

import { useState } from "react";
import {
  Building as BuildingIcon,
  Users,
  Wheat,
  Component,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import HeroList from "@/components/hero-list";
import { mockHeroes } from "@/mocks/heroes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Building } from "@/types";

interface Unit {
  name: string;
  count: number;
}

interface Resources {
  elementium: number;
}

export default function CastleView() {
  const [buildings, setBuildings] = useState<Building[]>([
    {
      name: "Walls",
      level: 1,
      type: "walls",
      cost: 100,
      description: "Defensive structure",
      effect: "Increases STR when attacked",
    },
    {
      name: "Moat",
      level: 1,
      type: "moat",
      cost: 150,
      description: "Water defense",
      effect: "Increases AGI when attacked",
    },
    {
      name: "Magic Shield",
      level: 1,
      cost: 200,
      type: "magicShield",
      description: "Magical protection",
      effect: "Increases INT when attacked",
    },
    {
      name: "Towers",
      level: 1,
      cost: 250,
      type: "towers",
      description: "Defensive towers",
      effect: "Determines max defenders",
    },
    {
      name: "Mine",
      level: 1,
      cost: 300,
      type: "mine",
      description: "Elementium production",
      effect: "Generates gold over time",
    },
    {
      name: "Hero Guild",
      level: 1,
      cost: 400,
      type: "heroGuild",
      description: "Hero recruitment",
      effect: "Available daily hero cards",
    },
    {
      name: "Spy Guild",
      level: 1,
      cost: 350,
      type: "spyGuild",
      description: "Espionage center",
      effect: "Enables spy missions",
    },
    {
      name: "Counter-Espionage Guild",
      level: 1,
      cost: 375,
      type: "counterEspionageGuild",
      description: "Anti-spy measures",
      effect: "Prevents enemy spying",
    },
    {
      name: "Altar",
      level: 1,
      cost: 500,
      type: "altar",
      description: "Hero summoning",
      effect: "Summons heroes and armies",
    },
  ]);

  const [resources, setResources] = useState<Resources>({
    elementium: 1000,
  });

  const getBuildingImage = (building: Building) => {
    switch (building.type) {
      case "walls":
        return "/images/wall-fire.jpg";
      case "magicShield":
        return "/images/shield-fire.jpg";
      case "moat":
        return "/images/moat-fire.jpg";
      case "towers":
        return "/images/tower-fire.jpg";
      case "altar":
        return "/images/altar-fire.jpg";
      case "spyGuild":
        return "/images/spy-fire.jpg";
      case "heroGuild":
        return "/images/hero-guild-fire.jpg";
      default:
        return "/images/wall-fire.jpg";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Castle</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative w-full h-64">
          <Image
            src="/images/molten-castle.jpg"
            alt="Castle Banner"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div className="space-y-6 w-full">
          {/* Castle Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={33} className="w-full" />
            </CardContent>
          </Card>

          {/* Resources Display */}
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div className="flex items-center">
                <Component className="mr-2" />
                <span>{resources.elementium} Elementium</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Buildings</h1>
      {/* Buildings List */}
      <Carousel className="w-full mb-6" opts={{ slidesToScroll: 1 }}>
        <CarouselContent>
          {buildings.map((building, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{building.name}</CardTitle>
                  <CardDescription>Level {building.level}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={getBuildingImage(building)}
                    alt={building.name}
                    className="w-full object-cover rounded-md"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {building.description}
                  </p>
                  <p className="text-xs text-gray-600">{building.effect}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      Upgrade ({building.cost} gold)
                    </Button>
                    <div className="flex items-center">
                      <BuildingIcon className="mr-2 h-4 w-4" />
                      <span>Level {building.level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <h1 className="text-2xl font-bold mb-4">Heroes</h1>

      <HeroList heroes={mockHeroes} />
    </div>
  );
}
