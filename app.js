const FileSystem = require('fs');
const path = require('path');
const { exec } = require('child_process');

const watchFolder = './watch'; // Folder to watch for new text files
const doneFolder = './done'; // Folder to move printed files

// Ensure watch and done folders exist
FileSystem.mkdirSync(watchFolder, { recursive: true });
FileSystem.mkdirSync(doneFolder, { recursive: true });

// Function to print and move file
function printAndMoveFile(file) {
  try {
    const filePath = path.join(watchFolder, file);
    const command = process.platform === 'win32' ? `notepad /p ${filePath}` : `lp ${filePath}`;

    exec(command, (error) => {
      if (error) {
        console.error(`Error printing ${file}:`, error);
        return;
      }

      console.log(`Printed ${file}`);

      const targetPath = path.join(doneFolder, file);
      FileSystem.renameSync(filePath, targetPath);
      console.log(`Moved ${file} to 'done' folder`);
    });
  } catch (error) {
    console.error(`Error handling ${file}:`, error);
  }
}

// Watch for new files in the folder
FileSystem.watch(watchFolder, (eventType, filename) => {
  if (eventType === 'rename' && filename.endsWith('.txt')) {
    console.log(`New file detected: ${filename}`);
    printAndMoveFile(filename);
  }
});

console.log(`Watching for files in '${watchFolder}'...`);
