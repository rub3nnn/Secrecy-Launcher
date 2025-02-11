const {DownloaderHelper} = require('node-downloader-helper') 
const {ipcRenderer} = require('electron');
var childProcess = require('child_process');
const request = require('request');
var WPAPI = require( 'wpapi' );
var wp = new WPAPI({ endpoint: 'https://secrecycraft.com/wp-json' });
const fs = require('fs');
const { on } = require('events');
const Store = require('electron-store')
const storage = new Store()
const versionApp = storage.get("version.app");

document.getElementById("loader").classList.add('fadeout');
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 500)

const docs = storage.get("docsPath");
console.log(docs)

function startcheck(version, url){

  if (fs.existsSync(storage.get("actDir"))) {
    fs.unlinkSync(storage.get("actDir"));
  };
  console.log("Directorio de documentos:", docs);
  if(fs.existsSync(docs + "/secrecy/files/act")){
    if(fs.existsSync(docs + "/secrecy/files/mods")){
      checkUpdates(url,docs+ "/secrecy/files/act", version);
    }else{
      fs.mkdir(docs + "/secrecy/files/mods", { recursive: true }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(docs + "/secrecy/files/mods Creado correctamente");
          checkUpdates(url,docs+ "/secrecy/files/act", version);
        }
      });
    }
  }else{
    fs.mkdir(docs + "/secrecy/files/act", { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(docs + "/secrecy/files/act Creado correctamente");
        if(fs.existsSync(docs + "/secrecy/files/mods")){
          checkUpdates(url,docs+ "/secrecy/files/act", version);
        }else{
          fs.mkdir(docs + "/secrecy/files/mods", { recursive: true }, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log(docs + "/secrecy/files/mods Creado correctamente");
              checkUpdates(url,docs+ "/secrecy/files/act", version);
            }
          });
        }
      }
    });
  }
  
}
if(fs.existsSync(docs + "/secrecy/files/descargas")){
}else{
  fs.mkdir(docs + "/secrecy/files/descargas", { recursive: true }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(docs + "/secrecy/files/descargas Creado correctamente");
      
    }
  });
}
document.querySelector("#animacion").style.display = "block";
document.querySelector(".loading-screen").style.display = "none";
setTimeout(() => {
  document.querySelector("#animacion").style.display = "none";
  document.querySelector(".loading-screen").style.display = "flex";
  wp.posts().categories(40).get( function( error, body ) {
    if(body){
      var body = JSON.parse(body[0].acf.info);
    }
  if(error){
    if(error.code === "ENOTFOUND"){
      loading.style.display = "none";
      desc.style.display = "block";
      desc.innerHTML= "Ha ocurrido un error al conectar con el servidor<br>Compruebe su conexión a internet - Error: " + error.code + "<br>(Ctrl + R para recargar)";
    }else{
      if(error.code === "ECONNRESET"){
        loading.style.display = "none";
        desc.style.display = "block";
        desc.innerHTML= "Ha ocurrido un error al conectar con el servidor<br>Compruebe su conexión a internet - Error: " + error.code + "<br>(Ctrl + R para recargar)";
      }
    }
    console.error(error)
    ipcRenderer.send('login');
    
  }else{ 
    const actData = body;
    startcheck(actData.version, actData.downloadUrl);
  }
})
}, 3120);

  const progressBar = document.querySelector("#bar");
  const container = document.querySelector("#bar-container");
  const loading = document.querySelector(".loading-bar");
  const desc = document.querySelector("#desc");
  const btnModal = document.querySelector("#btnModal");
  container.style.display = "none";
  desc.style.display = "none";
  btnModal.style.display = "none";

function download(url, path) {
  const dll = new DownloaderHelper (url, path);
  dll.start();
    
  dll.on('error',(err) => {
    ipcRenderer.send('login');
  });
  dll.on('progress',(stats) => {
    desc.style.display = "block";
    loading.style.display = "none";
    container.style.display = "block";
    progressBar.style.width = stats.progress + "%";
  });
  dll.on('end',(downloadInfo) => {
      
      archivo = downloadInfo.fileName;
      dirArchivo = downloadInfo.filePath;
      storage.set("actDir", dirArchivo);
      desc.textContent= "ACTUALIZACIÓN DESCARGADA";
      document.getElementById("bar-container").style.display = "none";
      startupdate(dirArchivo);
      
  });
}

function checkUpdates(url, path, version1){
  if(versionApp >= version1){
    ipcRenderer.send('login');
  }else{
    download(url, path);
  };
}

// Agregar listener
function startupdate(dirArchivo){
  childProcess.exec(dirArchivo, function (err, stdout, stderr) {
      if (err) {
        alert(err);
        btnModal.style.display = "block";
        btnModal.addEventListener("click", function(evento){
          startupdate(dirArchivo);
        })
      return;
  }else{
  }
  console.log(stdout);
  
  
//        process.exit(0);// exit process once it is opened

    
  })
};
