# Entre páginas — Catálogo de livros

Exercício de React + TypeScript com uma API REST real do [CrudCrud](https://crudcrud.com). Interface em português, responsiva e com bordas retas.

## Executar

Pré-requisito: Node.js 22.12+ (ou 24 LTS) e npm.

```bash
npm install
npm run dev
```

Abra a URL exibida no terminal. O ZIP inclui um `.env` com uma API temporária criada em 10/11/2026, testada com GET, POST, PUT e DELETE. Esse endpoint pode expirar ou atingir a cota. Nesse caso, gere outro conforme os passos abaixo. Nenhum livro de demonstração foi deixado na API.

## Configurar ou renovar a API

1. Acesse https://crudcrud.com e copie sua URL exclusiva.
2. Se não houver `.env`, copie `.env.example` e renomeie a cópia para `.env`.
3. Edite o arquivo na raiz do projeto:

```dotenv
VITE_API_URL=https://crudcrud.com/api/SEU_IDENTIFICADOR
```

4. Use a URL base, sem `/books` no final. O código acrescenta o recurso automaticamente.
5. Pare o servidor (`Ctrl+C`) e execute `npm run dev` novamente. Para produção, gere um novo build.

O `.env` está ignorado pelo Git. Após clonar o repositório, cada pessoa deve configurar sua própria URL. Variáveis `VITE_*` ficam visíveis no navegador: este endpoint é temporário e não deve receber dados sensíveis. Confira validade e cota no painel do serviço. Dados de um endpoint antigo não são transferidos para um novo.

## Funcionalidades

- Listagem com `GET /books` no `useEffect` de `BookList`.
- Cadastro com `POST /books`, título, autor e status.
- Remoção com `DELETE /books/:id` e confirmação.
- Alteração opcional de status com `PUT /books/:id`, sem enviar `_id` no corpo.
- Contadores de livros lidos e não lidos.
- Estados de carregamento, lista vazia, erros HTTP/rede e bloqueio durante envio.
- Cancelamento do GET ao desmontar; atualizações locais somente após sucesso da API.
- Validação de campos vazios e do formato das respostas recebidas.

## Organização e responsabilidades

```text
src/
  components/
    BookList.tsx   # Busca inicial, estado da coleção e integração dos filhos
    BookForm.tsx   # Campos controlados, validação e cadastro
    BookItem.tsx   # Exibição, exclusão e alteração de status
  services/
    books.ts      # fetch, endpoints, validação de resposta e mensagens de erro
  types/
    book.ts       # Book, BookStatus, BookFormState e CreateBookInput
  App.tsx         # Estrutura da página
  main.tsx        # Inicialização do React
  index.css       # Estilo responsivo
  vite-env.d.ts   # Tipagem das variáveis de ambiente
```

`Book` contém `_id`, `title`, `author` e `status`. O status é a união literal `'Lido' | 'Não lido'`. `CreateBookInput` e `BookFormState` usam `Omit<Book, '_id'>`, pois o identificador vem do servidor. As interfaces das props ficam junto aos respectivos componentes. Os eventos usam `ChangeEvent<HTMLInputElement | HTMLSelectElement>` e `FormEvent<HTMLFormElement>`. Erros capturados e respostas JSON entram como `unknown` e são verificados antes do uso.

O formulário envia o livro criado ao `BookList` por callback. O item informa exclusões e atualizações por callbacks. O serviço concentra o acesso HTTP, mantendo os componentes responsáveis pela interface e pelo estado.

## Verificações

```bash
npm run build
npm run lint
npm run preview
```

Build TypeScript/Vite e lint executados com sucesso durante a preparação. O contrato do serviço foi verificado em um endpoint real: cadastro, listagem, atualização, nova listagem, remoção e confirmação da remoção. Para repetir manualmente, cadastre um livro, atualize o status, recarregue a página e confira a persistência; remova e recarregue novamente. A validação visual automatizada no navegador não foi concluída devido a uma restrição do ambiente de execução. Não há fallback para localStorage: os livros são armazenados no CrudCrud.

O `StrictMode` pode iniciar um GET adicional em desenvolvimento; o efeito cancela requisições ao desmontar. A cota do serviço ainda pode contabilizar chamadas já recebidas.

## Publicar em um repositório público no GitHub

1. Crie um repositório **público** chamado `catalogo-livros` no GitHub, sem inicializar README ou `.gitignore`.
2. Abra o terminal na pasta extraída e execute, substituindo `SEU_USUARIO`:

```bash
git init
git add .
git commit -m "Cria catálogo de livros com React e TypeScript"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/catalogo-livros.git
git push -u origin main
```

Se já existir um remote `origin`, use `git remote set-url origin https://github.com/SEU_USUARIO/catalogo-livros.git` em vez de `git remote add`. O Git pode solicitar autenticação.

3. Entregue o link `https://github.com/SEU_USUARIO/catalogo-livros`.

Não envie `node_modules`, `dist` ou `.env`; o `.gitignore` já cobre essas pastas e o arquivo de configuração. Os arquivos `.ts`, `.tsx`, `.env.example` e `package-lock.json` devem estar no repositório.

## Referências

- https://crudcrud.com — contrato HTTP e geração automática de `_id`.
- https://vite.dev/guide/ — execução e requisitos do Vite.
