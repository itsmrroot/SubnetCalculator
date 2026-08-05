# Slash — IPv4 Subnet Calculator

A fast, browser-based IPv4 subnet calculator with a built-in tutorial. Type in an IP address and a prefix length (CIDR), and it instantly works out the network address, broadcast address, usable host range, subnet mask, and more — while visually showing you exactly which bits are network bits and which are host bits.

Everything runs client-side. No data is ever sent to a server.

## 🔗 Live demo

**[Live site →](https://itsmrroot.github.io/SubnetCalculator/)**

## Features

- **Instant calculation** — enter an IP and prefix, get the network address, broadcast address, first/last usable host, total addresses, usable host count, subnet mask, wildcard mask, IP class, and address type (public/private/loopback/link-local).
- **Interactive bit visualizer** — every bit of the address is rendered as a clickable cell, color-coded network (blue) vs. host (green). Click any bit to jump the prefix length to that point.
- **CIDR slider** — drag to change the prefix length from /0 to /32 and watch every result update live.
- **Binary math view** — toggle a panel showing the IP, mask, and resulting network address in raw binary, colored by network/host bits.
- **Network splitter** — break the current network into smaller equal-sized subnets, either by specifying how many subnets you need or how many hosts per subnet. Results are shown in a table with network, first host, last host, broadcast, and mask for each subnet.
- **"How subnetting works" tutorial** — a five-step walkthrough built into the page (IP address structure → binary place values → subnet masks → CIDR prefixes → borrowing bits to make subnets), with diagrams and worked formulas, ending with a link back to the calculator.
- **Dark / light mode** — toggle in the nav bar, persisted across visits.
- **6 languages** — English, Deutsch, العربية, Türkçe, Français, Español, including right-to-left layout for Arabic. Every label, result, table header, and tutorial paragraph is translated; IP addresses, bit grids, and tables stay left-to-right in every language since that's how the notation actually reads.
- **Copy to clipboard** — every result field has a one-click copy button, with a toast confirmation.
- **No build step, no dependencies** — plain HTML, CSS, and JavaScript.

## Project structure

```
SubnetCalculator/
├── index.html       # Page markup (calculator + tutorial)
├── css/
│   └── style.css    # All styling, incl. dark/light theme + RTL rules
├── js/
│   ├── script.js     # Subnet math, UI rendering, theme toggle
│   └── lang.js       # Translations for all 6 languages
├── .github/
│   └── workflows/
│       └── deploy.yml  # Auto-deploys to GitHub Pages on push to main
└── README.md
```

## Running locally

No build tools or installation required — just open `index.html` in a browser:

```bash
open index.html          # macOS
# or serve it locally, e.g.:
npx serve .
```

## How it works

The calculator does standard IPv4 subnetting arithmetic on the address, treated as a 32-bit unsigned integer:

- **Subnet mask** — derived from the CIDR prefix (`/24` → `255.255.255.0`).
- **Network address** — the IP bitwise-ANDed with the subnet mask.
- **Broadcast address** — the network address with all host bits set to `1`.
- **Usable hosts** — every address in the range except the network and broadcast addresses (with special handling for `/31` point-to-point links per RFC 3021, and `/32` single-host routes).
- **Address type** — checked against the private ranges defined in RFC 1918, plus loopback (`127.0.0.0/8`) and link-local (`169.254.0.0/16`).

The network splitter works by calculating how many extra prefix bits are needed to satisfy the requested subnet count or host count, then enumerating each resulting block.

New to subnetting? Scroll to the **"How subnetting works"** section on the page itself (or click **Learn** in the nav bar) for a guided walkthrough covering IP address structure, binary/place values, subnet masks, CIDR notation, and borrowing bits to create subnets — in whichever of the 6 supported languages you prefer.

## Internationalization

All UI text lives in `js/lang.js` as a `LANGS` object keyed by language code (`en`, `de`, `ar`, `tr`, `fr`, `es`). `script.js` calls `applyLang()` whenever the language changes to update every label, table header, and tutorial paragraph on the page. Arabic sets `dir="rtl"` on `<body>`; CSS rules in `style.css` keep numeric/technical elements (the bit visualizer, binary math panel, tutorial diagrams, and the subnet table) pinned left-to-right regardless of text direction, since bit and address order is not something that should mirror by locale.

## Tech stack

- HTML5
- CSS3 (no framework) — CSS custom properties drive both themes
- Vanilla JavaScript (no framework, no build step)
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) and [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- GitHub Actions + GitHub Pages for deployment

## License

[MIT](LICENSE)
