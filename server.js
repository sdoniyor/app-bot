// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();

// app.use(express.json());
// app.use(express.static(__dirname));

// const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// // GET products
// app.get('/products', (req, res) => {
//   fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
//     if (err) return res.status(500).send({ error: 'Ошибка чтения продуктов' });
//     res.json(JSON.parse(data));
//   });
// });

// // POST update product
// app.post('/update-product', (req, res) => {
//   const { index, deleted } = req.body;

//   fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
//     if (err) return res.status(500).send({ error: 'Ошибка чтения продуктов' });

//     const products = JSON.parse(data);
//     if (!products[index]) return res.status(400).send({ error: 'Товар не найден' });

//     products[index].deleted = deleted;

//     fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), err => {
//       if (err) return res.status(500).send({ error: 'Ошибка сохранения продукта' });
//       res.json({ ok: true });
//     });
//   });
// });

// app.listen(3000, () => console.log('Server started on http://localhost:3000'));
