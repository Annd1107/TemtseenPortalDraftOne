import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setLocalStorage, getLocalStorage } from "./storage-utils";

export interface Tournament {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  registrationFee: number; // in MNT (Mongolian Tugrik)
  maxParticipants: number;
  registeredCount: number;
  organizerId: string;
  organizerName: string;
  organizerOrganization: string;
  registrations: string[]; // array of student IDs
  createdAt: string;
  preparationMaterial?: {
    fileName: string;
    fileUrl: string;
  }; // optional PDF for mock tests/study materials
}

interface TournamentContextType {
  tournaments: Tournament[];
  addTournament: (tournament: Omit<Tournament, "id" | "registeredCount" | "registrations" | "createdAt">) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => boolean;
  deleteTournament: (id: string) => boolean;
  registerForTournament: (tournamentId: string, studentId: string) => boolean;
  unregisterFromTournament: (tournamentId: string, studentId: string) => boolean;
  getTournamentById: (id: string) => Tournament | undefined;
  getStudentRegistrations: (studentId: string) => Tournament[];
  getOrganizerTournaments: (organizerId: string) => Tournament[];
  isLoading: boolean;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Mock tournaments
const initialMockTournaments: Tournament[] = [
  {
    id: "1",
    title: "National Math Olympiad 2026",
    description: "Монгол Улсын 9-12-р ангийн сурагчдад зориулсан математикийн олимпиад",
    category: "Математик",
    date: "2026-03-15",
    location: "МУИС, Улаанбаатар",
    registrationFee: 10000,
    maxParticipants: 200,
    registeredCount: 145,
    organizerId: "2",
    organizerName: "Сарнай Дорж",
    organizerOrganization: "Математикийн Холбоо",
    registrations: [],
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Физикийн Уламжлалт Тэмцээн",
    description: "Ахлах ангийн сурагчдын физикийн мэдлэг чадварыг шалгах тэмцээн",
    category: "Физик",
    date: "2026-04-20",
    location: "Шинжлэх Ухааны Академи",
    registrationFee: 10000,
    maxParticipants: 150,
    registeredCount: 98,
    organizerId: "2",
    organizerName: "Сарнай Дорж",
    organizerOrganization: "Математикийн Холбоо",
    registrations: [],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    title: "Хими Олон Улсын Тэмцээн",
    description: "Олон улсын стандартад нийцсэн химийн олимпиад",
    category: "Хими",
    date: "2026-05-10",
    location: "Боловсролын Их Сургууль",
    registrationFee: 12000,
    maxParticipants: 100,
    registeredCount: 67,
    organizerId: "2",
    organizerName: "Сарнай Дорж",
    organizerOrganization: "Математикийн Холбоо",
    registrations: [],
    createdAt: "2026-01-25",
  },
];

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tournaments from localStorage on mount
  useEffect(() => {
    const loadTournaments = () => {
      const storedTournaments = getLocalStorage("temtseen_tournaments");
      if (storedTournaments && Array.isArray(storedTournaments)) {
        setTournaments(storedTournaments);
      } else {
        setTournaments(initialMockTournaments);
        setLocalStorage("temtseen_tournaments", initialMockTournaments);
      }
      setIsLoading(false);
    };

    loadTournaments();
  }, []);

  // Save tournaments to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && tournaments.length > 0) {
      setLocalStorage("temtseen_tournaments", tournaments);
    }
  }, [tournaments, isLoading]);

  const addTournament = (tournamentData: Omit<Tournament, "id" | "registeredCount" | "registrations" | "createdAt">) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: Date.now().toString(),
      registeredCount: 0,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    setTournaments([newTournament, ...tournaments]);
  };

  const updateTournament = (id: string, tournamentData: Partial<Tournament>): boolean => {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return false;

    setTournaments(tournaments.map(t =>
      t.id === id ? { ...t, ...tournamentData } : t
    ));
    return true;
  };

  const deleteTournament = (id: string): boolean => {
    const tournament = tournaments.find(t => t.id === id);
    if (!tournament) return false;

    setTournaments(tournaments.filter(t => t.id !== id));
    return true;
  };

  const registerForTournament = (tournamentId: string, studentId: string): boolean => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return false;
    
    if (tournament.registrations.includes(studentId)) return false;
    if (tournament.registeredCount >= tournament.maxParticipants) return false;

    setTournaments(tournaments.map(t => 
      t.id === tournamentId 
        ? { 
            ...t, 
            registrations: [...t.registrations, studentId],
            registeredCount: t.registeredCount + 1 
          }
        : t
    ));
    return true;
  };

  const unregisterFromTournament = (tournamentId: string, studentId: string): boolean => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return false;
    
    if (!tournament.registrations.includes(studentId)) return false;

    setTournaments(tournaments.map(t => 
      t.id === tournamentId 
        ? { 
            ...t, 
            registrations: t.registrations.filter(id => id !== studentId),
            registeredCount: t.registeredCount - 1 
          }
        : t
    ));
    return true;
  };

  const getTournamentById = (id: string): Tournament | undefined => {
    return tournaments.find(t => t.id === id);
  };

  const getStudentRegistrations = (studentId: string): Tournament[] => {
    return tournaments.filter(t => t.registrations.includes(studentId));
  };

  const getOrganizerTournaments = (organizerId: string): Tournament[] => {
    return tournaments.filter(t => t.organizerId === organizerId);
  };

  return (
    <TournamentContext.Provider 
      value={{ 
        tournaments, 
        addTournament,
        updateTournament,
        deleteTournament,
        registerForTournament,
        unregisterFromTournament,
        getTournamentById,
        getStudentRegistrations,
        getOrganizerTournaments,
        isLoading,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournaments() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error("useTournaments must be used within a TournamentProvider");
  }
  return context;
}