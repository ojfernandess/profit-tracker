const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let profits = {}; // Um objeto para armazenar os lucros de forma simples

// Rota para obter o lucro de um plano
app.get('/api/profit', (req, res) => {
    const planId = req.query.planId;
    if (profits[planId]) {
        return res.json({ profit: profits[planId] });
    }
    return res.json({ profit: 0 });
});

// Rota para salvar o lucro de um plano
app.post('/api/profit', (req, res) => {
    const { planId, profit } = req.body;
    if (!planId || profit === undefined) {
        return res.status(400).send('Faltam parâmetros.');
    }
    profits[planId] = profit; // Salva o lucro
    return res.status(200).send('Lucro salvo com sucesso.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
