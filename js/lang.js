/* ════════════════════════════════════════
   Slash – Language Translations
   ════════════════════════════════════════ */

const LANGS = {
  de: {
    dir: 'ltr',
    eyebrowNav: 'IPv4 Subnetzrechner',
    heroEyebrow: 'Subnetzrechner',
    heroTitleMain: 'Gib eine Adresse ein.',
    heroSpan: 'Er rechnet den Rest.',
    heroSub: 'Adresse und Präfixlänge eingeben — Slash berechnet sofort Netzwerk-, Broadcast- und Hostbereich und zeigt genau, welche Bits welche Aufgabe haben.',
    ipLabel: 'IP-Adresse',
    prefixLabel: 'Präfix',
    errorMsg: 'Gib eine gültige IPv4-Adresse ein, z. B. 192.168.1.0',
    bitsHeading: 'Welche Bits sind Netz, welche sind Host',
    legendNetwork: 'Netz',
    legendHost: 'Host',
    cidrReadout: (v, total) => `/${v} · ${total} Adressen`,
    binShow: 'Binärrechnung anzeigen ▾',
    binHide: 'Binärrechnung ausblenden ▴',
    resultsHeading: 'Ergebnis',
    res: { network: 'Netzwerkadresse', broadcast: 'Broadcast-Adresse', firstHost: 'Erster nutzbarer Host', lastHost: 'Letzter nutzbarer Host', total: 'Adressen gesamt', usable: 'Nutzbare Hosts', mask: 'Subnetzmaske', wildcard: 'Wildcard-Maske', ipClass: 'IP-Klasse', addrType: 'Adresstyp' },
    copyLabel: 'kopieren',
    toastCopied: 'Kopiert',
    explainLabel: 'erklären',
    modalCloseLabel: 'Schließen',
    explain: {
      network: (r) => `Die Netzwerkadresse ergibt sich aus einem bitweisen UND zwischen der IP und der Subnetzmaske: ${r.ipStr} UND ${r.maskStr} = ${r.networkStr}. Dabei wird jedes Host-Bit auf 0 gesetzt.`,
      broadcast: (r) => `Die Broadcast-Adresse ist die Netzwerkadresse mit jedem Host-Bit auf 1: ${r.networkStr} kombiniert mit der Wildcard-Maske ${r.wildcardStr} ergibt ${r.broadcastStr}.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `Ein /32 bezeichnet genau eine Adresse — ${r.firstStr} ist zugleich die erste und einzige nutzbare Adresse.`;
        if(r.cidr === 31) return `Eine /31-Punkt-zu-Punkt-Verbindung (RFC 3021) hat keine Netzwerk- oder Broadcast-Adresse — beide Adressen sind nutzbar, daher ist der erste nutzbare Host die Netzwerkadresse selbst: ${r.firstStr}.`;
        return `Der erste nutzbare Host ist die Netzwerkadresse plus 1: ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `Ein /32 bezeichnet genau eine Adresse — ${r.lastStr} ist zugleich die erste und einzige nutzbare Adresse.`;
        if(r.cidr === 31) return `Eine /31-Punkt-zu-Punkt-Verbindung (RFC 3021) hat keine Broadcast-Adresse — beide Adressen sind nutzbar, daher ist der letzte nutzbare Host die Broadcast-Adresse selbst: ${r.lastStr}.`;
        return `Der letzte nutzbare Host ist die Broadcast-Adresse minus 1: ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `Ein /${r.cidr}-Präfix lässt ${32-r.cidr} Host-Bits übrig, daher beträgt die Gesamtzahl der Adressen 2^${32-r.cidr} = ${r.total.toLocaleString()}.`,
      usable: (r) => {
        if(r.cidr >= 32) return `Ein /32 hat keine reservierte Netzwerk- oder Broadcast-Adresse, daher ist seine 1 Adresse nutzbar.`;
        if(r.cidr === 31) return `RFC 3021 macht eine Ausnahme für /31-Punkt-zu-Punkt-Verbindungen: Beide Adressen sind nutzbar, keine ist für Netzwerk oder Broadcast reserviert.`;
        return `Nutzbare Hosts sind die Gesamtzahl der Adressen minus 2, reserviert für Netzwerk- und Broadcast-Adresse: ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `Das Präfix /${r.cidr} bedeutet, dass die ersten ${r.cidr} Bits der Adresse Netzwerk-Bits sind (auf 1 gesetzt) und die restlichen ${32-r.cidr} Host-Bits sind (auf 0 gesetzt). Als vier Oktette geschrieben, ergibt das ${r.maskStr}.`,
      wildcard: (r) => `Die Wildcard-Maske kehrt jedes Bit der Subnetzmaske um: 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. Sie markiert die Host-Bits mit 1 statt mit 0.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `Die Klasse wird durch das erste Oktett bestimmt. ${firstOctet} liegt im Bereich ${ranges[r.ipClassBase]}, das ist Klasse ${r.ipClassBase}.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr} fällt in keinen reservierten privaten, Loopback- oder Link-lokalen Bereich, daher ist es eine öffentlich routbare Adresse.`,
          private: `${r.ipStr} liegt in einem durch RFC 1918 für private Netzwerke reservierten Bereich (10.0.0.0/8, 172.16.0.0/12 oder 192.168.0.0/16), daher ist es eine private Adresse.`,
          loopback: `${r.ipStr} beginnt mit 127, dem für Loopback-Verkehr reservierten Bereich, der nie den lokalen Rechner verlässt.`,
          linklocal: `${r.ipStr} liegt in 169.254.0.0/16, reserviert für Link-lokale Adressen, die automatisch vergeben werden, wenn kein DHCP-Server verfügbar ist.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'Dieses Netz aufteilen',
    splitterDesc: 'Teile das obige Netz in kleinere, gleich große Subnetze auf.',
    splitByLabel: 'Aufteilen nach',
    splitModeCount: 'Anzahl Subnetze',
    splitModeHosts: 'Hosts pro Subnetz',
    splitValueLabel: 'Wert',
    splitBtnLabel: 'Netz aufteilen',
    splitWarnCant: (cidr) => `Aufteilung nicht möglich — die gewünschte Größe passt nicht in ein /${cidr}-Netz.`,
    splitWarnShowing: (cap, total) => `Zeigt die ersten ${cap} von ${total} Subnetzen.`,
    th: { subnet: 'Subnetz', network: 'Netzwerk', availableRange: 'Verfügbarer Bereich', broadcast: 'Broadcast', mask: 'Maske' },
    footerText: 'Läuft vollständig im Browser. Nichts wird an einen Server gesendet.',
    bitTooltip: (bit, prefix) => `Bit ${bit} — klicken, um das Präfix auf /${prefix} zu setzen`,
    addr: { public: 'Öffentlich', private: 'Privat (RFC 1918)', loopback: 'Loopback', linkLocal: 'Link-lokal' },
    classSuffix: { multicast: ' (Multicast)', reserved: ' (reserviert)' },
    p2pSuffix: '2 (RFC 3021 Punkt-zu-Punkt)',
    themeToggleLabel: 'Design umschalten',
    navLearnLink: 'Lernen',
    learn: {
      heading: 'So funktioniert Subnetting',
      intro: 'Ein kurzer Überblick über die Ideen hinter dem Rechner oben — von einer einzelnen IP-Adresse zu mehreren Subnetzen, in fünf Schritten.',
      byteLabel: 'Byte',
      s1Title: 'Was ist eine IP-Adresse?',
      s1Text: 'Eine IPv4-Adresse ist 32 Bit lang und wird als vier Dezimalzahlen (0–255) geschrieben, getrennt durch Punkte — eine Zahl pro Byte (8 Bit). 192.168.1.0 sind eigentlich nur vier aneinandergereihte Bytes.',
      s1DiagTitle: '192.168.1.0 als vier Bytes',
      s2Title: 'Binärzahlen und Stellenwerte',
      s2Text: 'Computer kennen nur 0 und 1. Jede der 8 Positionen in einem Byte hat einen Stellenwert — 128, 64, 32, 16, 8, 4, 2, 1 — von links nach rechts. Addiere die Positionen mit einer 1, um den Dezimalwert zu erhalten.',
      s2DiagTitle: '192 in Binär',
      s2Note: '128 + 64 = 192 — nur die ersten beiden Bits sind gesetzt.',
      s3Title: 'Die Subnetzmaske',
      s3Text: 'Die Subnetzmaske zeigt, welche Bits der Adresse zum Netz- und welche zum Host-Teil gehören: eine 1 bedeutet Netz, eine 0 bedeutet Host. 255.255.255.0 setzt jedes Bit der ersten drei Bytes auf 1 und jedes Bit des letzten Bytes auf 0.',
      s3DiagTitle: '255.255.255.0 — Netz- vs. Host-Bits',
      s3Rule: '1 = Netz-Bit | 0 = Host-Bit',
      s4Title: 'Präfixlänge (CIDR)',
      s4Text: '/24 ist die Kurzschreibweise für die Subnetzmaske — sie sagt, dass die ersten 24 Bits der Netz-Teil sind, 8 Bits bleiben für Hosts. Die Anzahl nutzbarer Hosts ist 2 hoch Hostbits, minus 2 für Netz- und Broadcast-Adresse.',
      s4DiagTitle: '/24 = 24 Netz-Bits, 8 Host-Bits',
      s4FormulaLabel: 'Nutzbare Hosts',
      s4FormulaExpr: '2^(Hostbits) − 2',
      s5Title: 'Bits borgen für Subnetze',
      s5Text: 'Subnetting nimmt Bits vom Host-Teil und gibt sie dem Netz-Teil — weniger Hosts pro Netz gegen mehr, kleinere Netze. Werden 2 Bits geborgt, wird aus einem /24 ein /26: 4 neue Subnetze mit je 62 statt 254 nutzbaren Hosts.',
      s5DiagTitle: '/24 → /26 (2 Bits geborgt)',
      s5LegendS: 'S = Subnetz-Bit (geborgt)',
      s5LegendH: 'H = Host-Bit (bleibt)',
      s5FormulaSubnetsLabel: 'Neue Subnetze',
      s5FormulaSubnetsExpr: '2^(geborgene Bits)',
      s5FormulaHostsLabel: 'Hosts pro Subnetz',
      s5FormulaHostsExpr: '2^(verbleibende Hostbits) − 2',
      cta: 'Scroll nach oben und probier es mit deiner eigenen Adresse ↑',
    },
  },
  en: {
    dir: 'ltr',
    eyebrowNav: 'IPv4 subnet calculator',
    heroEyebrow: 'Subnet calculator',
    heroTitleMain: 'Give it an address.',
    heroSpan: 'It does the math.',
    heroSub: 'Type an IP and a prefix length — Slash works out the network, broadcast, and usable host range instantly, and shows exactly which bits are doing the work.',
    ipLabel: 'IP address',
    prefixLabel: 'Prefix',
    errorMsg: 'Enter a valid IPv4 address, e.g. 192.168.1.0',
    bitsHeading: 'Which bits are network, which are host',
    legendNetwork: 'Network',
    legendHost: 'Host',
    cidrReadout: (v, total) => `/${v} · ${total} addresses`,
    binShow: 'Show the binary math ▾',
    binHide: 'Hide the binary math ▴',
    resultsHeading: 'Result',
    res: { network: 'Network address', broadcast: 'Broadcast address', firstHost: 'First usable host', lastHost: 'Last usable host', total: 'Total addresses', usable: 'Usable hosts', mask: 'Subnet mask', wildcard: 'Wildcard mask', ipClass: 'IP class', addrType: 'Address type' },
    copyLabel: 'copy',
    toastCopied: 'Copied',
    explainLabel: 'explain',
    modalCloseLabel: 'Close',
    explain: {
      network: (r) => `The network address comes from a bitwise AND between the IP and the subnet mask: ${r.ipStr} AND ${r.maskStr} = ${r.networkStr}. Every host bit is forced to 0.`,
      broadcast: (r) => `The broadcast address is the network address with every host bit set to 1: ${r.networkStr} combined with the wildcard mask ${r.wildcardStr} gives ${r.broadcastStr}.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `A /32 identifies exactly one address — ${r.firstStr} is both the first and only usable address.`;
        if(r.cidr === 31) return `A /31 point-to-point link (RFC 3021) has no network or broadcast address — both addresses are usable, so the first usable host is the network address itself: ${r.firstStr}.`;
        return `The first usable host is the network address plus 1: ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `A /32 identifies exactly one address — ${r.lastStr} is both the first and only usable address.`;
        if(r.cidr === 31) return `A /31 point-to-point link (RFC 3021) has no broadcast address — both addresses are usable, so the last usable host is the broadcast address itself: ${r.lastStr}.`;
        return `The last usable host is the broadcast address minus 1: ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `A /${r.cidr} prefix leaves ${32-r.cidr} host bits, so the total address count is 2^${32-r.cidr} = ${r.total.toLocaleString()}.`,
      usable: (r) => {
        if(r.cidr >= 32) return `A /32 has no reserved network or broadcast address, so its 1 address is usable.`;
        if(r.cidr === 31) return `RFC 3021 makes an exception for /31 point-to-point links: both addresses are usable, none reserved for network or broadcast.`;
        return `Usable hosts are the total addresses minus 2, reserved for the network and broadcast addresses: ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `The prefix /${r.cidr} means the first ${r.cidr} bits of the address are network bits (set to 1) and the remaining ${32-r.cidr} are host bits (set to 0). Written as four octets, that's ${r.maskStr}.`,
      wildcard: (r) => `The wildcard mask flips every bit of the subnet mask: 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. It marks the host bits with 1s instead of 0s.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `The class is determined by the first octet. ${firstOctet} falls in the ${ranges[r.ipClassBase]} range, which is Class ${r.ipClassBase}.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr} doesn't fall into any reserved private, loopback, or link-local range, so it's a publicly routable address.`,
          private: `${r.ipStr} falls inside a range reserved by RFC 1918 for private networks (10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16), so it's a private address.`,
          loopback: `${r.ipStr} starts with 127, the range reserved for loopback traffic that never leaves the local machine.`,
          linklocal: `${r.ipStr} falls inside 169.254.0.0/16, reserved for link-local addresses assigned automatically when no DHCP server is available.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'Split this network',
    splitterDesc: 'Break the network above into smaller, equal-sized subnets.',
    splitByLabel: 'Split by',
    splitModeCount: 'Number of subnets',
    splitModeHosts: 'Hosts per subnet',
    splitValueLabel: 'Value',
    splitBtnLabel: 'Split network',
    splitWarnCant: (cidr) => `Can't split — the requested size doesn't fit inside a /${cidr} network.`,
    splitWarnShowing: (cap, total) => `Showing the first ${cap} of ${total} subnets.`,
    th: { subnet: 'Subnet', network: 'Network', availableRange: 'Available range', broadcast: 'Broadcast', mask: 'Mask' },
    footerText: 'Runs entirely in your browser. Nothing you type here is sent anywhere.',
    bitTooltip: (bit, prefix) => `Bit ${bit} — click to set prefix to /${prefix}`,
    addr: { public: 'Public', private: 'Private (RFC 1918)', loopback: 'Loopback', linkLocal: 'Link-local' },
    classSuffix: { multicast: ' (multicast)', reserved: ' (reserved)' },
    p2pSuffix: '2 (RFC 3021 point-to-point)',
    themeToggleLabel: 'Toggle theme',
    navLearnLink: 'Learn',
    learn: {
      heading: 'How subnetting works',
      intro: 'A short walkthrough of the ideas behind the calculator above — from a single IP address to a set of subnets, in five steps.',
      byteLabel: 'Byte',
      s1Title: 'What is an IP address?',
      s1Text: 'An IPv4 address is 32 bits long, written as four decimal numbers (0–255) separated by dots — one number per byte (8 bits). 192.168.1.0 is really just four bytes stitched together.',
      s1DiagTitle: '192.168.1.0 as four bytes',
      s2Title: 'Binary and place values',
      s2Text: 'Computers only understand 0 and 1. Each of the 8 positions in a byte is worth a power of two — 128, 64, 32, 16, 8, 4, 2, 1 — read left to right. Add up the positions that are 1 to get the decimal value.',
      s2DiagTitle: '192 in binary',
      s2Note: '128 + 64 = 192 — only the first two bits are set.',
      s3Title: 'The subnet mask',
      s3Text: 'The subnet mask marks which bits of the address are the network part and which are the host part: a 1 means network, a 0 means host. 255.255.255.0 sets every bit in the first three bytes to 1 and every bit in the last byte to 0.',
      s3DiagTitle: '255.255.255.0 — network vs. host bits',
      s3Rule: '1 = network bit | 0 = host bit',
      s4Title: 'Prefix length (CIDR)',
      s4Text: '/24 is shorthand for the subnet mask — it says the first 24 bits are the network part, leaving 8 bits for hosts. The number of usable hosts is 2 raised to the host-bit count, minus 2 for the network and broadcast addresses.',
      s4DiagTitle: '/24 = 24 network bits, 8 host bits',
      s4FormulaLabel: 'Usable hosts',
      s4FormulaExpr: '2^(host bits) − 2',
      s5Title: 'Borrowing bits to make subnets',
      s5Text: 'Subnetting takes bits from the host part and hands them to the network part, trading fewer hosts per network for more, smaller networks. Borrowing 2 bits turns a /24 into a /26: 4 new subnets, each with 62 usable hosts instead of 254.',
      s5DiagTitle: '/24 → /26 (2 bits borrowed)',
      s5LegendS: 'S = subnet bit (borrowed)',
      s5LegendH: 'H = host bit (remains)',
      s5FormulaSubnetsLabel: 'New subnets',
      s5FormulaSubnetsExpr: '2^(borrowed bits)',
      s5FormulaHostsLabel: 'Hosts per subnet',
      s5FormulaHostsExpr: '2^(remaining host bits) − 2',
      cta: 'Scroll back up and try it with your own address ↑',
    },
  },
  ar: {
    dir: 'rtl',
    eyebrowNav: 'حاسبة الشبكات الفرعية IPv4',
    heroEyebrow: 'حاسبة الشبكات الفرعية',
    heroTitleMain: 'أدخل عنوانًا.',
    heroSpan: 'وسيقوم بالحساب.',
    heroSub: 'أدخل عنوان IP وطول البادئة — يحسب Slash فورًا عنوان الشبكة والبث والنطاق المتاح للمضيفين، ويوضح بالضبط أي البتات تقوم بالعمل.',
    ipLabel: 'عنوان IP',
    prefixLabel: 'البادئة',
    errorMsg: 'أدخل عنوان IPv4 صالحًا، مثل 192.168.1.0',
    bitsHeading: 'ما هي بتات الشبكة وما هي بتات المضيف',
    legendNetwork: 'الشبكة',
    legendHost: 'المضيف',
    cidrReadout: (v, total) => `/${v} · ${total} عنوان`,
    binShow: 'إظهار الحساب الثنائي ▾',
    binHide: 'إخفاء الحساب الثنائي ▴',
    resultsHeading: 'النتيجة',
    res: { network: 'عنوان الشبكة', broadcast: 'عنوان البث', firstHost: 'أول مضيف صالح', lastHost: 'آخر مضيف صالح', total: 'إجمالي العناوين', usable: 'المضيفون القابلون للاستخدام', mask: 'قناع الشبكة الفرعية', wildcard: 'قناع Wildcard', ipClass: 'فئة IP', addrType: 'نوع العنوان' },
    copyLabel: 'نسخ',
    toastCopied: 'تم النسخ',
    explainLabel: 'شرح',
    modalCloseLabel: 'إغلاق',
    explain: {
      network: (r) => `عنوان الشبكة ينتج من عملية AND الثنائية بين عنوان IP وقناع الشبكة الفرعية: ${r.ipStr} AND ${r.maskStr} = ${r.networkStr}. يتم فيها تصفير كل بت مضيف.`,
      broadcast: (r) => `عنوان البث هو عنوان الشبكة مع تعيين كل بت مضيف إلى 1: دمج ${r.networkStr} مع قناع Wildcard ${r.wildcardStr} يعطي ${r.broadcastStr}.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `شبكة /32 تحدد عنوانًا واحدًا فقط — ${r.firstStr} هو العنوان الأول والوحيد القابل للاستخدام.`;
        if(r.cidr === 31) return `وصلة نقطة إلى نقطة /31 (RFC 3021) لا تملك عنوان شبكة أو بث — كلا العنوانين قابلان للاستخدام، لذا فإن أول مضيف قابل للاستخدام هو عنوان الشبكة نفسه: ${r.firstStr}.`;
        return `أول مضيف قابل للاستخدام هو عنوان الشبكة زائد 1: ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `شبكة /32 تحدد عنوانًا واحدًا فقط — ${r.lastStr} هو العنوان الأول والوحيد القابل للاستخدام.`;
        if(r.cidr === 31) return `وصلة نقطة إلى نقطة /31 (RFC 3021) لا تملك عنوان بث — كلا العنوانين قابلان للاستخدام، لذا فإن آخر مضيف قابل للاستخدام هو عنوان البث نفسه: ${r.lastStr}.`;
        return `آخر مضيف قابل للاستخدام هو عنوان البث ناقص 1: ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `بادئة /${r.cidr} تترك ${32-r.cidr} بت للمضيف، لذا فإن إجمالي عدد العناوين هو 2^${32-r.cidr} = ${r.total.toLocaleString()}.`,
      usable: (r) => {
        if(r.cidr >= 32) return `شبكة /32 لا تملك عنوان شبكة أو بث محجوزًا، لذا فإن عنوانها الوحيد قابل للاستخدام.`;
        if(r.cidr === 31) return `يستثني RFC 3021 وصلات نقطة إلى نقطة /31: كلا العنوانين قابلان للاستخدام، ولا شيء محجوز للشبكة أو البث.`;
        return `المضيفون القابلون للاستخدام هم إجمالي العناوين ناقص 2، المحجوزَين لعنواني الشبكة والبث: ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `البادئة /${r.cidr} تعني أن أول ${r.cidr} بت من العنوان هي بتات شبكة (مضبوطة على 1) والباقي ${32-r.cidr} بتات مضيف (مضبوطة على 0). مكتوبة كأربعة بايتات، هذا يعطي ${r.maskStr}.`,
      wildcard: (r) => `قناع Wildcard يعكس كل بت في قناع الشبكة الفرعية: 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. يمثل بتات المضيف بـ1 بدلاً من 0.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `يتم تحديد الفئة بواسطة البايت الأول. ${firstOctet} يقع ضمن نطاق ${ranges[r.ipClassBase]}، وهو الفئة ${r.ipClassBase}.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr} لا يقع ضمن أي نطاق محجوز خاص أو Loopback أو رابط محلي، لذا فهو عنوان عام قابل للتوجيه.`,
          private: `${r.ipStr} يقع ضمن نطاق محجوز بموجب RFC 1918 للشبكات الخاصة (10.0.0.0/8 أو 172.16.0.0/12 أو 192.168.0.0/16)، لذا فهو عنوان خاص.`,
          loopback: `${r.ipStr} يبدأ بـ127، النطاق المحجوز لحركة Loopback التي لا تغادر الجهاز المحلي أبدًا.`,
          linklocal: `${r.ipStr} يقع ضمن 169.254.0.0/16، المحجوز للعناوين ذات الرابط المحلي التي تُعيَّن تلقائيًا عند عدم توفر خادم DHCP.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'تقسيم هذه الشبكة',
    splitterDesc: 'قسّم الشبكة أعلاه إلى شبكات فرعية أصغر ومتساوية الحجم.',
    splitByLabel: 'التقسيم حسب',
    splitModeCount: 'عدد الشبكات الفرعية',
    splitModeHosts: 'المضيفون لكل شبكة فرعية',
    splitValueLabel: 'القيمة',
    splitBtnLabel: 'تقسيم الشبكة',
    splitWarnCant: (cidr) => `تعذر التقسيم — الحجم المطلوب لا يناسب شبكة /${cidr}.`,
    splitWarnShowing: (cap, total) => `عرض أول ${cap} من أصل ${total} شبكة فرعية.`,
    th: { subnet: 'شبكة فرعية', network: 'الشبكة', availableRange: 'النطاق المتاح', broadcast: 'البث', mask: 'القناع' },
    footerText: 'يعمل بالكامل في متصفحك. لا يتم إرسال أي شيء تكتبه إلى أي مكان.',
    bitTooltip: (bit, prefix) => `البت ${bit} — انقر لتعيين البادئة إلى /${prefix}`,
    addr: { public: 'عام', private: 'خاص (RFC 1918)', loopback: 'Loopback', linkLocal: 'رابط محلي' },
    classSuffix: { multicast: ' (بث متعدد)', reserved: ' (محجوز)' },
    p2pSuffix: '2 (RFC 3021 نقطة إلى نقطة)',
    themeToggleLabel: 'تبديل المظهر',
    navLearnLink: 'تعلّم',
    learn: {
      heading: 'كيف يعمل تقسيم الشبكات الفرعية',
      intro: 'شرح سريع للأفكار وراء الحاسبة أعلاه — من عنوان IP واحد إلى مجموعة من الشبكات الفرعية، في خمس خطوات.',
      byteLabel: 'بايت',
      s1Title: 'ما هو عنوان IP؟',
      s1Text: 'عنوان IPv4 يتكون من 32 بت، ويُكتب كأربعة أرقام عشرية (0–255) مفصولة بنقاط — رقم واحد لكل بايت (8 بت). 192.168.1.0 هو في الواقع أربعة بايتات مرتبطة ببعضها.',
      s1DiagTitle: '192.168.1.0 كأربعة بايتات',
      s2Title: 'الأرقام الثنائية والقيم المكانية',
      s2Text: 'الحواسيب تفهم فقط 0 و1. كل موضع من المواضع الثمانية في البايت له قيمة مكانية — 128، 64، 32، 16، 8، 4، 2، 1 — من اليسار إلى اليمين. اجمع المواضع التي قيمتها 1 للحصول على القيمة العشرية.',
      s2DiagTitle: '192 بالثنائي',
      s2Note: '128 + 64 = 192 — فقط أول بتين مفعّلتان.',
      s3Title: 'قناع الشبكة الفرعية',
      s3Text: 'يوضح قناع الشبكة الفرعية أي بتات العنوان تخص جزء الشبكة وأيها تخص جزء المضيف: 1 تعني شبكة، و0 تعني مضيف. 255.255.255.0 يجعل كل بت في البايتات الثلاثة الأولى 1 وكل بت في البايت الأخير 0.',
      s3DiagTitle: '255.255.255.0 — بتات الشبكة مقابل المضيف',
      s3Rule: '1 = بت شبكة | 0 = بت مضيف',
      s4Title: 'طول البادئة (CIDR)',
      s4Text: '/24 هي اختصار لقناع الشبكة الفرعية — تعني أن أول 24 بت هي جزء الشبكة، وتبقى 8 بتات للمضيفين. عدد المضيفين القابلين للاستخدام هو 2 أس عدد بتات المضيف، ناقص 2 لعنواني الشبكة والبث.',
      s4DiagTitle: '/24 = 24 بت شبكة، 8 بتات مضيف',
      s4FormulaLabel: 'المضيفون القابلون للاستخدام',
      s4FormulaExpr: '2^(بتات المضيف) − 2',
      s5Title: 'استعارة البتات لإنشاء شبكات فرعية',
      s5Text: 'تقسيم الشبكات الفرعية يأخذ بتات من جزء المضيف ويعطيها لجزء الشبكة — عدد أقل من المضيفين لكل شبكة مقابل عدد أكبر من الشبكات الأصغر. استعارة بتين تحوّل /24 إلى /26: 4 شبكات فرعية جديدة، كل منها بها 62 مضيفًا قابلًا للاستخدام بدلاً من 254.',
      s5DiagTitle: '/24 → /26 (بتان مستعارتان)',
      s5LegendS: 'S = بت شبكة فرعية (مستعار)',
      s5LegendH: 'H = بت مضيف (يبقى)',
      s5FormulaSubnetsLabel: 'شبكات فرعية جديدة',
      s5FormulaSubnetsExpr: '2^(البتات المستعارة)',
      s5FormulaHostsLabel: 'المضيفون لكل شبكة فرعية',
      s5FormulaHostsExpr: '2^(بتات المضيف المتبقية) − 2',
      cta: 'مرر للأعلى وجرّب بعنوانك الخاص ↑',
    },
  },
  tr: {
    dir: 'ltr',
    eyebrowNav: 'IPv4 alt ağ hesaplayıcı',
    heroEyebrow: 'Alt ağ hesaplayıcı',
    heroTitleMain: 'Bir adres ver.',
    heroSpan: 'Hesabı o yapsın.',
    heroSub: 'Bir IP ve önek uzunluğu gir — Slash ağ, yayın ve kullanılabilir host aralığını anında hesaplar ve hangi bitlerin ne iş yaptığını gösterir.',
    ipLabel: 'IP adresi',
    prefixLabel: 'Önek',
    errorMsg: 'Geçerli bir IPv4 adresi girin, örn. 192.168.1.0',
    bitsHeading: 'Hangi bitler ağ, hangileri host',
    legendNetwork: 'Ağ',
    legendHost: 'Host',
    cidrReadout: (v, total) => `/${v} · ${total} adres`,
    binShow: 'İkili hesaplamayı göster ▾',
    binHide: 'İkili hesaplamayı gizle ▴',
    resultsHeading: 'Sonuç',
    res: { network: 'Ağ adresi', broadcast: 'Yayın adresi', firstHost: 'İlk kullanılabilir host', lastHost: 'Son kullanılabilir host', total: 'Toplam adres', usable: 'Kullanılabilir hostlar', mask: 'Alt ağ maskesi', wildcard: 'Wildcard maskesi', ipClass: 'IP sınıfı', addrType: 'Adres türü' },
    copyLabel: 'kopyala',
    toastCopied: 'Kopyalandı',
    explainLabel: 'açıkla',
    modalCloseLabel: 'Kapat',
    explain: {
      network: (r) => `Ağ adresi, IP ile alt ağ maskesi arasındaki bit düzeyinde AND işleminden gelir: ${r.ipStr} AND ${r.maskStr} = ${r.networkStr}. Bu işlem her host bitini 0 yapar.`,
      broadcast: (r) => `Yayın adresi, her host biti 1 olarak ayarlanmış ağ adresidir: ${r.networkStr} ile wildcard maskesi ${r.wildcardStr} birleştiğinde ${r.broadcastStr} elde edilir.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `/32, tam olarak tek bir adresi belirtir — ${r.firstStr} hem ilk hem de tek kullanılabilir adrestir.`;
        if(r.cidr === 31) return `/31 noktadan noktaya bağlantının (RFC 3021) ağ veya yayın adresi yoktur — her iki adres de kullanılabilir, bu yüzden ilk kullanılabilir host ağ adresinin kendisidir: ${r.firstStr}.`;
        return `İlk kullanılabilir host, ağ adresi artı 1'dir: ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `/32, tam olarak tek bir adresi belirtir — ${r.lastStr} hem ilk hem de tek kullanılabilir adrestir.`;
        if(r.cidr === 31) return `/31 noktadan noktaya bağlantının (RFC 3021) yayın adresi yoktur — her iki adres de kullanılabilir, bu yüzden son kullanılabilir host yayın adresinin kendisidir: ${r.lastStr}.`;
        return `Son kullanılabilir host, yayın adresi eksi 1'dir: ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `/${r.cidr} öneki ${32-r.cidr} host biti bırakır, bu yüzden toplam adres sayısı 2^${32-r.cidr} = ${r.total.toLocaleString()} olur.`,
      usable: (r) => {
        if(r.cidr >= 32) return `/32'nin rezerve edilmiş bir ağ veya yayın adresi yoktur, bu yüzden tek adresi kullanılabilir.`;
        if(r.cidr === 31) return `RFC 3021, /31 noktadan noktaya bağlantılar için bir istisna yapar: her iki adres de kullanılabilir, hiçbiri ağ veya yayın için ayrılmamıştır.`;
        return `Kullanılabilir hostlar, ağ ve yayın adresleri için ayrılan 2 çıkarıldıktan sonraki toplam adres sayısıdır: ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `/${r.cidr} öneki, adresin ilk ${r.cidr} bitinin ağ biti (1'e ayarlı) ve kalan ${32-r.cidr} bitin host biti (0'a ayarlı) olduğu anlamına gelir. Dört bayt olarak yazıldığında bu ${r.maskStr} olur.`,
      wildcard: (r) => `Wildcard maskesi, alt ağ maskesinin her bitini tersine çevirir: 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. Host bitlerini 0 yerine 1 ile işaretler.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `Sınıf, ilk bayt tarafından belirlenir. ${firstOctet}, ${ranges[r.ipClassBase]} aralığına girer ve bu Sınıf ${r.ipClassBase}'dir.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr}, herhangi bir rezerve özel, loopback veya bağlantı yerel aralığına girmiyor, bu yüzden genel olarak yönlendirilebilir bir adrestir.`,
          private: `${r.ipStr}, RFC 1918 tarafından özel ağlar için ayrılan bir aralığa giriyor (10.0.0.0/8, 172.16.0.0/12 veya 192.168.0.0/16), bu yüzden özel bir adrestir.`,
          loopback: `${r.ipStr}, yerel makineden asla çıkmayan loopback trafiği için ayrılan 127 ile başlıyor.`,
          linklocal: `${r.ipStr}, DHCP sunucusu bulunmadığında otomatik olarak atanan bağlantı yerel adresler için ayrılan 169.254.0.0/16 aralığına giriyor.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'Bu ağı böl',
    splitterDesc: 'Yukarıdaki ağı daha küçük, eşit boyutlu alt ağlara böl.',
    splitByLabel: 'Bölme şekli',
    splitModeCount: 'Alt ağ sayısı',
    splitModeHosts: 'Alt ağ başına host',
    splitValueLabel: 'Değer',
    splitBtnLabel: 'Ağı böl',
    splitWarnCant: (cidr) => `Bölünemiyor — istenen boyut bir /${cidr} ağına sığmıyor.`,
    splitWarnShowing: (cap, total) => `${total} alt ağdan ilk ${cap} tanesi gösteriliyor.`,
    th: { subnet: 'Alt ağ', network: 'Ağ', availableRange: 'Kullanılabilir aralık', broadcast: 'Yayın', mask: 'Maske' },
    footerText: 'Tamamen tarayıcınızda çalışır. Buraya yazdığınız hiçbir şey herhangi bir yere gönderilmez.',
    bitTooltip: (bit, prefix) => `Bit ${bit} — öneki /${prefix} yapmak için tıkla`,
    addr: { public: 'Genel', private: 'Özel (RFC 1918)', loopback: 'Loopback', linkLocal: 'Bağlantı yerel' },
    classSuffix: { multicast: ' (multicast)', reserved: ' (ayrılmış)' },
    p2pSuffix: '2 (RFC 3021 noktadan noktaya)',
    themeToggleLabel: 'Temayı değiştir',
    navLearnLink: 'Öğren',
    learn: {
      heading: 'Alt ağ oluşturma nasıl çalışır',
      intro: 'Yukarıdaki hesaplayıcının arkasındaki fikirlere kısa bir bakış — tek bir IP adresinden bir dizi alt ağa, beş adımda.',
      byteLabel: 'Bayt',
      s1Title: 'IP adresi nedir?',
      s1Text: 'Bir IPv4 adresi 32 bit uzunluğundadır ve noktalarla ayrılmış dört ondalık sayı (0–255) olarak yazılır — bayt (8 bit) başına bir sayı. 192.168.1.0 aslında art arda dizilmiş dört bayttan ibarettir.',
      s1DiagTitle: 'Dört bayt olarak 192.168.1.0',
      s2Title: 'İkili sayılar ve basamak değerleri',
      s2Text: 'Bilgisayarlar yalnızca 0 ve 1\'i anlar. Bir bayttaki 8 konumun her birinin bir basamak değeri vardır — 128, 64, 32, 16, 8, 4, 2, 1 — soldan sağa. Ondalık değeri bulmak için 1 olan konumları topla.',
      s2DiagTitle: 'İkili olarak 192',
      s2Note: '128 + 64 = 192 — yalnızca ilk iki bit ayarlı.',
      s3Title: 'Alt ağ maskesi',
      s3Text: 'Alt ağ maskesi, adresin hangi bitlerinin ağ, hangilerinin host kısmı olduğunu gösterir: 1 ağ demektir, 0 host demektir. 255.255.255.0, ilk üç bayttaki her biti 1\'e, son bayttaki her biti 0\'a ayarlar.',
      s3DiagTitle: '255.255.255.0 — ağ ve host bitleri',
      s3Rule: '1 = ağ biti | 0 = host biti',
      s4Title: 'Önek uzunluğu (CIDR)',
      s4Text: '/24, alt ağ maskesinin kısaltmasıdır — ilk 24 bitin ağ kısmı olduğunu, 8 bitin host için kaldığını söyler. Kullanılabilir host sayısı, host bit sayısının 2 üssü eksi 2\'dir (ağ ve yayın adresleri için).',
      s4DiagTitle: '/24 = 24 ağ biti, 8 host biti',
      s4FormulaLabel: 'Kullanılabilir hostlar',
      s4FormulaExpr: '2^(host bitleri) − 2',
      s5Title: 'Alt ağ oluşturmak için bit ödünç almak',
      s5Text: 'Alt ağ oluşturma, host kısmından bit alıp ağ kısmına verir — ağ başına daha az host karşılığında daha fazla, daha küçük ağ. 2 bit ödünç almak bir /24\'ü /26\'ya çevirir: her biri 254 yerine 62 kullanılabilir hosta sahip 4 yeni alt ağ.',
      s5DiagTitle: '/24 → /26 (2 bit ödünç alındı)',
      s5LegendS: 'S = alt ağ biti (ödünç alındı)',
      s5LegendH: 'H = host biti (kalır)',
      s5FormulaSubnetsLabel: 'Yeni alt ağlar',
      s5FormulaSubnetsExpr: '2^(ödünç alınan bitler)',
      s5FormulaHostsLabel: 'Alt ağ başına host',
      s5FormulaHostsExpr: '2^(kalan host bitleri) − 2',
      cta: 'Yukarı kaydır ve kendi adresinle dene ↑',
    },
  },
  fr: {
    dir: 'ltr',
    eyebrowNav: 'Calculateur de sous-réseau IPv4',
    heroEyebrow: 'Calculateur de sous-réseau',
    heroTitleMain: 'Donne-lui une adresse.',
    heroSpan: 'Il fait le calcul.',
    heroSub: "Saisis une IP et une longueur de préfixe — Slash calcule instantanément le réseau, la diffusion et la plage d'hôtes utilisables, et montre exactement quels bits font le travail.",
    ipLabel: 'Adresse IP',
    prefixLabel: 'Préfixe',
    errorMsg: 'Entrez une adresse IPv4 valide, ex. 192.168.1.0',
    bitsHeading: 'Quels bits sont réseau, lesquels sont hôte',
    legendNetwork: 'Réseau',
    legendHost: 'Hôte',
    cidrReadout: (v, total) => `/${v} · ${total} adresses`,
    binShow: 'Afficher le calcul binaire ▾',
    binHide: 'Masquer le calcul binaire ▴',
    resultsHeading: 'Résultat',
    res: { network: 'Adresse réseau', broadcast: 'Adresse de diffusion', firstHost: 'Premier hôte utilisable', lastHost: 'Dernier hôte utilisable', total: 'Adresses totales', usable: 'Hôtes utilisables', mask: 'Masque de sous-réseau', wildcard: 'Masque générique', ipClass: 'Classe IP', addrType: "Type d'adresse" },
    copyLabel: 'copier',
    toastCopied: 'Copié',
    explainLabel: 'expliquer',
    modalCloseLabel: 'Fermer',
    explain: {
      network: (r) => `L'adresse réseau provient d'un ET logique bit à bit entre l'IP et le masque de sous-réseau : ${r.ipStr} ET ${r.maskStr} = ${r.networkStr}. Chaque bit hôte est forcé à 0.`,
      broadcast: (r) => `L'adresse de diffusion est l'adresse réseau avec chaque bit hôte à 1 : ${r.networkStr} combinée au masque générique ${r.wildcardStr} donne ${r.broadcastStr}.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `Un /32 désigne exactement une adresse — ${r.firstStr} est à la fois la première et la seule adresse utilisable.`;
        if(r.cidr === 31) return `Une liaison point-à-point /31 (RFC 3021) n'a ni adresse réseau ni adresse de diffusion — les deux adresses sont utilisables, donc le premier hôte utilisable est l'adresse réseau elle-même : ${r.firstStr}.`;
        return `Le premier hôte utilisable est l'adresse réseau plus 1 : ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `Un /32 désigne exactement une adresse — ${r.lastStr} est à la fois la première et la seule adresse utilisable.`;
        if(r.cidr === 31) return `Une liaison point-à-point /31 (RFC 3021) n'a pas d'adresse de diffusion — les deux adresses sont utilisables, donc le dernier hôte utilisable est l'adresse de diffusion elle-même : ${r.lastStr}.`;
        return `Le dernier hôte utilisable est l'adresse de diffusion moins 1 : ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `Un préfixe /${r.cidr} laisse ${32-r.cidr} bits hôte, donc le nombre total d'adresses est 2^${32-r.cidr} = ${r.total.toLocaleString()}.`,
      usable: (r) => {
        if(r.cidr >= 32) return `Un /32 n'a pas d'adresse réseau ni de diffusion réservée, donc son unique adresse est utilisable.`;
        if(r.cidr === 31) return `Le RFC 3021 fait une exception pour les liaisons point-à-point /31 : les deux adresses sont utilisables, aucune n'est réservée au réseau ou à la diffusion.`;
        return `Les hôtes utilisables correspondent au total d'adresses moins 2, réservées aux adresses réseau et de diffusion : ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `Le préfixe /${r.cidr} signifie que les ${r.cidr} premiers bits de l'adresse sont des bits réseau (à 1) et que les ${32-r.cidr} bits restants sont des bits hôte (à 0). Écrit en quatre octets, cela donne ${r.maskStr}.`,
      wildcard: (r) => `Le masque générique inverse chaque bit du masque de sous-réseau : 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. Il marque les bits hôte par des 1 au lieu de des 0.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `La classe est déterminée par le premier octet. ${firstOctet} se situe dans la plage ${ranges[r.ipClassBase]}, ce qui correspond à la classe ${r.ipClassBase}.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr} ne fait partie d'aucune plage privée, de bouclage ou de lien local réservée, c'est donc une adresse publiquement routable.`,
          private: `${r.ipStr} se situe dans une plage réservée par le RFC 1918 pour les réseaux privés (10.0.0.0/8, 172.16.0.0/12 ou 192.168.0.0/16), c'est donc une adresse privée.`,
          loopback: `${r.ipStr} commence par 127, la plage réservée au trafic de bouclage qui ne quitte jamais la machine locale.`,
          linklocal: `${r.ipStr} se situe dans 169.254.0.0/16, réservée aux adresses de lien local attribuées automatiquement en l'absence de serveur DHCP.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'Diviser ce réseau',
    splitterDesc: 'Découpe le réseau ci-dessus en sous-réseaux plus petits et de taille égale.',
    splitByLabel: 'Diviser par',
    splitModeCount: 'Nombre de sous-réseaux',
    splitModeHosts: 'Hôtes par sous-réseau',
    splitValueLabel: 'Valeur',
    splitBtnLabel: 'Diviser le réseau',
    splitWarnCant: (cidr) => `Division impossible — la taille demandée ne tient pas dans un réseau /${cidr}.`,
    splitWarnShowing: (cap, total) => `Affichage des ${cap} premiers sous-réseaux sur ${total}.`,
    th: { subnet: 'Sous-réseau', network: 'Réseau', availableRange: 'Plage disponible', broadcast: 'Diffusion', mask: 'Masque' },
    footerText: "Fonctionne entièrement dans votre navigateur. Rien de ce que vous tapez ici n'est envoyé où que ce soit.",
    bitTooltip: (bit, prefix) => `Bit ${bit} — cliquez pour régler le préfixe sur /${prefix}`,
    addr: { public: 'Public', private: 'Privé (RFC 1918)', loopback: 'Bouclage', linkLocal: 'Lien local' },
    classSuffix: { multicast: ' (multidiffusion)', reserved: ' (réservée)' },
    p2pSuffix: '2 (RFC 3021 point-à-point)',
    themeToggleLabel: 'Changer de thème',
    navLearnLink: 'Apprendre',
    learn: {
      heading: 'Comment fonctionne le subnetting',
      intro: 'Un petit tour des idées derrière le calculateur ci-dessus — d\'une seule adresse IP à un ensemble de sous-réseaux, en cinq étapes.',
      byteLabel: 'Octet',
      s1Title: 'Qu\'est-ce qu\'une adresse IP ?',
      s1Text: 'Une adresse IPv4 fait 32 bits, écrite sous forme de quatre nombres décimaux (0–255) séparés par des points — un nombre par octet (8 bits). 192.168.1.0, ce sont en réalité quatre octets mis bout à bout.',
      s1DiagTitle: '192.168.1.0 en quatre octets',
      s2Title: 'Binaire et valeurs positionnelles',
      s2Text: 'Les ordinateurs ne comprennent que 0 et 1. Chacune des 8 positions d\'un octet vaut une puissance de deux — 128, 64, 32, 16, 8, 4, 2, 1 — de gauche à droite. Additionne les positions à 1 pour obtenir la valeur décimale.',
      s2DiagTitle: '192 en binaire',
      s2Note: '128 + 64 = 192 — seuls les deux premiers bits sont à 1.',
      s3Title: 'Le masque de sous-réseau',
      s3Text: 'Le masque de sous-réseau indique quels bits de l\'adresse appartiennent au réseau et lesquels à l\'hôte : un 1 signifie réseau, un 0 signifie hôte. 255.255.255.0 met tous les bits des trois premiers octets à 1 et tous ceux du dernier octet à 0.',
      s3DiagTitle: '255.255.255.0 — bits réseau vs hôte',
      s3Rule: '1 = bit réseau | 0 = bit hôte',
      s4Title: 'Longueur de préfixe (CIDR)',
      s4Text: '/24 est la notation abrégée du masque de sous-réseau — cela signifie que les 24 premiers bits sont la partie réseau, laissant 8 bits pour les hôtes. Le nombre d\'hôtes utilisables est 2 puissance le nombre de bits hôte, moins 2 pour les adresses réseau et de diffusion.',
      s4DiagTitle: '/24 = 24 bits réseau, 8 bits hôte',
      s4FormulaLabel: 'Hôtes utilisables',
      s4FormulaExpr: '2^(bits hôte) − 2',
      s5Title: 'Emprunter des bits pour créer des sous-réseaux',
      s5Text: 'Le subnetting prend des bits de la partie hôte et les donne à la partie réseau — moins d\'hôtes par réseau contre davantage de réseaux, plus petits. Emprunter 2 bits transforme un /24 en /26 : 4 nouveaux sous-réseaux, chacun avec 62 hôtes utilisables au lieu de 254.',
      s5DiagTitle: '/24 → /26 (2 bits empruntés)',
      s5LegendS: 'S = bit de sous-réseau (emprunté)',
      s5LegendH: 'H = bit hôte (reste)',
      s5FormulaSubnetsLabel: 'Nouveaux sous-réseaux',
      s5FormulaSubnetsExpr: '2^(bits empruntés)',
      s5FormulaHostsLabel: 'Hôtes par sous-réseau',
      s5FormulaHostsExpr: '2^(bits hôte restants) − 2',
      cta: 'Remonte et essaie avec ta propre adresse ↑',
    },
  },
  es: {
    dir: 'ltr',
    eyebrowNav: 'Calculadora de subred IPv4',
    heroEyebrow: 'Calculadora de subred',
    heroTitleMain: 'Dale una dirección.',
    heroSpan: 'Él hace el cálculo.',
    heroSub: 'Escribe una IP y una longitud de prefijo — Slash calcula al instante la red, la difusión y el rango de hosts utilizables, y muestra exactamente qué bits hacen el trabajo.',
    ipLabel: 'Dirección IP',
    prefixLabel: 'Prefijo',
    errorMsg: 'Introduce una dirección IPv4 válida, p. ej. 192.168.1.0',
    bitsHeading: 'Qué bits son de red y cuáles de host',
    legendNetwork: 'Red',
    legendHost: 'Host',
    cidrReadout: (v, total) => `/${v} · ${total} direcciones`,
    binShow: 'Mostrar el cálculo binario ▾',
    binHide: 'Ocultar el cálculo binario ▴',
    resultsHeading: 'Resultado',
    res: { network: 'Dirección de red', broadcast: 'Dirección de difusión', firstHost: 'Primer host utilizable', lastHost: 'Último host utilizable', total: 'Direcciones totales', usable: 'Hosts utilizables', mask: 'Máscara de subred', wildcard: 'Máscara wildcard', ipClass: 'Clase IP', addrType: 'Tipo de dirección' },
    copyLabel: 'copiar',
    toastCopied: 'Copiado',
    explainLabel: 'explicar',
    modalCloseLabel: 'Cerrar',
    explain: {
      network: (r) => `La dirección de red proviene de un AND a nivel de bits entre la IP y la máscara de subred: ${r.ipStr} AND ${r.maskStr} = ${r.networkStr}. Esto pone a 0 cada bit de host.`,
      broadcast: (r) => `La dirección de difusión es la dirección de red con cada bit de host en 1: ${r.networkStr} combinada con la máscara wildcard ${r.wildcardStr} da ${r.broadcastStr}.`,
      firstHost: (r) => {
        if(r.cidr >= 32) return `Un /32 identifica exactamente una dirección — ${r.firstStr} es a la vez la primera y la única dirección utilizable.`;
        if(r.cidr === 31) return `Un enlace punto a punto /31 (RFC 3021) no tiene dirección de red ni de difusión — ambas direcciones son utilizables, así que el primer host utilizable es la propia dirección de red: ${r.firstStr}.`;
        return `El primer host utilizable es la dirección de red más 1: ${r.networkStr} + 1 = ${r.firstStr}.`;
      },
      lastHost: (r) => {
        if(r.cidr >= 32) return `Un /32 identifica exactamente una dirección — ${r.lastStr} es a la vez la primera y la única dirección utilizable.`;
        if(r.cidr === 31) return `Un enlace punto a punto /31 (RFC 3021) no tiene dirección de difusión — ambas direcciones son utilizables, así que el último host utilizable es la propia dirección de difusión: ${r.lastStr}.`;
        return `El último host utilizable es la dirección de difusión menos 1: ${r.broadcastStr} − 1 = ${r.lastStr}.`;
      },
      total: (r) => `Un prefijo /${r.cidr} deja ${32-r.cidr} bits de host, así que el total de direcciones es 2^${32-r.cidr} = ${r.total.toLocaleString()}.`,
      usable: (r) => {
        if(r.cidr >= 32) return `Un /32 no tiene dirección de red ni de difusión reservada, así que su única dirección es utilizable.`;
        if(r.cidr === 31) return `El RFC 3021 hace una excepción para los enlaces punto a punto /31: ambas direcciones son utilizables, ninguna está reservada para red o difusión.`;
        return `Los hosts utilizables son el total de direcciones menos 2, reservadas para las direcciones de red y difusión: ${r.total.toLocaleString()} − 2 = ${Number(r.usableCode).toLocaleString()}.`;
      },
      mask: (r) => `El prefijo /${r.cidr} significa que los primeros ${r.cidr} bits de la dirección son bits de red (en 1) y los ${32-r.cidr} bits restantes son bits de host (en 0). Escrito como cuatro octetos, eso es ${r.maskStr}.`,
      wildcard: (r) => `La máscara wildcard invierte cada bit de la máscara de subred: 255.255.255.255 − ${r.maskStr} = ${r.wildcardStr}. Marca los bits de host con 1 en lugar de 0.`,
      ipClass: (r) => {
        const firstOctet = (r.ip>>>24)&255;
        const ranges = {A:'0–127', B:'128–191', C:'192–223', D:'224–239', E:'240–255'};
        return `La clase se determina por el primer octeto. ${firstOctet} cae en el rango ${ranges[r.ipClassBase]}, que es la Clase ${r.ipClassBase}.`;
      },
      addrType: (r) => {
        const map = {
          public: `${r.ipStr} no cae en ningún rango privado, de loopback o de enlace local reservado, así que es una dirección públicamente enrutable.`,
          private: `${r.ipStr} cae dentro de un rango reservado por el RFC 1918 para redes privadas (10.0.0.0/8, 172.16.0.0/12 o 192.168.0.0/16), así que es una dirección privada.`,
          loopback: `${r.ipStr} comienza con 127, el rango reservado para el tráfico de loopback que nunca sale de la máquina local.`,
          linklocal: `${r.ipStr} cae dentro de 169.254.0.0/16, reservado para direcciones de enlace local asignadas automáticamente cuando no hay un servidor DHCP disponible.`,
        };
        return map[r.addrKind];
      },
    },
    splitterHeading: 'Dividir esta red',
    splitterDesc: 'Divide la red anterior en subredes más pequeñas y de igual tamaño.',
    splitByLabel: 'Dividir por',
    splitModeCount: 'Número de subredes',
    splitModeHosts: 'Hosts por subred',
    splitValueLabel: 'Valor',
    splitBtnLabel: 'Dividir red',
    splitWarnCant: (cidr) => `No se puede dividir — el tamaño solicitado no cabe en una red /${cidr}.`,
    splitWarnShowing: (cap, total) => `Mostrando las primeras ${cap} de ${total} subredes.`,
    th: { subnet: 'Subred', network: 'Red', availableRange: 'Rango disponible', broadcast: 'Difusión', mask: 'Máscara' },
    footerText: 'Funciona completamente en tu navegador. Nada de lo que escribas aquí se envía a ningún sitio.',
    bitTooltip: (bit, prefix) => `Bit ${bit} — haz clic para fijar el prefijo en /${prefix}`,
    addr: { public: 'Pública', private: 'Privada (RFC 1918)', loopback: 'Loopback', linkLocal: 'Enlace local' },
    classSuffix: { multicast: ' (multidifusión)', reserved: ' (reservada)' },
    p2pSuffix: '2 (RFC 3021 punto a punto)',
    themeToggleLabel: 'Cambiar tema',
    navLearnLink: 'Aprender',
    learn: {
      heading: 'Cómo funciona la subdivisión en subredes',
      intro: 'Un breve recorrido por las ideas detrás de la calculadora de arriba — de una sola dirección IP a un conjunto de subredes, en cinco pasos.',
      byteLabel: 'Byte',
      s1Title: '¿Qué es una dirección IP?',
      s1Text: 'Una dirección IPv4 tiene 32 bits y se escribe como cuatro números decimales (0–255) separados por puntos — un número por byte (8 bits). 192.168.1.0 son en realidad cuatro bytes unidos.',
      s1DiagTitle: '192.168.1.0 como cuatro bytes',
      s2Title: 'Binario y valores posicionales',
      s2Text: 'Los ordenadores solo entienden 0 y 1. Cada una de las 8 posiciones de un byte vale una potencia de dos — 128, 64, 32, 16, 8, 4, 2, 1 — de izquierda a derecha. Suma las posiciones con un 1 para obtener el valor decimal.',
      s2DiagTitle: '192 en binario',
      s2Note: '128 + 64 = 192 — solo los dos primeros bits están activados.',
      s3Title: 'La máscara de subred',
      s3Text: 'La máscara de subred indica qué bits de la dirección son la parte de red y cuáles la de host: un 1 significa red, un 0 significa host. 255.255.255.0 pone en 1 todos los bits de los tres primeros bytes y en 0 todos los del último byte.',
      s3DiagTitle: '255.255.255.0 — bits de red vs. host',
      s3Rule: '1 = bit de red | 0 = bit de host',
      s4Title: 'Longitud de prefijo (CIDR)',
      s4Text: '/24 es la notación abreviada de la máscara de subred — indica que los primeros 24 bits son la parte de red, dejando 8 bits para hosts. El número de hosts utilizables es 2 elevado al número de bits de host, menos 2 por las direcciones de red y difusión.',
      s4DiagTitle: '/24 = 24 bits de red, 8 bits de host',
      s4FormulaLabel: 'Hosts utilizables',
      s4FormulaExpr: '2^(bits de host) − 2',
      s5Title: 'Pedir prestados bits para crear subredes',
      s5Text: 'La subdivisión en subredes toma bits de la parte de host y se los da a la parte de red — menos hosts por red a cambio de más redes, más pequeñas. Pedir prestados 2 bits convierte un /24 en un /26: 4 subredes nuevas, cada una con 62 hosts utilizables en lugar de 254.',
      s5DiagTitle: '/24 → /26 (2 bits prestados)',
      s5LegendS: 'S = bit de subred (prestado)',
      s5LegendH: 'H = bit de host (permanece)',
      s5FormulaSubnetsLabel: 'Subredes nuevas',
      s5FormulaSubnetsExpr: '2^(bits prestados)',
      s5FormulaHostsLabel: 'Hosts por subred',
      s5FormulaHostsExpr: '2^(bits de host restantes) − 2',
      cta: 'Sube y pruébalo con tu propia dirección ↑',
    },
  },
};

let currentLang = localStorage.getItem('slash-lang') || 'en';

function getLang() {
  return LANGS[currentLang] || LANGS['en'];
}

function setLang(lang, callback) {
  currentLang = LANGS[lang] ? lang : 'en';
  localStorage.setItem('slash-lang', currentLang);
  const L = LANGS[currentLang];
  document.documentElement.lang = currentLang;
  document.body.setAttribute('dir', L.dir);
  if (callback) callback();
}
