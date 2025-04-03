**Description:**


This program is a basic version control text editor that uses HTML, CSS, and JavaScript. The program allows the user to enter text and save multiple versions. The user can perform undo/redo functionality, as well as restoration of previous versions.




**Features:**



Save Versions: Saves a snapshot of the current version of text in a doubly linked-list.

Undo/Redo: Undo or redo words.

 **NOTE: The way this feature was implemented requires the use of spaces. The feature will not work correctly if the user hits backspace in the middle of a word and types something new.**

Version History Panel: Provides the user with various versions to view and revert to.















**Responsive UI:** Written in CSS in a simple and readable interface.



 



 



 



 



**Files Included:**



 



 



 



index.html: The application's main HTML file.



 



 



 



style.css: The application's styling file.



 



 



 



script.js: This JavaScript file implements version control, undo/redo, and version history functionality.




 



 



 



**Steps to Run the Code:**



 



 



 



1. Download the files (index.html, style.css, script.js) into a directory on your machine.







2. Open index.html in your preferred web browser.



  



**Functions:**



  



Save a Version: Press the Save button to save the current page as a new version.



  



Undo Changes: Press the Undo button to undo the last change.



  



Redo Changes: Press the Redo button to redo the last undone change.















Restore a Previous Version: Click on the version logged in the Version History panel to return to that version.



   










**Commands to generate output:**














1. Type "Good morning everyone" in the text editor.







2. Hit undo and redo to view functionality.







3. Redo so that the text says "Good morning everyone" and now backspace until the text reads "Good morning ", then enter "people." The text should now read "Good morning people."







4. Hit undo and redo to view behvaiour of a deletion/replacement.







5. Click save to save the version in version history.







6. Change the text to "Goodnight everyone" and click save to store another version in the version history.







7. Choose any of the versions in the version list on the left panel to revert to.
_______



If the above application is not working as expected then please contact author(s).
