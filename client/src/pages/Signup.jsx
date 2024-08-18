import { useState } from "react";
// import class from './../../node_modules/sucrase/dist/parser/plugins/flow';

export default function Signup() {
    const [formData, setFormData] = useState({
        fname: "",
        sname: "",
        email: "",
        password: "",
        phone: "",
        cnfpassword: "",
        type: "",
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
        const cnfpassword = document.getElementById("cnfpassword");
        if (cnfpassword.type === "password") {
            cnfpassword.type = "text";
        } else {
            cnfpassword.type = "password";
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            console.log(formData);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if(response.status === 201){
                
                setTimeout(() => {
                window.location.href = "/login";
                },1000);
            }
        } catch (error) {
            console.log("error occured");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen h-auto md:mt-0 mx-auto mt-12 mb-12  w-screen flex flex-col items-center justify-center">
            <div className="shadow-md">
                <div class="text-2xl p-4 bg-gray-900 text-white text-center rounded-t-md font-bold uppercase">Signup</div>
                <form class="py-4 px-6" onSubmit={handleSubmit} method="POST">
                    <div className="flex gap-2 flex-col md:flex-row">
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="name">
                                First Name
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fname"
                                name="fname"
                                type="text"
                                placeholder="John"
                                value={formData.fname}
                                onChange={handleInput}
                            />
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="name">
                                Last Name
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="sname"
                                name="sname"
                                type="text"
                                placeholder="Doe"
                                value={formData.sname}
                                onChange={handleInput}
                            />
                        </div>
                    </div>
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
                    <div className="flex md:flex-row flex-col gap-2">
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="phone">
                                Phone Number
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="1234567890"
                                value={formData.phone}
                                onChange={handleInput}
                            />
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="phone">
                                Type
                            </label>
                            <select
                                class="shadow-md border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInput}
                            >
                                <option value="" default disabled hidden>
                                    Select Type
                                </option>
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2">
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
                        <div class="mb-4">
                            <label class="block text-gray-700 font-bold mb-2" for="phone">
                                Confirm Password
                            </label>
                            <span className="flex">
                                <input
                                    class="shadow appearance-none border rounded w-full min-w-[250px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="cnfpassword"
                                    type="password"
                                    name="cnfpassword"
                                    placeholder="*******"
                                    value={formData.cnfpassword}
                                    onChange={handleInput}
                                />
                            </span>
                        </div>
                    </div>
                    <span className="block text-gray-700 font-bold mb-2">
                        <input type="checkbox" className="rounded-full" onClick={togglePassword} /> Show Password
                    </span>

                    <div class="mt-4 mb-4">
                        Already have an account?
                        <a href="/login" class="text-blue-500 hover:text-blue-800">
                            Login
                        </a>
                    </div>
                    <div class="flex items-center justify-center mb-4">
                        <button class="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline" type="submit">
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
