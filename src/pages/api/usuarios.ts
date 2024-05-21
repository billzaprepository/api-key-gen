import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { rows: usuarios } = await sql`SELECT * FROM usuarios`;
    return res.status(200).json(usuarios);
  }

  if (req.method === 'POST') {
    const { usuario, data_validade } = req.body;
    const chave_api = `${generateRandomString(5)}-${generateRandomString(5)}-${generateRandomString(5)}-${generateRandomString(5)}`;

    await sql`
      INSERT INTO usuarios (usuario, chave_api, data_validade)
      VALUES (${usuario}, ${chave_api}, ${data_validade})
    `;
    
    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  }

  if (req.method === 'PUT') {
    const { id, usuario, data_validade } = req.body;

    await sql`
      UPDATE usuarios
      SET usuario = ${usuario}, data_validade = ${data_validade}
      WHERE id = ${id}
    `;
    
    return res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;

    await sql`
      DELETE FROM usuarios
      WHERE id = ${id}
    `;
    
    return res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

function generateRandomString(length: number) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}
