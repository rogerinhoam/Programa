

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
    alert('Serviço salvo!');import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://zkdfimbfwgofkmmcvyfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua chave completa aqui
const supabase = createClient(supabaseUrl, supabaseKey);

// CADASTRO CLIENTE
document.getElementById('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;

  const { data, error } = await supabase.from('clientes').insert([{ nome, telefone }]);
  if (error) return alert('Erro ao salvar cliente');
  alert('Cliente salvo!');
  listarClientes();
  carregarClientesNoOrcamento();
  e.target.reset();
});

// LISTAGEM CLIENTES
async function listarClientes() {
  const { data, error } = await supabase.from('clientes').select('*');
  const container = document.getElementById('listaClientes');
  container.innerHTML = '';
  data.forEach((cliente) => {
    const div = document.createElement('div');
    div.className = 'p-2 bg-white border rounded flex justify-between';
    div.innerHTML = `<span>${cliente.nome} - ${cliente.telefone}</span>`;
    container.appendChild(div);
  });
}

async function carregarClientesNoOrcamento() {
  const { data } = await supabase.from('clientes').select('*');
  const select = document.getElementById('clienteSelect');
  select.innerHTML = '<option value=\"\">Selecione um cliente</option>';
  data.forEach(cli => {
    const opt = document.createElement('option');
    opt.value = cli.id;
    opt.textContent = cli.nome;
    select.appendChild(opt);
  });
}
