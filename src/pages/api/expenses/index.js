import { db } from '../../../lib/firebase'; // Ensure this path is correct
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, orderBy('date', 'desc')); // Query expenses ordered by date
      const querySnapshot = await getDocs(q); // Get all documents from Firestore

      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json(expenses); // Return expenses in response
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Error fetching expenses' });
    }
  } else if (req.method === 'POST') {
    const { amount, description, category, date } = req.body; // Get data from request body
    try {
      const expense = await addDoc(collection(db, 'expenses'), {
        amount,
        description,
        category,
        date: new Date(date), // Convert date string to Date object
      });
      res.status(201).json({ id: expense.id, amount, description, category, date }); // Respond with created expense
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(400).json({ error: 'Error creating expense' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']); // Specify allowed methods
    res.status(405).end(`Method ${req.method} Not Allowed`); // Handle disallowed methods
  }
}
