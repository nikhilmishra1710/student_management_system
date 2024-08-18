import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
// import { AuthContext } from "./context/AuthContextProvider.jsx";
import { AuthContextProvider } from "./context/AuthContextProvider";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthContextProvider>
            <BrowserRouter>
                <Toaster />
                <App />
            </BrowserRouter>
        </AuthContextProvider>
    </StrictMode>
);
