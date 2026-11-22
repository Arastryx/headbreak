import { app, shell, BrowserWindow, ipcMain, net, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import { setupKanbanApi } from './api/kanbanApi'
import { initDatabase } from './database/database'
import { checkAutomatedMovements } from './checkAutomatedMovements'
import { store } from './config'
import { mkdirSync, existsSync } from 'node:fs'
import { setupAttachmentApi } from './api/attachmentApi'
import { clearOrphanedAttachments } from './clearOrphanedAttachments'
import { ThumbnailManager } from './ThumbnailManager'
import url from 'node:url'
import { AttachmentManager } from './AttachmentManager'

const isDev = !app.isPackaged

async function installDevtron() {
  const { devtron } = await import('@electron/devtron')
  await devtron.install()
}

if (isDev) {
  installDevtron().catch((error) => {
    console.error('Failed to install Devtron:', error)
  })
}

ThumbnailManager.prepThumbnails()
AttachmentManager.prepPasted()

interface HeadbreakApp {
  mainWindow?: BrowserWindow
}

export const headbreakApp: HeadbreakApp = {}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: store.get('window.width') ?? 1700,
    height: store.get('window.height') ?? 1000,
    x: store.get('window.x'),
    y: store.get('window.y'),
    show: false,
    autoHideMenuBar: true,
    icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds()
    store.set('window.x', bounds.x)
    store.set('window.y', bounds.y)

    if (!mainWindow.isMaximized()) {
      store.set('window.width', bounds.width)
      store.set('window.height', bounds.height)
    }

    store.set('window.maximized', mainWindow.isMaximized())
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  headbreakApp.mainWindow = mainWindow
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (headbreakApp.mainWindow) {
      if (headbreakApp.mainWindow.isMinimized()) {
        headbreakApp.mainWindow.restore()
      }
      headbreakApp.mainWindow.focus()
    }
  })

  protocol.registerSchemesAsPrivileged([{ scheme: 'thum', privileges: { bypassCSP: true } }])

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.arastryx.headbreak')

    protocol.handle('thum', async (request) => {
      let params = request.url.slice('thum:///'.length)

      return net.fetch(
        url.pathToFileURL((await ThumbnailManager.getThumbnail(params)) ?? '').toString()
      )
    })

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    const path = app.getPath('userData')
    const dbPath = `${path}/${import.meta.env.DEV ? 'dev' : 'app'}`

    if (!existsSync(dbPath)) {
      mkdirSync(dbPath)
    }

    await initDatabase()

    await Promise.all([checkAutomatedMovements(), clearOrphanedAttachments()])

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    setupKanbanApi()
    setupAttachmentApi()

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
}
