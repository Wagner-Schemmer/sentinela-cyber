// ===== Sentinela Cyber — 100% local (+ consulta anonimizada opcional) =====
let tests = 0, lastPwd = "", lastReport = "";
const $ = id => document.getElementById(id);
const COMMON = ["123456","password","123456789","qwerty","senha","12345678","111111","abc123","brasil","flamengo","corinthians","palmeiras"];
const WORDS = ["abacaxi","ponte","tigre","nuvem","farol","sombra","vento","lago","pedra","foguete","ilha","trem","lua","cacto","rio","montanha","gato","livro","chave","porta","janela","estrela","mar","sol","chuva","neve","areia","folha","raiz","tronco","abelha","cavalo","pato","sapo","urso","zebra","cobra","aranha","borboleta","tubarão","golfinho","papagaio","coruja","lobo","raposa","onça","tatu","capivara","jabuti"];

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- 01 Força ----------
$("togglePwd").onclick = () => {
  const i = $("pwd");
  i.type = i.type === "password" ? "text" : "password";
};
$("pwd").addEventListener("input", e => analyze(e.target.value));

function analyze(pwd) {
  lastPwd = pwd; tests++; $("stTests").textContent = tests;
  $("breachOut").textContent = "Consulta anonimizada (só os 5 primeiros dígitos do hash saem do aparelho).";
  const fill = $("meterFill"), v = $("pwdVerdict"), ul = $("pwdChecks");
  if (!pwd) { fill.style.width = "0%"; v.textContent = "Aguardando senha…"; ul.innerHTML = ""; $("crackTime").textContent = "—"; return; }
  let pool = 0;
  const hasL = /[a-z]/.test(pwd), hasU = /[A-Z]/.test(pwd),
        hasD = /[0-9]/.test(pwd), hasS = /[^a-zA-Z0-9]/.test(pwd);
  if (hasL) pool += 26; if (hasU) pool += 26; if (hasD) pool += 10; if (hasS) pool += 33;
  const entropy = pwd.length * Math.log2(pool || 1);
  $("crackTime").textContent = humanTime(Math.pow(2, entropy - 1) / 1e10);
  const checks = [
    [pwd.length >= 12, `Mínimo 12 caracteres (tem ${pwd.length})`],
    [hasL && hasU, "Maiúsculas e minúsculas"],
    [hasD, "Números"],
    [hasS, "Símbolos (!@#…)"],
    [!COMMON.includes(pwd.toLowerCase()), "Não é senha comum/vazada"],
    [!/(.)\1{2,}/.test(pwd), "Sem repetições (aaa, 111)"],
    [!/123|abc|qwe/i.test(pwd), "Sem sequências óbvias"],
  ];
  ul.innerHTML = checks.map(([o, t]) => `<li class="${o ? "ok" : "bad"}">${o ? "✔" : "✖"} ${t}</li>`).join("");
  const pct = Math.min(100, Math.round(entropy / 100 * 100));
  fill.style.width = pct + "%";
  let label, color;
  if (entropy < 35) { label = "🔴 FRACA — troca urgente"; color = "var(--red)"; }
  else if (entropy < 55) { label = "🟡 RAZOÁVEL — dá pra melhorar"; color = "var(--amber)"; }
  else if (entropy < 80) { label = "🟢 FORTE — bom trabalho"; color = "var(--green)"; }
  else { label = "🛡️ BLINDADA — nível excelente"; color = "var(--green)"; }
  fill.style.background = color; v.textContent = label + ` (${Math.round(entropy)} bits)`;
}
function humanTime(s) {
  if (s < 1) return "menos de 1 segundo ⚠️";
  const u = [[31536000, "anos"], [86400, "dias"], [3600, "horas"], [60, "minutos"], [1, "segundos"]];
  for (const [d, n] of u) if (s >= d) { const x = Math.floor(s / d); return `~${x.toLocaleString("pt-BR")} ${n}`; }
}

// ---------- 01b Vazamento real (k-anonymity, HaveIBeenPwned) ----------
async function sha1hex(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
$("breachBtn").onclick = async () => {
  if (!lastPwd) { toast("Digite uma senha primeiro"); return; }
  $("breachOut").textContent = "Consultando base de vazamentos…";
  try {
    const hash = await sha1hex(lastPwd);
    const res = await fetch("https://api.pwnedpasswords.com/range/" + hash.slice(0, 5));
    if (!res.ok) throw 0;
    const txt = await res.text();
    const line = txt.split("\n").find(l => l.split(":")[0].trim() === hash.slice(5));
    const n = line ? +line.split(":")[1].trim() : 0;
    $("breachOut").innerHTML = n > 0
      ? `🚨 <strong>Essa senha apareceu em ${n.toLocaleString("pt-BR")} vazamentos.</strong> Troque agora e ative 2FA.`
      : `✅ <strong>Não encontrada em vazamentos conhecidos.</strong> Continue usando (única por site!).`;
  } catch {
    $("breachOut").textContent = "⚠️ Sem internet ou serviço indisponível. Tente de novo mais tarde.";
  }
};

// ---------- 02 Gerador ----------
let genMode = "pass";
document.querySelectorAll("#gerador .chip").forEach(c => c.onclick = () => {
  genMode = c.dataset.gm;
  document.querySelectorAll("#gerador .chip").forEach(x => x.classList.toggle("active", x === c));
  $("genLen").disabled = genMode === "words";
  gen();
});
const hist = [];
function rnd(n) { const b = new Uint32Array(n); crypto.getRandomValues(b); return [...b]; }
function gen() {
  $("lenVal").textContent = $("genLen").value;
  let out;
  if (genMode === "words") {
    out = rnd(5).map(n => WORDS[n % WORDS.length]).join("-") + "-" + (10 + rnd(1)[0] % 90);
  } else {
    const L = +$("genLen").value;
    let alpha = "";
    if ($("gLower").checked) alpha += "abcdefghijkmnopqrstuvwxyz";
    if ($("gUpper").checked) alpha += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if ($("gDigit").checked) alpha += "23456789";
    if ($("gSym").checked) alpha += "!@#$%&*+-=?";
    if (!$("gAmb").checked) {
      if ($("gLower").checked) alpha += "l";
      if ($("gUpper").checked) alpha += "OI";
      if ($("gDigit").checked) alpha += "01";
    }
    if (!alpha) { $("genOut").value = "Marque ao menos um grupo!"; return; }
    out = rnd(L).map(n => alpha[n % alpha.length]).join("");
  }
  $("genOut").value = out;
  hist.unshift(out); if (hist.length > 6) hist.pop();
  $("genHist").innerHTML = hist.map((h, i) =>
    `<div><span>${h}</span><button data-h="${i}">copiar</button></div>`).join("");
}
$("genLen").oninput = () => { $("lenVal").textContent = $("genLen").value; };
$("genBtn").onclick = gen;
$("genHist").addEventListener("click", async e => {
  const i = e.target.dataset.h; if (i === undefined) return;
  await navigator.clipboard.writeText(hist[+i]); toast("Senha copiada!");
});
$("clearHist").onclick = () => { hist.length = 0; $("genHist").innerHTML = ""; toast("Histórico limpo"); };
async function copyOut() {
  if (!$("genOut").value) return;
  await navigator.clipboard.writeText($("genOut").value); toast("Senha copiada!");
}
$("copyGen").onclick = copyOut;
gen();

// ---------- 03 Links ----------
const SHORT = ["bit.ly", "tinyurl", "t.co", "goo.gl", "is.gd", "cutt.ly", "ow.ly", "bitly"];
const BRANDS = ["itau", "bradesco", "santander", "nubank", "caixa", "correios", "receita", "gov", "mercadolivre", "americanas", "netflix", "whatsapp"];
$("urlBtn").onclick = () => {
  const raw = $("urlIn").value.trim(), box = $("urlResult");
  $("urlCopy").classList.add("hidden"); lastReport = "";
  if (!raw) { box.innerHTML = ""; $("urlScore").style.width = "0%"; return; }
  let u; try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); }
  catch { box.innerHTML = `<div class="flag danger">❌ Nem consegui ler esse link. Não clique.</div>`; return; }
  const flags = []; // [gravidade 1-3, texto]
  const host = u.hostname.toLowerCase();
  if (u.protocol === "http:") flags.push([3, "❌ HTTP sem cadeado — dados viajam abertos."]);
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) flags.push([3, "❌ Endereço IP numérico em vez de site real. Golpe clássico."]);
  if (u.username || raw.includes("@")) flags.push([3, "❌ Contém @ — o domínio real vem DEPOIS do @."]);
  if (host.includes("xn--")) flags.push([3, "❌ Domínio disfarçado (punycode) imitando marca famosa."]);
  if (SHORT.some(s => host === s || host.endsWith("." + s))) flags.push([2, "⚠️ Link encurtado esconde o destino. Expanda antes."]);
  if (host.split(".").length - 1 >= 3) flags.push([1, "⚠️ Subdomínios demais — tenta se passar por site conhecido."]);
  if (BRANDS.some(b => host.includes(b))) flags.push([2, "⚠️ Cita marca famosa — confira no app/site oficial, nunca pelo link."]);
  if (raw.length > 120) flags.push([1, "⚠️ URL muito longa, pode esconder o destino."]);
  if (/promo|gratis|grátis|urgente|bloqueio|suspens|premio|prêmio|brinde|cupom/i.test(raw))
    flags.push([2, "⚠️ Linguagem de urgência/prêmio — isca típica."]);
  const score = Math.min(100, flags.reduce((a, f) => a + f[0] * 9, 0));
  const bar = $("urlScore");
  bar.style.width = Math.max(flags.length ? 12 : 0, score) + "%";
  bar.style.background = score >= 50 ? "var(--red)" : score > 0 ? "var(--amber)" : "var(--green)";
  const head = score >= 50
    ? `<div class="flag danger">🚨 RISCO ALTO (${score}/100) — não clique, não informe dados.</div>`
    : score > 0
    ? `<div class="flag">⚠️ SUSPEITO (${score}/100) — confira pelo canal oficial.</div>`
    : `<div class="flag safe">✅ Nenhum sinal clássico de phishing. Mesmo assim, confira o remetente.</div>`;
  box.innerHTML = head + flags.map(([, t]) =>
    `<div class="flag ${/❌/.test(t) ? "danger" : ""}">${t}</div>`).join("");
  lastReport = `SENTINELA CYBER — verificação de link\nLink: ${raw}\nRisco: ${score}/100\n` +
    (flags.length ? flags.map(([, t]) => "- " + t.replace(/❌|⚠️/g, "").trim()).join("\n") : "- Nenhum sinal clássico detectado.");
  $("urlCopy").classList.remove("hidden");
};
$("urlCopy").onclick = async () => {
  await navigator.clipboard.writeText(lastReport); toast("Relatório copiado!");
};

// ---------- 04 Checklist ----------
const ITEMS = [
  "Senha diferente para e-mail e banco",
  "Verificação em 2 etapas no WhatsApp e e-mail",
  "Celular com bloqueio de tela + backup",
  "Desconfio de links com urgência/prêmio",
  "Não uso a mesma senha em tudo (uso gerador)",
  "Wi-Fi público só com VPN ou 4G",
  "Apps e sistema sempre atualizados",
  "Conferi meus vazamentos aqui no Sentinela",
];
const KEY = "sentinela-checklist";
const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
$("chkList").innerHTML = ITEMS.map((t, i) =>
  `<label><input type="checkbox" data-i="${i}" ${saved.includes(i) ? "checked" : ""}> ${t}</label>`).join("");
function paintChk() {
  const n = document.querySelectorAll("#chkList input:checked").length;
  $("chkProg").textContent = `${n}/${ITEMS.length}`;
  $("chkFill").style.width = (n / ITEMS.length * 100) + "%";
  $("chkFill").style.background = n === ITEMS.length ? "var(--green)" : "var(--acc)";
}
$("chkList").addEventListener("change", () => {
  const n = [...document.querySelectorAll("#chkList input:checked")].map(c => +c.dataset.i);
  localStorage.setItem(KEY, JSON.stringify(n)); paintChk();
});
paintChk();
