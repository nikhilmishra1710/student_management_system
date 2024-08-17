import { useState } from "react";
// import class from './../../node_modules/sucrase/dist/parser/plugins/flow';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        type: "",
    });

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
        e.preventDefault();
        try {
            console.log(formData);
        } catch (error) {
            console.log("error occured");
        }
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
                            onChange={handleInput}
                        />
                    </div>
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
                                onChange={handleInput}
                            />
                        </span>
                    </div>
                    <span className="block text-gray-700 font-bold mb-2"><input type="checkbox" className="rounded-full" onClick={togglePassword}/>  Show Password</span>

                    <div class="mt-4 mb-4">
                        Already have an account? <a href="/login" class="text-blue-500 hover:text-blue-800">Login</a>
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
