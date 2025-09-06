class Version {
  constructor(content, previous = null, next = null) {
    this.content = content;
    this.previous = previous;
    this.next = next;
  }
}

class VersionControl {
  constructor() {
    this.currentVersion = null;
    this.undoStack = [];
    this.redoStack = [];
  }

  clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
  }

  saveVersion(content) {
    const newVersion = new Version(content, this.currentVersion);
    if (this.currentVersion) {
      this.currentVersion.next = newVersion;
    }
    this.currentVersion = newVersion;
    this.clearHistory();
    this.updateVersionList();
  }

  saveChanges(action, content) {
    if (content !== "") {
      this.undoStack.push({ type: action, value: content });
      this.redoStack = [];
    }
  }

  undo() {
    let text = document.getElementById("textInput").value;

    if (this.undoStack.length > 0) {
      const baseAction = this.undoStack.pop();
      this.redoStack.push(baseAction);

      if (baseAction.type === "add") {
        text = text.slice(0, -baseAction.value.length);

        while (
          this.undoStack.length > 0 &&
          this.undoStack[this.undoStack.length - 1].type === "add"
        ) {
          const nextAction = this.undoStack.pop();
          this.redoStack.push(nextAction);
          text = text.slice(0, -nextAction.value.length);

          if (nextAction.value === " ") break;
        }
      } else if (baseAction.type === "delete") {
        text += baseAction.value;

        while (
          this.undoStack.length > 0 &&
          this.undoStack[this.undoStack.length - 1].type === "delete"
        ) {
          const nextAction = this.undoStack.pop();
          this.redoStack.push(nextAction);
          text += nextAction.value;

          if (nextAction.value === " ") break;
        }
      }

      document.getElementById("textInput").value = text;
    }
  }

  redo() {
    let text = document.getElementById("textInput").value;

    if (this.redoStack.length > 0) {
      const baseAction = this.redoStack.pop();
      this.undoStack.push(baseAction);

      if (baseAction.type === "add") {
        text += baseAction.value;

        while (
          this.redoStack.length > 0 &&
          this.redoStack[this.redoStack.length - 1].type === "add"
        ) {
          const nextAction = this.redoStack.pop();
          this.undoStack.push(nextAction);
          text += nextAction.value;

          if (nextAction.value === " ") break;
        }
      } else if (baseAction.type === "delete") {
        text = text.slice(0, -baseAction.value.length);

        while (
          this.redoStack.length > 0 &&
          this.redoStack[this.redoStack.length - 1].type === "delete"
        ) {
          const nextAction = this.redoStack.pop();
          this.undoStack.push(nextAction);
          text = text.slice(0, -nextAction.value.length);

          if (nextAction.value === " ") break;
        }
      }

      document.getElementById("textInput").value = text;
    }
  }

  updateVersionList() {
    const list = document.getElementById("versionList");
    list.innerHTML = "";
    let tail = this.currentVersion;
    while (tail && tail.previous) {
      tail = tail.previous;
    }

    let versionNumber = 1;
    let current = tail;
    while (current) {
      const version = current;
      const li = document.createElement("li");
      li.textContent = `Version ${versionNumber}`;
      li.onclick = () => {
        if (confirm("Do you want to revert to this version?")) {
          document.getElementById("textInput").value = version.content;
          this.currentVersion = version;
          this.clearHistory();
          this.updateVersionList();
        }
      };
      list.appendChild(li);
      current = current.next;
      versionNumber++;
    }
  }
}

const vcs = new VersionControl();

document.getElementById("textInput").addEventListener("input", (e) => {
  const newValue = e.target.value;
  const oldValue = vcs.lastInput || "";
  const diff = newValue.length - oldValue.length;

  if (diff > 0) {
    const added = newValue.slice(-diff);
    for (const char of added) {
      vcs.saveChanges("add", char);
    }
  }

  vcs.lastInput = newValue;
});

document.getElementById("textInput").addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    const input = document.getElementById("textInput");
    const currentValue = input.value;
    if (currentValue.length > 0) {
      const deletedChar = currentValue.slice(-1);
      input.value = currentValue.slice(0, -1);
      vcs.saveChanges("delete", deletedChar);
      vcs.lastInput = input.value;
      e.preventDefault();
    }
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
