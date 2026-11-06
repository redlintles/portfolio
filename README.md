# Portfólio · João Paulo

Portfólio estático em **Next.js 16 + React 19 + TypeScript + Tailwind CSS 3**. Os estilos usam classes BEM e diretivas `@apply`. O build usa o Webpack integrado ao Next.js.

## Executar

Use Node.js 22 ou 24 LTS e npm. Versões experimentais do Node.js não fazem parte da configuração validada.

```sh
npm ci
npm run dev
```

Abra `http://localhost:3000/pt-BR/`. Há cinco tipos de página em português, inglês e espanhol: início, sobre, contatos, índice de projetos e detalhes. A raiz também mostra a Home em português.

## Reconstruir após editar JSON

```sh
npm run rebuild
npm run preview
```

`rebuild` valida conteúdo e gera todo o site em `out/`. Não é necessário modificar código para editar textos ou cadastrar projetos. O modo `dev` é adequado ao desenvolvimento; após alterações em arquivos lidos do disco, atualize a página. No site publicado, as alterações só aparecem depois de um novo build/deploy.

## Projetos

Cada arquivo `projects/*.json` define exatamente um projeto. Copie um existente e escolha um `slug` único com letras minúsculas, números e hífens. `Primary` entra nos destaques; `Secondary` entra no grid Metro. Ambos aparecem no índice com busca e filtros.

```json
{
  "slug": "meu-projeto",
  "type": "Secondary",
  "project_name": "projects.meu-projeto.project_name",
  "description": "projects.meu-projeto.description",
  "technologies": ["Rust"],
  "image_links": ["/images/meu-projeto.png"],
  "video_link": "",
  "github_repo": "https://github.com/redlintles/meu-projeto",
  "successes": "projects.meu-projeto.successes",
  "project_link": "",
  "failures": "projects.meu-projeto.failures"
}
```

Os campos textuais contêm **chaves de tradução** resolvidas em `locale/{language}.json`. Acrescente a entrada correspondente em `projects` nos três arquivos de idioma:

```json
"meu-projeto": {
  "project_name": "Meu projeto",
  "description": "Descrição do projeto.",
  "successes": "Resultados e aprendizados do projeto.",
  "failures": "Dificuldades reais e próximos passos."
}
```

Não adicione comentários ou vírgulas finais aos JSONs. `project_link` pode estar ausente ou vazio; nesse caso, a página informa que o projeto não está publicado. O link do Textforge aponta para sua biblioteca no crates.io. `video_link` é um link externo, sem embeds de terceiros.

### Imagens e Base64

`image_links` aceita URLs HTTPS, caminhos locais iniciados por `/` (arquivos em `public/`) e Data URLs raster completas, como `data:image/png;base64,...`. SVG em Data URL é recusado. Projetos sem capturas usam `illustration_link`, quando configurado. Sem imagens ou ilustração, a galeria exibe um estado vazio. A primeira imagem é usada no cartão, e todas aparecem na galeria. Para acessibilidade mais específica, futuras alterações podem ampliar o schema com textos alternativos próprios por imagem; atualmente a galeria usa nome traduzido e número da captura.

Base64 aumenta o tamanho do HTML e dos dados enviados ao navegador. Prefira imagens comprimidas quando possível. A foto genérica da Home fica localmente em `public/images/workspace.jpg`; sua fonte e licença estão em `locale/site.json` e `ASSETS.md`.

## Textos e configurações

- `locale/pt-BR.json`, `locale/en.json`, `locale/es.json`: todos os textos traduzidos, biografia e qualificações.
- `locale/site.json`: contatos, notas das tecnologias e referência da fotografia.
- `projects/*.json`: projetos, tecnologias, mídias e links.
- `app/globals.css`: estilos BEM com `@apply`, responsividade, foco visível e redução de movimento.

As notas das tecnologias são autoavaliações. A tradução de `failures` pode ser uma string vazia: nesse caso, a seção de desafios é omitida. Os canais de contato são configurados em `locale/site.json`.

## GitHub Pages

O workflow `.github/workflows/deploy.yml` executa testes, build e verificação TypeScript em pushes para `main`. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**. O nome do repositório configura automaticamente o prefixo da URL. Se sua branch principal tiver outro nome, altere o gatilho do workflow.

Para testar um prefixo localmente, use a mesma variável nos dois comandos:

```sh
NEXT_PUBLIC_BASE_PATH=/nome-do-repositorio npm run rebuild
NEXT_PUBLIC_BASE_PATH=/nome-do-repositorio npm run preview
```

Abra `http://localhost:3000/nome-do-repositorio/pt-BR/`. Imagens locais e navegação respeitam o prefixo. Para `redlintles.github.io`, o workflow usa prefixo vazio. Todas as rotas exportam `index.html` em diretórios, compatíveis com acesso direto e atualização no Pages. Não há servidor Node.js em produção, API, formulário ou serviço externo obrigatório.

## Verificações

```sh
npm test
npm run build
npm run check
node scripts/verify-export.mjs
```

Os testes verificam contratos de entrada e esquemas de URL. O build valida slugs únicos, traduções e estrutura dos JSONs antes de gerar páginas. O TypeScript usa modo estrito. A navegação, os filtros e as tecnologias têm operação por teclado; os destaques mantêm ações visíveis em telas sem hover.

Se o build foi gerado com um prefixo, informe o mesmo `NEXT_PUBLIC_BASE_PATH` ao executar `scripts/verify-export.mjs`.

## Ilustrações de projetos sem interface

O campo opcional `illustration_link` aponta para uma imagem conceitual. Textforge, seus bindings, API PHP, scripts e templates Docker já incluem ilustrações vetoriais originais em `public/images/projects/`. Elas aparecem no cartão e nos detalhes, identificadas como imagens ilustrativas. Quando `image_links` contém capturas reais, elas têm prioridade e a ilustração deixa de aparecer. É possível trocar o caminho no JSON, inclusive por uma URL HTTPS ou Data URL raster.
