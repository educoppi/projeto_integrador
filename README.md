
# Título do Projeto

## TI-43



## Integrantes
- Eduardo Bruno Coppi
- Eduardo Lombardo Fuzato
- Rafael Eugênio Crempe
- Sara Malavazi

## Tecnologias Utilizadas:

- Next.js
- Express
- Prisma
- TypeScript
- React
- Bootstrap

## Instalação e Execução: 

npx prisma generate

npx prisma migrate dev --name init

npx prisma migrate dev --name nome_atualizaçao

npx prisma db push --force-reset

npm run seed

# Endpoints da API

## Medicamentos

### 1.1 - Criar Medicamento /POST
Cadastra um novo medicamento no sistema

### Requisição

**Query:** nenhum

**Cabeçalho:** 

Content-Type: application/json

Authorization: Bearer {{token}}

Body: 

```
{
     "name": string com o nome do medicamento,
     "quantity": quantidade em número do medicamento a ser cadastrado,
     "dosage": string com a dosagem do medicamento a ser cadastrado,
     "type": string com o tipo do medicamento a ser cadastrado,
     "expiresAt": data de vencimento do medicamento em ISO 
}
```

### Resposta

#### Status Code:

- **201**: Sucesso no cadastrado
- **400**: Preencha todos os campos
- **409**: Medicamento já cadastrado

**Cabeçalho:**

**Body:** nenhum






npm install bcrypt express-session nodemailer uuid             (faz a criptografia da senha)
npm install jsonwebtoken

