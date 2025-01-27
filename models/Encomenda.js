const mongoose = require("mongoose");

const encomendaSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  produto: { type: String, required: true },
  quantidade: { type: Number, required: true },
  status: { type: String, default: "Pendente" },
  dataCriacao: { type: Date, default: Date.now },
});

const Encomenda = mongoose.model("Encomenda", encomendaSchema);

module.exports = Encomenda;
