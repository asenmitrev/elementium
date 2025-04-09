import HeroList from "@/components/hero-list";
import { GetServerSideProps } from "next";
import { HeroService } from "@/services/hero.service";
import type { Hero, Unit } from "types";
import ProtectedRoute from "@/components/protected-route";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { requireAuth } from "@/utils/check-onboarding";
interface HeroesProps {
  initialHeroes: (Hero & { units: Unit[] })[];
}

export const getServerSideProps: GetServerSideProps<HeroesProps> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const auth = await requireAuth(context);
  if ("redirect" in auth) {
    return auth;
  }
  try {
    // Fetch heroes on the server
    const heroes = await HeroService.getHeroes(session?.user.accessToken || "");

    return {
      props: {
        initialHeroes: heroes,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Heroes({ initialHeroes }: HeroesProps) {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Hero List</h1>
        <HeroList heroes={initialHeroes} />
      </main>
    </ProtectedRoute>
  );
}
