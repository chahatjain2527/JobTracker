import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let userName = 'User';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded?.role?.toLowerCase() === 'admin';
      userName = decoded?.userName || 'User';
    } catch (error) {
      isAdmin = false;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 hidden">
            <span className="text-2xl">📋</span>
            <span className="text-xl font-semibold text-slate-900 hidden sm:inline">JobTracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Dashboard
            </Link>
            <Link to="/companies" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Companies
            </Link>
            <Link to="/addCompanies" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              Add Company
            </Link>
            {isAdmin && (<>
              <Link to="/users" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition">
                Users
              </Link>
              <Link to="/pendingCompanies" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition">
                Pending Companies
              </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{isAdmin ? 'Admin' : 'User'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile spacer so the menu button stays right-aligned when the logo is hidden */}
          <div className="md:hidden flex-1" />

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-slate-200 pt-4">
            <Link 
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              Dashboard
            </Link>
            <Link 
              to="/companies"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              Companies
            </Link>
            <Link 
              to="/addCompanies"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              Add Company
            </Link>
            {isAdmin && (<>
              <Link to="/users" onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" >
                  Users
              </Link>
              <Link to="/pendingCompanies" onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" >
                  Pending Companies
              </Link></>
            )}
            <div className="border-t border-slate-200 pt-4 mt-4 px-4">
              <p className="text-sm font-medium text-slate-900 mb-1">{userName}</p>
              <p className="text-xs text-slate-500 mb-3">{isAdmin ? 'Admin' : 'User'}</p>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
