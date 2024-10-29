import Navbar from "./components/Navbar";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import QueryProvider from "./components/QueryProvider";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "./store";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  return (
    <QueryProvider>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <Router>
        <Navbar />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Routes>
            <Route path="/sign-in" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/task-manager"
              element={
                <ProtectedRoute
                  element={
                    <DndProvider backend={HTML5Backend}>
                      <Tasks />
                    </DndProvider>
                  }
                />
              }
            />
          </Routes>
        </GoogleOAuthProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;
