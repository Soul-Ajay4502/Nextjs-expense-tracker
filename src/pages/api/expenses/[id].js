import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } else if (req.method === 'PUT') {
    const { amount, description, categoryId, date } = req.body;
    try {
      const updatedExpense = await prisma.expense.update({
        where: { id: parseInt(id) },
        data: { amount, description, categoryId, date: new Date(date) },
      });
      res.status(200).json(updatedExpense);
    } catch (error) {
      res.status(400).json({ error: 'Error updating expense' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.expense.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: 'Error deleting expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
