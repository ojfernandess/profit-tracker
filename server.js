const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "profits.json");

// Middleware
app.use(bodyParser.json());

// Função para carregar dados
function loadProfits() {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    }
    return {};
}

// Função para salvar dados
function saveProfits(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Endpoint para salvar lucro
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId || profit == null) {
        return res.status(400).json({ message: "Faltando parâmetros obrigatórios" });
    }

    const profits = loadProfits();

    if (!profits[userId]) {
        profits[userId] = {};
    }

    profits[userId][planId] = { profit, startTime };

    saveProfits(profits);

    res.json({ message: "Lucro salvo com sucesso", data: profits[userId][planId] });
});

// Endpoint para obter lucro
app.get("/api/profit", (req, res) => {
    const { userId, planId } = req.query;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const profits = loadProfits();

    if (profits[userId] && profits[userId][planId]) {
        return res.json(profits[userId][planId]);
    }

    res.json({ profit: 0 }); // Retorna 0 se não encontrar o registro
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
