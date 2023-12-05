import {join} from 'path'
import {app, BrowserWindow} from 'electron'

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false

function createWindow() {
  const windowOpts = {
    width: 360,
    height: 540,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
    },
  }

  if(isDev) {
    windowOpts.resizable = true
  }

  const mainWindow = new BrowserWindow(windowOpts)

  if(isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
