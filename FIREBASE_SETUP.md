# Configuração do Firebase

Para que a aplicação funcione corretamente, você precisa configurar as variáveis de ambiente do Firebase.

## Passos para configurar:

1. **Crie um arquivo `.env` na raiz do projeto** (mesmo nível do package.json)

2. **Adicione as seguintes variáveis ao arquivo `.env`:**

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

3. **Obtenha as credenciais do Firebase Console:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Selecione seu projeto
   - Vá em "Configurações do projeto" (ícone de engrenagem)
   - Na aba "Geral", role para baixo até "Seus aplicativos"
   - Se não tiver um app web, clique em "Adicionar app" e escolha "Web"
   - Copie as credenciais do objeto `firebaseConfig`

4. **Substitua os valores no arquivo `.env`** pelas credenciais reais do seu projeto Firebase.

## Exemplo de arquivo .env configurado:

```env
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=meu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meu-projeto-12345
VITE_FIREBASE_STORAGE_BUCKET=meu-projeto-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## Importante:
- **NUNCA** commite o arquivo `.env` para o repositório
- O arquivo `.env` já está no `.gitignore` para sua segurança
- Reinicie o servidor de desenvolvimento após criar o arquivo `.env`
