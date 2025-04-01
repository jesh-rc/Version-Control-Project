Description



It is a basic version control text editor that uses HTML, CSS, and JavaScript. Provides text input and then multiple versions saved. The program provides undo/redo. It provides the user with a version history panel to revert and see earlier versions.



Features



Save Versions: Saves snapshots of the various versions of the text that have been completed.

Undo /Redo: Undo or redo previous action.

Version History Panel: Provides the user with various versions to see and revert to.















Responsive UI: Written in CSS in a simple and readable interface.



 



 



 



 



Files Included



 



 



 



index.html: The application's main HTML file.



 



 



 



style.css: The application's styling file.



 



 



 



script.js: This JavaScript file implements version control, undo/redo, and version history functionality.



 



 



 



Setup and Usage



 



 



 



Steps to Run the Code



 



 



 



Download the files (index.html, style.css, script.js) into a directory on your machine.







Open index.html in your preferred web browser.



  



Commands to generate the Output



  



Save a Version: Press the Save button to save the current page as a new version.



  



Undo Changes: Press the Undo button (↩) to undo the last change.



  



Redo Changes: Press the Redo button (↪) to redo the last undone change.















Restore a Previous Version: Click on the version logged in the Version History panel to return to that version.



   



How It Works   



The application possesses a VersionControl class to save versions, undo/redo stacks, and text change buffers.



The Save button saves the current text as a new Version object.



Undo and Redo are achieved by pushing and popping changes into stacks.







Deletions and insertions of text are buffered to monitor changes.



Troubleshooting



All files must be in one directory before opening index.html.



_______



If the above application is not working as expected then utilize browser console to check if there is any JavaScript error.



Future Development



Include export/import option for saved versions.



Enhance the UI/UX for better user experience.



Include collaborative editing feature.
