import { Castle, Component } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import useCastles from "@/hooks/useCastles";
import { GetServerSideProps } from "next";
import { CastleService } from "@/services/castle.service";
import type { Castle as ICastle } from "types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { requireAuth } from "@/utils/check-onboarding";

interface CastlesProps {
  initialCastles: ICastle[];
}

// Add this color mapping near the top of the file, before the component
const elementColors = {
  fire: {
    accent: "text-red-400",
    hover: "hover:text-red-300",
    border: "hover:border-red-700/50",
    button: "text-red-400 hover:text-red-300 hover:bg-red-950/30",
    icon: "text-red-400",
  },
  water: {
    accent: "text-blue-400",
    hover: "hover:text-blue-300",
    border: "hover:border-blue-700/50",
    button: "text-blue-400 hover:text-blue-300 hover:bg-blue-950/30",
    icon: "text-blue-400",
  },
  earth: {
    accent: "text-green-400",
    hover: "hover:text-green-300",
    border: "hover:border-green-700/50",
    button: "text-green-400 hover:text-green-300 hover:bg-green-950/30",
    icon: "text-green-400",
  },
} as const;

export const getServerSideProps: GetServerSideProps<CastlesProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const auth = await requireAuth(context);
  if ("redirect" in auth) {
    return auth;
  }
  try {
    // Fetch castles on the server - cookies will be automatically included
    const castles = await CastleService.getCastles(session?.user.accessToken);

    if (!castles || castles.length === 0) {
      return {
        redirect: {
          destination: "/choose-element",
          permanent: false,
        },
      };
    }

    return {
      props: {
        initialCastles: castles,
      },
    };
  } catch (error) {
    console.error("Error fetching castles:", error);
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Castles({ initialCastles }: CastlesProps) {
  const { castles, error, isLoading } = useCastles(initialCastles);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p>Loading castles...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">Error loading castles</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <header className="pb-4 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Castle className="h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold tracking-tighter">
                Your Castles
              </h1>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {castles?.map((castle) => {
            const colors =
              elementColors[castle.type as keyof typeof elementColors];

            return (
              <Card
                key={castle._id}
                className={cn(
                  "overflow-hidden border-gray-800 bg-gray-900/60 transition-colors cursor-pointer",
                  colors.border
                )}
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <Image
                    src={castle.image || "/placeholder.svg"}
                    alt="Castle image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center justify-between">
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                        Mine Level {castle.buildings.mine.level}
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Building className={`h-3 w-3 ${colors.icon}`} />
                        {castle.type}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-semibold text-lg  transition-colors capitalize`}
                    >
                      <Link
                        href={`/castle/${castle._id}`}
                        className={`${colors.accent} ${colors.hover} hover:no-underline`}
                      >
                        {castle.type} Castle
                      </Link>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Component className={`h-4 w-4 ${colors.icon}`} />
                      Mine Level: {castle.buildings.mine.level}
                    </div>
                    <div
                      onClick={(e) => e.preventDefault()}
                      className="relative z-10"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${colors.button} -mr-2`}
                        asChild
                      >
                        <Link href={`/castle/${castle._id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
