import { toast } from "sonner";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

export const Toast = {
  success: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#10B981]/20 rounded-xl shadow-2xl shadow-[#10B981]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#10B981]/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#10B981] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#10B981]/60 hover:text-white hover:bg-[#10B981]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  add: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#10B981]/20 rounded-xl shadow-2xl shadow-[#10B981]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#10B981]/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#10B981] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#10B981]/60 hover:text-white hover:bg-[#10B981]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  remove: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#EF4444]/20 rounded-xl shadow-2xl shadow-[#EF4444]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#EF4444]/20 rounded-full">
              <X className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#EF4444] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#EF4444]/60 hover:text-white hover:bg-[#EF4444]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  error: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#EF4444]/20 rounded-xl shadow-2xl shadow-[#EF4444]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#EF4444]/20 rounded-full">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#EF4444] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#EF4444]/60 hover:text-white hover:bg-[#EF4444]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  loading: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#F59E0B]/20 rounded-xl shadow-2xl shadow-[#F59E0B]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#F59E0B]/20 rounded-full">
              <div className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#F59E0B] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#F59E0B]/60 hover:text-white hover:bg-[#F59E0B]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  info: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#3B82F6]/20 rounded-xl shadow-2xl shadow-[#3B82F6]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#3B82F6]/20 rounded-full">
              <Info className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#3B82F6] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#3B82F6]/60 hover:text-white hover:bg-[#3B82F6]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },
};

export default Toast;
