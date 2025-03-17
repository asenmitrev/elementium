"use client";

import { useMemo, useState } from "react";
import { Component } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Building, Castle } from "@/types";
import BuildingCard from "@/components/building";
import CastleLayout from "./layout";
import { useRouter } from "next/router";
import { mockCastles } from "@/mocks/castles";
import ProtectedRoute from "@/components/protected-route";

interface Resources {
  elementium: number;
}

export default function CastlePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const castleId = router.query.castleId as string;
  const castle = mockCastles.find((castle) => castle._id === castleId);

  const buildings: Building[] = useMemo(() => {
    if (!castle?.buildings) return [];

    return Object.entries(castle.buildings)
      .map(([key, building]) => {
        const buildingOrder = castle.buildingOrder.find(
          (order) => order.buildingOrdered === key
        );
        if (!buildingOrder) return null;
        return {
          ...building,
          type: key as keyof Omit<Castle["buildings"], "buildingOrder">,
          isUpgrading:
            buildingOrder.dateOfCompletion > new Date() ? true : false,
        };
      })
      .filter(
        (building): building is Building & { isUpgrading: boolean } =>
          building !== null
      )
      .sort(
        (
          a: Building & { isUpgrading: boolean },
          b: Building & { isUpgrading: boolean }
        ) => {
          // Put upgrading building first
          if (a.isUpgrading) return -1;
          if (b.isUpgrading) return 1;

          // Then sort by level (highest first)
          return b.level - a.level;
        }
      ) as Building[];
  }, [castle]);

  const [resources, setResources] = useState<Resources>({
    elementium: 1000,
  });
  if (!castle) {
    return <div>Castle not found</div>;
  }
  return (
    <ProtectedRoute>
      <CastleLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative w-full h-64">
            <Image
              src={castle.image}
              alt={castle.type + " castle"}
              fill
              className="object-cover rounded-lg"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent rounded-lg" />
            <h1 className="text-2xl capitalize font-bold mb-4 absolute top-4 left-6 ">
              {castle.type} Castle
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
            <BuildingCard
              key={index}
              building={building}
              type={castle.type}
              castleId={castleId}
            />
          ))}
        </div>
      </CastleLayout>
    </ProtectedRoute>
  );
}
