import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { StudentDashboard } from "./components/StudentDashboard";
import { OrganizerDashboard } from "./components/OrganizerDashboard";
import { TournamentDetail } from "./components/TournamentDetail";
import { About } from "./components/About";
import { Profile } from "./components/Profile";
import { Notifications } from "./components/Notifications";
import { Achievements } from "./components/Achievements";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "student", element: <StudentDashboard /> },
      { path: "organizer", element: <OrganizerDashboard /> },
      { path: "tournament/:id", element: <TournamentDetail /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <Notifications /> },
      { path: "achievements", element: <Achievements /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);