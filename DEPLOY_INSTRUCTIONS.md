# Instruções para Configuração do Chatbot DAES (NVIDIA AI)

Para que o chatbot funcione corretamente no deploy da Vercel, siga estes passos:

1. **Obter a API Key da NVIDIA:**
   - Acesse o [NVIDIA Build API Portal](https://build.nvidia.com/) ou a plataforma de integrações da NVIDIA.
   - Gere e copie sua chave de API (com prefixo `nvapi-`).

2. **Configurar no Vercel:**
   - Vá para o painel do seu projeto na Vercel.
   - Clique na aba **Settings** > **Environment Variables**.
   - Adicione/Edite a variável:
     - **Key:** `NVIDIA_API_KEY`
     - **Value:** (Cole a chave gerada no passo 1)
   - Clique em **Save**.

3. **Redeploy:** Faça um novo deploy ou clique em "Redeploy" para que as variáveis de ambiente entrem em vigor.

**Observação:** O código utiliza por padrão o modelo `meta/llama-3.3-70b-instruct` através do endpoint `https://integrate.api.nvidia.com/v1/chat/completions`.
