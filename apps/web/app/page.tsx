// app/web/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from '@repo/common/types'; // Adjust the import path
import { ZodError } from 'zod';

export default function HomePage() {
  const router = useRouter();
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' }); // Changed identifier to email
  const [roomData, setRoomData] = useState({ slug: '' });
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState<string[]>([]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    try {
      // Validate signup data
      CreateUserSchema.parse(signupData);

      const response = await axios.post('http://localhost:3001/signup', signupData);
      alert('Signup successful! Please log in.');
      setSignupData({ username: '', email: '', password: '' });
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.errors.map((e) => e.message));
      } else {
        setError([err.response?.data?.message || 'Signup failed']);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    try {
      // Validate login data
      SigninSchema.parse(loginData);

      const response = await axios.post('http://localhost:3001/login', loginData); // Send email and password
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      alert('Login successful!');
      setLoginData({ email: '', password: '' });
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.errors.map((e) => e.message));
      } else {
        setError([err.response?.data?.message || 'Login failed']);
      }
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        throw new Error('Please log in first');
      }

      // Validate create room data
      CreateRoomSchema.parse(roomData);

      const response = await axios.post(
        'http://localhost:3001/create-room',
        { slug: roomData.slug, adminID: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Room created! Room ID: ${response.data.roomId}`);
      setRoomData({ slug: '' });
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.errors.map((e) => e.message));
      } else {
        setError([err.response?.data?.message || 'Failed to create room']);
      }
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    if (!joinRoomId) {
      setError(['Please enter a Room ID']);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError(['Please log in first']);
      return;
    }

    router.push(`/chat/${joinRoomId}`);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Chat App</h1>
        {error.length > 0 && (
          <div className="text-red-500 text-center">
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        {/* Signup Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Signup <span className="text-sm text-gray-500">(New User?)</span>
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Signup
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Login <span className="text-sm text-gray-500">(Returning User?)</span>
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          {localStorage.getItem('token') && (
            <div className="mt-4 text-center">
              <Link href="/rooms">
                <button className="text-blue-600 hover:underline">View Available Rooms</button>
              </Link>
            </div>
          )}
        </div>

        {/* Create Room Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Room</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <input
                type="text"
                value={roomData.slug}
                onChange={(e) => setRoomData({ ...roomData, slug: e.target.value })}
                placeholder="Room Name (Slug)"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Room
            </button>
          </form>
        </div>

        {/* Join Room Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Join Room</h2>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <input
                type="number"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Room ID"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}