import { useQuery } from "@tanstack/react-query";
import { CastleService } from "@/services/castle.service";
import type { Castle } from "types";

export default function useCastles() {
  const {
    data: castles,
    error,
    isLoading,
  } = useQuery<Castle[]>({
    queryKey: ["castles"],
    queryFn: () => CastleService.getCastles(),
  });

  return { castles, error, isLoading };
}
