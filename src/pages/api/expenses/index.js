import prisma from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const expenses = await prisma.expense.findMany({
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    res.status(200).json(expenses);
  } else if (req.method === 'POST') {
    const { amount, description, categoryId, date } = req.body;
    try {
      const expense = await prisma.expense.create({
        data: { amount, description, categoryId, date: new Date(date) },
      });
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: 'Error creating expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
