import { mockCastles } from "@/mocks/castles";

export default function useCastle(castleId: string) {
  const castle = mockCastles.find((castle) => castle._id === castleId);
  return castle;
}
