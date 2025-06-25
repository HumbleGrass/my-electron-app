const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${electron.versions.chrome()}), Node.js (v${electron.versions.node()}), and Electron (v${electron.versions.electron()})`;
function quit() {
    electron.ipcMain.quit()
}

document.getElementById('quitButton').addEventListener('click', () => quit());