import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface BackToTopProps {
  targetRef?: React.RefObject<HTMLElement>;
}

export const BackToTop = ({ targetRef }: BackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef?.current) {
        setIsVisible(targetRef.current.scrollTop > 300);
      } else {
        setIsVisible(window.scrollY > 300);
      }
    };

    const element = targetRef?.current || window;
    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [targetRef]);

  const scrollToTop = () => {
    const element = targetRef?.current || window;
    if (element === window) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      element.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="sm"
            className="rounded-full w-12 h-12 p-0 bg-primary/90 hover:bg-primary shadow-lg"
            title="Back to top"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
