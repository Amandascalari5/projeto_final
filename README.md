Esse projeto foi desenvolvido para o trabalho final da aula de Programação Web, ele busca consolidar as tecnologias aprendidas em aula. A fim de atender os requisitos foi desenvolvido uma aplicação web voltada a comunidade do automobilismo, especificamente a Fórmula 1, na qual o usuário pode manter uma coleção de pilotos da temporada atual de Fórmula 1 (dados retirados da API Open F1), e deixar comentários sobre a performance do piloto em determinada etapa do campeonato. 

Para isso o usuário deverá efetuar o cadastro, e então fazer seu login, em seguida será direcionado a página de /dashboard que contém duas ações, acessar a lista completa de pilotos da temporada (/pilots/page.tsx) ou a sua coleção pessoal de pilotos (/pilots/my-collection/page.tsx). Na página de coleção pessoal é possível que o usuário deixe um comentário associado ao piloto, é possível também que o usuário edite ou remova esse comentário, assim como excluir o piloto da sua coleção, para remover o comentário e o piloto é necessário que o usuário remova primeiro o comentário e em seguida retire o piloto de sua coleção.

Tecnologias utilizadas
-Next.js
-React + TypeScript
-CSS
-Zod (validação)
-API Open F1 (dados piloto)
-Armazenamento em JSON

O projeto se propõe a criar um espaço para os fãs de automobilismo deixarem seus comentários pessoais sem ter que se engajar com as redes sociais, como um diário virtual de avaliações. 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Executando
Clone o repositório:
```bash
git clone git@github.com:Amandascalari5/projeto_final.git
cd projeto_final

Instalar pelo terminal:
    -npm install
    -Zod para validação de formulário: npm i zod
    -React Hot Toast para emitir mensagens estilo toast: npm i react-hot-toast
    -Brcrypt para criptografia da senha do usuário: npm i bcrypt
    -Jose para criar session tokens: npm i jose

Em seguida, executar comando:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) no navegador para acessar aplicação.