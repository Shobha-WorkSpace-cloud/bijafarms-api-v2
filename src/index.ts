import express from 'express';
import expensesRouter from './expenses';
const app = express();

app.use('/expenses', expensesRouter);
app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
