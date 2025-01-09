app.get('/api/profit', (req, res) => {
    const planId = req.query.planId;  // Obtém o planId da URL
    if (!planId) {
        return res.status(400).send('O planId é necessário.');
    }

    // Aqui, você deve adicionar a lógica para buscar o lucro associado ao planId
    const profit = getProfitForPlan(planId);  // Exemplo de função para buscar o lucro do plano

    if (profit === undefined) {
        return res.status(404).send('Plano não encontrado.');
    }

    res.json({ profit: profit.toFixed(2) });  // Retorna o lucro com duas casas decimais
});

// Função de exemplo para obter o lucro de um plano específico
function getProfitForPlan(planId) {
    // Aqui você pode buscar o lucro no banco de dados ou memória
    // Exemplo simples de lucro fixo para um plano
    const profits = {
        "plan1": 100.00,
        "plan2": 200.00
    };

    return profits[planId];
}
