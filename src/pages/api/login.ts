import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Change this to your own secret key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, senha } = req.body;

    try {
      const { rows } = await sql`
        SELECT * FROM login WHERE email = ${email} AND senha = ${senha};
      `;

      if (rows.length > 0) {
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error('Erro ao verificar as credenciais:', error);
      return res.status(500).json({ error: 'Erro ao verificar as credenciais' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
