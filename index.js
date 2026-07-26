const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

let ultimoQR = null;
let statusBot = "Iniciando...";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
    protocolTimeout: 120000,
  },
});

client.on("qr", async (qr) => {
  console.log("Novo QR Code gerado.");
  ultimoQR = await qrcode.toDataURL(qr);
  statusBot = "Aguardando escaneamento do QR Code";
});

client.on("ready", () => {
  console.log("✅ Bot conectado e pronto!");
  statusBot = "Conectado e funcionando ✅";
  ultimoQR = null;
});

client.on("auth_failure", (msg) => {
  console.error("❌ Falha na autenticação:", msg);
  statusBot = "Erro de autenticação";
});

client.on("disconnected", (reason) => {
  console.log("⚠️ Desconectado:", reason);
  statusBot = "Desconectado: " + reason;
});

const BOT_ATIVO = true;

const regras = [
  { palavrasChave: ["preço", "preco", "valor", "quanto custa"], resposta: "Os planos são:\n📅 Trimestral\n📅 Anual\n\nQuer saber os valores de cada um?" },
  { palavrasChave: ["trimestral"], resposta: "O Plano Trimestral dá acesso completo por 3 meses. Quer saber o valor e como ativar?" },
  { palavrasChave: ["anual"], resposta: "O Plano Anual é o mais econômico a longo prazo. Quer saber o valor e como ativar?" },
  { palavrasChave: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"], resposta: "Olá! 👋 Recebi a tua mensagem. Em breve te respondo com mais detalhes!" },
];

function gerarResposta(texto) {
  if (!texto || typeof texto !== "string") return null;
  const textoMin = texto.toLowerCase();
  for (const regra of regras) {
    if (regra.palavrasChave.some((p) => textoMin.includes(p))) return regra.resposta;
  }
  return null;
}

client.on("message", async (message) => {
  try {
    if (!BOT_ATIVO) return;
    if (message.from === "status@broadcast") return;
    const chat = await message.getChat();
    if (chat.isGroup) return;
    const resposta = gerarResposta(message.body);
    if (resposta) {
      console.log(`Respondendo para ${message.from}: ${resposta}`);
      await client.sendMessage(message.from, resposta);
    }
  } catch (err) {
    console.error("Erro ao processar mensagem:", err && err.stack ? err.stack : err);
  }
});

process.on("unhandledRejection", (err) => {
  console.error("Erro não tratado:", err && err.message ? err.message : err);
});

app.get("/", (req, res) => {
  res.send(`<html><head><title>Meu Bot WhatsApp</title></head><body style="font-family: sans-serif; text-align: center; padding: 40px;"><h1>Status do Bot</h1><p style="font-size: 20px;">${statusBot}</p>${ultimoQR ? `<p>Escaneia o QR Code abaixo com o WhatsApp:</p><img src="${ultimoQR}" />` : ""}${!ultimoQR && statusBot.includes("Conectado") ? "<p>✅ Tudo certo, bot rodando normalmente!</p>" : ""}<p><small>Atualiza a página (F5) se o QR Code não aparecer.</small></p></body></html>`);
});

app.listen(PORT, () => {
  console.log(`Servidor web rodando na porta ${PORT}`);
});

client.initialize().catch((err) => {
  const msg = (err && err.message) ? err.message : String(err);
  console.error("\n❌ Erro ao iniciar o bot:", msg);
  statusBot = "Erro ao iniciar: " + msg;
});
