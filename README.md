# 🛡️ Sentinela Cyber

Analisador de força de senhas, gerador seguro e verificador de links de phishing + checklist de higiene digital.

**100% client-side:** nenhum dado sai do navegador.

## Ferramentas
1. **Medidor de força** — entropia em bits, tempo estimado de quebra (força bruta a 10 bi/s), 6 checks
2. **Gerador** — `crypto.getRandomValues`, tamanho 8–64, grupos ABC/abc/123/#@!, modo sem ambíguos
3. **Verificador de links** — 9 heurísticas (IP literal, @, punycode, encurtadores, HTTP, subdomínios, marcas, URL longa, urgência)
4. **Checklist** — 8 itens salvos em `localStorage`

## Rodar
Go Live no VSCode ou `python3 -m http.server` na pasta. Sem build, sem dependências.
