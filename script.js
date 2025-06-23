import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://zkdfimbfwgofkmmcvyfu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZGZpbWJmd2dvZmttbWN2eWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MzQxMTksImV4cCI6MjA2NjIxMDExOX0.vOTrEVYX30FpWPQykY5CF1QCfkyG5gDLnI_2N9TATRE'
);

// --- CLIENTES ---

async function listarClientes() {
  const div = document.getElementById('listaClientes');
  div.innerHTML = 'Carregando...';
  const { data, error } = await supabase.from('clientes').select().order('nome');
  if (error) {
    div.innerHTML = 'Erro ao carregar clientes: ' + error.message;
    return;
  }
  if (!data.length) {
    div.innerHTML = 'Nenhum cliente cadastrado.';
    return;
  }
  div.innerHTML = '';
  data.forEach(c => {
    const el = document.createElement('div');
    el.className = 'entrada-lista';
    el.innerHTML = `
      <span>${c.nome} - ${c.telefone}</span>
      <button class="btn-editar" onclick="editarCliente('${c.id}', '${c.nome}', '${c.telefone}')">Editar</button>
      <button class="btn-excluir" onclick="excluirCliente('${c.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.salvarCliente = async () => {
  const id = document.getElementById('clienteId').value;
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !telefone) {
    alert("Preencha todos os campos!");
    return;
  }

  if (id) {
    // Atualizar
    const { error } = await supabase.from('clientes').update({ nome, telefone }).eq('id', id);
    if (error) {
      alert("Erro ao atualizar cliente: " + error.message);
      return;
    }
    alert("Cliente atualizado!");
  } else {
    // Inserir novo
    const { error } = await supabase.from('clientes').insert({ nome, telefone });
    if (error) {
      alert("Erro ao salvar cliente: " + error.message);
      return;
    }
    alert("Cliente salvo!");
  }

  document.getElementById('clienteId').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('telefone').value = '';
  listarClientes();
  listarOrcamentos(); // Atualiza histórico se cliente mudou
};

window.editarCliente = (id, nome, telefone) => {
  document.getElementById('clienteId').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('telefone').value = telefone;
};

window.excluirCliente = async (id) => {
  if (!confirm("Quer mesmo excluir esse cliente?")) return;
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  if (error) {
    alert("Erro ao excluir cliente: " + error.message);
    return;
  }
  alert("Cliente excluído!");
  listarClientes();
  listarOrcamentos();
};

// --- SERVIÇOS ---

async function listarServicos() {
  const div = document.getElementById('listaServicos');
  div.innerHTML = 'Carregando...';
  const { data, error } = await supabase.from('servicos').select().order('descricao');
  if (error) {
    div.innerHTML = 'Erro ao carregar serviços: ' + error.message;
    return;
  }
  if (!data.length) {
    div.innerHTML = 'Nenhum serviço cadastrado.';
    return;
  }
  div.innerHTML = '';
  data.forEach(s => {
    const el = document.createElement('div');
    el.className = 'entrada-lista';
    el.innerHTML = `
      <span>${s.descricao} - R$ ${s.valor.toFixed(2)}</span>
      <button class="btn-editar" onclick="editarServico('${s.id}', '${s.descricao}', ${s.valor})">Editar</button>
      <button class="btn-excluir" onclick="excluirServico('${s.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.salvarServico = async () => {
  const id = document.getElementById('servicoId').value;
  const descricao = document.getElementById('descricao').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);

  if (!descricao || isNaN(valor)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  if (id) {
    // Atualizar
    const { error } = await supabase.from('servicos').update({ descricao, valor }).eq('id', id);
    if (error) {
      alert("Erro ao atualizar serviço: " + error.message);
      return;
    }
    alert("Serviço atualizado!");
  } else {
    // Inserir novo
    const { error } = await supabase.from('servicos').insert({ descricao, valor });
    if (error) {
      alert("Erro ao salvar serviço: " + error.message);
      return;
    }
    alert("Serviço salvo!");
  }

  document.getElementById('servicoId').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  listarServicos();
  listarOrcamentos(); // Atualiza histórico se serviço mudou
};

window.editarServico = (id, descricao, valor) => {
  document.getElementById('servicoId').value = id;
  document.getElementById('descricao').value = descricao;
  document.getElementById('valor').value = valor;
};

window.excluirServico = async (id) => {
  if (!confirm("Quer mesmo excluir esse serviço?")) return;
  const { error } = await supabase.from('servicos').delete().eq('id', id);
  if (error) {
    alert("Erro ao excluir serviço: " + error.message);
    return;
  }
  alert("Serviço excluído!");
  listarServicos();
  listarOrcamentos();
};

// --- ORÇAMENTOS ---

async function listarOrcamentos() {
  const div = document.getElementById('listaOrcamentos');
  div.innerHTML = 'Carregando...';
  const { data, error } = await supabase.from('orcamentos').select().order('criado_em', { ascending: false });
  if (error) {
    div.innerHTML = 'Erro ao carregar orçamentos: ' + error.message;
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
      <span><b>${o.cliente}</b> - ${o.servico} - R$ ${o.total.toFixed(2)} <br><small>${dtFormat}</small></span>
      <button class="btn-excluir" onclick="excluirOrcamento('${o.id}')">Excluir</button>
    `;
    div.appendChild(el);
  });
}

window.excluirOrcamento = async (id) => {
  if (!confirm("Quer mesmo excluir esse orçamento?")) return;
  const { error } = await supabase.from('orcamentos').delete().eq('id', id);
  if (error) {
    alert("Erro ao excluir orçamento: " + error.message);
    return;
  }
  alert("Orçamento excluído!");
  listarOrcamentos();
};

// --- INICIALIZAÇÃO ---

window.onload = () => {
  listarClientes();
  listarServicos();
  listarOrcamentos();
};
