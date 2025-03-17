import { Castle, Component } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import useCastles from "@/hooks/useCastles";
import { GetServerSideProps } from "next";
import { requireAuth } from "@/utils/auth.server";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function Castles() {
  const { castles, error, isLoading } = useCastles();

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
        <h1 className="text-4xl font-bold mb-8 flex items-center">
          <Castle className="mr-2 h-8 w-8" />
          Your Castles
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {castles?.map((castle) => (
            <div
              key={castle._id}
              className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-4">
                <Link
                  href={`/castle/${castle._id}`}
                  className="text-white capitalize"
                >
                  {castle.type}
                </Link>
              </h2>
              <div className="space-y-2">
                <img src={castle.image} alt={castle.type} />
                <div className="border-t pt-2">
                  <h3 className="font-medium mb-2">Resources:</h3>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <Component color="gold" className="mr-2 h-4 w-4" />
                      {castle.buildings.mine.level}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
