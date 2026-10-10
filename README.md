<div align="center">

[![Stars](https://img.shields.io/github/stars/Wagner-Schemmer/sentinela-cyber?style=social)](https://github.com/Wagner-Schemmer/sentinela-cyber/stargazers)
[![Live](https://img.shields.io/badge/demo-ao_vivo-34d399?style=for-the-badge&logo=vercel&logoColor=white)](https://sentinela-cyber.vercel.app)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-instalável-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

  <a href="https://sentinela-cyber.vercel.app"><img alt="Sentinela Cyber — segurança para gente normal" src="docs/banner.svg" /></a>

  <h1>Sentinela Cyber</h1>

  <p>
    <b>Segurança para gente normal, 100% no navegador.</b>
    <br />
    Nenhum dado sai do seu dispositivo. Nem a senha testada, nem o link verificado.
  </p>

  <p>
    <a href="https://sentinela-cyber.vercel.app"><b>Demo</b></a> ·
    <a href="#o-que-cada-ferramenta-faz">Ferramentas</a> ·
    <a href="#como-rodar">Como rodar</a> ·
    <a href="#como-se-compara">Comparar</a> ·
    <a href="#stack">Stack</a>
  </p>
</div>

<a href="https://sentinela-cyber.vercel.app"><img src="docs/preview.png" alt="Sentinela Cyber ao vivo" /></a>

O Sentinela Cyber é um kit gratuito de higiene digital: mede a força da sua senha em bits de entropia, consulta vazamentos reais sem expor sua senha, gera senhas fortes e dá nota de 0 a 100 para links suspeitos — tudo client-side, sem conta e sem servidor.

## O que cada ferramenta faz

| Ferramenta | O que faz | Seus dados |
|---|---|---|
| **Medidor de força** | Entropia em bits, tempo de quebra (10 bi tentativas/s), 7 checks | ✓ nunca saem do navegador |
| **Vazamento real** | HaveIBeenPwned por k-anonymity (só 5 chars do SHA-1 viajam) | ✓ senha completa nunca viaja |
| **Gerador** | `crypto.getRandomValues`: aleatória 8–64 ou frase-senha PT-BR | ✓ gerada localmente |
| **Verificador de links** | Score 0–100, 9 heurísticas, relatório copiável p/ WhatsApp | ✓ análise local |
| **Checklist + FAQ** | 8 itens de higiene digital salvos em `localStorage` | ✓ ficam no aparelho |

## Como se compara

| | Verificadores online comuns | Sentinela Cyber |
|---|---|---|
| Sua senha sai do aparelho | Na maioria, sim | **Não** |
| Precisa de conta | Quase sempre | **Não** |
| Funciona offline (PWA) | Raramente | **Sim** |
| Código aberto | Raramente | **Sim** |

## Como rodar

1. Abra o `index.html` (Go Live no VSCode ou `python3 -m http.server` na pasta).
2. Digite uma senha no medidor e veja a nota na hora.
3. Instale como PWA no celular e use offline.

## Estrutura

```
sentinela-cyber/
├── index.html      # markup + seções (medidor, vazamento, gerador, links, checklist, FAQ)
├── styles.css      # tema dark cyber
├── script.js       # entropia, 9 heurísticas, HIBP k-anonymity
├── manifest.json   # PWA instalável
└── api/            # health check p/ monitoramento
```

## Personalizar

1. Pesos das 9 heurísticas em `script.js` (função de score 0–100).
2. Textos e checklist em `index.html`.
3. Deploy: conectar o repo na Vercel (zero config).

## Stack

HTML · CSS · JavaScript (zero dependências, zero build).

## Quem faz

<a href="https://github.com/Wagner-Schemmer/sentinela-cyber/graphs/contributors"><img src="https://contrib.rocks/image?repo=Wagner-Schemmer/sentinela-cyber" alt="contribuidores" /></a>

## Star history

<a href="https://www.star-history.com/#Wagner-Schemmer/sentinela-cyber&Date"><img alt="Star History" src="https://api.star-history.com/svg?repos=Wagner-Schemmer/sentinela-cyber&type=Date" /></a>

---
Feito por [Wagner Schemmer](https://wagner-port.vercel.app) · [Portfólio](https://wagner-port.vercel.app) · [LinkedIn](https://www.linkedin.com/in/wagner-schemmer-martins-46950627a)
