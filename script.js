import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://zkdfimbfwgofkmmcvyfu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZGZpbWJmd2dvZmttbWN2eWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzQxMTksImV4cCI6MjA2NjIxMDExOX0.vOTrEVYX30FpWPQykY5CF1QCfkyG5gDLnI_2N9TATRE'
);

window.cadastrarCliente = async () => {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !telefone) {
    alert("Preencha todos os campos!");
    return;
  }

  const { error } = await supabase.from('clientes').insert({ nome, telefone });

  if (error) {
    alert("Erro ao salvar cliente: " + error.message);
  } else {
    alert('Cliente salvo com sucesso!');
    carregarClientes();
  }
};

window.cadastrarServico = async () => {
  const descricao = document.getElementById('descricao').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);

  if (!descricao || isNaN(valor)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const { error } = await supabase.from('servicos').insert({ descricao, valor });

  if (error) {
    alert("Erro ao salvar serviço: " + error.message);
  } else {
    alert('Serviço salvo com sucesso!');
    carregarServicos();
  }
};

window.gerarOrcamento = async () => {
  const clienteId = document.getElementById('clienteSelect').value;
  const servicoId = document.getElementById('servicoSelect').value;
  const forma = document.getElementById('formaPagamento').value;

  if (!clienteId || !servicoId) {
    alert("Selecione cliente e serviço.");
    return;
  }

  const { data: cliente, error: errCli } = await supabase.from('clientes').select().eq('id', clienteId).single();
  const { data: servico, error: errServ } = await supabase.from('servicos').select().eq('id', servicoId).single();

  if (errCli || errServ) {
    alert("Erro ao buscar dados: " + (errCli?.message || errServ?.message));
    return;
  }

  const taxa = 20;
  const total = parseFloat(servico.valor) + taxa;

  const cupom = `
=============================
    R.M. Estética Automotiva
=============================
Cliente: ${cliente.nome}
Serviço: ${servico.descricao}
Valor: R$ ${servico.valor.toFixed(2)}
Taxa: R$ ${taxa.toFixed(2)}
Total: R$ ${total.toFixed(2)}
Forma de Pagamento: ${forma}
=============================
  `;

  document.getElementById('cupom').innerText = cupom;

  const { error } = await supabase.from('orcamentos').insert({
    cliente: cliente.nome,
    telefone: cliente.telefone,
    servico: servico.descricao,
    valor: servico.valor,
    taxa,
    total,
    forma
  });

  if (error) {
    alert("Erro ao salvar orçamento: " + error.message);
  } else {
    carregarHistorico();
    // Enviar para WhatsApp
    const numero = cliente.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(cupom)}`, '_blank');
  }
};

async function carregarClientes() {
  const sel = document.getElementById('clienteSelect');
  sel.innerHTML = '<option value="">Selecione um cliente</option>';

  const { data, error } = await supabase.from('clientes').select();

  if (error) {
    alert("Erro ao carregar clientes: " + error.message);
    return;
  }

  data.forEach(c => sel.add(new Option(c.nome, c.id)));
}

async function carregarServicos() {
  const sel = document.getElementById('servicoSelect');
  sel.innerHTML = '<option value="">Selecione um serviço</option>';

  const { data, error } = await supabase.from('servicos').select();

  if (error) {
    alert("Erro ao carregar serviços: " + error.message);
    return;
  }

  data.forEach(s => sel.add(new Option(s.descricao, s.id)));
}

async function carregarHistorico() {
  const div = document.getElementById('listaHistorico');
  div.innerHTML = '';

  const { data, error } = await supabase.from('orcamentos').select().order('criado_em', { ascending: false });

  if (error) {
    alert("Erro ao carregar histórico: " + error.message);
    return;
  }

  data.forEach(o => {
    div.innerHTML += `<p>${o.cliente} - ${o.servico} - R$ ${o.total.toFixed(2)}</p>`;
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

