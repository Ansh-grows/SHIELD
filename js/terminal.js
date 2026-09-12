/**
 * SHIELD Cyber Society - Interactive Terminal Engine
 * Emulates a security-hardened Linux/BSD bash environment with society telemetry
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (!terminalInput || !terminalOutput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const ASCII_BANNER = `
  ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
  ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
  ███████╗███████║██║█████╗  ██║     ██║  ██║
  ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
  ███████║██║  ██║██║███████╗███████╗██████╔╝
  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
  NIT HAMIRPUR - STUDENT CYBER DEFENSE & RESEARCH
  `;

  const COMMANDS = {
    help: () => `
<div class="term-line success">Available Commands:</div>
<div class="term-line"><span class="cyan">about</span>       - About SHIELD Cyber Society & NIT Hamirpur</div>
<div class="term-line"><span class="cyan">motto</span>       - Display our 4 pillars</div>
<div class="term-line"><span class="cyan">domains</span>     - List all 8 specialized cybersecurity tracks</div>
<div class="term-line"><span class="cyan">nmap</span>        - Scan SHIELD educational network topology</div>
<div class="term-line"><span class="cyan">ctf</span>         - Inspect current CTF cipher & challenge status</div>
<div class="term-line"><span class="cyan">whoami</span>      - Display current recruit profile</div>
<div class="term-line"><span class="cyan">join</span>        - Initiate society recruit sequence</div>
<div class="term-line"><span class="cyan">banner</span>      - Display SHIELD ASCII banner</div>
<div class="term-line"><span class="cyan">clear</span>       - Clear terminal window</div>
`,
    about: () => `
<div class="term-line success">=== SHIELD CYBER SOCIETY (NIT HAMIRPUR) ===</div>
<div class="term-line">SHIELD is the premier student cybersecurity & ethical hacking society of National Institute of Technology, Hamirpur.</div>
<div class="term-line muted">"Curious about how hackers think and work? Want to explore cybersecurity beyond textbooks, gain hands-on learning, and secure the digital world?"</div>
<div class="term-line cyan">Learn how hackers work. Build your skills. Defend what matters.</div>
`,
    motto: () => `
<div class="term-line success">=== CORE PILLARS ===</div>
<div class="term-line"><span class="cyan">[1] LEARN</span>       : Master fundamental offensive & defensive computing.</div>
<div class="term-line"><span class="green">[2] BUILD</span>       : Architect security tools, CTF problems, and defense labs.</div>
<div class="term-line"><span class="amber">[3] COLLABORATE</span> : Team up for global CTFs, hackathons, and security research.</div>
<div class="term-line"><span class="crimson">[4] DEFEND</span>      : Secure infrastructure, lead awareness, and defend systems.</div>
`,
    domains: () => `
<div class="term-line success">=== 8 SPECIALIZED SECURITY DOMAINS ===</div>
<div class="term-line"><span class="cyan">[1] Network Security</span>     : Packet analysis, firewall defense, zero-trust routing & perimeter auditing.</div>
<div class="term-line"><span class="cyan">[2] Web App Security</span>     : OWASP Top 10, source code reviews, API auditing & bug bounty hunting.</div>
<div class="term-line"><span class="cyan">[3] Cryptography</span>         : Classical ciphers, RSA, ECC, lattice cryptography & cryptanalysis.</div>
<div class="term-line"><span class="cyan">[4] Digital Forensics</span>    : Memory dump triage (Volatility), disk imaging, timeline reconstruction.</div>
<div class="term-line"><span class="cyan">[5] Malware Analysis</span>     : Static & dynamic reverse engineering, sandbox analysis, Ghidra disassembly.</div>
<div class="term-line"><span class="cyan">[6] Cloud Analysis</span>       : AWS/GCP IAM configuration review, container security, cloud posture.</div>
<div class="term-line"><span class="cyan">[7] Security Operations</span>  : SIEM telemetry, threat hunting, live blue-teaming & incident response.</div>
<div class="term-line"><span class="cyan">[8] Offensive Security</span>   : Red teaming, penetration testing, privilege auditing & system hardening.</div>
`,
    nmap: () => `
<div class="term-line muted">[Simulated Educational Network Audit]</div>
<div class="term-line">Educational audit report for shield.nith.ac.in (10.14.0.1)</div>
<div class="term-line">Host status: Online (0.00042s latency).</div>
<div class="term-line muted">PORT     STATE SERVICE       VERSION</div>
<div class="term-line"><span class="green">22/tcp   open  ssh</span>           OpenSSH 9.6p1 (Debian)</div>
<div class="term-line"><span class="green">80/tcp   open  http</span>          nginx/1.24.0</div>
<div class="term-line"><span class="green">443/tcp  open  ssl/https</span>     SHIELD Gateway TLSv1.3</div>
<div class="term-line"><span class="cyan">1337/tcp open  ctf-daemon</span>    SHIELD_CTF_ENGINE v2.4</div>
<div class="term-line muted">Educational topology check completed. Perimeter secure.</div>
`,
    ctf: () => `
<div class="term-line success">=== LIVE CTF CHALLENGE: CRACK THE SHIELD ===</div>
<div class="term-line">Target: Mini Crypto & Encoding puzzle below.</div>
<div class="term-line">Encrypted Cipher: <span class="green">U0hJRUxEe2QzZjNuZF93aDR0X200dHQzcnNfbjF0aH0=</span></div>
<div class="term-line">Hint: Check standard base representation (Base64).</div>
<div class="term-line cyan">Submit the decoded flag in the CTF section to unlock your recruit badge!</div>
`,
    whoami: () => `
<div class="term-line"><span class="green">UID</span> : 1337 (student_cadet)</div>
<div class="term-line"><span class="cyan">HOST</span>: terminal.shield.nith.ac.in</div>
<div class="term-line"><span class="amber">ROLE</span>: Student Security Researcher</div>
<div class="term-line"><span class="muted">STATUS</span>: Active Member</div>
`,
    join: () => {
      const dialog = document.getElementById('join-dialog');
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        return `<div class="term-line success">[+] Initialized recruitment modal dialog. Welcome to SHIELD!</div>`;
      }
      return `<div class="term-line">Visit our recruitment section below or join our Discord community!</div>`;
    },
    banner: () => `<pre class="cyan" style="font-size:0.65rem; line-height:1.2;">${ASCII_BANNER}</pre>`,
    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Echo input command
    const echoRow = document.createElement('div');
    echoRow.className = 'term-line cmd-echo';
    echoRow.innerHTML = `<span class="prompt-prefix">guest@shield-nith:~$</span> ${escapeHTML(rawCmd)}`;
    terminalOutput.appendChild(echoRow);

    const parts = trimmed.split(' ');
    const cmd = parts[0];

    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd](parts.slice(1));
      if (result) {
        const resDiv = document.createElement('div');
        resDiv.innerHTML = result;
        terminalOutput.appendChild(resDiv);
      }
    } else {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'term-line danger';
      errorDiv.innerHTML = `command not found: "${escapeHTML(cmd)}". Type <span class="cyan">help</span> for available commands.`;
      terminalOutput.appendChild(errorDiv);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = terminalInput.value;
      terminalInput.value = '';
      executeCommand(value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = terminalInput.value.trim().toLowerCase();
      const match = Object.keys(COMMANDS).find(c => c.startsWith(current));
      if (match) {
        terminalInput.value = match;
      }
    }
  });

  // Handle Quick Chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
        terminalInput.value = '';
        terminalInput.focus();
      }
    });
  });

  // Auto focus input when clicking terminal body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
});
