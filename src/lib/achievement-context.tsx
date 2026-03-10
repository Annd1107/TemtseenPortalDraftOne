import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setLocalStorage, getLocalStorage } from "./storage-utils";

export interface Achievement {
  id: string;
  studentId: string;
  tournamentId: string;
  tournamentTitle: string;
  category: string;
  date: string;
  location: string;
  placement: number; // 1st, 2nd, 3rd, etc.
  totalParticipants: number;
  score?: number;
  medal?: "gold" | "silver" | "bronze";
  certificate?: string;
}

interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  getStudentAchievements: (studentId: string) => Achievement[];
  deleteAchievement: (id: string) => boolean;
  isLoading: boolean;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Mock achievements for demo
const initialMockAchievements: Achievement[] = [
  {
    id: "1",
    studentId: "1",
    tournamentId: "past-1",
    tournamentTitle: "Математикийн Олимпиад 2025",
    category: "Математик",
    date: "2025-11-15",
    location: "МУИС, Улаанбаатар",
    placement: 1,
    totalParticipants: 150,
    score: 95,
    medal: "gold",
  },
  {
    id: "2",
    studentId: "1",
    tournamentId: "past-2",
    tournamentTitle: "Физикийн Уламжлалт Тэмцээн 2025",
    category: "Физик",
    date: "2025-10-20",
    location: "Шинжлэх Ухааны Академи",
    placement: 3,
    totalParticipants: 120,
    score: 88,
    medal: "bronze",
  },
  {
    id: "3",
    studentId: "1",
    tournamentId: "past-3",
    tournamentTitle: "Хими Үндэсний Тэмцээн 2025",
    category: "Хими",
    date: "2025-09-10",
    location: "Боловсролын Их Сургууль",
    placement: 2,
    totalParticipants: 100,
    score: 92,
    medal: "silver",
  },
  {
    id: "4",
    studentId: "1",
    tournamentId: "past-4",
    tournamentTitle: "Биологийн Олимпиад 2025",
    category: "Биологи",
    date: "2025-08-05",
    location: "ШУА, Улаанбаатар",
    placement: 5,
    totalParticipants: 80,
    score: 82,
  },
  {
    id: "5",
    studentId: "1",
    tournamentId: "past-5",
    tournamentTitle: "Програмчлалын Тэмцээн 2025",
    category: "Информатик",
    date: "2025-06-15",
    location: "МУИС, Улаанбаатар",
    placement: 1,
    totalParticipants: 60,
    score: 98,
    medal: "gold",
  },
];

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements from localStorage on mount
  useEffect(() => {
    const loadAchievements = () => {
      const storedAchievements = getLocalStorage("temtseen_achievements");
      if (storedAchievements && Array.isArray(storedAchievements)) {
        setAchievements(storedAchievements);
      } else {
        setAchievements(initialMockAchievements);
        setLocalStorage("temtseen_achievements", initialMockAchievements);
      }
      setIsLoading(false);
    };

    loadAchievements();
  }, []);

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && achievements.length > 0) {
      setLocalStorage("temtseen_achievements", achievements);
    }
  }, [achievements, isLoading]);

  const addAchievement = (achievementData: Omit<Achievement, "id">) => {
    const newAchievement: Achievement = {
      ...achievementData,
      id: Date.now().toString(),
    };
    setAchievements([newAchievement, ...achievements]);
  };

  const getStudentAchievements = (studentId: string): Achievement[] => {
    return achievements
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const deleteAchievement = (id: string): boolean => {
    const achievement = achievements.find(a => a.id === id);
    if (!achievement) return false;

    setAchievements(achievements.filter(a => a.id !== id));
    return true;
  };

  return (
    <AchievementContext.Provider 
      value={{ 
        achievements, 
        addAchievement,
        getStudentAchievements,
        deleteAchievement,
        isLoading,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}
