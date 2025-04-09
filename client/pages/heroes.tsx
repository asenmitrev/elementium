import HeroList from "@/components/hero-list";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/utils/auth.server";
import { HeroService } from "@/services/hero.service";
import type { Hero, Unit } from "types";
import ProtectedRoute from "@/components/protected-route";

interface HeroesProps {
  initialHeroes: (Hero & { units: Unit[] })[];
}

export const getServerSideProps: GetServerSideProps<HeroesProps> = async (
  context
) => {
  // First run the auth check
  const authResult = await requireAuth(context);
  if ("redirect" in authResult) {
    return authResult;
  }

  try {
    // Fetch heroes on the server
    const heroes = await HeroService.getHeroes(context.req?.headers.cookie);

    return {
      props: {
        initialHeroes: heroes,
      },
    };
  } catch (error) {
    console.error("Error fetching heroes:", error);
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
