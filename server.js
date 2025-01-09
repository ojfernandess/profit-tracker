const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const PROFITS_FILE = "./profits.json";

// Função para carregar os lucros do arquivo JSON
function loadProfits() {
    if (fs.existsSync(PROFITS_FILE)) {
        return JSON.parse(fs.readFileSync(PROFITS_FILE));
    }
    return {};
}

// Função para salvar os lucros no arquivo JSON
function saveProfits(data) {
    fs.writeFileSync(PROFITS_FILE, JSON.stringify(data, null, 2));
}

// Endpoint para salvar os lucros
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit } = req.body;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const profits = loadProfits();

    // Atualiza ou cria os lucros para o usuário e plano
    if (!profits[userId]) {
        profits[userId] = {};
    }
    profits[userId][planId] = profit;

    saveProfits(profits);

    res.json({ message: "Lucros salvos com sucesso", profits: profits[userId] });
});

// Endpoint para buscar lucros
app.get("/api/profit", (req, res) => {
    const { userId, planId } = req.query;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const profits = loadProfits();
    const userProfits = profits[userId] || {};
    const profit = userProfits[planId] || 0;

    res.json({ profit });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
