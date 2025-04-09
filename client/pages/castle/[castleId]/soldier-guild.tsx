import CastleLayout from "./layout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BuildingHeader from "@/components/building-header";
import { getBuildingImage } from "@/components/building";
import useCastle from "@/hooks/useCastle";
import { useRouter } from "next/router";

export default function HeroGuild() {
  const router = useRouter();
  const castleId = router.query.castleId as string;
  const { castle } = useCastle(castleId);

  if (!castle) return <div>Castle not found</div>;
  return (
    <CastleLayout>
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <BuildingHeader
              imageUrl={getBuildingImage(
                castle.buildings.soldierGuild,
                castle.type
              )}
              title="Soldier Guild"
              castleId={castle._id}
            />
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
            </div>
          </div>
        </div>
      </div>
    </CastleLayout>
  );
}
