# Bot WhatsApp — Rodando 24/7 no Render.com

Sem depender do teu PC, sem depender da tua internet de casa.

## ⚠️ Limitação importante do plano gratuito

O plano **gratuito** do Render tem duas características que precisas saber:

1. **"Dorme" depois de 15 minutos sem uso** — se ninguém acessar a URL do serviço, ele hiberna. Na próxima mensagem recebida, ele "acorda" (demora uns 30-60 segundos pra voltar a responder).
2. **Perde a sessão ao reiniciar** — como o plano gratuito não guarda arquivos permanentemente, toda vez que o serviço reiniciar (hibernar/acordar, ou fazer novo deploy), vai pedir escanear o QR Code de novo.

**Se isso for um problema real pro teu uso diário**, a solução é o plano pago do Render (a partir de $7/mês), que tem disco persistente (não perde sessão) e não hiberna. Mas pra testar e validar se esse caminho resolve o teu problema, o gratuito já serve.

## 1. Criar conta no Render

1. Vai em **render.com**
2. Cria conta (pode ser com GitHub, Google, ou email)

## 2. Subir o código

**Opção mais simples (sem Git):**
1. Cria um repositório novo no **GitHub** (github.com → New repository)
2. Faz upload manual dos arquivos dessa pasta pro repositório (botão "Add file > Upload files" no GitHub, direto pelo navegador, sem precisar instalar nada)
3. No Render, clica em **"New +"** → **"Web Service"**
4. Conecta a tua conta GitHub e escolhe esse repositório

## 3. Configurar o serviço no Render

Quando pedir as configurações:
- **Name:** meu-whatsapp-bot (ou o nome que quiseres)
- **Region:** escolhe a mais próxima (Europa, se disponível)
- **Branch:** main
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

Clica em **"Create Web Service"**.

## 4. Esperar o deploy

Vai aparecer uma tela de logs (parecido com o terminal que já usaste). Espera até aparecer algo como:
```
Servidor web rodando na porta 3000
```

## 5. Acessar o QR Code

1. No topo da página do Render, vai ter uma URL tipo `https://meu-whatsapp-bot.onrender.com`
2. Abre essa URL no navegador
3. Vai aparecer o **QR Code como imagem** na página
4. Escaneia com o WhatsApp: **Configurações → Aparelhos conectados → Conectar um aparelho**

## 6. Confirmar que funcionou

Depois de escanear, atualiza a página (F5) — deve aparecer: **"Conectado e funcionando ✅"**

## 7. Testar

Pede pra alguém te mandar "oi" pelo WhatsApp. Se o serviço estiver "dormindo" (sem uso há 15+ min), a primeira mensagem pode demorar um pouco mais pra ser respondida (ele "acorda"). Depois disso, responde normal.

## 8. Editar as respostas automáticas

Abre o arquivo `index.js` no GitHub (direto no navegador, botão de lápis pra editar), mexe no bloco `regras`, salva — o Render detecta a mudança e refaz o deploy sozinho automaticamente.

## 9. Manter sempre acordado (opcional, evita a hibernação)

Existem serviços gratuitos de "ping" (tipo UptimeRobot) que acessam a tua URL a cada 10 minutos, simulando uso e evitando que o Render hiberne o serviço. Se quiseres, te ajudo a configurar isso depois.
