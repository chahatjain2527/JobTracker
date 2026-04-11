import react, { useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name :"",
    email:"",
    password:""
  });

  const { name, email, password } = formData;
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      if(!name || !email || !password){
        // alert("Enter all values");
        setErrorMsg("Enter all values");
        return;
      }

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

    } catch (error) {
      console.log("Error in register",error.response);
      const message = error.response.data.message || "Something Went Wrong";
      // alert(error.response.data.message);
      setErrorMsg(message);
    }
  };

  return(
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={name} onChange={handleChange} placeholder="Enter Name" />
        <input type="text" name="email" value={email} onChange={handleChange} placeholder="Enter Email" />
        <input type="password" name="password" value={password} onChange={handleChange} placeholder="Enter Password" />
        <button type="submit">Register</button>
      </form>
      {errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}
    </div>
  );


};

export default Register;