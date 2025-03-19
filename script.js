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
    }

    saveVersion(content) {
        const newVersion = new Version(content, this.currentVersion);
        this.currentVersion = newVersion;
        this.undoStack.push(newVersion);
        this.redoStack = [];
        this.updateVersionList();
    }

    undo() {
        if (this.currentVersion && this.currentVersion.previous) {
            this.redoStack.push(this.currentVersion);
            this.currentVersion = this.currentVersion.previous;
            document.getElementById("textInput").value = this.currentVersion.content;
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.currentVersion = this.redoStack.pop();
            document.getElementById("textInput").value = this.currentVersion.content;
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

document.getElementById("textInput").addEventListener("input", () => {
    vcs.saveVersion(document.getElementById("textInput").value);
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
