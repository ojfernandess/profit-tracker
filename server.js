const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./profits.json";

// Middleware
app.use(bodyParser.json());

// Carregar dados do arquivo JSON
let data = {};
if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Endpoint para salvar dados (POST)
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const key = `${userId}-${planId}`;
    data[key] = { profit, startTime };

    // Salvar os dados no arquivo
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    console.log(`Dados salvos para ${key}:`, data[key]);

    res.json({ message: "Dados salvos com sucesso" });
});

// **NOVO** Endpoint para recuperar dados (GET)
app.get("/api/profit", (req, res) => {
    const { userId, planId } = req.query;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const key = `${userId}-${planId}`;
    const profitData = data[key];

    if (!profitData) {
        return res.status(404).json({ message: "Dados não encontrados para este usuário e plano" });
    }

    res.json(profitData);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
