class Version {
    constructor(content, previous = null) {
        this.content = content;
        this.previous = previous;
    }
}

class VersionControl {
    constructor() {
        this.currentVersion = null;
        this.undoStack = [];
        this.redoStack = [];
        this.changes = "";
    }

    saveVersion(content) {
        const newVersion = new Version(content, this.currentVersion);
        this.currentVersion = newVersion;
        this.updateVersionList();
    }

    saveChanges(content) {
        this.undoStack.push(content);
        this.redoStack = []; // Clear redo stack after a new change
    }

    undo() {
        if (this.undoStack.length > 0) {
            const lastWord = this.undoStack.pop();
            this.redoStack.push(lastWord);
    
            // Reconstruct the entire text from what's left in the undoStack
            let newText = this.undoStack.join("");
            document.getElementById("textInput").value = newText;
        }
    }
    

    redo() {
        if (this.redoStack.length > 0) {
            const word = this.redoStack.pop();
            this.undoStack.push(word);

            let currentText = document.getElementById("textInput").value;
            document.getElementById("textInput").value = currentText + word;
        }
    }

    updateVersionList() {
        let list = document.getElementById("versionList");
        list.innerHTML = "";
        let temp = this.currentVersion;
        let index = 1;
        while (temp) {
            let li = document.createElement("li");
            li.textContent = `Version ${index}`;
            li.onclick = () => {
                document.getElementById("textInput").value = temp.content;
            };
            list.appendChild(li);
            temp = temp.previous;
            index++;
        }
    }
}

const vcs = new VersionControl();

document.getElementById("textInput").addEventListener("input", (e) => {
    if (e.data && e.data !== " ") {
        vcs.changes += e.data;
    } else if (e.data === " ") {
        vcs.saveChanges(vcs.changes + " ");
        vcs.changes = "";
    }
});


document.querySelector("button[onclick='saveVersion()']").addEventListener("click", () => {
    vcs.saveVersion(document.getElementById("textInput").value);
});

document.querySelector("button[onclick='undo()']").addEventListener("click", () => {
    vcs.undo();
});

document.querySelector("button[onclick='redo()']").addEventListener("click", () => {
    vcs.redo();
});
