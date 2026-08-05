# Slash — IPv4 Subnet Calculator

A fast, browser-based IPv4 subnet calculator. Type in an IP address and a prefix length (CIDR), and it instantly works out the network address, broadcast address, usable host range, subnet mask, and more — while visually showing you exactly which bits are network bits and which are host bits.

Everything runs client-side. No data is ever sent to a server.

## 🔗 Live demo

**[Live site →](https://itsmrroot.github.io/SubnetCalculator/)**

## Features

- **Instant calculation** — enter an IP and prefix, get the network address, broadcast address, first/last usable host, total addresses, usable host count, subnet mask, wildcard mask, IP class, and address type (public/private/loopback/link-local).
- **Interactive bit visualizer** — every bit of the address is rendered as a clickable cell, color-coded network (teal) vs. host (amber). Click any bit to jump the prefix length to that point.
- **CIDR slider** — drag to change the prefix length from /0 to /32 and watch every result update live.
- **Binary math view** — toggle a panel showing the IP, mask, and resulting network address in raw binary, colored by network/host bits.
- **Network splitter** — break the current network into smaller equal-sized subnets, either by specifying how many subnets you need or how many hosts per subnet. Results are shown in a table with network, first host, last host, broadcast, and mask for each subnet.
- **Copy to clipboard** — every result field has a one-click copy button, with a toast confirmation.
- **No build step, no dependencies** — plain HTML, CSS, and JavaScript.

## Project structure

```
SubnetCalculator/
├── index.html       # Page markup
├── css/
│   └── style.css    # All styling
├── js/
│   └── script.js    # Subnet math + UI logic
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

## Tech stack

- HTML5
- CSS3 (no framework)
- Vanilla JavaScript (no framework, no build step)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), and [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

## License

This project is free to use and modify.
