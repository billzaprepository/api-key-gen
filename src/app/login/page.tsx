"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, senha });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Save token to local storage
        router.push('/');
      }
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900 text-gray-100">
      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
