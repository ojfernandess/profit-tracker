const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Conecte ao banco de dados MongoDB
mongoose.connect("mongodb://localhost:27017/profit-tracker", { useNewUrlParser: true, useUnifiedTopology: true });

// Defina o modelo para armazenar os lucros
const profitSchema = new mongoose.Schema({
    userId: String,
    planId: String,
    profit: Number,
    startTime: Number
});

const Profit = mongoose.model("Profit", profitSchema);

// Rota para salvar ou atualizar o lucro
app.post("/api/profit", async (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId || profit === undefined) {
        return res.status(400).json({ message: "Faltando parâmetros obrigatórios" });
    }

    try {
        // Atualiza ou cria um novo registro
        const result = await Profit.findOneAndUpdate(
            { userId, planId },
            { profit, startTime },
            { upsert: true, new: true }
        );
        res.json({ message: "Lucro salvo com sucesso!", data: result });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar lucro", error });
    }
});

// Rota para recuperar os lucros
app.get("/api/profit", async (req, res) => {
    const { userId, planId } = req.query;

    if (!userId || !planId) {
        return res.status(400).json({ message: "Faltando parâmetros obrigatórios" });
    }

    try {
        const result = await Profit.findOne({ userId, planId });
        if (result) {
            res.json(result);
        } else {
            res.json({ profit: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao recuperar lucro", error });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
