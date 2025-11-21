import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-ocean-teal mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-charcoal">Welcome Back</h2>
          <p className="text-gray-500">Login to access your dashboard.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 outline-none transition"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full bg-ocean-teal text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition shadow-md">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          New to GreenSort? <Link to="/register" className="text-ocean-teal font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;