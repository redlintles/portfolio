# Histórico de alterações

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
