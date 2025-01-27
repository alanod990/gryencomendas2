const express = require("express");

const app = express();
const PORT = 3000;

// Middleware para lidar com JSON
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// mongo

const mongoose = require("mongoose");

// Substitua pela sua string de conexão do MongoDB Atlas
const MONGO_URL = "mongodb+srv://alanodx:ccwe7aqx55@gryencomenda.2g31h.mongodb.net/?retryWrites=true&w=majority&appName=gryencomenda";

// Conectando ao MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch((error) => console.error("Erro ao conectar ao MongoDB:", error));

// Rota

const Encomenda = require("./models/Encomenda");

// Rota para criar uma nova encomenda
app.post("/encomendas", async (req, res) => {
  try {
    const { cliente, produto, quantidade } = req.body;

    // Validação básica
    if (!cliente || !produto || !quantidade) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
    }

    // Criando a encomenda
    const novaEncomenda = new Encomenda({
      cliente,
      produto,
      quantidade,
    });

    // Salvando no MongoDB
    await novaEncomenda.save();

    res.status(201).json(novaEncomenda);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar encomenda", detalhes: error.message });
  }
});
