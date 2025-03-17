import { useMemo, useState } from "react";
import { Component } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Building, Castle } from "types";
import BuildingCard from "@/components/building";
import CastleLayout from "./layout";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/protected-route";
import useCastle from "@/hooks/useCastle";
import { GetServerSidePropsContext } from "next";
import { requireAuth } from "@/utils/auth.server";
import { CastleService } from "@/services/castle.service";

interface Resources {
  elementium: number;
}

interface CastleProps {
  initialCastle: Castle;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // First run the auth check
  const authResult = await requireAuth(context);
  if ("redirect" in authResult) {
    return authResult;
  }

  try {
    const castleId = context.params?.castleId as string;
    // Fetch castle on the server - cookies will be automatically included
    const castle = await CastleService.getCastle(
      castleId,
      context.req?.headers.cookie
    );

    if (!castle) {
      return {
        redirect: {
          destination: "/castles",
          permanent: false,
        },
      };
    }

    return {
      props: {
        initialCastle: castle,
      },
    };
  } catch (error) {
    console.error("Error fetching castle:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
}

export default function CastlePage({
  initialCastle,
  children,
}: CastleProps & {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const castleId = router.query.castleId as string;
  const { castle } = useCastle(castleId, initialCastle);

  const buildings: Building[] = useMemo(() => {
    if (!castle?.buildings) return [];

    return Object.entries(castle.buildings).map(([key, building]) => ({
      ...building,
      type: key as keyof Omit<Castle["buildings"], "buildingOrder">,
    }));
  }, [castle]);

  console.log(buildings);

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
