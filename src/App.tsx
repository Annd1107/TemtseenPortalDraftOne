import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./lib/auth-context";
import { TournamentProvider } from "./lib/tournament-context";
import { LanguageProvider } from "./lib/language-context";
import { ThemeProvider } from "./lib/theme-context";
import { AchievementProvider } from "./lib/achievement-context";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TournamentProvider>
            <AchievementProvider>
              <RouterProvider router={router} />
            </AchievementProvider>
          </TournamentProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}