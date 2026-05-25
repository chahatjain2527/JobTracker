import React, { useState } from "react"
import api from "../services/api"
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = formData;
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        setErrorMsg("Enter all values");
        return;
      }

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      login(res.data.token);
      navigate("/dashboard");

    } catch (error) {
      debugger;
      const message = error?.response?.data?.message || "Something went wrong";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
          />
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-700 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-medium hover:bg-slate-700">Register</button>
        </form>
        {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
        <p className="mt-6 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-slate-900 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
