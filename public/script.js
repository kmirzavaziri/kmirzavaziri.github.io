function initFallingCharacters(cloudDOM) {
    let isHovering = false;

    cloudDOM.addEventListener("mouseenter", () => {
        isHovering = true;
    });

    cloudDOM.addEventListener("mouseleave", () => {
        isHovering = false;
    });

    dropRandomCharacter();

    function randomPos(min, max, size) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.round(randomNumber / size) * size;
    }

    function dropRandomCharacter() {
        const cloudRect = cloudDOM.getBoundingClientRect();

        const cloudBottom = cloudRect.bottom + window.scrollY;
        const cloudLeft = cloudRect.left + window.scrollX;
        const cloudRight = cloudRect.right + window.scrollX;

        let left = cloudLeft !== cloudRight ? cloudLeft + 50 : 0;
        let right = cloudLeft !== cloudRight ? cloudRight - 50 : window.innerWidth;

        const randomCharacter = Math.random() < 0.5 ? "0" : "1";
        const randomLeft = randomPos(left, right, 10)

        const characterDiv = document.createElement("div");
        characterDiv.classList.add("km-falling-character", "km-screen-only");
        characterDiv.textContent = randomCharacter;
        characterDiv.style.left = `${randomLeft}px`;
        characterDiv.style.top = `${cloudBottom - 30}px`;

        document.body.appendChild(characterDiv);

        const timeout = isHovering ? Math.random() * 50 : 200 + Math.random() * 1000;

        setTimeout(dropRandomCharacter, timeout);

        setTimeout(() => {
            characterDiv.remove();
        }, 6000);
    }
}

function initTerminal() {
    const kamyarInfo = {
        name: "Kamyar",
        role: "Backend Developer",
        favouriteEditor: "JetBrains IDEs",
        favouriteLanguage: "Go",
        favouriteOS: "Ubuntu",
        favouriteVCS: "GitLab",
        programmingHero: "Ken Thompson",
        currentGoal: "Contributing to open-source projects and learning cloud technologies",
        favoriteQuote: "Debugging is like being the detective in a crime movie where you are also the murderer. - Filipe Fortes",
    };

    const quotes = [
        "There are 2 hard problems in computer science: cache invalidation, naming things, and off-by-1 errors.",
        "Some things Man was never meant to know. For everything else, there's Google.",
        "Failure is not an option -- it comes bundled with Windows.",
        "To err is human... to really foul up requires the root password.",
        "If at first you don't succeed; call it version 1.0.",
        "Why do we want intelligent terminals when there are so many stupid users?",
        "Hey! It compiles! Ship it!",
        "My software never has bugs. It just develops random features.",
        "rm -rf / (Do not try at home, it doesn't matter what is your cwd)",
        "The great thing about Object Oriented code is that it can make small, simple problems look like large, complex ones.",
        "Unix is user-friendly. It's just very selective about who its friends are.",
        "I'm not anti-social; I'm just not user friendly.",
        "Better to be a geek than an idiot.",
        "There are 10 types of people in these world: those who know trinary, those who don't, and those who mistake it for binary.",
        "Difference between a virus and windows ? Viruses rarely fail.",
        "I think Microsoft named .NET so it wouldn't show up in a Unix directory listing.",
        "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    ];

    const fs = {
        root: {
            type: "dir",
            content: {
                "work-experience": {
                    type: "dir",
                    content: {
                        "best-wing": {
                            type: "file",
                            content: "working as a senior software engineer from 2024",
                        },
                        "divar": {
                            type: "file",
                            content: "working as a mid-level software engineer from 2022 to 2024",
                        },
                        "avistopia": {
                            type: "file",
                            content: "worked as a mid-level software engineer from 2021 to 2022",
                        },
                        "digikala": {
                            type: "file",
                            content: "worked as a junior software engineer from 2020 to 2021",
                        },
                    },
                },
            },
        },
        cwd: "/",
        getAbsPath: function (p) {
            let absPath;

            p = p.replace(/\/+/, '/');
            p = p.replace(/\/$/, '');

            if (p.startsWith("/")) {
                absPath = p;
            } else if (fs.cwd.endsWith("/")) {
                absPath = fs.cwd + p;
            } else {
                absPath = fs.cwd + "/" + p;
            }

            const parts = absPath.split("/");
            let i = 0;
            while (i < parts.length) {
                if (parts[i] === "..") {
                    if (i === 0) {
                        parts.splice(i, 1);
                    } else {
                        parts.splice(i - 1, 2);
                        i -= 1;
                    }
                } else if (parts[i] === ".") {
                    parts.splice(i, 1);
                } else {
                    i += 1;
                }
            }


            if (parts.length === 0) {
                return "/";
            } else if (parts.length === 1) {
                return "/" + parts[0];
            } else {
                return parts.join("/");
            }
        },
        access: function (p) {
            const parts = p === "/" ? [] : p.substring(1).split("/");
            let c = fs.root;
            for (let i = 0; i < parts.length; i++) {
                if (c.type !== "dir") {
                    return null;
                }

                if (!(parts[i] in c.content)) {
                    return null;
                }

                c = c.content[parts[i]];
            }

            return c;
        },
        pathExists: function (p) {
            return fs.access(p) !== null;
        },
        isDir: function (p) {
            return fs.access(p) !== null && fs.access(p).type === "dir";
        },
    };

    const terminal = document.getElementById('km-terminal');
    const terminalHistory = document.getElementById('km-terminal-history');
    const userInput = document.getElementById('km-terminal-user-input');
    const suggestionsDOM = document.getElementById('km-terminal-suggestions');
    const cwdDOM = document.getElementById('km-terminal-cwd');

    let cmdHistory = [];

    const commands = {
        help: function (args) {
            return "" +
                "help\tshow the list of available commands\n" +
                "clear\tclear the terminal\n" +
                "info\tshows my info\n" +
                "quote\tprint a random quote\n" +
                "cd\tchange current/working directory\n" +
                "ls\tlist directory contents\n" +
                "pwd\tprint name of current/working directory\n" +
                "cat\tconcatenate files and print on the standard output" +
                "";
        },
        info: function (args) {
            if (args.length !== 1) {
                return "usage: info help | info FORMAT.\n\nType info help to get help."
            }

            switch (args[0]) {
                case "help":
                    return "usage: info help | info FORMAT\n\nFORMAT {json, yaml}"
                case "json":
                    return JSON.stringify(kamyarInfo, null, 2)
                case "yaml":
                    let yaml = ""
                    for (const key in kamyarInfo) {
                        yaml += `${key}: "${kamyarInfo[key]}"\n`
                    }
                    return yaml
                default:
                    return "unknown format: " + args[0]
            }
        },
        quote: function (args) {
            return quotes[Math.floor(Math.random() * quotes.length)];
        },
        ls: function (args) {
            const paths = args.length === 0 ? "." : args;

            let output = ""

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const absPath = fs.getAbsPath(path);

                if (!fs.pathExists(absPath)) {
                    output += `ls: cannot access '${path}': No such file or directory\n`
                    continue;
                }

                if (fs.isDir(absPath)) {
                    if (paths.length > 1) {
                        output += `${path}:\n`
                    }
                    output += Object.keys(fs.access(absPath).content).join("\n") + "\n\n"
                } else {
                    output += `${path}\n\n`
                }
            }

            return output.trim()
        },
        pwd: function (args) {
            return fs.cwd;
        },
        cat: function (args) {
            if (args.length === 0) {
                return `cat: No file path provided\n`
            }

            const paths = args.length === 0 ? "." : args;

            let output = ""

            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const absPath = fs.getAbsPath(path);

                if (!fs.pathExists(absPath)) {
                    output += `cat: ${path}: No such file or directory\n`
                    continue;
                }

                if (fs.isDir(absPath)) {
                    output += `cat: ${path}: Is a directory\n`
                    continue;
                }

                output += fs.access(absPath).content;
            }

            return output
        },
    }

    function makeHistory(input, output) {
        const lastHistoryItem = document.createElement("div");
        lastHistoryItem.className = "km-terminal-history-item"
        lastHistoryItem.innerHTML = `
            <span class="km-terminal-context">
                <span class="km-terminal-loc">guest@km-website</span>:<span class="km-terminal-cwd">${fs.cwd}</span>
            </span>
            ${input}
            <pre class="km-terminal-history-item-output">${output}</pre>
        `;

        terminalHistory.appendChild(lastHistoryItem);

        cmdHistoryCurrentCmd = "";
        cmdHistoryCurrentIndex = cmdHistory.length;
        suggestionsDOM.textContent = ""
    }

    function runCommand() {
        const rawInput = userInput.textContent;
        const input = rawInput.trim()
        userInput.textContent = "\xa0"

        let output = ""

        const parts = input.split(/\s+/);
        const command = parts[0];
        const args = parts.slice(1);

        if (input === "") {
            makeHistory(rawInput, output)
            return
        }

        cmdHistory.push(rawInput)

        if (command === "clear") {
            terminalHistory.innerHTML = "";
            return;
        }

        if (command === "cd") {
            if (args.length > 1) {
                makeHistory(rawInput, "cd: no such file or directory: " + path)
            } else {
                const path = args.length === 1 ? args[0] : ".";
                const absPath = fs.getAbsPath(path);

                if (!fs.pathExists(absPath)) {
                    makeHistory(rawInput, "cd: no such file or directory: " + path)
                } else if (!fs.isDir(absPath)) {
                    makeHistory(rawInput, "cd: not a directory: " + path)
                } else {
                    makeHistory(rawInput, output)
                    fs.cwd = absPath;
                    cwdDOM.textContent = fs.cwd
                }
            }

            return;
        }

        if (command in commands) {
            output = commands[command](args);
        } else {
            output = "command not found: " + command;
        }
        makeHistory(rawInput, output)
    }

    terminal.addEventListener('click', function () {
        userInput.focus();
    });

    userInput.addEventListener('input', function () {
        if (userInput.textContent === "") {
            userInput.textContent = "\xa0"
        }

        if (userInput.textContent.endsWith("\n")) {
            runCommand()
        }

    });

    let cmdHistoryCurrentCmd = "";
    let cmdHistoryCurrentIndex = cmdHistory.length;

    function getCaretPosition() {
        let caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode === userInput) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() === userInput) {
                const tempEl = document.createElement("span");
                userInput.insertBefore(tempEl, userInput.firstChild);
                const tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint("EndToEnd", range);
                caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    }

    function moveCaretToEnd() {
        const range = document.createRange();
        range.selectNodeContents(userInput);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function moveCaretToPos(pos) {
        const range = document.createRange()

        range.setStart(userInput.childNodes[0], pos)
        range.collapse(true)

        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }

    function getSuggestions(prefix) {
        const cwd = fs.access(fs.cwd);
        return Object.keys(cwd.content)
            .filter(x => x.startsWith(prefix))
            .map(x => cwd.content[x].type === "dir" ? x + "/" : x);

    }

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            runCommand();
        }

        if (event.key === "Tab") {
            event.preventDefault();

            const input = userInput.textContent;

            let caretPos = getCaretPosition();

            const {start, end} = strings.findWordBoundaries(input, caretPos);
            const prefix = input.slice(start, end);

            const left = input.slice(0, start);
            const right = input.slice(end);

            const suggestions = getSuggestions(prefix);

            if (suggestions.length === 1) {
                const leftAndSuggestion = left + suggestions[0];
                userInput.textContent = leftAndSuggestion + right;
                moveCaretToPos(leftAndSuggestion.length);
            }

            if (suggestions.length > 1) {
                suggestionsDOM.textContent = suggestions.join(" ");
            }
        }

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();

            if (cmdHistoryCurrentIndex === cmdHistory.length) {
                cmdHistoryCurrentCmd = userInput.textContent
            }

            if (event.key === "ArrowUp" && cmdHistoryCurrentIndex > 0) {
                cmdHistoryCurrentIndex -= 1;
            }

            if (event.key === "ArrowDown" && cmdHistoryCurrentIndex < cmdHistory.length) {
                cmdHistoryCurrentIndex += 1;
            }

            if (cmdHistoryCurrentIndex === cmdHistory.length) {
                userInput.textContent = cmdHistoryCurrentCmd;
            } else {
                userInput.textContent = cmdHistory[cmdHistoryCurrentIndex];
            }

            moveCaretToEnd();
        }


        if (event.ctrlKey && !event.shiftKey && event.code === "KeyC") {
            event.preventDefault();

            makeHistory(userInput.textContent, "")
            userInput.textContent = "\xa0"
        }

        if (event.ctrlKey && event.code === "KeyL") {
            event.preventDefault();

            terminalHistory.innerHTML = "";
        }
    });
}

function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

document.addEventListener("DOMContentLoaded", () => {
    initFallingCharacters(document.getElementById("km-header-title"));
    initTerminal()
    initTooltips()
});


const strings = {
    findWordBoundaries: function (text, index) {
        text = text.replace(/\s/g, " ");

        let start = text.slice(0, index).lastIndexOf(" ") + 1;

        let end = text.slice(index).lastIndexOf(" ");
        if (end === -1) {
            end = text.length - 1;
        }
        end += index;

        return {
            start: start,
            end: end,
        };

    },
};