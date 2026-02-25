const vscode = require('vscode');
const path = require('path');
const sound = require('sound-play');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Test Fail Sound extension is now active!');

    // Since extension.js is in the root, it's right next to the audio folder
    const soundFilePath = path.join(context.extensionPath, 'audio', 'fahhhhh.mp3');

    // Listen for when a task process ends
    const taskListener = vscode.tasks.onDidEndTaskProcess((event) => {
        const taskName = event.execution.task.name.toLowerCase();
        
        // Check if the task is related to testing
        const isTestTask = taskName.includes('test') || event.execution.task.source === 'test';

        // An exit code other than 0 usually means the command failed
        if (isTestTask && event.exitCode !== 0) {
            vscode.window.showInformationMessage('Test failed! Playing sound...');
            
            // Play the sound
            sound.play(soundFilePath).catch((err) => {
                console.error('Error playing sound:', err);
                vscode.window.showErrorMessage('Failed to play the test failure sound.');
            });
        }
    });

    context.subscriptions.push(taskListener);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};