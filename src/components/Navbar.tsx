import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth()!;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Sports Card Tracker</Link>
        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <button onClick={logout} className="flex items-center hover:text-blue-200">
                <LogOut className="mr-1" size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;