import { useQuery } from "@tanstack/react-query";
import { CastleService } from "@/services/castle.service";
import type { Castle } from "types";
import { useSession } from "next-auth/react";
export default function useCastle(castleId: string, initialData?: Castle) {
  const { data: session } = useSession();
  const {
    data: castle,
    error,
    isLoading,
  } = useQuery<Castle>({
    queryKey: ["castle", castleId],
    queryFn: () => CastleService.getCastle(castleId, session?.user.accessToken),
    initialData,
    enabled: !!castleId && !!session?.user.accessToken,
  });

  return { castle, error, isLoading };
}
