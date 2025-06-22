
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqioC-oJl3_gRKiRgGP7uR826tera1SJ4",
  authDomain: "oficina-ab32d.firebaseapp.com",
  projectId: "oficina-ab32d",
  storageBucket: "oficina-ab32d.firebasestorage.app",
  messagingSenderId: "766713218232",
  appId: "1:766713218232:web:ed4eb5d5ff5b20b627a04d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.cadastrarCliente = async () => {
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  if (!nome || !telefone) return alert("Preencha todos os campos!");
  await addDoc(collection(db, "clientes"), { nome, telefone, criadoEm: serverTimestamp() });
  alert("✅ Cliente cadastrado!");
};

window.cadastrarServico = async () => {
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  if (!descricao || isNaN(valor)) return alert("Preencha todos os campos!");
  await addDoc(collection(db, "servicos"), { descricao, valor, criadoEm: serverTimestamp() });
  alert("✅ Serviço cadastrado!");
};

window.gerarOrcamento = async () => {
  const clienteId = document.getElementById('clienteId').value;
  const servicoId = document.getElementById('servicoId').value;
  const taxaBase = 20.0;

  const clientesSnap = await getDocs(collection(db, "clientes"));
  const servicosSnap = await getDocs(collection(db, "servicos"));
  const cliente = clientesSnap.docs.find(doc => doc.id === clienteId)?.data();
  const servico = servicosSnap.docs.find(doc => doc.id === servicoId)?.data();

  if (!cliente || !servico) return alert("ID de cliente ou serviço inválido");

  const total = parseFloat(servico.valor) + taxaBase;

  const orcamento = {
    cliente: cliente.nome,
    telefone: cliente.telefone,
    servico: servico.descricao,
    valorServico: servico.valor,
    taxaBase,
    total,
    criadoEm: serverTimestamp()
  };

  await addDoc(collection(db, "orcamentos"), orcamento);

  // Exibir cupom no console (poderá ser visual futuramente)
  console.log("🧾 CUPOM GERADO:");
  console.log(`Cliente: ${orcamento.cliente}`);
  console.log(`Serviço: ${orcamento.servico}`);
  console.log(`Valor Serviço: R$ ${orcamento.valorServico}`);
  console.log(`Taxa Base: R$ ${orcamento.taxaBase}`);
  console.log(`Total: R$ ${orcamento.total}`);

  // Link para WhatsApp
  const msg = `Olá ${orcamento.cliente}, aqui está seu orçamento da R.M. Estética Automotiva:\n` +
              `Serviço: ${orcamento.servico}\n` +
              `Valor: R$ ${orcamento.valorServico}\n` +
              `Taxa base: R$ ${orcamento.taxaBase}\n` +
              `Total: R$ ${orcamento.total}`;
  const whatsappLink = `https://wa.me/55${cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

  window.open(whatsappLink, '_blank');
  alert("✅ Orçamento gerado e enviado para o WhatsApp!");
};

// Histórico (exibe orçamentos)
window.addEventListener("load", async () => {
  const historicoDiv = document.getElementById("lista-historico");
  const snap = await getDocs(collection(db, "orcamentos"));
  snap.forEach(doc => {
    const d = doc.data();
    const item = document.createElement("div");
    item.innerHTML = `<strong>${d.cliente}</strong> - ${d.servico} - Total: R$ ${d.total}`;
    historicoDiv.appendChild(item);
  });
});
