import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { index, deleted } = req.body;
  const filePath = path.join(process.cwd(), 'products.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Ошибка чтения продуктов' });

    const products = JSON.parse(data);
    if (!products[index]) return res.status(400).json({ error: 'Товар не найден' });

    products[index].deleted = deleted;

    fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Ошибка сохранения продукта' });
      res.status(200).json({ ok: true });
    });
  });
}
