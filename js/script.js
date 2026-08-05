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
  if(firstOctet < 240) return 'D (multicast)';
  return 'E (reserved)';
}
function isPrivate(int){
  const o1 = (int>>>24)&255, o2=(int>>>16)&255;
  if(o1===10) return true;
  if(o1===172 && o2>=16 && o2<=31) return true;
  if(o1===192 && o2===168) return true;
  if(o1===127) return 'Loopback';
  if(o1===169 && o2===254) return 'Link-local';
  return false;
}

function calculate(ipStr, cidr){
  const ip = ipToInt(ipStr);
  const mask = maskFromCidr(cidr);
  const wildcard = (~mask) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = Math.pow(2, 32-cidr);
  let first, last, usable;
  if(cidr >= 32){ first = network; last = network; usable = 1; }
  else if(cidr === 31){ first = network; last = broadcast; usable = '2 (RFC 3021 point-to-point)'; }
  else { first = (network+1)>>>0; last = (broadcast-1)>>>0; usable = total-2; }

  const priv = isPrivate(ip);
  return {
    ip, cidr, mask, wildcard, network, broadcast, total, first, last, usable,
    ipStr: intToIp(ip),
    maskStr: intToIp(mask),
    wildcardStr: intToIp(wildcard),
    networkStr: intToIp(network),
    broadcastStr: intToIp(broadcast),
    firstStr: intToIp(first),
    lastStr: intToIp(last),
    ipClass: classify((ip>>>24)&255),
    addrType: priv ? (typeof priv === 'string' ? priv : 'Private (RFC 1918)') : 'Public'
  };
}

// ---------- state ----------
let state = { ip: '192.168.1.0', cidr: 24 };

const ipInput = document.getElementById('ipInput');
const cidrInput = document.getElementById('cidrInput');
const cidrSlider = document.getElementById('cidrSlider');
const errorMsg = document.getElementById('errorMsg');
const maskHint = document.getElementById('maskHint');

function render(){
  const valid = isValidIp(state.ip);
  errorMsg.style.display = valid ? 'none' : 'block';
  if(!valid) return;

  const r = calculate(state.ip, state.cidr);
  maskHint.textContent = '= ' + r.maskStr;
  cidrSlider.value = state.cidr;
  document.getElementById('cidrReadout').textContent = `/${state.cidr} · ${r.total.toLocaleString()} addresses`;

  renderOctets(r);
  renderResults(r);
  renderBinaryMath(r);
}

function renderOctets(r){
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
      btn.title = `Bit ${globalIndex+1} — click to set prefix to /${globalIndex+1}`;
      btn.addEventListener('click', () => { setCidr(globalIndex+1); });
      cells.appendChild(btn);
    }
    row.appendChild(cells);
    container.appendChild(row);
  }
}

function renderResults(r){
  const items = [
    ['Network address', r.networkStr],
    ['Broadcast address', r.broadcastStr],
    ['First usable host', r.firstStr],
    ['Last usable host', r.lastStr],
    ['Total addresses', r.total.toLocaleString()],
    ['Usable hosts', String(r.usable)],
    ['Subnet mask', r.maskStr],
    ['Wildcard mask', r.wildcardStr],
    ['IP class', r.ipClass],
    ['Address type', r.addrType],
  ];
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  items.forEach(([k,v]) => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div><button class="copy-btn" data-copy="${v}">copy</button>`;
    grid.appendChild(el);
  });
}

function renderBinaryMath(r){
  const ipBits = toBinaryOctets(r.ip).join('.');
  const maskBits = toBinaryOctets(r.mask).join('.');
  const netBits = toBinaryOctets(r.network).join('.');
  function colorize(bits, ref){
    return bits.split('').map((ch,i) => {
      if(ch === '.') return '.';
      const cls = i < state.cidr ? 'n' : 'h';
      return `<span class="${cls}">${ch}</span>`;
    }).join('');
  }
  const box = document.getElementById('binaryMath');
  box.innerHTML = `
    <div class="bm-row"><div class="bm-label">IP</div><div class="bm-bits">${colorize(ipBits)}</div></div>
    <div class="bm-row"><div class="bm-label">Mask</div><div class="bm-bits">${colorize(maskBits)}</div></div>
    <div class="bm-rule"></div>
    <div class="bm-row"><div class="bm-label">Network</div><div class="bm-bits">${colorize(netBits)}</div></div>
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
  const box = document.getElementById('binaryMath');
  box.classList.toggle('show');
  e.target.textContent = box.classList.contains('show') ? 'Hide the binary math ▴' : 'Show the binary math ▾';
});

// copy buttons (event delegation)
document.getElementById('resultsGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if(!btn) return;
  navigator.clipboard.writeText(btn.dataset.copy).then(showToast);
});
function showToast(){
  const t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1400);
}

// ---------- splitter ----------
document.getElementById('splitBtn').addEventListener('click', () => {
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
    warning.textContent = `Can't split — the requested size doesn't fit inside a /${state.cidr} network.`;
    document.getElementById('splitTable').style.display = 'none';
    return;
  }
  warning.style.display = numSubnets > cap ? 'block' : 'none';
  if(numSubnets > cap) warning.textContent = `Showing the first ${cap} of ${numSubnets.toLocaleString()} subnets.`;

  const blockSize = Math.pow(2, 32 - newCidr);
  const tbody = document.getElementById('splitBody');
  tbody.innerHTML = '';
  for(let i=0; i<showCount; i++){
    const netInt = (base.network + i*blockSize) >>> 0;
    const sub = calculate(intToIp(netInt), newCidr);
    const row = document.createElement('tr');
    row.innerHTML = `<td>${i+1}</td><td>${sub.networkStr}/${newCidr}</td><td>${sub.firstStr}</td><td>${sub.lastStr}</td><td>${sub.broadcastStr}</td><td>${sub.maskStr}</td>`;
    tbody.appendChild(row);
  }
  document.getElementById('splitTable').style.display = 'table';
});

render();
