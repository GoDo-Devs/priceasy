const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'seu_banco'
});

// Endpoint para criar um intervalo
app.post('/price-ranges', async (req, res) => {
  const { price_table_id, min_value, max_value, plans } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO price_ranges (price_table_id, min_value, max_value, planos)
       VALUES (?, ?, ?, ?)`,
      [price_table_id, min_value, max_value, JSON.stringify(plans)]
    );

    res.status(201).json({
      message: 'Faixa de preço criada com sucesso!',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao inserir:', error);
    res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
