"use client";
import { X, AlertTriangle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTravel: () => void;
}

export default function RecruitModal({
  isOpen,
  onClose,
  onTravel,
}: RecruitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/dark-fantasy-smoke.png')] opacity-10 bg-cover bg-center" />

        {/* Content container */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
            <h2 className="text-3xl font-bold text-white">Recruit New Units</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-xl text-gray-300 mb-8">
              To recruit new units, you need to travel on the map and explore
              different territories.
            </p>

            {/* Warning box */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-5 mb-8">
              <div className="flex gap-3 items-start">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-amber-500 mb-2">
                    Warning
                  </h3>
                  <p className="text-gray-300">
                    While traveling, you may encounter neutral heroes who will
                    attack you. Be prepared for battle!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-800/50 bg-gray-900/30">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-900 border-gray-700 hover:bg-gray-800 hover:text-white text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={onTravel}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Map className="w-4 h-4 mr-2" />
              Travel to Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
