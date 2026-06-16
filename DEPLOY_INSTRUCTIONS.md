# Instruções para Configuração do Chatbot DAES (Gemini)

Para que o chatbot funcione corretamente no deploy da Vercel, siga estes passos:

1.  **Obter a API Key:** Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey) e gere uma nova chave de API para o Gemini.
2.  **Configurar no Vercel:**
    - Vá para o painel do seu projeto na Vercel.
    - Clique na aba **Settings** > **Environment Variables**.
    - Adicione uma nova variável:
        - **Key:** `GEMINI_API_KEY`
        - **Value:** (Cole a chave gerada no passo 1)
    - Clique em **Save**.
3.  **Redeploy:** Faça um novo deploy ou clique em "Promote to Production" para que as variáveis de ambiente entrem em vigor.

**Observação:** O código utiliza o modelo `gemini-1.5-flash`.
