import CastleLayout from "./layout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BuildingHeader from "@/components/building-header";
import { useRouter } from "next/router";
import { getBuildingImage } from "@/components/building";
import useCastle from "@/hooks/useCastle";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/utils/auth.server";
import { CastleService } from "@/services/castle.service";
import { Hero as IHero, Castle, Unit } from "types";
import Hero from "@/components/hero";

interface WallsProps {
  initialCastle: Castle;
  heroes: (IHero & { units: Unit[] })[];
}

export const getServerSideProps: GetServerSideProps<WallsProps> = async (
  context
) => {
  // First run the auth check
  const authResult = await requireAuth(context);
  if ("redirect" in authResult) {
    return authResult;
  }

  const castleId = context.params?.castleId as string;

  try {
    const [castle, heroes] = await Promise.all([
      CastleService.getCastle(castleId, context.req?.headers.cookie),
      CastleService.getCastleHeroes(castleId, context.req?.headers.cookie),
    ]);

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
        heroes,
      },
    };
  } catch (error) {
    console.error("Error fetching castle data:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Walls({ initialCastle, heroes }: WallsProps) {
  const router = useRouter();
  const castleId = router.query.castleId as string;
  const { castle } = useCastle(castleId, initialCastle);

  if (!castle) return <div>Castle not found</div>;

  return (
    <CastleLayout>
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BuildingHeader
              imageUrl={getBuildingImage(castle.buildings.walls, castle.type)}
              title="Walls"
              castleId={castle._id}
            />

            <div className="space-y-6 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={33} className="w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Heroes Manning the Walls</h1>

        {heroes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero) => (
              <Hero
                key={hero._id}
                hero={hero.type}
                units={hero.units?.map((unit) => unit.type) ?? []}
                link={`/hero/${hero._id}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex text-gray-500 py-4">
            No heroes are currently manning the walls.
          </div>
        )}
      </div>
    </CastleLayout>
  );
}
