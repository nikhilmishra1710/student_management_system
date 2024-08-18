import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import { useAuthContext } from "./context/AuthContextProvider";

function App() {
    const { authUser } = useAuthContext();
    console.log(authUser);
    return (
        <>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        authUser ? authUser.role === "STUDENT" ? <StudentDashboard /> : authUser.role === "INSTRUCTOR" ? <StudentDashboard /> : null : <Navigate to="/login" />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
