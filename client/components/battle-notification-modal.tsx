import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

interface BattleNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  battleId: string;
}

export default function BattleNotificationModal({
  isOpen,
  onClose,
  battleId,
}: BattleNotificationModalProps) {
  const router = useRouter();

  const handleViewBattle = () => {
    router.push(`/battle/${battleId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Battle Encounter!</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700">
            You have been attacked while traveling by a wandering hero. Check
            the battle results.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleViewBattle}>View Battle</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
