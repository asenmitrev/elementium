import { useQuery } from "@tanstack/react-query";
import { CastleService } from "@/services/castle.service";
import type { Castle } from "types";

export default function useCastles(initialData?: Castle[]) {
  const {
    data: castles,
    error,
    isLoading,
  } = useQuery<Castle[]>({
    queryKey: ["castles"],
    queryFn: () => CastleService.getCastles(),
    initialData,
  });

  return { castles, error, isLoading };
}
