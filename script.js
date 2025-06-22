
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
  alert("Cliente cadastrado!");
};

window.cadastrarServico = async () => {
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  if (!descricao || isNaN(valor)) return alert("Preencha todos os campos!");
  await addDoc(collection(db, "servicos"), { descricao, valor, criadoEm: serverTimestamp() });
  alert("Serviço cadastrado!");
};

window.gerarOrcamento = async () => {
  const clienteId = document.getElementById('clienteId').value;
  const servicoId = document.getElementById('servicoId').value;
  const forma = document.getElementById('pagamento').value;
  const taxa = 20;

  const clientes = await getDocs(collection(db, "clientes"));
  const servicos = await getDocs(collection(db, "servicos"));

  const cliente = clientes.docs.find(doc => doc.id === clienteId)?.data();
  const servico = servicos.docs.find(doc => doc.id === servicoId)?.data();
  if (!cliente || !servico) return alert("IDs inválidos!");

  const total = parseFloat(servico.valor) + taxa;

  const texto = `
R.M. Estética Automotiva
Cliente: ${cliente.nome}
Telefone: ${cliente.telefone}
Serviço: ${servico.descricao}
Valor: R$ ${servico.valor.toFixed(2)}
Taxa: R$ ${taxa.toFixed(2)}
Forma: ${forma}
Total: R$ ${total.toFixed(2)}
Data: ${new Date().toLocaleString()}`;

  document.getElementById("cupom").innerText = texto;

  await addDoc(collection(db, "orcamentos"), {
    cliente: cliente.nome,
    telefone: cliente.telefone,
    servico: servico.descricao,
    valor: servico.valor,
    taxa,
    total,
    forma,
    criadoEm: serverTimestamp()
  });

  const link = `https://wa.me/55${cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
  window.open(link, "_blank");
};

window.addEventListener("load", async () => {
  const div = document.getElementById("lista-historico");
  const snap = await getDocs(collection(db, "orcamentos"));
  snap.forEach(doc => {
    const d = doc.data();
    const el = document.createElement("div");
    el.innerText = `${d.cliente} - ${d.servico} - R$ ${d.total}`;
    div.appendChild(el);
  });
});
