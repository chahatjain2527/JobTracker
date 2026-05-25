import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddCompanies from './pages/add-company'
import Companies from './pages/Companies'
import PendingCompanies from './pages/AdminPending'
import Navbar from './components/Navbar.jsx'
import Users from './pages/Users.jsx'

function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={
        token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={token ? <><Navbar /><Dashboard /></> : <Navigate to="/login" />} />
      <Route path="/addCompanies" element={token ? <><Navbar /><AddCompanies/></> : <Navigate to="/login" />} />
      <Route path="/companies" element={token ? <><Navbar /><Companies/></> : <Navigate to="/login" />} />
      <Route path="/users" element={token ? <><Navbar /><Users/></> : <Navigate to="/login" />} />
      <Route path="/pendingCompanies" element={token ? <><Navbar /><PendingCompanies/></> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
