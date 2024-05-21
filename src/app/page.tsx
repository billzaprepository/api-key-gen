"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import withAuth from './components/withAuth';

interface Usuario {
  id: number;
  usuario: string;
  chave_api: string;
  data_validade: string;
}

const Home = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [newUsuario, setNewUsuario] = useState('');
  const [newDataValidade, setNewDataValidade] = useState('');
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUsuario = async () => {
    try {
      await axios.post('/api/usuarios', {
        usuario: newUsuario,
        data_validade: newDataValidade,
      });
      fetchUsuarios();
      setNewUsuario('');
      setNewDataValidade('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUsuario = async () => {
    if (window.confirm('Você tem certeza que deseja salvar as alterações?')) {
      try {
        if (editUsuario) {
          await axios.put('/api/usuarios', {
            id: editUsuario.id,
            usuario: editUsuario.usuario,
            data_validade: editUsuario.data_validade,
          });
          fetchUsuarios();
          setEditUsuario(null);
        }
      } catch (error) {
        console.error('Error editing user:', error);
      }
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    if (window.confirm('Você tem certeza que deseja excluir esta chave?')) {
      try {
        await axios.delete('/api/usuarios', { data: { id } });
        fetchUsuarios();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleRenewUsuario = async (id: number, currentUsuario: string, currentDate: string) => {
    if (window.confirm('Você tem certeza que deseja renovar esta chave?')) {
      try {
        const newDate = dayjs(currentDate).add(1, 'month').format('YYYY-MM-DD');
        await axios.put('/api/usuarios', {
          id,
          usuario: currentUsuario,
          data_validade: newDate,
        });
        fetchUsuarios();
      } catch (error) {
        console.error('Error renewing user:', error);
      }
    }
  };

  const handleCopyChave = async (chaveApi: string) => {
    try {
      await navigator.clipboard.writeText(chaveApi);
      alert('Chave copiada para o clipboard!');
    } catch (error) {
      console.error('Error copying API key:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8">BILLZAP KEYS</h1>

      <div className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Adicionar Usuário</h2>
        <input
          type="text"
          value={newUsuario}
          onChange={(e) => setNewUsuario(e.target.value)}
          placeholder="Nome do Usuário"
          className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
        />
        <input
          type="date"
          value={newDataValidade}
          onChange={(e) => setNewDataValidade(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
        />
        <button
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={handleAddUsuario}
        >
          Adicionar
        </button>
      </div>

      <ul className="w-full max-w-2xl bg-gray-800 shadow-md rounded-lg p-4 mb-8 space-y-4">
        {usuarios.map((usuario: Usuario) => (
          <li key={usuario.id} className="p-4 border-b border-gray-700">
            <div className="mb-2">
              <span className="font-semibold">Nome:</span> {usuario.usuario}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Chave:</span> {usuario.chave_api}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Vencimento:</span> {dayjs(usuario.data_validade).format('DD/MM/YYYY')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setEditUsuario(usuario)}
              >
                Editar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => handleDeleteUsuario(usuario.id)}
              >
                Excluir
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={() => handleRenewUsuario(usuario.id, usuario.usuario, usuario.data_validade)}
              >
                Renovar
              </button>
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                onClick={() => handleCopyChave(usuario.chave_api)}
              >
                Copiar chave
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editUsuario && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
            <input
              type="text"
              value={editUsuario.usuario}
              onChange={(e) => setEditUsuario({ ...editUsuario, usuario: e.target.value })}
              placeholder="Nome do Usuário"
              className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
            />
            <input
              type="date"
              value={editUsuario.data_validade}
              onChange={(e) => setEditUsuario({ ...editUsuario, data_validade: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-700 rounded-md bg-gray-700 text-gray-100"
            />
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-4"
              onClick={handleEditUsuario}
            >
              Salvar
            </button>
            <button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setEditUsuario(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default withAuth(Home);
