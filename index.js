
// All of the Node.js APIs are available in the preload process.

const {ipcRenderer} = require('electron');

const Store = require('electron-store')

const storage = new Store()

const renderer = require('./js/intrarenderer')

function receiveMessageFromIframePage (event) {
    ipcRenderer.send( 'cuentaEnd' );
    
}

function receiveMessageFromIframePage2 (event) {
  ipcRenderer.send('relogin');
}


//Listen for message events
window.addEventListener('message', function(event) {
  if(event.data.event_id === 'my_cors_message'){
      storage.set("username.secrecy", event.data.data.v1);
      storage.set("perfilFoto",event.data.data.v2);
      receiveMessageFromIframePage(event);
  }
  if(event.data.event_id === 'logout'){
    receiveMessageFromIframePage2(event);
}
});
