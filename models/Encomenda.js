const mongoose = require("mongoose");

// Subschema para Status dentro de Items
const statusSchema = new mongoose.Schema({
  Etapa: { type: String, required: true },
  Data: { type: Date, required: true },
});

// Subschema para Items
const itemSchema = new mongoose.Schema({
  Escola: { type: String, required: true },
  Peca: { type: String, required: true },
  Genero: { type: String, required: true },
  Tamanho: { type: String, required: true },
  Status: [statusSchema], // Array de status
  Observacoes: { type: String, default: null },
});

// Subschema para Pagamento
const pagamentoSchema = new mongoose.Schema({
  Status: { type: Boolean, required: true },
  DataPagamento: { type: Date, required: true },
  Metodo: { type: String, required: true },
});

// Modelo principal de Encomenda
const encomendaSchema = new mongoose.Schema({
  Responsavel: {
    Nome: { type: String, required: true },
    Telefone: { type: String, required: true },
  },
  DataCriacao: { type: Date, required: true },
  DataConclusao: { type: Date, default: null },
  Pagamento: pagamentoSchema,
  Observacoes: { type: String, default: null },
  Items: [itemSchema], // Array de itens
});

// Exportando o modelo de Encomenda
const Encomenda = mongoose.model("Encomenda", encomendaSchema);

module.exports = Encomenda;
