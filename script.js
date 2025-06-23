import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://zkdfimbfwgofkmmcvyfu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZGZpbWJmd2dvZmttbWN2eWZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYzNDExOSwiZXhwIjoyMDY2MjEwMTE5fQ.Hc60LYhUdJlgLvbp7OysxX67jxjCamJpdIneA_xhwcw'
);

window.cadastrarCliente = async () => {
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  if (!nome || !telefone) return alert("Preencha todos os campos!");
  await supabase.from('clientes').insert({ nome, telefone });
  alert('Cliente salvo!');
  carregarClientes();
};

window.cadastrarServico = async () => {
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  if (!descricao || isNaN(valor)) return alert("Preencha todos os campos!");
  await supabase.from('servicos').insert({ descricao, valor });
  alert('Serviço salvo!');
  carregarServicos();
};

window.gerarOrcamento = async () => {
  const clienteId = document.getElementById('clienteSelect').value;
  const servicoId = document.getElementById('servicoSelect').value;
  const forma = document.getElementById('formaPagamento').value;

  const cliente = await supabase.from('clientes').select().eq('id', clienteId).single();
  const servico = await supabase.from('servicos').select().eq('id', servicoId).single();

  const taxa = 20;
  const total = parseFloat(servico.data.valor) + taxa;

  const cupom = `
=============================
    R.M. Estética Automotiva
=============================
Cliente: ${cliente.data.nome}
Serviço: ${servico.data.descricao}
Valor: R$ ${servico.data.valor.toFixed(2)}
Taxa: R$ ${taxa.toFixed(2)}
Total: R$ ${total.toFixed(2)}
Forma de Pagamento: ${forma}
=============================
  `;

  document.getElementById('cupom').innerText = cupom;

  await supabase.from('orcamentos').insert({
    cliente: cliente.data.nome,
    telefone: cliente.data.telefone,
    servico: servico.data.descricao,
    valor: servico.data.valor,
    taxa,
    total,
    forma
  });

  carregarHistorico();

  const numero = cliente.data.telefone.replace(/\D/g, '');
  window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(cupom)}`, '_blank');
};

async function carregarClientes() {
  const sel = document.getElementById('clienteSelect');
  sel.innerHTML = '<option value="">Selecione um cliente</option>';
  const { data } = await supabase.from('clientes').select();
  data.forEach(c => sel.add(new Option(c.nome, c.id)));
}

async function carregarServicos() {
  const sel = document.getElementById('servicoSelect');
  sel.innerHTML = '<option value="">Selecione um serviço</option>';
  const { data } = await supabase.from('servicos').select();
  data.forEach(s => sel.add(new Option(s.descricao, s.id)));
}

async function carregarHistorico() {
  const div = document.getElementById('listaHistorico');
  div.innerHTML = '';
  const { data } = await supabase.from('orcamentos').select().order('criado_em', { ascending: false });
  data.forEach(o => {
    div.innerHTML += `<p>${o.cliente} - ${o.servico} - R$ ${o.total}</p>`;
  });
}

window.testeSupabase = async () => {
  const { error } = await supabase.from('teste').insert({ mensagem: 'teste ok' });
  alert(error ? `Erro: ${error.message}` : 'Teste OK ✅');
};

window.onload = () => {
  carregarClientes();
  carregarServicos();
  carregarHistorico();
};

