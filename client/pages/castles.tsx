import { useState } from "react";
import { Castle, Component } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export default function Castles() {
  const [castles, setCastles] = useState([
    {
      id: 1,
      name: "Castle Black",
      level: 5,
      image: "/images/molten-castle.jpg",
      resources: {
        gold: 1000,
      },
    },
    {
      id: 2,
      name: "Water Castle",
      level: 3,
      image: "/images/castle-water.jpg",
      resources: {
        gold: 500,
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCastles = castles.filter((castle) =>
    castle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        <Castle className="mr-2 h-8 w-8" />
        Your Castles
      </h1>

      <div className="mb-6">
        <Label htmlFor="search">Search Castles</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by castle name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCastles.map((castle) => (
          <div
            key={castle.id}
            className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-4">
              <Link href={`/castle`}>{castle.name}</Link>
            </h2>
            <div className="space-y-2">
              <img src={castle.image} alt={castle.name} />
              <p className="text-gray-600">Level: {castle.level}</p>
              <div className="border-t pt-2">
                <h3 className="font-medium mb-2">Resources:</h3>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <Component color="gold" className="mr-2 h-4 w-4" />
                    {castle.resources.gold}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
