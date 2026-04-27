import { useBreakpoint } from 'use-breakpoint';

// Define our breakpoints (matching Tailwind CSS breakpoints)
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Custom hook for responsive design
export const useResponsive = () => {
  const { breakpoint, maxWidth } = useBreakpoint(BREAKPOINTS);

  // Helper functions for common responsive checks
  const isMobile = (maxWidth ?? 0) < 640;
  const isTablet = (maxWidth ?? 0) >= 640 && (maxWidth ?? 0) < 1024;
  const isDesktop = (maxWidth ?? 0) >= 1024;

  // Get screen size category
  const getScreenSize = (): 'small' | 'medium' | 'large' => {
    if (isMobile) return 'small';
    if (isTablet) return 'medium';
    return 'large';
  };

  // Get responsive skill limits
  const getSkillLimit = (): number => {
    if (isMobile) return 3;
    if (isTablet) return 4;
    return 8; // Desktop
  };

  // Get responsive card heights
  const getCardHeights = () => {
    if (isMobile) {
      return {
        collapsed: 'h-[270px]',
        expanded: 'h-[450px]' // Increased from 400px to 480px for small mobile
      };
    } else if (isTablet) {
      return {
        collapsed: 'h-[280px]',
        expanded: 'h-[420px]'
      };
    }
    // Desktop
    return {
      collapsed: 'h-[240px]',
      expanded: 'h-[350px]'
    };
  };

  // Get responsive skill truncation length
  const getSkillTruncationLength = (): number => {
    if (isMobile) return 10;
    if (isTablet) return 12;
    return 15; // Desktop
  };

  return {
    breakpoint,
    maxWidth,
    isMobile,
    isTablet,
    isDesktop,
    getScreenSize,
    getSkillLimit,
    getCardHeights,
    getSkillTruncationLength,
  };
}; 