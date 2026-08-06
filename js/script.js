/* ── Apply theme IMMEDIATELY (also mirrors the inline <head> script) ── */
(function() {
  const saved = localStorage.getItem('slash-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const isDark = (html.getAttribute('data-theme') || 'dark') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('slash-theme', next);
}

// ---------- core math ----------
function isValidIp(str){
  const parts = str.trim().split('.');
  if(parts.length !== 4) return false;
  return parts.every(p => /^\d{1,3}$/.test(p) && +p >= 0 && +p <= 255);
}
function ipToInt(ip){
  return ip.trim().split('.').reduce((acc,o)=> (acc*256) + (+o), 0) >>> 0;
}
function intToIp(int){
  return [24,16,8,0].map(s => (int >>> s) & 255).join('.');
}
function maskFromCidr(cidr){
  return cidr === 0 ? 0 : (0xFFFFFFFF << (32-cidr)) >>> 0;
}
function toBinaryOctets(int){
  return [24,16,8,0].map(s => (((int >>> s) & 255) >>> 0).toString(2).padStart(8,'0'));
}
function classify(firstOctet){
  if(firstOctet < 128) return 'A';
  if(firstOctet < 192) return 'B';
  if(firstOctet < 224) return 'C';
  if(firstOctet < 240) return 'D';
  return 'E';
}
function isPrivate(int){
  const o1 = (int>>>24)&255, o2=(int>>>16)&255;
  if(o1===127) return 'loopback';
  if(o1===169 && o2===254) return 'linklocal';
  if(o1===10) return 'private';
  if(o1===172 && o2>=16 && o2<=31) return 'private';
  if(o1===192 && o2===168) return 'private';
  return 'public';
}

function calculate(ipStr, cidr){
  const ip = ipToInt(ipStr);
  const mask = maskFromCidr(cidr);
  const wildcard = (~mask) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = Math.pow(2, 32-cidr);
  let first, last, usableCode;
  if(cidr >= 32){ first = network; last = network; usableCode = 1; }
  else if(cidr === 31){ first = network; last = broadcast; usableCode = 'p2p'; }
  else { first = (network+1)>>>0; last = (broadcast-1)>>>0; usableCode = total-2; }

  return {
    ip, cidr, mask, wildcard, network, broadcast, total, first, last, usableCode,
    ipStr: intToIp(ip),
    maskStr: intToIp(mask),
    wildcardStr: intToIp(wildcard),
    networkStr: intToIp(network),
    broadcastStr: intToIp(broadcast),
    firstStr: intToIp(first),
    lastStr: intToIp(last),
    ipClassBase: classify((ip>>>24)&255),
    addrKind: isPrivate(ip)
  };
}

// ---------- state ----------
let state = { ip: '192.168.1.0', cidr: 24 };
let lastResult = null;

const ipInput = document.getElementById('ipInput');
const cidrInput = document.getElementById('cidrInput');
const cidrSlider = document.getElementById('cidrSlider');
const errorMsg = document.getElementById('errorMsg');
const maskHint = document.getElementById('maskHint');

function render(){
  const L = getLang();
  const valid = isValidIp(state.ip);
  errorMsg.style.display = valid ? 'none' : 'block';
  if(!valid) return;

  const r = calculate(state.ip, state.cidr);
  maskHint.textContent = '= ' + r.maskStr;
  cidrSlider.value = state.cidr;
  document.getElementById('cidrReadout').textContent = L.cidrReadout(state.cidr, r.total.toLocaleString());

  renderOctets(r);
  renderResults(r);
  renderBinaryMath(r);
}

function renderOctets(r){
  const L = getLang();
  const container = document.getElementById('octetRows');
  container.innerHTML = '';
  const octets = state.ip.trim().split('.');
  for(let o=0; o<4; o++){
    const row = document.createElement('div');
    row.className = 'octet-row';

    const val = document.createElement('div');
    val.className = 'octet-value';
    val.textContent = octets[o] ?? '0';
    row.appendChild(val);

    const cells = document.createElement('div');
    cells.className = 'cells';
    for(let b=0; b<8; b++){
      const globalIndex = o*8 + b;
      const btn = document.createElement('button');
      btn.className = 'cell ' + (globalIndex < state.cidr ? 'net' : 'host');
      if(globalIndex === state.cidr) btn.classList.add('boundary');
      btn.title = L.bitTooltip(globalIndex+1, globalIndex+1);
      btn.addEventListener('click', () => { setCidr(globalIndex+1); });
      cells.appendChild(btn);
    }
    row.appendChild(cells);
    container.appendChild(row);
  }
}

function renderResults(r){
  const L = getLang();

  let ipClassDisplay = r.ipClassBase;
  if(r.ipClassBase === 'D') ipClassDisplay += L.classSuffix.multicast;
  else if(r.ipClassBase === 'E') ipClassDisplay += L.classSuffix.reserved;

  const addrMap = { public: L.addr.public, private: L.addr.private, loopback: L.addr.loopback, linklocal: L.addr.linkLocal };
  const addrTypeDisplay = addrMap[r.addrKind];

  const usableDisplay = r.usableCode === 'p2p' ? L.p2pSuffix : String(r.usableCode);

  const items = [
    ['network', L.res.network, r.networkStr],
    ['broadcast', L.res.broadcast, r.broadcastStr],
    ['firstHost', L.res.firstHost, r.firstStr],
    ['lastHost', L.res.lastHost, r.lastStr],
    ['total', L.res.total, r.total.toLocaleString()],
    ['usable', L.res.usable, usableDisplay],
    ['mask', L.res.mask, r.maskStr],
    ['wildcard', L.res.wildcard, r.wildcardStr],
    ['ipClass', L.res.ipClass, ipClassDisplay],
    ['addrType', L.res.addrType, addrTypeDisplay],
  ];
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  items.forEach(([id,k,v]) => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<div class="stat-head">
        <div class="k">${k}</div>
        <div class="stat-actions">
          <button class="explain-btn" data-explain="${id}" title="${L.explainLabel}" aria-label="${L.explainLabel}">?</button>
          <button class="copy-btn" data-copy="${v}">${L.copyLabel}</button>
        </div>
      </div>
      <div class="v">${v}</div>`;
    grid.appendChild(el);
  });
  lastResult = r;
}

function renderBinaryMath(r){
  const L = getLang();
  const ipBits = toBinaryOctets(r.ip).join('.');
  const maskBits = toBinaryOctets(r.mask).join('.');
  const netBits = toBinaryOctets(r.network).join('.');
  function colorize(bits){
    return bits.split('').map((ch,i) => {
      if(ch === '.') return '.';
      const cls = i < state.cidr ? 'n' : 'h';
      return `<span class="${cls}">${ch}</span>`;
    }).join('');
  }
  const box = document.getElementById('binaryMath');
  box.innerHTML = `
    <div class="bm-row"><div class="bm-label">IP</div><div class="bm-bits">${colorize(ipBits)}</div></div>
    <div class="bm-row"><div class="bm-label">${L.res.mask}</div><div class="bm-bits">${colorize(maskBits)}</div></div>
    <div class="bm-rule"></div>
    <div class="bm-row"><div class="bm-label">${L.res.network}</div><div class="bm-bits">${colorize(netBits)}</div></div>
  `;
}

function setCidr(v){
  state.cidr = Math.max(0, Math.min(32, v));
  cidrInput.value = state.cidr;
  render();
}

ipInput.addEventListener('input', () => { state.ip = ipInput.value; render(); });
cidrInput.addEventListener('input', () => { setCidr(+cidrInput.value || 0); });
cidrSlider.addEventListener('input', () => { setCidr(+cidrSlider.value); });

document.getElementById('binToggle').addEventListener('click', (e) => {
  const L = getLang();
  const box = document.getElementById('binaryMath');
  box.classList.toggle('show');
  e.target.textContent = box.classList.contains('show') ? L.binHide : L.binShow;
});

// copy + explain buttons (event delegation)
document.getElementById('resultsGrid').addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.copy-btn');
  if(copyBtn){ navigator.clipboard.writeText(copyBtn.dataset.copy).then(showToast); return; }

  const explainBtn = e.target.closest('.explain-btn');
  if(explainBtn) openExplain(explainBtn.dataset.explain, explainBtn);
});
function showToast(){
  const t = document.getElementById('toast');
  t.textContent = getLang().toastCopied;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1400);
}

// ---------- explain modal ----------
let explainTrigger = null;
function openExplain(id, triggerEl){
  if(!lastResult) return;
  const L = getLang();
  const fn = L.explain[id];
  if(!fn) return;
  explainTrigger = triggerEl || null;
  document.getElementById('explainTitle').textContent = L.res[id];
  document.getElementById('explainBody').textContent = fn(lastResult);
  document.getElementById('explainOverlay').classList.add('show');
  document.getElementById('explainClose').focus();
}
function closeExplain(){
  document.getElementById('explainOverlay').classList.remove('show');
  if(explainTrigger){ explainTrigger.focus(); explainTrigger = null; }
}
document.getElementById('explainClose').addEventListener('click', closeExplain);
document.getElementById('explainOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'explainOverlay') closeExplain();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeExplain();
});

// ---------- splitter ----------
document.getElementById('splitBtn').addEventListener('click', () => {
  const L = getLang();
  if(!isValidIp(state.ip)) return;
  const base = calculate(state.ip, state.cidr);
  const mode = document.getElementById('splitMode').value;
  const val = Math.max(1, +document.getElementById('splitValue').value || 1);

  let newCidr;
  if(mode === 'count'){
    const bitsNeeded = Math.ceil(Math.log2(val));
    newCidr = state.cidr + bitsNeeded;
  } else {
    const hostBitsNeeded = Math.ceil(Math.log2(val + 2));
    newCidr = 32 - hostBitsNeeded;
  }
  newCidr = Math.max(state.cidr, Math.min(32, newCidr));

  const warning = document.getElementById('splitWarning');
  const numSubnets = Math.pow(2, newCidr - state.cidr);
  const cap = 512;
  const showCount = Math.min(numSubnets, cap);

  if(newCidr <= state.cidr){
    warning.style.display = 'block';
    warning.textContent = L.splitWarnCant(state.cidr);
    document.getElementById('splitTable').style.display = 'none';
    return;
  }
  warning.style.display = numSubnets > cap ? 'block' : 'none';
  if(numSubnets > cap) warning.textContent = L.splitWarnShowing(cap, numSubnets.toLocaleString());

  const blockSize = Math.pow(2, 32 - newCidr);
  const tbody = document.getElementById('splitBody');
  tbody.innerHTML = '';
  for(let i=0; i<showCount; i++){
    const netInt = (base.network + i*blockSize) >>> 0;
    const sub = calculate(intToIp(netInt), newCidr);
    const row = document.createElement('tr');
    row.innerHTML = `<td>${i+1}</td><td>${sub.networkStr}/${newCidr}</td><td>${sub.firstStr} – ${sub.lastStr}</td><td>${sub.broadcastStr}</td><td>${sub.maskStr}</td>`;
    tbody.appendChild(row);
  }
  document.getElementById('splitTable').style.display = 'table';
});

// ---------- i18n wiring ----------
function applyLang(){
  const L = getLang();
  document.getElementById('navEyebrow').textContent = L.eyebrowNav;
  document.getElementById('heroEyebrow').textContent = L.heroEyebrow;
  document.getElementById('heroTitleMain').textContent = L.heroTitleMain;
  document.getElementById('heroTitleSpan').textContent = L.heroSpan;
  document.getElementById('heroSub').textContent = L.heroSub;
  document.getElementById('ipLabel').textContent = L.ipLabel;
  document.getElementById('prefixLabel').textContent = L.prefixLabel;
  document.getElementById('errorMsg').textContent = L.errorMsg;
  document.getElementById('bitsHeading').textContent = L.bitsHeading;
  document.getElementById('legendNetwork').textContent = L.legendNetwork;
  document.getElementById('legendHost').textContent = L.legendHost;
  document.getElementById('resultsHeading').textContent = L.resultsHeading;
  document.getElementById('splitterHeading').textContent = L.splitterHeading;
  document.getElementById('splitterDesc').textContent = L.splitterDesc;
  document.getElementById('splitByLabel').textContent = L.splitByLabel;
  document.getElementById('splitModeCount').textContent = L.splitModeCount;
  document.getElementById('splitModeHosts').textContent = L.splitModeHosts;
  document.getElementById('splitValueLabel').textContent = L.splitValueLabel;
  document.getElementById('splitBtn').textContent = L.splitBtnLabel;
  document.getElementById('thSubnet').textContent = L.th.subnet;
  document.getElementById('thNetwork').textContent = L.th.network;
  document.getElementById('thAvailableRange').textContent = L.th.availableRange;
  document.getElementById('thBroadcast').textContent = L.th.broadcast;
  document.getElementById('thMask').textContent = L.th.mask;
  document.getElementById('footerText').textContent = L.footerText;
  document.getElementById('navLearnLink').textContent = L.navLearnLink;
  document.querySelector('.theme-btn').setAttribute('aria-label', L.themeToggleLabel);
  document.getElementById('explainClose').setAttribute('aria-label', L.modalCloseLabel);

  const box = document.getElementById('binaryMath');
  document.getElementById('binToggle').textContent = box.classList.contains('show') ? L.binHide : L.binShow;

  // ── Learn section ──
  document.getElementById('learnHeading').textContent = L.learn.heading;
  document.getElementById('learnIntro').textContent = L.learn.intro;
  document.querySelectorAll('.js-byte-label').forEach(el => {
    el.textContent = `${L.learn.byteLabel} ${el.dataset.n}`;
  });
  document.getElementById('learnS1Title').textContent = L.learn.s1Title;
  document.getElementById('learnS1Text').textContent = L.learn.s1Text;
  document.getElementById('learnS1DiagTitle').textContent = L.learn.s1DiagTitle;
  document.getElementById('learnS2Title').textContent = L.learn.s2Title;
  document.getElementById('learnS2Text').textContent = L.learn.s2Text;
  document.getElementById('learnS2DiagTitle').textContent = L.learn.s2DiagTitle;
  document.getElementById('learnS2Note').textContent = L.learn.s2Note;
  document.getElementById('learnS3Title').textContent = L.learn.s3Title;
  document.getElementById('learnS3Text').textContent = L.learn.s3Text;
  document.getElementById('learnS3DiagTitle').textContent = L.learn.s3DiagTitle;
  document.getElementById('learnS3Rule').textContent = L.learn.s3Rule;
  document.getElementById('learnS4Title').textContent = L.learn.s4Title;
  document.getElementById('learnS4Text').textContent = L.learn.s4Text;
  document.getElementById('learnS4DiagTitle').textContent = L.learn.s4DiagTitle;
  document.getElementById('learnS4FormulaLabel').textContent = L.learn.s4FormulaLabel;
  document.getElementById('learnS4FormulaExpr').textContent = L.learn.s4FormulaExpr;
  document.getElementById('learnS5Title').textContent = L.learn.s5Title;
  document.getElementById('learnS5Text').textContent = L.learn.s5Text;
  document.getElementById('learnS5DiagTitle').textContent = L.learn.s5DiagTitle;
  document.getElementById('learnS5LegendS').textContent = L.learn.s5LegendS;
  document.getElementById('learnS5LegendH').textContent = L.learn.s5LegendH;
  document.getElementById('learnS5FormulaSubnetsLabel').textContent = L.learn.s5FormulaSubnetsLabel;
  document.getElementById('learnS5FormulaSubnetsExpr').textContent = L.learn.s5FormulaSubnetsExpr;
  document.getElementById('learnS5FormulaHostsLabel').textContent = L.learn.s5FormulaHostsLabel;
  document.getElementById('learnS5FormulaHostsExpr').textContent = L.learn.s5FormulaHostsExpr;
  document.getElementById('learnCta').textContent = L.learn.cta;

  const sel = document.getElementById('langSelect');
  if (sel) sel.value = currentLang;

  render();
}

function changeLang(lang){
  setLang(lang, applyLang);
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang, applyLang);
});
