import HeroList from "@/components/hero-list";
import { mockHeroes } from "@/mocks/heroes";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Hero List</h1>
      <HeroList heroes={mockHeroes} />
    </main>
  );
}
