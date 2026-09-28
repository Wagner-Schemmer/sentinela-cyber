# 🛡️ Sentinela Cyber

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
