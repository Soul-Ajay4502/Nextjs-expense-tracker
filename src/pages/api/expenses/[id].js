import { db } from '../../../lib/firebase'; // Ensure this path is correct
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query; // Assuming id is the document ID in Firestore

  if (req.method === 'GET') {
    try {
      const expenseDoc = await getDoc(doc(db, 'expenses', id)); // Retrieve expense document
      if (expenseDoc.exists()) {
        res.status(200).json({ id: expenseDoc.id, ...expenseDoc.data() });
      } else {
        res.status(404).json({ error: 'Expense not found' });
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      res.status(500).json({ error: 'Error fetching expense' });
    }
  } else if (req.method === 'PUT') {
    const { amount, description, category, date } = req.body; // Get the updated expense data
    try {
      const expenseRef = doc(db, 'expenses', id); // Reference to the expense document
      await updateDoc(expenseRef, {
        amount,
        description,
        category,
        date: new Date(date), // Convert date string to Date object
      });
      res.status(200).json({ id, amount, description, category, date }); // Respond with the updated expense
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(400).json({ error: 'Error updating expense' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const expenseRef = doc(db, 'expenses', id); // Reference to the expense document
      await deleteDoc(expenseRef); // Delete the document from Firestore
      res.status(204).end(); // No content to send back
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(400).json({ error: 'Error deleting expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']); // Allowed methods
    res.status(405).end(`Method ${req.method} Not Allowed`); // Handle disallowed methods
  }
}
