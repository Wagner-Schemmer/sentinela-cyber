# 🛡️ Sentinela Cyber

[![Live](https://img.shields.io/badge/demo-ao_vivo-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://sentinela-cyber.vercel.app)
![JS](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-instalável-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

Analisador de força de senhas, gerador seguro e verificador de links de phishing + checklist de higiene digital.

**100% client-side:** nenhum dado sai do navegador.

## Ferramentas
1. **Medidor de força** — entropia em bits, tempo estimado de quebra (força bruta a 10 bi/s), 7 checks
2. **Vazamento real** — consulta HaveIBeenPwned por k-anonymity (só 5 chars do SHA-1 saem do aparelho)
3. **Gerador** — `crypto.getRandomValues`: aleatória 8–64 ou frase-senha PT-BR, histórico de sessão
4. **Verificador de links** — score 0–100, 9 heurísticas, relatório copiável p/ WhatsApp
5. **Checklist + FAQ** — 8 itens salvos em `localStorage`, conteúdo educativo, PWA instalável

## Rodar
Go Live no VSCode ou `python3 -m http.server` na pasta. Sem build, sem dependências.
