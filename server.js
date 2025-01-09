const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

let profits = {};  // Aqui vamos armazenar os lucros por `userId` e `planId` para fins de exemplo

// Rota para salvar o lucro
app.post("/api/profit", (req, res) => {
    const { userId, planId, profit, startTime } = req.body;

    if (!userId || !planId || profit === undefined) {
        return res.status(400).json({ message: "Faltando parâmetros obrigatórios" });
    }

    // Salva o lucro no "banco de dados" (usando um objeto simples aqui, mas você pode usar um banco real)
    if (!profits[userId]) {
        profits[userId] = {};
    }

    profits[userId][planId] = { profit, startTime };

    res.json({ message: "Lucro salvo com sucesso!" });
});

// Rota para recuperar os lucros
app.get("/api/profit", (req, res) => {
    const userId = req.query.userId;
    const planId = req.query.planId;

    if (!userId || !planId) {
        return res.status(400).json({ message: "Faltando parâmetros obrigatórios" });
    }

    // Recupera o lucro armazenado
    const userProfit = profits[userId] && profits[userId][planId];
    if (userProfit) {
        return res.json(userProfit);
    } else {
        return res.json({ profit: 0 });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
