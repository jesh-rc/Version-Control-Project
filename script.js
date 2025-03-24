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
      this.changeBuffer = "";
      this.deletionBuffer = "";
    }
  
    clearHistory() {
      this.undoStack = [];
      this.redoStack = [];
      this.changeBuffer = "";
      this.deletionBuffer = "";
    }
  
    saveVersion(content) {
      const newVersion = new Version(content, this.currentVersion);
      if (this.currentVersion) {
        this.currentVersion.next = newVersion; // link forward
      }
      this.currentVersion = newVersion;
      this.clearHistory();
      this.updateVersionList();
    }
  
    saveChanges(content) {
      if (content.trim() !== "") {
        this.undoStack.push({ type: "add", value: content });
        this.redoStack = [];
      }
    }
  
    flushChangesBuffer() {
      if (this.changeBuffer.length > 0) {
        this.saveChanges(this.changeBuffer);
        this.changeBuffer = "";
      }
    }
  
    flushDeletionBuffer() {
      if (this.deletionBuffer.length > 0) {
        this.undoStack.push({ type: "delete", value: this.deletionBuffer });
        this.deletionBuffer = "";
        this.redoStack = [];
      }
    }
  
    undo() {
      this.flushDeletionBuffer();
      this.flushChangesBuffer();
  
      if (this.undoStack.length > 0) {
        const action = this.undoStack.pop();
        let text = document.getElementById("textInput").value;
  
        if (action.type === "add") {
          document.getElementById("textInput").value = text.slice(0, -action.value.length);
          this.redoStack.push(action);
        } else if (action.type === "delete") {
          document.getElementById("textInput").value = text + action.value;
          this.redoStack.push(action);
        }
      }
    }
  
    redo() {
      this.flushDeletionBuffer();
      this.flushChangesBuffer();
  
      if (this.redoStack.length > 0) {
        const action = this.redoStack.pop();
        let text = document.getElementById("textInput").value;
  
        if (action.type === "add") {
          document.getElementById("textInput").value = text + action.value;
          this.undoStack.push(action);
        } else if (action.type === "delete") {
          document.getElementById("textInput").value = text.slice(0, -action.value.length);
          this.undoStack.push(action);
        }
      }
    }
  
    updateVersionList() {
      const list = document.getElementById("versionList");
      list.innerHTML = "";
  
      // Find oldest version (tail)
      let tail = this.currentVersion;
      while (tail && tail.previous) {
        tail = tail.previous;
      }
  
      // Walk forward from oldest to newest version
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
    if (e.inputType === "insertText" && e.data === " ") {
      vcs.changeBuffer += " ";
      vcs.flushChangesBuffer();
    } else if (e.inputType === "insertText") {
      vcs.changeBuffer += e.data;
    } else if (e.inputType === "deleteContentBackward") {
      vcs.flushChangesBuffer();
    }
  });
  
  document.getElementById("textInput").addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      const input = document.getElementById("textInput");
      const currentValue = input.value;
      if (currentValue.length > 0) {
        const deletedChar = currentValue.slice(-1);
        input.value = currentValue.slice(0, -1);
        vcs.deletionBuffer = deletedChar + vcs.deletionBuffer;
        if (deletedChar === " " || input.value.length === 0) {
          vcs.flushDeletionBuffer();
        }
        e.preventDefault();
      }
    }
  });
  
  document.querySelector("button[onclick='saveVersion()']").addEventListener("click", () => {
    vcs.flushChangesBuffer();
    vcs.flushDeletionBuffer();
    vcs.saveVersion(document.getElementById("textInput").value);
  });
  
  document.querySelector("button[onclick='undo()']").addEventListener("click", () => {
    vcs.undo();
  });
  
  document.querySelector("button[onclick='redo()']").addEventListener("click", () => {
    vcs.redo();
  });
  
