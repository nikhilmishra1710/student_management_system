import { useState } from "react";
import { toast } from "react-hot-toast";
// import class from './../../node_modules/sucrase/dist/parser/plugins/flow';

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePassword = (e) => {
        const password = document.getElementById("password");
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        }
    };

    const validateEmail = (email) => {  
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if( validateEmail(formData.email) === false){
            toast.error("Invalid Email");
            setError("Invalid Email");
            setLoading(false);
            return;
        }
        if (formData.email === "" || formData.password === "") {
            toast.error("Please fill all fields");
            setError("Please fill all fields");
            setLoading(false);
            return;
        }
        try {
            console.log(formData);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(typeof(data),data);
            if (response.status === 200) {
                localStorage.setItem("user-token", JSON.stringify(data));
                toast.success("Login Successful");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            }
        } catch (error) {
            toast.error("An error occured! Try again later..");
            console.log("error occured");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen h-auto md:mt-0 mx-auto mt-12 mb-12  w-screen flex flex-col items-center justify-center">
            <div className="shadow-md">
                <div class="text-2xl p-4 bg-gray-900 text-white text-center rounded-t-md font-bold uppercase">Signup</div>
                <form class="py-4 px-6" onSubmit={handleSubmit} method="POST">
                      
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="email">
                            Email
                        </label>
                        <input
                            class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="johndoe@email.com"
                            value={formData.email}
                            onChange={handleInput}
                        />
                    </div>
                    
                    
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="phone">
                                Password
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="*******"
                                value={formData.password}
                                onChange={handleInput}
                            />
                        </div>
                        
                    <span className="block text-gray-700 font-bold mb-2">
                        <input type="checkbox" className="rounded-full" onClick={togglePassword} /> Show Password
                    </span>

                    <div class="mt-4 mb-4">
                        Dont't have an account?
                        <a href="/signup" class="text-blue-500 hover:text-blue-800">
                            Signup
                        </a>
                    </div>
                    <div class="flex items-center justify-center mb-4">
                        {!loading ? (
                            <button class="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline" type="submit">
                                Login
                            </button>
                        ) : (
                            <button disabled class="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline" type="submit">
                                Loading...
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
