# Histórico de alterações

## Galeria na página de detalhes

- Nova seção Galeria (`components/gallery.tsx`): imagens num grid de quadros 16:9 fixos, com legenda revelada no hover ou foco do teclado e sempre visível em telas de toque.
- Vídeos agora são reproduzidos num `<video controls>` com tema escuro, em vez de links.
- `video_links[].link` passa a aceitar o nome de um arquivo em `public/assets/` ou uma URL HTTPS de arquivo de vídeo (`mp4`, `webm`, `ogv`, `ogg`). Caminhos iniciados por `/` e links de páginas são recusados; a validação também confere se o arquivo existe.
- Novas chaves de idioma: `images`, `videoFallback`; `gallery` e `video` tiveram os textos ajustados.
- `projects/colour.json` passou a usar chaves de tradução, com textos em português, inglês e espanhol.

## Pasta de assets para imagens

- Nova pasta `public/assets/` para as imagens dos projetos.
- `image_links[].link` aceita apenas o nome do arquivo (com subpastas opcionais); o caminho completo é montado como `/assets/<nome>` com o prefixo do GitHub Pages.
- URLs HTTPS e Data URLs raster continuam aceitas. Caminhos iniciados por `/` deixam de ser aceitos em `image_links`; `illustration_link` e `video_links` não mudam.
- O build e o modo `dev` falham quando o arquivo referenciado não existe.
- `mediaUrl` foi movido de `lib/content.ts` para `lib/media.ts`, que pode ser importado por componentes cliente.

Validação: testes unitários de nomes, caminhos e existência de arquivos, exportação com imagem em subpasta e nome com espaço, TypeScript, build com prefixo e integridade dos links exportados.

## Limpeza editorial

- Comentários descrevem o comportamento do código, sem referências à solicitação de desenvolvimento.
- A documentação descreve a configuração e o uso do projeto.
- Seções de desafios sem conteúdo são omitidas, sem mensagens de preenchimento.
- Galerias vazias apresentam um estado neutro, sem promessas de conteúdo futuro.

Validação: contratos de conteúdo, testes de validação e TypeScript.

## Mídias com descrição

Mudança incompatível no contrato de `projects/*.json`:

- `image_links`: de `string[]` para `{ link: string; description: string }[]`.
- `video_link`: removido; substituído por `video_links`, também uma lista de objetos `{ link, description }`.
- `description` referencia uma frase curta nos arquivos de idioma, permitindo tradução independente por asset.
- Imagens exibem a descrição como texto alternativo e legenda; cada vídeo tem seu próprio link descritivo.
- O cartão usa o `link` da primeira imagem. Ilustrações continuam como fallback.
- A validação de build e de desenvolvimento verifica todos os objetos e suas traduções.
- Os 12 JSONs existentes foram migrados. As listas vazias permanecem válidas.

Migração e exemplos completos: `README.md`, seção Projetos.

Validação: testes unitários do contrato, exportação com múltiplas mídias em ambiente temporário, TypeScript, build estático e integridade dos links exportados.
