const request = require('request');
const {app, BrowserWindow, webContents, Menu, shell, ipcMain} = require('electron')
//Menu.setApplicationMenu(false)
const path = require('path')
const url = require('url')

appData = app.getPath("appData");
var pjson = require('./package.json');


const iconUrl = url.format({
  pathname: path.join(__dirname, 'Icon.ico'),
  protocol: 'file:',
  slashes: true
})

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname + '/files/default/icon.ico',
    autoHideMenuBar: true,
    width: 1400,
    height: 870,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  ipcMain.on('relogin', ()=>{
    mainWindow.webContents.send('loaderOn');
  })

  mainWindow.on('close', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  ipcMain.on('microsoftAccount', function () {
    console.log("1")
    microsoftAccount()
  })
  
  ipcMain.on('cuentaEnd', ()=>{
    mainWindow.webContents.send('profileAct');

  })

  // and load the index.html of the app.
  mainWindow.loadFile('./loading.html');
  //mainWindow.loadURL('https://secrecycraft.com/')
  // Open the DevTools.

  mainWindow.webContents.on("new-window", (_, url) => {
    _.preventDefault();
    const protocol = require("url").parse(url).protocol;
    if (protocol === "http:" || protocol === "https:") {
        shell.openExternal(url);
    }
});
  // mainWindow.webContents.openDevTools()
  ipcMain.on('hide-me', function() {
    mainWindow.hide();
  });
  ipcMain.on('show-me', function() {
    mainWindow.show();
  });
  ipcMain.on('close', (evt, arg) => {
    app.quit()
  })
  this.senderrorauth = function(){
    mainWindow.webContents.send('errorauth');
  }
}


const lul = app.getPath('documents')
const Store = require('electron-store')
const storage = new Store()
storage.set("docsPath", lul);
storage.set("version.app",pjson.version);
console.log(pjson.version)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  if(storage.get("appData")){
    if(appData === storage.get("appData")){
        console.log("La dirección de appdata no ha cambiado")
    }else{
      storage.set("appData", appData)
    }
  } else {
    storage.set("appData", appData)
  };
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  
  
  
})


const msmc = require("msmc");
function microsoftAccount(){
  console.log("2")
  if(storage.get("mineapi.profile")){
    if(msmc.validate(storage.get("mineapi.profile"))){}else{
      msmc.refresh(msmc.getMCLC().getAuth(storage.get("mineapi"))).then(function(result){storage.set("mineapi",result)}).catch(error => {fastLaunch();console.log(error)})
          }
  }else{
    fastLaunch()
  }
}



function fastLaunch(){
  msmc.fastLaunch("electron", 
            (update) => {
                //A hook for catching loading bar events and errors, standard with MSMC
                console.log("CallBack!!!!!")
                console.log(update)
            }).then(result => {
                //If the login works
                 if (msmc.errorCheck(result)){
                    senderrorauth()
                    console.log("We failed to log someone in because : "+result.reason)
                    return;
                }
                storage.set("mineapi",result)
            }).catch(reason=>{
                //If the login fails 
                senderrorauth()
                console.log("We failed to log someone in because : "+reason);
            })
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.


ipcMain.on('close-me', (evt, arg) => {
  setTimeout(function () {
  app.quit()
}, 1000)
})

ipcMain.on('cuenta', (evt, arg) => {
  if (typeof userWindow !== 'undefined') {
    userWindow.show();
}else{
    const userWindow = new BrowserWindow({
      icon: __dirname + '/files/default/icon.ico',
      frame: false,
      autoHideMenuBar: true,
      width: 900,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'index.js')
      }
    });
    userWindow.loadFile("./loadingGame.html");
    ipcMain.on('cuentaEnd', ()=>{
      userWindow.hide();
    })
    
  }

})


const {DownloaderHelper} = require('node-downloader-helper'); 


ipcMain.on('logged', ()=>{
  BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'index.html'),
      protocol:'file',
      slashes:true
  }));
})

ipcMain.on('login', ()=>{
  request('https://secrecycraft.com/db/settings/login.html', function (error, response, body) {
    let infoLogin = body;
  if(error){
    console.log(error);
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'index.html'),
      protocol:'file',
      slashes:true
    }));
  }else{
    console.log(infoLogin);
    storage.set("loginStatus",infoLogin);
    if(infoLogin==="enabled"){
      BrowserWindow.getAllWindows()[0].loadURL("https://secrecycraft.com/loginapp");
    }else{
      BrowserWindow.getAllWindows()[0].loadURL(url.format({
        pathname : path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
      }));
    }
  }
})})


ipcMain.on('terminado', ()=>{
  BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'index.html'),
      protocol:'file',
      slashes:true
  }));
})

ipcMain.on('restore', ()=>{
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
}
} )


ipcMain.on('logout', ()=>{
  BrowserWindow.getAllWindows()[0].loadURL("https://secrecycraft.com/wp-login.php?action=logout&redirect_to=https%3A%2F%2Fsecrecycraft.com%2Floginapp%2F");
})

ipcMain.on('urlcar', ()=>{
  BrowserWindow.getAllWindows()[0].loadURL(url.format({
      pathname : path.join(__dirname,'urlcar.html'),
      protocol:'file',
      slashes:true
  }));
})



// In this example, only windows with the `about:blank` url will be created.
// All other urls will be blocked.

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
