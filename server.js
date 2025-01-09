const express = require('express');
const app = express();
const port = 3000;

// Dados de exemplo (em produção, você deve usar um banco de dados)
let profitData = {};

// Middleware para permitir requisições CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obter o lucro
app.get('/api/profit', (req, res) => {
    const planId = req.query.planId;

    if (!planId) {
        return res.status(400).send('O planId é necessário.');
    }

    // Verifique se existe lucro salvo para o planId
    const profit = profitData[planId] || 0;

    res.json({ profit: profit.toFixed(2) });
});

// Endpoint para salvar o lucro
app.post('/api/profit', (req, res) => {
    const { planId, profit } = req.body;

    if (!planId || profit === undefined) {
        return res.status(400).send('PlanId e Profit são necessários.');
    }

    // Salva o lucro para o planId
    profitData[planId] = profit;

    res.status(200).send('Lucro salvo com sucesso!');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
