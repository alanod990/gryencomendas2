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
    const {
      Responsavel,
      DataCriacao,
      DataConclusao,
      Pagamento,
      Observacoes,
      Items,
    } = req.body;

    // Validação básica
    if (!Responsavel || !Responsavel.Nome || !Responsavel.Telefone || !DataCriacao || !Pagamento || !Items || !Items.length) {
      return res.status(400).json({ erro: "Dados obrigatórios estão ausentes!" });
    }

    // Criando a nova encomenda
    const novaEncomenda = new Encomenda({
      Responsavel,
      DataCriacao,
      DataConclusao,
      Pagamento,
      Observacoes,
      Items,
    });

    // Salvando no banco
    await novaEncomenda.save();

    res.status(201).json(novaEncomenda);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar encomenda", detalhes: error.message });
  }
});

// Rota para listar encomendas com filtros e ordenação
app.get("/encomendas", async (req, res) => {
  try {
    const { responsavel, dataInicio, dataFim, ordenacao, status } = req.query;

    // Filtros dinâmicos
    let filtros = {};

    if (responsavel) {
      filtros["Responsavel.Nome"] = { $regex: responsavel, $options: "i" }; // Busca pelo nome do responsável (case insensitive)
    }

    if (dataInicio || dataFim) {
      filtros.DataCriacao = {};
      if (dataInicio) filtros.DataCriacao.$gte = new Date(dataInicio);
      if (dataFim) filtros.DataCriacao.$lte = new Date(dataFim);
    }

    if (status) {
      filtros["Items.Status.Etapa"] = { $regex: status, $options: "i" }; // Busca pelo status dos itens
    }

    // Ordenação
    let ordenacaoObj = {};
    if (ordenacao) {
      const [campo, ordem] = ordenacao.split(":"); // Exemplo: "DataCriacao:asc" ou "DataCriacao:desc"
      ordenacaoObj[campo] = ordem === "desc" ? -1 : 1;
    }

    // Busca com filtros e ordenação
    const encomendas = await Encomenda.find(filtros).sort(ordenacaoObj);

    res.status(200).json(encomendas); // Retorna as encomendas filtradas e ordenadas
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar encomendas", detalhes: error.message });
  }
});



// Rota para buscar uma encomenda específica pelo ID
app.get("/encomendas/:id", async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    const encomenda = await Encomenda.findById(id); // Busca a encomenda pelo ID no banco

    if (!encomenda) {
      return res.status(404).json({ erro: "Encomenda não encontrada!" }); // Se não encontrar, retorna erro 404
    }

    res.status(200).json(encomenda); // Retorna a encomenda encontrada
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar encomenda", detalhes: error.message });
  }
});


// Rota para atualizar uma encomenda pelo ID
app.put("/encomendas/:id", async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    const dadosAtualizados = req.body; // Dados enviados no corpo da requisição

    // Atualiza a encomenda pelo ID
    const encomendaAtualizada = await Encomenda.findByIdAndUpdate(id, dadosAtualizados, {
      new: true, // Retorna a encomenda atualizada
      runValidators: true, // Aplica as validações do modelo
    });

    // Verifica se a encomenda foi encontrada
    if (!encomendaAtualizada) {
      return res.status(404).json({ erro: "Encomenda não encontrada!" });
    }

    res.status(200).json(encomendaAtualizada); // Retorna a encomenda atualizada
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar encomenda", detalhes: error.message });
  }
});


// Rota para excluir uma encomenda pelo ID
app.delete("/encomendas/:id", async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL

    // Tenta deletar a encomenda pelo ID
    const encomendaDeletada = await Encomenda.findByIdAndDelete(id);

    // Verifica se a encomenda foi encontrada e deletada
    if (!encomendaDeletada) {
      return res.status(404).json({ erro: "Encomenda não encontrada!" });
    }

    res.status(200).json({ mensagem: "Encomenda excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir encomenda", detalhes: error.message });
  }
});
