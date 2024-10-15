
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    try {
      const category = await prisma.category.create({
        data: { name },
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: 'Error creating category' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
