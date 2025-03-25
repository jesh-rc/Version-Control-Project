// A version of the text with references to the previous and next versions
class Version {
  constructor(content, previous = null, next = null) {
    this.content = content;
    this.previous = previous;
    this.next = next;
  }
}
// Handles which version, the undo/redo stacks, and the bufffers for new text changes and deleted text
class VersionControl {
  constructor() {
    this.currentVersion = null;
    this.undoStack = [];
    this.redoStack = [];
    this.changeBuffer = "";
    this.deletionBuffer = "";
  }

  // This method resets the undo/redo stack, and the change/deletion buffer
  clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
    this.changeBuffer = "";
    this.deletionBuffer = "";
  }

  // This method saves a new version of the text and links it to the version list 
  saveVersion(content) {
    const newVersion = new Version(content, this.currentVersion);

    // Sets the next of the current version as the new version
    if (this.currentVersion) {
      this.currentVersion.next = newVersion; 
    }
  
    // Now set the new version as the current version
    this.currentVersion = newVersion;

    // Clear all the history and refresh the versions list
    this.clearHistory();
    this.updateVersionList();
  }

  // Saves whatever content that is not empty to the undo stack by pushing it onto the stack
  saveChanges(content) {
    if (content.trim() !== "") {
      this.undoStack.push({ type: "add", value: content });
      this.redoStack = [];
    }
  }

  // This moves the change buffer content to the undo stack if the length is greater then 0
  flushChangesBuffer() {
    if (this.changeBuffer.length > 0) {
      this.saveChanges(this.changeBuffer);
      this.changeBuffer = "";
    }
  }

  // This moves the deletion buffer content to the undo stack if the length is greater then 0
  flushDeletionBuffer() {
    if (this.deletionBuffer.length > 0) {
      this.undoStack.push({ type: "delete", value: this.deletionBuffer });
      this.deletionBuffer = "";
      this.redoStack = [];
    }
  }

  // Undo function
  undo() {

    // Saves any of the deletions and additions before performing any undoing 
    this.flushDeletionBuffer();
    this.flushChangesBuffer();

    // If the length of the phrase is greater then 0, we can pop it off the undoStack
    if (this.undoStack.length > 0) {
      const action = this.undoStack.pop();
      let text = document.getElementById("textInput").value;

      if (action.type === "add") {

        // Remove the added text from the end of the sentence
        document.getElementById("textInput").value = text.slice(0, -action.value.length);
        this.redoStack.push(action);
      } else if (action.type === "delete") {

        // Add the deleted text back to the sentence
        document.getElementById("textInput").value = text + action.value;
        this.redoStack.push(action);
      }
    }
  }

  // Redo function
  redo() {

    // Saves any of the deletions and additions before performing any redoing 
    this.flushDeletionBuffer();
    this.flushChangesBuffer();

        // If the length of the phrase is greater then 0, we can pop it off the redoStack
    if (this.redoStack.length > 0) {
      const action = this.redoStack.pop();
      let text = document.getElementById("textInput").value;

      if (action.type === "add") {

        // Apply the previosuly undone addition again
        document.getElementById("textInput").value = text + action.value;
        this.undoStack.push(action);
      } else if (action.type === "delete") {

        // Apply the previosuly undone deletion again
        document.getElementById("textInput").value = text.slice(0, -action.value.length);
        this.undoStack.push(action);
      }
    }
  }

  // Update the list of versions in the UI
  updateVersionList() {
    const list = document.getElementById("versionList");

    // Clear the current list
    list.innerHTML = "";

    // Traverse to the first version in the list
    let tail = this.currentVersion;
    while (tail && tail.previous) {
      tail = tail.previous;
    }

    
    // Traverse through each version and display it in the list
    let versionNumber = 1;
    let current = tail;
    while (current) {
      const version = current;
      const li = document.createElement("li");
      li.textContent = `Version ${versionNumber}`;

      // When the user clicks on a previous version in the list
      li.onclick = () => {

        // Prompt a alert message to confirm
        if (confirm("Do you want to revert to this version?")) {

          // Get the text stored in version requested by the user and replace the current text
          document.getElementById("textInput").value = version.content;

          // Update the current version as the selected version
          this.currentVersion = version;

          // Clear the undo/redo history and update the version lists
          this.clearHistory();
          this.updateVersionList();
        }
      };

      // Add the version to the list, moves the next version in the linked list, and increments the version number for labeling
      list.appendChild(li);
      current = current.next;
      versionNumber++;
    }
  }
}

// Create a new instance of the class to keep track of text versions, undo/redo history, and buffers
const vcs = new VersionControl();

// Listens for any text inputs changes
document.getElementById("textInput").addEventListener("input", (e) => {

  // Check if a space is entered, this space gets saved in changeBuffer and flushChangesBuffer is called to save the buffered word
  if (e.inputType === "insertText" && e.data === " ") {
    vcs.changeBuffer += " ";
    vcs.flushChangesBuffer();

    // If a normal character is inserted, add it to change buffer
  } else if (e.inputType === "insertText") {
    vcs.changeBuffer += e.data;

    // If the backspace is pressed, it is saved before deletion occurs
  } else if (e.inputType === "deleteContentBackward") {
    vcs.flushChangesBuffer();
  }
});

// Listens for any backspace key presses
document.getElementById("textInput").addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    const input = document.getElementById("textInput");
    const currentValue = input.value;
    if (currentValue.length > 0) {

      // Manually remove the last character by extracting the last character and removs it
      const deletedChar = currentValue.slice(-1);
      input.value = currentValue.slice(0, -1);

      // Store the deleted characters in a buffer for tracking
      vcs.deletionBuffer = deletedChar + vcs.deletionBuffer;

      // Flush saves the deletion if the space was deleted and the input field is empty
      if (deletedChar === " " || input.value.length === 0) {
        vcs.flushDeletionBuffer();
      }

      // Prevents the browser from handling the backspace normally
      e.preventDefault();
    }
  }
});

// Selects the save button and saves the current version when clicked
document.querySelector("button[onclick='saveVersion()']").addEventListener("click", () => {
  vcs.flushChangesBuffer();
  vcs.flushDeletionBuffer();
  vcs.saveVersion(document.getElementById("textInput").value);
});

// Selects the undo button and executes the undo function when clicked
document.querySelector("button[onclick='undo()']").addEventListener("click", () => {
  vcs.undo();
});

// Selects the redo button and executes the redo function when clicked
document.querySelector("button[onclick='redo()']").addEventListener("click", () => {
  vcs.redo();
});
