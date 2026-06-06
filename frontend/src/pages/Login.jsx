import React, { useState } from "react"
    import api from "../services/api"
import { Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { emailName, password } = formData;
    const [errorMsg, setErrorMsg] = useState("");
    const [loader, setLoader] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoader(true);
        try {
            if (!emailName || !password) {
                setLoader(false);
                setErrorMsg("Enter all values")
                return;
            }
            const res = await api.post("/auth/login", {
                emailName,
                password,
            });
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                window.location.href = "/dashboard";
            }
        }
        catch (error) {
            setLoader(false);
            const message = error?.response?.data?.message || "Something went wrong";
            setErrorMsg(message);
        }
        finally {
            setLoader(false);            
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h2 className="text-3xl font-semibold text-slate-900 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Email or User Name"
                        onChange={handleChange}
                        value={emailName}
                        name="emailName"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        value={password}
                        name="password"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
                    />
                    <button type="submit" disabled={loader} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-medium hover:bg-slate-700">{loader ? (<span className="spinner"></span>) : "Login"}</button>
                </form>
                {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
                <p className="mt-6 text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-slate-900 font-semibold">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
