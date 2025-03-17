import { useQuery } from "@tanstack/react-query";
import { CastleService } from "@/services/castle.service";
import type { Castle } from "types";

export default function useCastle(castleId: string, initialData?: Castle) {
  const {
    data: castle,
    error,
    isLoading,
  } = useQuery<Castle>({
    queryKey: ["castle", castleId],
    queryFn: () => CastleService.getCastle(castleId),
    initialData,
    enabled: !!castleId,
  });

  return { castle, error, isLoading };
}
