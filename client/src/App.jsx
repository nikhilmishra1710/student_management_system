import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import { useAuthContext } from "./context/AuthContextProvider";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const { authUser } = useAuthContext();
    console.log(authUser);
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        authUser ? authUser.role === "STUDENT" ? <StudentDashboard /> : authUser.role === "INSTRUCTOR" ? <TeacherDashboard /> : <AdminDashboard /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
