require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const profits = {}; // Armazenamento em memória (substitua isso por um banco de dados real)

// Endpoint para obter lucro
app.get("/api/profit", (req, res) => {
    const { planId } = req.query;
    if (!planId) return res.status(400).send({ error: "PlanId é obrigatório." });
    const profit = profits[planId] || 0;
    res.send({ profit });
});

// Endpoint para salvar lucro
app.post("/api/profit", (req, res) => {
    const { planId, profit } = req.body;
    if (!planId || typeof profit !== "number") {
        return res.status(400).send({ error: "PlanId e Profit são obrigatórios." });
    }
    profits[planId] = profit;
    res.send({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
