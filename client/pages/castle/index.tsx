"use client";

import { useState } from "react";
import { Component } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Building } from "@/types";
import BuildingCard from "@/components/building";
import CastleLayout from "./layout";

interface Resources {
  elementium: number;
}

export default function Castle({ children }: { children: React.ReactNode }) {
  const [buildings, setBuildings] = useState<Building[]>([
    {
      name: "Walls",
      level: 1,
      type: "walls",
      link: "/walls",
      cost: 100,
      description: "+Earth when attacked",
    },
    {
      name: "Moat",
      level: 1,
      type: "moat",
      cost: 150,
      description: "+Water when attacked",
    },
    {
      name: "Magic Shield",
      level: 1,
      cost: 200,
      type: "magicShield",
      description: "+Fire when attacked",
    },
    {
      name: "Towers",
      level: 1,
      cost: 250,
      type: "towers",
      description: "Determines defender capacity",
    },
    {
      name: "Mine",
      level: 1,
      cost: 300,
      type: "mine",
      description: "Elementium production",
    },
    {
      name: "Hero Guild",
      level: 1,
      cost: 400,
      link: "/hero-guild",
      type: "heroGuild",
      description: "Hero recruitment",
    },
    {
      name: "Soldier Guild",
      level: 1,
      cost: 400,
      link: "/soldier-guild",
      type: "soldierGuild",
      description: "Soldier recruitment",
    },
    {
      name: "Spy Guild",
      level: 1,
      cost: 350,
      type: "spyGuild",
      description: "Espionage center",
    },
    {
      name: "Counter-Espionage Guild",
      level: 1,
      cost: 375,
      type: "counterEspionageGuild",
      description: "Anti-spy measures",
    },
    {
      name: "Altar",
      level: 1,
      cost: 500,
      type: "altar",
      link: "/hero-altar",
      description: "Dead hero resurrection",
    },
  ]);

  const [resources, setResources] = useState<Resources>({
    elementium: 1000,
  });
  return (
    <CastleLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative w-full h-64">
          <Image
            src="/images/molten-castle.jpg"
            alt="Castle Banner"
            fill
            className="object-cover rounded-lg"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent rounded-lg" />
          <h1 className="text-2xl font-bold mb-4 absolute top-4 left-6 ">
            Your Castle
          </h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {buildings.map((building, index) => (
          <BuildingCard key={index} building={building} />
        ))}
      </div>
    </CastleLayout>
  );
}
