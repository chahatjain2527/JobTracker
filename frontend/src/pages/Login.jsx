import React, { useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { email, password } = formData;
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!email || !password) {
                setErrorMsg("Enter all values")
                return;
            }
            const res = await api.post("/auth/login", {
                email,
                password,
            });
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                var decodeToken = jwtDecode(res.data.token);
                console.log("Decoded Token=>",decodeToken)
                // navigate("/dashboard");
                window.location.href = "/dashboard";
            }
        }
        catch (error) {

            console.log("Error in register", error.response);
            const message = error?.response?.data?.message || "Something Went Wrong";
            // alert(error.response.data.message);
            setErrorMsg(message);
        }

    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter Email" onChange={handleChange} value={email} name="email" />
                <input type="password" placeholder="Enter Password" onChange={handleChange} value={password} name="password" />
                <button type="submit">Login</button>
            </form>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </div>
    );
}

export default Login;