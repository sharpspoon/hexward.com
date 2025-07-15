/**
 * Hexward Terminal - Interactive Developer UI
 * Author: Hexward Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize terminal after the main script has loaded components
    setTimeout(initTerminal, 500);
});

/**
 * Initialize the Terminal UI
 */
function initTerminal() {
    // Create terminal container
    const terminalContainer = document.createElement('div');
    terminalContainer.className = 'terminal-container';
    terminalContainer.innerHTML = `
        <div class="terminal-header">
            <div class="terminal-buttons">
                <span class="terminal-button close"></span>
                <span class="terminal-button minimize"></span>
                <span class="terminal-button maximize"></span>
            </div>
            <div class="terminal-title">hexward@console:~</div>
            <div class="terminal-actions">
                <button class="terminal-action-btn" id="terminal-help" title="Help">
                    <i class="fas fa-question-circle"></i>
                </button>
                <button class="terminal-action-btn" id="terminal-fullscreen" title="Toggle Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="terminal-body">
            <div class="terminal-output">
                <p class="terminal-welcome">Welcome to Hexward Terminal v1.0</p>
                <p>Type <span class="terminal-cmd">help</span> to see available commands.</p>
            </div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">hexward@console:~$</span>
                <input type="text" class="terminal-input" autofocus spellcheck="false">
            </div>
        </div>
    `;

    // Add terminal to the page after the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.parentNode.insertBefore(terminalContainer, heroSection.nextSibling);

        // Initialize terminal functionality
        const terminal = new Terminal(terminalContainer);
        terminal.init();
    }
}

/**
 * Terminal Class
 */
class Terminal {
    constructor(container) {
        this.container = container;
        this.output = container.querySelector('.terminal-output');
        this.input = container.querySelector('.terminal-input');
        this.prompt = container.querySelector('.terminal-prompt');
        this.history = [];
        this.historyIndex = -1;
        this.currentDirectory = '~';
        this.isMinimized = false;
        this.isFullscreen = false;

        // Easter egg counters and flags
        this.konamiIndex = 0;
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.hasActivatedMatrix = false;
        this.hasFoundEasterEgg = false;
    }

    init() {
        // Set up event listeners
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Terminal button actions
        const closeBtn = this.container.querySelector('.terminal-button.close');
        const minimizeBtn = this.container.querySelector('.terminal-button.minimize');
        const maximizeBtn = this.container.querySelector('.terminal-button.maximize');
        const fullscreenBtn = this.container.querySelector('#terminal-fullscreen');
        const helpBtn = this.container.querySelector('#terminal-help');

        closeBtn.addEventListener('click', () => this.toggleTerminal(false));
        minimizeBtn.addEventListener('click', () => this.minimizeTerminal());
        maximizeBtn.addEventListener('click', () => this.maximizeTerminal());
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        helpBtn.addEventListener('click', () => this.executeCommand('help'));

        // Make terminal draggable
        this.makeDraggable();

        // Global key listener for Konami code
        document.addEventListener('keydown', this.checkKonamiCode.bind(this));

        // Focus input when clicking anywhere in the terminal
        this.container.addEventListener('click', (e) => {
            if (e.target !== this.input && !this.isMinimized) {
                this.input.focus();
            }
        });

        // Add minimize/restore button to body
        const terminalToggle = document.createElement('button');
        terminalToggle.className = 'terminal-toggle';
        terminalToggle.innerHTML = '<i class="fas fa-terminal"></i>';
        terminalToggle.title = 'Toggle Terminal';
        terminalToggle.addEventListener('click', () => this.toggleTerminal());
        document.body.appendChild(terminalToggle);
    }

    handleKeyDown(e) {
        // Handle special keys
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.history.push(command);
                this.historyIndex = this.history.length;
            } else {
                this.addOutput(`<span class="terminal-prompt">${this.prompt.textContent}</span>`);
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
                // Move cursor to end of input
                setTimeout(() => {
                    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
                }, 0);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        } else if (e.key === 'c' && e.ctrlKey) {
            this.addOutput(`<span class="terminal-prompt">${this.prompt.textContent}</span> ^C`);
            this.input.value = '';
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            this.clearTerminal();
        }
    }

    executeCommand(command) {
        // Add command to output
        this.addOutput(`<span class="terminal-prompt">${this.prompt.textContent}</span> ${this.escapeHtml(command)}`);

        // Parse command and arguments
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();

        // Execute command
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
            case 'cls':
                this.clearTerminal();
                break;
            case 'echo':
                this.echo(args.slice(1).join(' '));
                break;
            case 'date':
                this.showDate();
                break;
            case 'whoami':
                this.whoami();
                break;
            case 'ls':
            case 'dir':
                this.listDirectory();
                break;
            case 'cd':
                this.changeDirectory(args[1]);
                break;
            case 'pwd':
                this.printWorkingDirectory();
                break;
            case 'cat':
            case 'type':
                this.catFile(args[1]);
                break;
            case 'matrix':
                this.activateMatrix();
                break;
            case 'contact':
                this.contact();
                break;
            case 'about':
                this.about();
                break;
            case 'services':
                this.services();
                break;
            case 'exit':
                this.toggleTerminal(false);
                break;
            case 'easteregg':
                this.easterEgg();
                break;
            case 'sudo':
                this.sudo(args.slice(1).join(' '));
                break;
            case 'cowsay':
                this.cowsay(args.slice(1).join(' '));
                break;
            case 'fortune':
                this.fortune();
                break;
            case 'theme':
                this.toggleTheme();
                break;
            case 'banner':
                this.showBanner();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'joke':
                this.joke();
                break;
            default:
                this.commandNotFound(cmd);
        }
    }

    // Helper methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addOutput(html) {
        const output = document.createElement('div');
        output.className = 'terminal-line';
        output.innerHTML = html;
        this.output.appendChild(output);

        // Scroll to bottom
        this.container.querySelector('.terminal-body').scrollTop = this.container.querySelector('.terminal-body').scrollHeight;
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    showHelp() {
        const helpText = `
            <div class="terminal-help">
                <p class="terminal-help-title">Available Commands:</p>
                <div class="terminal-help-grid">
                    <div class="terminal-help-category">
                        <p class="terminal-help-category-title">Navigation:</p>
                        <p><span class="terminal-cmd">ls</span> - List directory contents</p>
                        <p><span class="terminal-cmd">cd [dir]</span> - Change directory</p>
                        <p><span class="terminal-cmd">pwd</span> - Print working directory</p>
                    </div>
                    <div class="terminal-help-category">
                        <p class="terminal-help-category-title">File Operations:</p>
                        <p><span class="terminal-cmd">cat [file]</span> - Display file contents</p>
                    </div>
                    <div class="terminal-help-category">
                        <p class="terminal-help-category-title">System:</p>
                        <p><span class="terminal-cmd">clear</span> - Clear terminal</p>
                        <p><span class="terminal-cmd">date</span> - Show current date/time</p>
                        <p><span class="terminal-cmd">whoami</span> - Display current user</p>
                        <p><span class="terminal-cmd">echo [text]</span> - Display text</p>
                        <p><span class="terminal-cmd">exit</span> - Close terminal</p>
                    </div>
                    <div class="terminal-help-category">
                        <p class="terminal-help-category-title">Website:</p>
                        <p><span class="terminal-cmd">about</span> - About Hexward</p>
                        <p><span class="terminal-cmd">services</span> - View services</p>
                        <p><span class="terminal-cmd">contact</span> - Contact information</p>
                        <p><span class="terminal-cmd">skills</span> - View skills</p>
                    </div>
                    <div class="terminal-help-category">
                        <p class="terminal-help-category-title">Fun:</p>
                        <p><span class="terminal-cmd">matrix</span> - Activate Matrix mode</p>
                        <p><span class="terminal-cmd">cowsay [text]</span> - Cow says text</p>
                        <p><span class="terminal-cmd">fortune</span> - Random fortune</p>
                        <p><span class="terminal-cmd">joke</span> - Random joke</p>
                        <p><span class="terminal-cmd">banner</span> - Display ASCII banner</p>
                    </div>
                </div>
                <p class="terminal-help-tip">Tip: Use Tab for autocomplete, Arrow Up/Down for command history</p>
                <p class="terminal-help-tip">Tip: Try to find hidden easter eggs!</p>
            </div>
        `;
        this.addOutput(helpText);
    }

    echo(text) {
        if (text) {
            this.addOutput(this.escapeHtml(text));
        } else {
            this.addOutput('');
        }
    }

    showDate() {
        const now = new Date();
        this.addOutput(now.toString());
    }

    whoami() {
        this.addOutput('visitor@hexward.com');
    }

    commandNotFound(cmd) {
        this.addOutput(`Command not found: ${cmd}. Type <span class="terminal-cmd">help</span> for a list of commands.`);
    }

    listDirectory() {
        let files;

        if (this.currentDirectory === '~') {
            files = [
                { name: 'about.txt', type: 'file' },
                { name: 'contact.txt', type: 'file' },
                { name: 'projects', type: 'directory' },
                { name: 'skills.json', type: 'file' },
                { name: 'resume.pdf', type: 'file' },
                { name: '.hidden', type: 'directory' }
            ];
        } else if (this.currentDirectory === '~/projects') {
            files = [
                { name: 'web-development', type: 'directory' },
                { name: 'backend-systems', type: 'directory' },
                { name: 'devops', type: 'directory' },
                { name: 'README.md', type: 'file' }
            ];
        } else if (this.currentDirectory === '~/.hidden') {
            files = [
                { name: 'easter-egg.txt', type: 'file' },
                { name: 'secrets', type: 'directory' }
            ];
        } else if (this.currentDirectory === '~/.hidden/secrets') {
            files = [
                { name: 'konami.txt', type: 'file' }
            ];
        } else {
            files = [
                { name: '..', type: 'directory' },
                { name: 'README.md', type: 'file' }
            ];
        }

        let output = '<div class="terminal-ls">';
        files.forEach(file => {
            const className = file.type === 'directory' ? 'terminal-directory' : 'terminal-file';
            output += `<span class="${className}">${file.name}</span>`;
        });
        output += '</div>';

        this.addOutput(output);
    }

    changeDirectory(dir) {
        if (!dir || dir === '~') {
            this.currentDirectory = '~';
            this.updatePrompt();
            return;
        }

        if (dir === '..') {
            if (this.currentDirectory === '~') {
                this.addOutput('Already at home directory');
                return;
            }

            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/');
            this.updatePrompt();
            return;
        }

        // Handle relative paths
        const newDir = dir.startsWith('/') ? dir : `${this.currentDirectory}/${dir}`;

        // Check if directory exists (simplified)
        const validDirs = [
            '~',
            '~/projects',
            '~/.hidden',
            '~/.hidden/secrets',
            '~/projects/web-development',
            '~/projects/backend-systems',
            '~/projects/devops'
        ];

        if (validDirs.includes(newDir)) {
            this.currentDirectory = newDir;
            this.updatePrompt();
        } else {
            this.addOutput(`cd: ${dir}: No such directory`);
        }
    }

    updatePrompt() {
        const dir = this.currentDirectory.replace('~', '~');
        this.prompt.textContent = `hexward@console:${dir}$`;
    }

    printWorkingDirectory() {
        this.addOutput(this.currentDirectory.replace('~', '/home/hexward'));
    }

    catFile(filename) {
        if (!filename) {
            this.addOutput('Usage: cat [filename]');
            return;
        }

        const fileContents = {
            'about.txt': `
                <div class="terminal-file-content">
                    <h3>About Hexward Consulting</h3>
                    <p>Hexward Consulting provides expert software development and consulting services, specializing in backend systems, APIs, and DevOps solutions.</p>
                    <p>With over a decade of experience in the industry, we deliver efficient, scalable, and maintainable solutions for businesses of all sizes.</p>
                </div>
            `,
            'contact.txt': `
                <div class="terminal-file-content">
                    <h3>Contact Information</h3>
                    <p>Email: robin.ward@hexward.com</p>
                    <p>Website: https://hexward.com</p>
                    <p>To discuss your project, please send an email or use the contact form on the website.</p>
                </div>
            `,
            'skills.json': `
                <pre class="terminal-code json">
{
  "languages": [
    "JavaScript", "TypeScript", "Python", "Go", "Java", "SQL"
  ],
  "frontend": [
    "React", "Vue.js", "Angular", "HTML5", "CSS3", "SASS"
  ],
  "backend": [
    "Node.js", "Express", "Django", "Flask", "Spring Boot"
  ],
  "databases": [
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch"
  ],
  "devops": [
    "Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Terraform"
  ]
}
                </pre>
            `,
            'README.md': `
                <div class="terminal-markdown">
                    <h1>Hexward Projects</h1>
                    <p>This directory contains information about various projects completed by Hexward Consulting.</p>
                    <p>Browse the subdirectories to learn more about specific project categories.</p>
                    <hr>
                    <p>For more information, visit <a href="https://hexward.com" target="_blank">hexward.com</a></p>
                </div>
            `,
            'easter-egg.txt': `
                <div class="terminal-easter-egg">
                    <p>🎉 You found an Easter Egg! 🎉</p>
                    <p>Try using the <span class="terminal-cmd">matrix</span> command or entering the Konami code...</p>
                    <p>There are more secrets to discover. Keep exploring!</p>
                </div>
            `,
            'konami.txt': `
                <div class="terminal-easter-egg">
                    <p>⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️</p>
                    <p>The Konami Code is a cheat code that appears in many Konami video games.</p>
                    <p>Try pressing these keys in sequence on this website...</p>
                </div>
            `,
            'resume.pdf': `
                <div class="terminal-file-content">
                    <p>This would normally open a PDF file. For now, please visit the About page to learn more.</p>
                    <p>You can use the <span class="terminal-cmd">about</span> command to view information about Hexward Consulting.</p>
                </div>
            `
        };

        // Check if file exists in current directory
        const fileExists = this.fileExistsInCurrentDirectory(filename);

        if (fileExists && fileContents[filename]) {
            this.addOutput(fileContents[filename]);
        } else if (fileExists) {
            this.addOutput(`<p>File exists but content is not available.</p>`);
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`);
        }
    }

    fileExistsInCurrentDirectory(filename) {
        // Simplified file system check
        if (this.currentDirectory === '~') {
            return ['about.txt', 'contact.txt', 'skills.json', 'resume.pdf'].includes(filename);
        } else if (this.currentDirectory === '~/projects') {
            return ['README.md'].includes(filename);
        } else if (this.currentDirectory === '~/.hidden') {
            return ['easter-egg.txt'].includes(filename);
        } else if (this.currentDirectory === '~/.hidden/secrets') {
            return ['konami.txt'].includes(filename);
        }
        return false;
    }

    activateMatrix() {
        if (this.hasActivatedMatrix) {
            this.addOutput('Matrix mode already activated once. Try refreshing the page to use it again.');
            return;
        }

        this.hasActivatedMatrix = true;
        this.addOutput('<p>Initializing Matrix mode...</p>');

        // Create matrix overlay
        const overlay = document.createElement('div');
        overlay.className = 'matrix-overlay';
        document.body.appendChild(overlay);

        // Create canvas for matrix effect
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        overlay.appendChild(canvas);

        // Add exit button
        const exitBtn = document.createElement('button');
        exitBtn.className = 'matrix-exit-btn';
        exitBtn.innerHTML = 'Exit Matrix';
        exitBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.addOutput('<p>Matrix mode deactivated.</p>');
        });
        overlay.appendChild(exitBtn);

        // Initialize matrix effect
        const ctx = canvas.getContext('2d');
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }

        // Draw matrix effect
        function drawMatrix() {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff9d';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = characters.charAt(Math.floor(Math.random() * characters.length));

                // Draw character
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                // Move drop down
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        // Animate matrix effect
        const matrixInterval = setInterval(drawMatrix, 50);

        // Stop animation when overlay is removed
        exitBtn.addEventListener('click', () => {
            clearInterval(matrixInterval);
        });
    }

    contact() {
        this.addOutput(`
            <div class="terminal-contact">
                <h3>Contact Hexward Consulting</h3>
                <p>Email: <a href="mailto:robin.ward@hexward.com">robin.ward@hexward.com</a></p>
                <p>For more information, visit the <a href="contact.html">Contact Page</a>.</p>
            </div>
        `);
    }

    about() {
        this.addOutput(`
            <div class="terminal-about">
                <h3>About Hexward Consulting</h3>
                <p>Hexward Consulting provides expert software development and consulting services.</p>
                <p>For more information, visit the <a href="about.html">About Page</a>.</p>
            </div>
        `);
    }

    services() {
        this.addOutput(`
            <div class="terminal-services">
                <h3>Services</h3>
                <ul>
                    <li>Backend Development</li>
                    <li>DevOps & Infrastructure</li>
                    <li>Database Architecture</li>
                    <li>Security Implementation</li>
                </ul>
                <p>For more information, visit the <a href="services.html">Services Page</a>.</p>
            </div>
        `);
    }

    easterEgg() {
        if (this.hasFoundEasterEgg) {
            this.addOutput(`<p>You've already found this easter egg! Try finding others...</p>`);
            return;
        }

        this.hasFoundEasterEgg = true;
        this.addOutput(`
            <div class="terminal-easter-egg">
                <p>🎉 Congratulations! You found an Easter Egg! 🎉</p>
                <p>Here's a special ASCII art just for you:</p>
                <pre class="terminal-ascii-art">
  _    _                                  _ 
 | |  | |                                | |
 | |__| | _____  ____      ____ _ _ __ __| |
 |  __  |/ _ \\ \\/ /\\ \\ /\\ / / _\` | '__/ _\` |
 | |  | |  __/>  <  \\ V  V / (_| | | | (_| |
 |_|  |_|\\___/_/\\_\\  \\_/\\_/ \\__,_|_|  \\__,_|
                </pre>
                <p>Try to find more easter eggs in the terminal!</p>
            </div>
        `);
    }

    sudo(command) {
        this.addOutput(`<p>Nice try! But you don't have sudo privileges on this system.</p>`);
    }

    cowsay(message) {
        if (!message) {
            message = "Moo! I'm a cow!";
        }

        const messageLength = message.length;
        const border = '-'.repeat(messageLength + 2);

        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
        `;

        this.addOutput(`
            <pre class="terminal-cowsay">
 ${'_' + border + '_'}
< ${message} >
 ${'‾' + border + '‾'}
${cow}
            </pre>
        `);
    }

    fortune() {
        const fortunes = [
            "The best code is no code at all.",
            "It's not a bug – it's an undocumented feature.",
            "Programming is like writing a book... except if you miss a single comma, the entire book makes no sense.",
            "The only code without bugs is no code at all.",
            "The best error message is the one that never shows up.",
            "The most important skill in programming is knowing when to walk away.",
            "Always code as if the person who will maintain your code is a violent psychopath who knows where you live.",
            "There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.",
            "A good programmer is someone who always looks both ways before crossing a one-way street.",
            "Documentation is like sex: when it's good, it's very good; when it's bad, it's better than nothing."
        ];

        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        this.addOutput(`<p class="terminal-fortune">${randomFortune}</p>`);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');

        // Update localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Update toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (isDarkMode) {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-lightbulb';
            }
        }

        this.addOutput(`<p>Theme switched to ${isDarkMode ? 'dark' : 'light'} mode.</p>`);
    }

    showBanner() {
        this.addOutput(`
            <pre class="terminal-banner">
  _    _                                  _ 
 | |  | |                                | |
 | |__| | _____  ____      ____ _ _ __ __| |
 |  __  |/ _ \\ \\/ /\\ \\ /\\ / / _\` | '__/ _\` |
 | |  | |  __/>  <  \\ V  V / (_| | | | (_| |
 |_|  |_|\\___/_/\\_\\  \\_/\\_/ \\__,_|_|  \\__,_|
            </pre>
            <p>Welcome to Hexward Consulting - Your personal full-stack weapon.</p>
        `);
    }

    showSkills() {
        this.addOutput(`
            <div class="terminal-skills">
                <h3>Skills & Expertise</h3>
                <div class="terminal-skills-grid">
                    <div class="terminal-skills-category">
                        <h4>Languages</h4>
                        <ul>
                            <li>JavaScript/TypeScript</li>
                            <li>Python</li>
                            <li>Go</li>
                            <li>Java</li>
                            <li>SQL</li>
                        </ul>
                    </div>
                    <div class="terminal-skills-category">
                        <h4>Frontend</h4>
                        <ul>
                            <li>React</li>
                            <li>Vue.js</li>
                            <li>Angular</li>
                            <li>HTML5/CSS3</li>
                        </ul>
                    </div>
                    <div class="terminal-skills-category">
                        <h4>Backend</h4>
                        <ul>
                            <li>Node.js</li>
                            <li>Express</li>
                            <li>Django</li>
                            <li>Spring Boot</li>
                        </ul>
                    </div>
                    <div class="terminal-skills-category">
                        <h4>DevOps</h4>
                        <ul>
                            <li>Docker</li>
                            <li>Kubernetes</li>
                            <li>AWS/GCP</li>
                            <li>CI/CD</li>
                        </ul>
                    </div>
                </div>
                <p>For more information, visit the <a href="about.html">About Page</a>.</p>
            </div>
        `);
    }

    joke() {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "Why do Java developers wear glasses? Because they don't C#.",
            "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
            "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
            "Why did the developer go broke? Because he used up all his cache.",
            "Why did the programmer quit his job? Because he didn't get arrays.",
            "What's a programmer's favorite hangout place? The Foo Bar.",
            "What do you call a programmer from Finland? Nerdic.",
            "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25."
        ];

        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        this.addOutput(`<p class="terminal-joke">${randomJoke}</p>`);
    }

    makeDraggable() {
        const header = this.container.querySelector('.terminal-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.terminal-button, .terminal-action-btn')) return;

            isDragging = true;
            offsetX = e.clientX - this.container.getBoundingClientRect().left;
            offsetY = e.clientY - this.container.getBoundingClientRect().top;

            this.container.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            this.container.style.left = `${x}px`;
            this.container.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.container.style.transition = '';
        });
    }

    toggleTerminal(show = null) {
        if (show === null) {
            this.container.classList.toggle('hidden');
        } else if (show) {
            this.container.classList.remove('hidden');
        } else {
            this.container.classList.add('hidden');
        }

        if (!this.container.classList.contains('hidden')) {
            this.input.focus();
        }
    }

    minimizeTerminal() {
        this.container.classList.add('minimized');
        this.isMinimized = true;
    }

    maximizeTerminal() {
        this.container.classList.remove('minimized');
        this.isMinimized = false;
        this.input.focus();
    }

    toggleFullscreen() {
        this.container.classList.toggle('fullscreen');
        this.isFullscreen = !this.isFullscreen;

        const icon = this.container.querySelector('#terminal-fullscreen i');
        if (this.isFullscreen) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }

    checkKonamiCode(e) {
        // Reset if wrong key
        if (e.key !== this.konamiCode[this.konamiIndex]) {
            this.konamiIndex = 0;
            return;
        }

        // Increment index
        this.konamiIndex++;

        // Check if complete
        if (this.konamiIndex === this.konamiCode.length) {
            this.activateKonamiCode();
            this.konamiIndex = 0;
        }
    }

    activateKonamiCode() {
        // Create a special effect for Konami code
        const overlay = document.createElement('div');
        overlay.className = 'konami-overlay';
        overlay.innerHTML = `
            <div class="konami-content">
                <h2>⭐ KONAMI CODE ACTIVATED! ⭐</h2>
                <p>You've unlocked a secret!</p>
                <div class="konami-animation"></div>
                <button class="konami-close">Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Close button
        overlay.querySelector('.konami-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 10000);
    }

    autocomplete() {
        const input = this.input.value.trim();
        if (!input) return;

        const commands = [
            'help', 'clear', 'echo', 'date', 'whoami', 'ls', 'cd', 'pwd', 'cat',
            'matrix', 'contact', 'about', 'services', 'exit', 'easteregg', 'sudo',
            'cowsay', 'fortune', 'theme', 'banner', 'skills', 'joke'
        ];

        // Find matching commands
        const matches = commands.filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            // Single match - autocomplete
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            // Multiple matches - show options
            this.addOutput(`<span class="terminal-prompt">${this.prompt.textContent}</span> ${input}`);
            this.addOutput(`<div class="terminal-autocomplete">${matches.join('  ')}</div>`);
        }
    }
}
