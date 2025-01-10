const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

const PORT = 5000;
const DATA_FILE = "profits.json";

// Middleware para parsear JSON
app.use(bodyParser.json());

// Função para carregar dados do arquivo
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    }
    return {}; // Retorna um objeto vazio se o arquivo não existir
}

// Função para salvar dados no arquivo
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Rota POST para salvar lucros
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const data = loadData();

    // Verifica se o usuário existe
    if (!data[userId]) {
        data[userId] = {};
    }

    // Salva os lucros do plano
    data[userId][planId] = { profit, startTime };

    saveData(data);

    res.status(200).json({ message: "Dados salvos com sucesso" });
});

// Rota GET para recuperar lucros
app.get("/api/profit", (req, res) => {
    const { userId, planId } = req.query;

    if (!userId || !planId) {
        return res.status(400).json({ message: "userId e planId são obrigatórios" });
    }

    const data = loadData();

    // Retorna os lucros do usuário e plano especificado
    if (data[userId] && data[userId][planId]) {
        return res.status(200).json(data[userId][planId]);
    }

    res.status(404).json({ message: "Dados não encontrados" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
