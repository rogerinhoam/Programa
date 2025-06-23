import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://zkdfimbfwgofkmmcvyfu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZGZpbWJmd2dvZmttbWN2eWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzQxMTksImV4cCI6MjA2NjIxMDExOX0.vOTrEVYX30FpWPQykY5CF1QCfkyG5gDLnI_2N9TATRE'
);

// --- Clientes ---

async function listarClientes() {
  const div = document.getElementById('listaClientes');
  div.innerHTML = 'Carregando clientes...';
  const { data, error } = await supabase.from('clientes').select().order('nome');
  if (error) {
    div.innerHTML = `Erro: ${error.message}`;
    return;
  }
  if (!data.length) {
    div.innerHTML = 'Nenhum cliente cadastrado.';
    return;
  }
  div.innerHTML = '';
  data.forEach(cliente => {
    const el = document.createElement('div');
    el.className = 'entrada-lista';
    el.innerHTML = `
      <div class="entrada-texto">${cliente.nome} - ${cliente.telefone}</div>
      <button class="btn-editar" onclick="editarCliente('${cliente.id}', '${cliente.nome}', '${cliente.telefone}')">Editar</button>
      <button class="btn-excluir" onclick="excluirCliente('${cliente.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.salvarCliente = async () => {
  const id = document.getElementById('clienteId').value;
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !telefone) {
    alert('Preencha todos os campos!');
    return;
  }

  if (id) {
    const { error } = await supabase.from('clientes').update({ nome, telefone }).eq('id', id);
    if (error) {
      alert('Erro ao atualizar cliente: ' + error.message);
      return;
    }
    alert('Cliente atualizado!');
  } else {
    const { error } = await supabase.from('clientes').insert({ nome, telefone });
    if (error) {
      alert('Erro ao salvar cliente: ' + error.message);
      return;
    }
    alert('Cliente salvo!');
  }

  limparFormCliente();
  listarClientes();
  carregarClientesNoOrcamento();
};

window.editarCliente = (id, nome, telefone) => {
  document.getElementById('clienteId').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('telefone').value = telefone;
};

window.excluirCliente = async (id) => {
  if (!confirm('Quer mesmo excluir este cliente?')) return;
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  if (error) {
    alert('Erro ao excluir cliente: ' + error.message);
    return;
  }
  alert('Cliente excluído!');
  listarClientes();
  carregarClientesNoOrcamento();
};

// --- Serviços ---

async function listarServicos() {
  const div = document.getElementById('listaServicos');
  div.innerHTML = 'Carregando serviços...';
  const { data, error } = await supabase.from('servicos').select().order('descricao');
  if (error) {
    div.innerHTML = `Erro: ${error.message}`;
    return;
  }
  if (!data.length) {
    div.innerHTML = 'Nenhum serviço cadastrado.';
    return;
  }
  div.innerHTML = '';
  data.forEach(servico => {
    const el = document.createElement('div');
    el.className = 'entrada-lista';
    el.innerHTML = `
      <div class="entrada-texto">${servico.descricao} - R$ ${servico.valor.toFixed(2)}</div>
      <button class="btn-editar" onclick="editarServico('${servico.id}', '${servico.descricao}', ${servico.valor})">Editar</button>
      <button class="btn-excluir" onclick="excluirServico('${servico.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.salvarServico = async () => {
  const id = document.getElementById('servicoId').value;
  const descricao = document.getElementById('descricao').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);

  if (!descricao || isNaN(valor)) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  if (id) {
    const { error } = await supabase.from('servicos').update({ descricao, valor }).eq('id', id);
    if (error) {
      alert('Erro ao atualizar serviço: ' + error.message);
      return;
    }
    alert('Serviço atualizado!');
  } else {
    const { error } = await supabase.from('servicos').insert({ descricao, valor });
    if (error) {
      alert('Erro ao salvar serviço: ' + error.message);
      return;
    }
    alert('Serviço salvo!');
  }

  limparFormServico();
  listarServicos();
  carregarServicosNoOrcamento();
};

window.editarServico = (id, descricao, valor) => {
  document.getElementById('servicoId').value = id;
  document.getElementById('descricao').value = descricao;
  document.getElementById('valor').value = valor;
};

window.excluirServico = async (id) => {
  if (!confirm('Quer mesmo excluir este serviço?')) return;
  const { error } = await supabase.from('servicos').delete().eq('id', id);
  if (error) {
    alert('Erro ao excluir serviço: ' + error.message);
    return;
  }
  alert('Serviço excluído!');
  listarServicos();
  carregarServicosNoOrcamento();
};

// --- Orçamentos ---

async function listarOrcamentos() {
  const div = document.getElementById('listaOrcamentos');
  div.innerHTML = 'Carregando orçamentos...';
  const { data, error } = await supabase.from('orcamentos').select().order('criado_em', { ascending: false });
  if (error) {
    div.innerHTML = `Erro: ${error.message}`;
    return;
  }
  if (!data.length) {
    div.innerHTML = 'Nenhum orçamento cadastrado.';
    return;
  }
  div.innerHTML = '';
  data.forEach(o => {
    const dt = new Date(o.criado_em);
    const dtFormat = dt.toLocaleString('pt-BR');
    const el = document.createElement('div');
    el.className = 'entrada-lista';
    el.innerHTML = `
      <div class="entrada-texto">
        <b>${o.cliente}</b> - ${o.servico} - R$ ${o.total.toFixed(2)}<br/>
        <small>${dtFormat}</small><br/>
        <small>Pagamento: ${o.forma}</small>
      </div>
      <button class="btn-excluir" onclick="excluirOrcamento('${o.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.excluirOrcamento = async (id) => {
  if (!confirm('Quer mesmo excluir este orçamento?')) return;
  const { error } = await supabase.from('orcamentos').delete().eq('id', id);
  if (error) {
    alert('Erro ao excluir orçamento: ' + error.message);
    return;
  }
  alert('Orçamento excluído!');
  listarOrcamentos();
};

// --- Gerar Orçamento ---

async function carregarClientesNoOrcamento() {
  const sel = document.getElementById('clienteSelect');
  sel.innerHTML = '<option value="">Selecione um cliente</option>';
  const { data, error } = await supabase.from('clientes').select().order('nome');
  if (error) {
    alert('Erro ao carregar clientes: ' + error.message);
    return;
  }
  data.forEach(c => sel.add(new Option(c.nome, c.id)));
}

async function carregarServicosNoOrcamento() {
  const sel = document.getElementById('servicoSelect');
  sel.innerHTML = '<option value="">Selecione um serviço</option>';
  const { data, error } = await supabase.from('servicos').select().order('descricao');
  if (error) {
    alert('Erro ao carregar serviços: ' + error.message);
    return;
  }
  data.forEach(s => sel.add(new Option(s.descricao, s.id)));
}

window.gerarOrcamento = async () => {
  const clienteId = document.getElementById('clienteSelect').value;
  const servicoId = document.getElementById('servicoSelect').value;
  const forma = document.getElementById('formaPagamento').value;

  if (!clienteId || !servicoId) {
    alert('Selecione cliente e serviço.');
    return;
  }

  const { data: cliente, error: errCli } = await supabase.from('clientes').select().eq('id', clienteId).single();
  const { data: servico, error: errServ } = await supabase.from('servicos').select().eq('id', servicoId).single();

  if (errCli || errServ) {
    alert('Erro ao buscar dados: ' + (errCli?.message || errServ?.message));
    return;
  }

  const taxa = 20;
  const total = parseFloat(servico.valor) + taxa;

  const cupom = `
=============================
    R.M. Estética Automotiva
=============================
Cliente: ${cliente.nome}
Telefone: ${cliente.telefone}
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
    alert('Erro ao salvar orçamento: ' + error.message);
  } else {
    alert('Orçamento salvo!');
    listarOrcamentos();

    // Abrir WhatsApp para enviar cupom
    const telefoneLimpo = cliente.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(cupom)}`, '_blank');
  }
};

window.limparFormCliente = () => {
  document.getElementById('clienteId').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('telefone').value = '';
};

window.limparFormServico = () => {
  document.getElementById('servicoId').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
};

window.onload = () => {
  listarClientes();
  listarServicos();
  listarOrcamentos();
  carregarClientesNoOrcamento();
  carregarServicosNoOrcamento();
};

window.mostrarAba = (nome) => {
  document.querySelectorAll('.aba').forEach(sec => {
    sec.style.display = sec.id === nome ? 'block' : 'none';
  });
};
