import { Info, X } from "lucide-react";
import { useState } from "react";

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 text-white px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Demo Mode:</strong> This app is running in demo mode. All
            data is stored locally and will reset on page refresh.
            <span className="font-medium ml-2">
              To enable full functionality, set up Supabase following the
              SUPABASE_SETUP.md guide.
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white transition-colors p-1"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
