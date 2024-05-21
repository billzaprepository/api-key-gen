import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas as origens. Para produção, especifique a origem exata.
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { chave } = req.query;

  if (Array.isArray(chave) || typeof chave !== 'string') {
    return res.status(400).json({ message: 'Chave inválida' });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM usuarios WHERE chave_api = ${chave};
    `;

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chave inválida' });
    }

    const chaveData = rows[0];
    const isExpired = dayjs().isAfter(dayjs(chaveData.data_validade));

    if (isExpired) {
      return res.status(201).json({ message: 'Chave vencida' });
    }

    return res.status(200).json({ message: 'Acesso liberado' });
  } catch (error) {
    console.error('Erro ao verificar a chave:', error);
    return res.status(500).json({ error: 'Erro ao verificar a chave' });
  }
}
