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
      this.changeBuffer = "";
      this.deletionBuffer = "";
    }
  
    saveVersion(content) {
      const newVersion = new Version(content, this.currentVersion);
      this.currentVersion = newVersion;
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
  
      // Count total versions
      let temp = this.currentVersion;
      let count = 0;
      while (temp) {
        count++;
        temp = temp.previous;
      }
  
      // Build list with descending numbering
      temp = this.currentVersion;
      let currentVersionNumber = count;
      while (temp) {
        const version = temp;
        const li = document.createElement("li");
        li.textContent = `Version ${currentVersionNumber}`;
        li.onclick = () => {
          if (confirm("Do you want to revert back to this version?")) {
            document.getElementById("textInput").value = version.content;
          }
        };
        list.appendChild(li);
        temp = temp.previous;
        currentVersionNumber--;
      }
    }
  }
  
  const vcs = new VersionControl();
  
  // Listen for text input to handle typed characters
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
  
  // Handle Backspace manually so we can track deletions
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
  
  // Hook up buttons
  document.querySelector("button[onclick='saveVersion()']").addEventListener("click", () => {
    vcs.flushChangesBuffer();
    vcs.saveVersion(document.getElementById("textInput").value);
  });
  
  document.querySelector("button[onclick='undo()']").addEventListener("click", () => {
    vcs.undo();
  });
  
  document.querySelector("button[onclick='redo()']").addEventListener("click", () => {
    vcs.redo();
  });
  
