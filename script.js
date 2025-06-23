-- Tabela clientes
create table if not exists clientes (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  telefone text not null
);

-- Tabela servicos
create table if not exists servicos (
  id uuid default uuid_generate_v4() primary key,
  descricao text not null,
  valor numeric(10,2) not null
);

-- Tabela orcamentos
create table if not exists orcamentos (
  id uuid default uuid_generate_v4() primary key,
  cliente text not null,
  telefone text not null,
  servico text not null,
  valor numeric(10,2) not null,
  taxa numeric(10,2) not null,
  total numeric(10,2) not null,
  forma text not null,
  criado_em timestamp with time zone default now()
);
