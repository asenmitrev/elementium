import { useQuery } from "@tanstack/react-query";
import { CastleService } from "@/services/castle.service";
import type { Castle } from "types";
import { useSession } from "next-auth/react";

export default function useCastles(initialData?: Castle[]) {
  const { data: session } = useSession();
  const {
    data: castles,
    error,
    isLoading,
  } = useQuery<Castle[]>({
    queryKey: ["castles"],
    queryFn: () => CastleService.getCastles(session?.user.accessToken),
    initialData,
    enabled: !!session?.user.accessToken,
  });

  return { castles, error, isLoading };
}
