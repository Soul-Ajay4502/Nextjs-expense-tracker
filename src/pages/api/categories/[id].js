
import prisma from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { expenses: true },
    });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(400).json({ error: 'Error updating category' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.category.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: 'Error deleting category' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
