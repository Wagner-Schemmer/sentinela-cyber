// ===== Sentinela Cyber — 100% local =====
let tests = 0;
const $ = id => document.getElementById(id);
const COMMON = ["123456","password","123456789","qwerty","senha","12345678","111111","abc123","brasil","flamengo"];

// ---------- 01 Força ----------
$("togglePwd").onclick = () => {
  const i = $("pwd");
  i.type = i.type === "password" ? "text" : "password";
};
$("pwd").addEventListener("input", e => analyze(e.target.value));

function analyze(pwd) {
  tests++; $("stTests").textContent = tests;
  const fill = $("meterFill"), v = $("pwdVerdict"), ul = $("pwdChecks");
  if (!pwd) { fill.style.width = "0%"; v.textContent = "Aguardando senha…"; ul.innerHTML = ""; $("crackTime").textContent = "—"; return; }
  let pool = 0;
  const hasL = /[a-z]/.test(pwd), hasU = /[A-Z]/.test(pwd),
        hasD = /[0-9]/.test(pwd), hasS = /[^a-zA-Z0-9]/.test(pwd);
  if (hasL) pool += 26; if (hasU) pool += 26; if (hasD) pool += 10; if (hasS) pool += 33;
  const entropy = pwd.length * Math.log2(pool || 1);
  const guesses = Math.pow(2, entropy - 1) / 1e10; // 10 bi tentativas/s
  $("crackTime").textContent = humanTime(guesses);
  const checks = [
    [pwd.length >= 12, `Mínimo 12 caracteres (tem ${pwd.length})`],
    [hasL && hasU, "Maiúsculas e minúsculas"],
    [hasD, "Números"],
    [hasS, "Símbolos (!@#…)"],
    [!COMMON.includes(pwd.toLowerCase()), "Não é senha comum/vazada"],
    [!/(.)\1{2,}/.test(pwd), "Sem repetições (aaa, 111)"],
  ];
  const ok = checks.filter(c => c[0]).length;
  ul.innerHTML = checks.map(([o, t]) => `<li class="${o ? "ok" : "bad"}">${o ? "✔" : "✖"} ${t}</li>`).join("");
  const pct = Math.min(100, Math.round(entropy / 90 * 100));
  fill.style.width = pct + "%";
  let label, color;
  if (entropy < 35) { label = "🔴 FRACA — troca urgente"; color = "var(--red)"; }
  else if (entropy < 55) { label = "🟡 RAZOÁVEL — dá pra melhorar"; color = "var(--amber)"; }
  else if (entropy < 75) { label = "🟢 FORTE — bom trabalho"; color = "var(--green)"; }
  else { label = "🛡️ BLINDADA — nível excelente"; color = "var(--green)"; }
  fill.style.background = color; v.textContent = label + ` (${Math.round(entropy)} bits)`;
}
function humanTime(s) {
  if (s < 1) return "menos de 1 segundo ⚠️";
  const u = [[31536000, "anos"], [86400, "dias"], [3600, "horas"], [60, "minutos"], [1, "segundos"]];
  for (const [d, n] of u) if (s >= d) { const x = Math.floor(s / d); return `~${x.toLocaleString("pt-BR")} ${n}`; }
}

// ---------- 02 Gerador ----------
function gen() {
  const L = +$("genLen").value; $("lenVal").textContent = L;
  let alpha = "";
  if ($("gLower").checked) alpha += "abcdefghijkmnopqrstuvwxyz";
  if ($("gUpper").checked) alpha += "ABCDEFGHJKLMNPQRSTUVWXYZ";
  if ($("gDigit").checked) alpha += "23456789";
  if ($("gSym").checked) alpha += "!@#$%&*+-=?";
  // alfabetos-base já excluem ambíguos; se o modo estrito estiver desligado, inclui 0/O/1/l
  if (!$("gAmb").checked) {
    if ($("gLower").checked) alpha += "l";
    if ($("gUpper").checked) alpha += "OI";
    if ($("gDigit").checked) alpha += "01";
  }
  if (!alpha) { $("genOut").value = "Marque ao menos um grupo!"; return; }
  const buf = new Uint32Array(L); crypto.getRandomValues(buf);
  $("genOut").value = [...buf].map(n => alpha[n % alpha.length]).join("");
}
$("genLen").oninput = () => $("lenVal").textContent = $("genLen").value;
$("genBtn").onclick = gen;
$("copyGen").onclick = async () => {
  if (!$("genOut").value) return;
  await navigator.clipboard.writeText($("genOut").value);
  $("copyGen").textContent = "✔";
  setTimeout(() => $("copyGen").textContent = "📋", 1200);
};
gen();

// ---------- 03 Links ----------
const SHORT = ["bit.ly", "tinyurl", "t.co", "goo.gl", "is.gd", "cutt.ly", "ow.ly"];
const BRANDS = ["banco", "itau", "bradesco", "santander", "nubank", "caixa", "correios", "receita", "gov", "mercadolivre", "americanas", "netflix"];
$("urlBtn").onclick = () => {
  const raw = $("urlIn").value.trim(), box = $("urlResult");
  if (!raw) { box.innerHTML = ""; return; }
  let u; try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); }
  catch { box.innerHTML = `<div class="flag danger">❌ Nem consegui ler esse link. Não clique.</div>`; return; }
  const flags = [];
  const host = u.hostname.toLowerCase();
  if (u.protocol === "http:") flags.push(["danger", "❌ Usa HTTP sem cadeado — dados viajam abertos."]);
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) flags.push(["danger", "❌ O endereço é um IP numérico, não um site real. Golpe clássico."]);
  if (u.username || u.password || raw.includes("@")) flags.push(["danger", "❌ Contém @ — o domínio real vem DEPOIS do @."]);
  if (host.includes("xn--")) flags.push(["danger", "❌ Domínio internacional disfarçado (punycode), imita letras de marcas."]);
  if (SHORT.some(s => host.includes(s))) flags.push(["warn", "⚠️ Link encurtado: esconde o destino real. Expanda antes de clicar."]);
  if (host.split(".").length - 1 >= 3) flags.push(["warn", "⚠️ Subdomínios demais — tenta parecer um site conhecido."]);
  if (BRANDS.some(b => host.includes(b)) && !host.endsWith(".br") && !/\.com$/.test(host))
    flags.push(["warn", "⚠️ Cita banco/loja famosa em domínio estranho. Confira o endereço oficial."]);
  if (raw.length > 120) flags.push(["warn", "⚠️ URL muito longa — pode esconder o destino."]);
  if (/promo|gratis|grátis|urgente|bloqueio|suspens|premio|prêmio/i.test(raw))
    flags.push(["warn", "⚠️ Linguagem de urgência/prêmio — isca típica de phishing."]);
  const danger = flags.filter(f => f[0] === "danger").length;
  const head = danger > 0
    ? `<div class="flag danger">🚨 RISCO ALTO — ${flags.length} sinal(is). Não clique, não informe dados.</div>`
    : flags.length > 0
    ? `<div class="flag">⚠️ SUSPEITO — ${flags.length} sinal(is). Confira pelo app/site oficial.</div>`
    : `<div class="flag safe">✅ Nenhum sinal clássico de phishing. Mesmo assim, confira o remetente.</div>`;
  box.innerHTML = head + flags.map(([c, t]) => `<div class="flag ${c === "danger" ? "danger" : ""}">${t}</div>`).join("");
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
  "Conferi meus vazamentos (haveibeenpwned.com)",
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
