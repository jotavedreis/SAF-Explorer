# SAF Explorer

O **SAF Explorer** é um site feito para organizar e consultar informações sobre **Sistemas Agroflorestais (SAFs)**. A aplicação reúne um catálogo de espécies, funções ecológicas das plantas, relações entre espécies e um painel visual sobre química do solo, nutrientes, pH e sintomas de deficiência nutricional.

A ideia do projeto é facilitar a consulta tanto para estudo quanto para manejo em campo, deixando os dados em uma interface clara, responsiva e fácil de atualizar.

## Preview do projeto

Use os espaços abaixo para adicionar prints do site. Você pode criar uma pasta `public/screenshots` e salvar as imagens com os nomes sugeridos.

### Página inicial

![Print da página inicial](./public/screenshots/home.png)

### Catálogo de espécies

![Print do catálogo de espécies](./public/screenshots/especies.png)

### Painel de solo

![Print do painel de solo](./public/screenshots/solo.png)

### Área administrativa

![Print da área administrativa](./public/screenshots/admin.png)

## Funcionalidades

- Página inicial com apresentação do projeto e atalhos para as áreas principais.
- Catálogo público de plantas agroflorestais.
- Busca de espécies por nome popular ou científico.
- Filtro de espécies por função ecológica.
- Modal com detalhes da planta, categoria, foto, explicação e relações com outras espécies.
- Painel de química do solo com nutrientes, sintomas de deficiência e fontes naturais.
- Controle visual de pH para comparar disponibilidade de nutrientes.
- Diagnóstico visual para relacionar sintomas observados com possíveis nutrientes deficientes.
- Área administrativa protegida por login.
- Cadastro e gerenciamento de espécies, categorias, funções, relações, nutrientes, pontos de pH e sintomas visuais.
- Integração com Supabase para armazenamento, autenticação e consulta dos dados.

## Tecnologias e linguagens usadas

Este projeto foi desenvolvido com:

- **TypeScript**: linguagem principal do projeto, usada para criar componentes, páginas e regras com tipagem.
- **TSX / React**: construção das interfaces reutilizáveis do site.
- **Next.js**: framework usado para rotas, renderização, páginas server-side e organização da aplicação.
- **CSS**: estilização global e estilos específicos das páginas.
- **Tailwind CSS**: utilitários de estilo usados diretamente nos componentes.
- **Supabase**: banco de dados, autenticação e acesso aos dados do catálogo.
- **Zod**: validação de dados nos formulários e ações.
- **ESLint**: padronização e verificação de qualidade do código.

## Estrutura do projeto

```txt
SAF-Explorer/
├── app/
│   ├── admin/        # Área administrativa e formulários de gestão
│   ├── especies/     # Catálogo público de espécies
│   ├── solo/         # Painel de química do solo
│   ├── styles/       # Arquivos CSS organizados por área
│   ├── globals.css   # Estilos globais
│   ├── layout.tsx    # Layout principal da aplicação
│   └── page.tsx      # Página inicial
├── lib/
│   ├── errors/       # Tratamento de erros
│   ├── supabase/     # Clientes Supabase do navegador, servidor e admin
│   └── validation/   # Validações com Zod
├── public/           # Arquivos públicos, imagens e futuros prints
├── proxy.ts          # Proteção das rotas administrativas
├── package.json      # Scripts e dependências
└── README.md
```

## Banco de dados

O projeto usa o Supabase para armazenar e consultar dados relacionados a:

- espécies;
- categorias;
- funções ecológicas;
- relações entre plantas;
- nutrientes;
- pontos de pH;
- disponibilidade de nutrientes;
- sintomas visuais;
- autenticação da área administrativa.

As páginas públicas consultam os dados com a chave anônima do Supabase. A área administrativa usa autenticação e operações protegidas no servidor.

## Objetivo do projeto

O SAF Explorer foi criado para ser uma ferramenta digital de apoio ao estudo e manejo agroflorestal. Ele ajuda a visualizar como espécies, nutrientes, funções ecológicas e condições do solo se conectam, tornando as informações mais acessíveis para planejamento, aprendizado e tomada de decisão.

## Autor

Desenvolvido por **João Vitor Reis**.
