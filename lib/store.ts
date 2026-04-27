import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Candidate, FilterState, User } from './types';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  toggleLoginModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  // Existing state
  filters: FilterState;
  shortlistedCandidates: Candidate[];
  isFilterApplied: boolean;
  showTeamModal: boolean;
  isLeftPanelExpanded: boolean;
  isRightPanelExpanded: boolean;
  expandedCardId: string | null;
  setFilters: (newFilters: Partial<FilterState>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateEmail: string) => void;
  setShortlist: (candidates: Candidate[]) => void;
  clearShortlist: () => void;
  hasFilterChanges: () => boolean;
  openTeamModal: () => void;
  closeTeamModal: () => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftPanelExpanded: (expanded: boolean) => void;
  setRightPanelExpanded: (expanded: boolean) => void;
  setExpandedCard: (cardId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth initial state
      user: null,
      isAuthenticated: false,
      showLoginModal: false,

      // Existing state
      filters: {
        skills: '',
        workAvailability: [],
        minSalary: 45000,
        maxSalary: 150000,
        location: '',
        roleName: '',
        company: '',
        educationLevel: 'all',
        degreeSubject: '',
        sortBy: 'date',
        page: 1,
        limit: 10,
      },
      shortlistedCandidates: [],
      isFilterApplied: false,
      showTeamModal: false,
      isLeftPanelExpanded: false,
      isRightPanelExpanded: false,
      expandedCardId: null,

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true, showLoginModal: false }),
      logout: () => set({ user: null, isAuthenticated: false, shortlistedCandidates: [] }),
      toggleLoginModal: () => set((state) => ({ showLoginModal: !state.showLoginModal })),
      openLoginModal: () => set({ showLoginModal: true }),
      closeLoginModal: () => set({ showLoginModal: false }),

      // Existing actions
      setFilters: (newFilters) => set((state) => {
        const updatedFilters = { ...state.filters, ...newFilters, page: 1 };
        const hasAnyFilters = updatedFilters.skills !== '' ||
                             updatedFilters.workAvailability.length > 0 ||
                             updatedFilters.minSalary !== 45000 ||
                             updatedFilters.maxSalary !== 150000 ||
                             updatedFilters.location !== '' ||
                             updatedFilters.roleName !== '' ||
                             updatedFilters.company !== '' ||
                             updatedFilters.educationLevel !== 'all' ||
                             updatedFilters.degreeSubject !== '';
        return {
          filters: updatedFilters,
          isFilterApplied: hasAnyFilters,
        };
      }),
      applyFilters: () => set({ isFilterApplied: true }),
      clearFilters: () => set({
        isFilterApplied: false,
        filters: {
          skills: '',
          workAvailability: [],
          minSalary: 45000,
          maxSalary: 150000,
          location: '',
          roleName: '',
          company: '',
          educationLevel: 'all',
          degreeSubject: '',
          sortBy: 'date',
          page: 1,
          limit: 10,
        },
      }),
      addCandidate: (candidate) => set((state) => ({
        shortlistedCandidates: state.shortlistedCandidates.some((c) => c.email === candidate.email)
          ? state.shortlistedCandidates
          : [...state.shortlistedCandidates, candidate],
      })),
      removeCandidate: (candidateEmail) => set((state) => ({
        shortlistedCandidates: state.shortlistedCandidates.filter((c) => c.email !== candidateEmail),
      })),
      setShortlist: (candidates) => set({ shortlistedCandidates: candidates }),
      clearShortlist: () => set({ shortlistedCandidates: [] }),
      hasFilterChanges: () => {
        const state = get();
        return state.filters.skills !== '' ||
               state.filters.workAvailability.length > 0 ||
               state.filters.minSalary !== 45000 ||
               state.filters.maxSalary !== 150000 ||
               state.filters.location !== '' ||
               state.filters.roleName !== '' ||
               state.filters.company !== '' ||
               state.filters.educationLevel !== 'all' ||
               state.filters.degreeSubject !== '';
      },
      openTeamModal: () => set({ showTeamModal: true }),
      closeTeamModal: () => set({ showTeamModal: false }),
      toggleLeftPanel: () => set((state) => ({ isLeftPanelExpanded: !state.isLeftPanelExpanded })),
      toggleRightPanel: () => set((state) => ({ isRightPanelExpanded: !state.isRightPanelExpanded })),
      setLeftPanelExpanded: (expanded) => set({ isLeftPanelExpanded: expanded }),
      setRightPanelExpanded: (expanded) => set({ isRightPanelExpanded: expanded }),
      setExpandedCard: (cardId) => set({ expandedCardId: cardId }),
    }),
    {
      name: 'recruitflow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
