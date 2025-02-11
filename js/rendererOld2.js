//consts & vars 
const msmc = require("msmc");
const Store = require('electron-store')
const storage = new Store()
const {shell} = require('electron') 
const {DownloaderHelper} = require('node-downloader-helper')
const { app, BrowserWindow } = require('electron')
const {ipcRenderer} = require('electron');
const os = require('os');
const userHomeDir = os.homedir();
var childProcess = require('child_process');
const fs = require('fs');
const notifier = require('node-notifier');
const request = require('request');
var express = require('express');
const appData = storage.get("appData");
const minecraftData = appData + "/.minecraft"
const path = require('path');
var StreamZip = require('node-stream-zip');
const { BADRESP } = require('dns');
const { isGeneratorFunction } = require('util/types');
TLauncherData = storage.get("TLauncher");
const docuus = storage.get("docsPath") + "/secrecy"
const body = document.querySelector("body");
const dirTree = require("directory-tree");
const mineloader = document.querySelector("#mineloader");
const { Client, Authenticator, offline } = require('minecraft-launcher-core');
const e = require('express');
const optifine = require('optifine-utils');
const { versions } = require('process');
const launcher = new Client();
const jsonfile = require('jsonfile')
var WPAPI = require( 'wpapi' );
var wp = new WPAPI({ endpoint: 'https://secrecycraft.com/wp-json' });


//query & ById
var modal = document.getElementById("myModal");
const btnModals = document.querySelector("#btnModal");
const btnCloseModals = document.querySelector("#btnCloseModal");
const btnModalCancel = document.querySelector("#btnModalCancel");
const btnModalAccept = document.querySelector("#btnModalAccept");
const progressBar = document.getElementById('bar');
const check = document.getElementById('check');
const CompMine1 = document.querySelector("#CompMine1");
const modalTitle = document.querySelector("#modalTitle");
const subdesc = document.querySelector("#subdesc");
const barContainer = document.querySelector("#bar-container");
const modalImg = document.querySelector(".modalImg");
const play = document.querySelector("#play");
const recargar = document.querySelector("#recargar");
const modalTextInput = document.querySelector("#modalTextInput");

function downloadModal(){ 
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'block';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "block";
  barContainer.style.display = "block";
  subdesc.style.display = "block";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalTitle.style.display = "none";
}

function preDownloadModal(){ 
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.width = '0';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "block";
  barContainer.style.display = "block";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalTitle.style.display = "none";
}

function optionsModal(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "inline-block";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "inline-block";
  modalImg.style.display="none";
}

function titleModal(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
}
function titleModalClose(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
}
function titleModalTextInputClose(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "block";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "block";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "inline-block";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "inline-block";
  modalImg.style.display="none";
}
function downloadModal(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'block';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "block";
  modalTitle.style.display = "none";
  barContainer.style.display = "block";
  bar.style.display = "block";
  subdesc.style.display = "block";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
}
function modalError(msg){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "block";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalText(msg);
}
function modalErrorSkip(msg){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "block";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "block";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalText(msg);
}
function modalSuccess(msg){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "block";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "block";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalText(msg);
  comprobar();
}
function modalOnlySuccess(msg){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "block";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="none";
  modalText(msg);

}
function modalImage(img){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  modalTextInput.style.display = "none";
  progressBar.style.display = 'none';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  modalTitle.style.display = "block";
  barContainer.style.display = "none";
  subdesc.style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "block";
  btnModalCancel.style.display = "none";
  modalImg.style.display="block";
  document.getElementById("modalImg").src=img;
}

btnCloseModals.addEventListener("click", function(eventos){
  closePopup();
})

function closePopup(){
  modal.style.display = "none"
  body.style.overflow = "auto";
}

function modalText(msg){
  modalTitle.textContent=msg
}
function modalDesc(msg){
  desc.textContent=msg
}
function modalSubDesc(msg){
  subdesc.textContent=msg
}

CompMine1.addEventListener("click", function(eventos){
  modalError("Este complemento solo es compatible para conectar con Servidores de Secrecy. No es posible instalarlo mientras no haya ninguno activo.");
})

btnModals.addEventListener("click", function(eventos){
  launchMine()
})

function launchMine(){   
  if(storage.get("installed.name")){
    wp.posts().id(storage.get("installed.id")).get( function( error, posts13 ) {
      serverIns = posts13
      if(storage.get("version."+serverIns.name)===serverIns.version) {
        document.querySelector("#gstartbutton").disabled = true;
        document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
        document.querySelector("#gstartbutton").textContent = "Cargando..."
        closePopup();
        checkJava();
      }else{
        document.querySelector("#actualizarpack").style.display = "none";
          document.querySelector("#gstartbutton").disabled = true;
          document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
          document.querySelector("#mineloadercontainer").style.display = "block";
          wp.posts().id(storage.get("installed.id")).get( function( error, posts14 ) {
            serverIns = posts14
            document.querySelector("#gstartbutton").textContent = "Actualizando archivos del pack "+ serverIns.name;
                  fs.rm(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
                    if (err) {
                      if( err.code === "ENOTEMPTY"){
                        modalError("Un mod no se ha podido eliminar correctamente. Este error se soluciona reiniciando la aplicación")
                      }else{
                        if( err.code === "EPERM"){
                          modalError("Un mod no se ha podido eliminar correctamente. Es necesario reiniciar la aplicación.");
                        }else{
                          modalError(err);
                        }
                      
                      }
                    }else{
                      storage.set("installed.name","");
                      document.querySelector("#gstartbutton").textContent = "Archivos adaptados"
                          setTimeout(() => {
                            document.querySelector("#gstartbutton").textContent = "Descargando actualización de " + serverIns.name;
                            storage.set("launch","true")
                            checkMineFolder(serverIns.descarga, serverIns.name, serverIns.version, serverIns.mineversion, serverIns.config);
                          }, 600);
                    }
                  });
          })
        }
    })
  }else{
    document.querySelector("#gstartbutton").disabled = true;
    document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
    document.querySelector("#gstartbutton").textContent = "Cargando..."
    checkJava();
  }
  
  

}

recargar.addEventListener("click", function(eventos){
  reload();
})

function reload(){
  if(lastSection === "packs"){
    requestdb();
  }
  if(lastSection === "ajustes"){
    reajustes();
  }
  if(lastSection === "bibl"){
    biblFiles();
  }
  if(lastSection === "panel"){
    comprobar();
  }
}
function recargarSkip(){
    requestdb();
    reajustes();
    panel();
    biblFiles()
}

function changemineusername(){
  if(storage.get("Xpremium")){}else{
    modalTextInput.value = "";
    var format = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
    modalSubDesc("")
    modalText("Introduce tu nombre de usuario para minecraft")
    titleModalTextInputClose();
    btnModalAccept.addEventListener("click", submitinputusername);
    function submitinputusername(){
      if(modalTextInput.value){
      {
          btnModalAccept.removeEventListener("click", submitinputusername);
          storage.set("username.minecraft", modalTextInput.value);
          document.getElementById("mineusername").textContent=modalTextInput.value;
          closePopup();
      }
    }else{
      modalSubDesc("Tienes que introducir un nombre de usuario")
    }}
    btnModalCancel.addEventListener("click", function(eventos){{
      btnModalAccept.removeEventListener("click", submitinputusername);
      closePopup();
    }})
  }
}

function setNameProfile(){
  if(storage.get("username.minecraft")){}else{
    storage.set("username.minecraft", storage.get("username.secrecy"))
  }
  if(storage.get("Xpremium")){
    document.getElementById("mineusername").innerHTML=`<span class="text" style="margin-left: 0%; margin-top:0; margin-bottom: 0;  margin-right: 0%; ">${storage.get("mineapi.profile.name")}</span>`;
    document.getElementById("profile").src=(`https://crafatar.com/avatars/${storage.get("mineapi.profile.id")}?overlay=true&default=MHF_Steve&scale=10`);
  }else{
    document.getElementById("mineusername").innerHTML=`<span class="text" style="margin-left: 0%; margin-top:0; margin-bottom: 0;  margin-right: 0%; ">${storage.get("username.minecraft")}</span><i class='bx bx-chevron-up' style="font-size: 35px; color: #ffffff; margin-right: -7px;" ></i>`;
    document.getElementById("profile").src=(storage.get("perfilFoto"));
  }
  
  document.getElementById("username").innerText=storage.get("username.secrecy");
}

function logout(){
  ipcRenderer.send( 'logout' );
}

ipcRenderer.on('profileAct', function (evt) {
  setNameProfile(); 
  document.getElementById("loader").classList.remove('fadein');
  if(storage.get("loader", "on")){
    document.getElementById("loader").classList.add('fadeout');
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1000);
  storage.set("loader","off");
}}
);


ipcRenderer.on('loaderOn', function (evt) {
  document.getElementById("loader").classList.remove('fadeout');
document.getElementById("loader").classList.add('fadein');
document.getElementById("loader").style.display = "flex";
storage.set("loader", "on");
});


ipcRenderer.on('errorauth', function (evt) {
  storage.set("Xpremium",false)
  reajustes()
})
//.categories(
//OnLoad
checkPremium()
storage.set("launch","")
setNameProfile();
wp.posts().categories(40).get( function( error, posts5 ) {
  if(error){
    console.error(error)
  }else{
    let body = posts5[0].acf.portada 
    const portadaData = JSON.parse(body)
    document.getElementById("portada12").innerHTML = `<lottie-player src="${portadaData.portada}" background="transparent" speed="1" id="animacion" style="width: 100%; height: auto; display: block; z-index: 17;" autoplay></lottie-player>;`
  }});

wp.posts().categories(40).get( function( error, posts2 ) {
  if(error){
    console.error("Ha ocurrido un error comprobando notificaciones.")
  }else{
    const notifData = JSON.parse(posts2[0].acf.notif);
    if(notifData.id === storage.get("notif")){
        console.log("No mostrando notificación");
    }else{
      storage.set("notif",notifData.id);
      if(notifData.mode === "html"){
        titleModalClose();
        document.getElementById("modalTitle").innerHTML = notifData.html;
      }
      if(notifData.mode === "text"){
        titleModalClose();

        modalText(notifData.text);
      }
      if(notifData.img){
        modalImage(notifData.img);
      }
    }
  }    
}
);

function existDir(dir){
  if(fs.existsSync(dir)){
    return true
  }else{
    return false
  }
}

function createDir(dir){
  fs.mkdirSync( dir, { recursive: true }, (error) => {
    if (error) {
      modalError("Ha ocurrido un error creando la carpeta de almacén de Slauncher: " + error.code);
    } else {
      return true
    }
  });
}




function deletePack(val){
  let file = modsTree.children.find(element => element.name == val.id);
  fs.unlink(file.path, (err) => {
    if (err) {
      modalError(err)
      return
    }
    modalOnlySuccess("Pack "+file.name.replace(".zip", "")+" eliminado correctamente")
    packList();
    })
  
}


function selectPack(val){
  let file = modsTree.children.find(element => element.name == val.id);
  if(existDir(minecraftData+"/mods")){
    fs.readdir(minecraftData+"/mods", function(err, files) {
      if (err) {
        modalError(err)
      } else {
         if (!files.length) {
          installPack(file.name, file.path)
         }else{
          optionsModal();
          modalText("Parece que tienes ya instalados algunos mods, es necesario eliminarlos antes de continuar.");
          btnModalAccept.addEventListener("click", acceptremoveandinstallpack);
          function acceptremoveandinstallpack(){
          btnModalAccept.removeEventListener("click", acceptremoveandinstallpack);
          titleModal();
          modalText("Eliminando archivos...");
          fs.rm(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
          if (err) {
          modalError(err)
          }else{
          storage.set("installed.name","");
          modalText("Archivos Eliminados");
            installPack(file.name, file.path)
          }
          });
          }
        btnModalCancel.addEventListener("click", function(eventos){
          closePopup();
        })
         }
      }
    });
  }else{
    if(createDir(minecraftData+"/mods")){
      installPack(file.name, file.path)
    };
  }
}

function openModsFolder(){
  if(existDir(minecraftData+"/mods")){
    shell.openPath(minecraftData+"/mods") // Open the given file in the desktop's default manner.
  }else{
    fs.mkdirSync( minecraftData+"/mods", { recursive: true }, (error) => {
      if (error) {
        modalError("Ha ocurrido un error creando la carpeta de almacén de Slauncher: " + error.code);
      } else {
        shell.openPath(minecraftData+"/mods") // Open the given file in the desktop's default manner.
      }
    });
  }
}


function installPack(name, path){
  preDownloadModal()
  modalDesc("Extrayendo archivos")
  modalSubDesc("Cargando...")
  var zip = new StreamZip({
    file: path
  , storeEntries: true
  });
  zip.on('ready', function () {
    zip.extract(null, minecraftData + "/mods", (err, count) => {
        console.log(err ? 'Extract error' : `Extracted ${count} entries`);
        if(err){
          modalError(err);
        }else{
          modalSuccess("Pack "+name.replace(".zip", "")+ " instalado correctamente.");
          progressBar.style.width = "0%";
        };
        zip.close();
    });
  });
}

const archiver = require('archiver');
const { file } = require('jszip')

function packList(){
  const tree = dirTree(docuus + "/files/mods");
  Object.defineProperty(window, 'modsTree', {
    value: tree,
    configurable: false,
    writable: true
  }); 

  function serverTemplate42(server) {
    return ` 
    <div class="card" >
          <div class="box">
            <div class="content">
              <h2></h2>
              <h3>${server.name.replace(".zip", "")}</h3>
              <btnModal class="selectPack" onClick="selectPack(this)" id="${server.name}">SELECCIONAR</btnModal>
              <btnModal class="EliminarPack" id="${server.name}" onClick="deletePack(this)">ELIMINAR</btnModal>
              <p id="${server.name + "pack"}"></p>
            </div>
          </div>
        </div>`;

}

document.querySelector("#exportPack").style.display = "none"
document.querySelector("#addPack").style.display = "none"

fs.readdir(docuus + "/files/mods", function(err, files) {
  if (err) {
     modalError(err);
  } else {
     if (!files.length) {

      document.getElementById("packsDiv").innerHTML = `<span class="text">No tienes ningún pack guardado</span>`;
    }else{
      document.getElementById("packsDiv").innerHTML = `${tree.children.map(serverTemplate42).join("")}`;
    }
  }})
}

function addPack(){
  var input = document.createElement('input');
input.type = 'file';
input.accept = '.zip';


input.onchange = e => { 
   var file = e.target.files[0]; 
   fs.copyFile(file.path, docuus + "/files/mods", (err) => {
    if (err) throw err;
  });
}

input.click();
}

function test(){
  modalTextInput.value = "";
  var format = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  modalSubDesc("")
  modalText("¿Que nombre le quieres poner al pack?")
  titleModalTextInputClose();
  btnModalAccept.addEventListener("click", submitinputpacksave);
  function submitinputpacksave(){
    if(modalTextInput.value){
    {
        btnModalAccept.removeEventListener("click", submitinputpacksave);
        preDownloadModal();
        modalDesc("Guardando el pack " + modalTextInput.value )
        PrezipDirectory(minecraftData + "/mods", docuus + "/files/mods", modalTextInput.value) 
    }
  }else{
    modalSubDesc("Tienes que introducir un nombre")
  }}
  btnModalCancel.addEventListener("click", function(eventos){{
    btnModalAccept.removeEventListener("click", submitinputpacksave);
    closePopup();
  }})
}

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */

function PrezipDirectory(sourceDir, outPath, name) {

  if(fs.existsSync(outPath)){
    zipDirectory(sourceDir, outPath + "/" + name + ".zip", name)
  }else{
    fs.mkdir( outPath, { recursive: true }, (error) => {
      if (error) {
        modalError("Ha ocurrido un error creando la carpeta de almacén de Slauncher: " + error.code);
      } else {
        console.log( outPath + " creado correctamente");
        zipDirectory(sourceDir, outPath + "/" + name + ".zip", name)
      }
    });
  }
}

function zipDirectory(sourceDir, outPath, name) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('finish', () => subzipDirectory(name));
    stream.on('error', function(err){
      modalError("Ha ocurrido un error guardando el pack" + err.code);
      console.error(err); 
    });
    archive.finalize();
  });
}

function subzipDirectory(name){
  packList();
  modalOnlySuccess("Se ha guardado correctamente el pack de mods "+name)
}



function searchVersions(){
  document.getElementById("verAlertDiv").innerHTML = ``
  document.getElementById("verDiv").innerHTML = `<div style="width:100px; margin:auto; margin-top:100px;">
  <div class="loader22"></div>
  </div>`
  document.querySelector("#verFilters").style.display = "inline-block";
document.querySelector("#verInstalled").style.display = "inline-block";
document.querySelector("#verMine").style.display = "none";
wp.posts().categories(40).get( function( error, posts1 ) {
  if(error){
    console.error(error)
    errorVersions()
  }else{
    if(posts1[0]){
      if(posts1[0].acf.versions){
      var body = posts1[0].acf.versions
    const versionesMine = JSON.parse(body);
    Object.defineProperty(window, 'mineVerDb', {
      value: versionesMine,
      configurable: false,
      writable: true
    }); 
    
    actualVersion();
    function serverTemplate42(server) {
        return ` 
        <div class="card" >
              <div class="box">
                <div class="content">
                  <h2>${server.clas}</h2>
                  <h3>${server.mod} ${server.version}</h3>
                  <btnModal class="selectVer" id="${server.mod}${server.version}">SELECCIONAR</btnModal>
                  <p>${server.tag}</p>
                </div>
              </div>
            </div>`;

    }
    
    
    document.getElementById("verDiv").innerHTML = `${versionesMine.map(serverTemplate42).join("")}`;
      }else{
        errorVersions()
      }
  }else{
    errorVersions()
  }
    document.querySelectorAll('.selectVer').forEach(btn => {
      btn.addEventListener("click", onClickEventInstaller); // events bubble up to ancestors
    
    });
    function onClickEventInstaller(e){
      var result = e.target.id
      if(result.includes("Forge")){
        let verInfo = mineVerDb.find(element => element.version == result.replace("Forge",""));
        lastSec()
        setMineVer(verInfo.version, "Forge");
      }else{
        let verInfo = mineVerDb.find(element => element.version == result);
        lastSec()
        setMineVer(verInfo.version, verInfo.mod);
      }
    }
    
  }
  })
  function errorVersions(){
    Object.defineProperty(window, 'mineVerDb', {
      value: false,
      configurable: false,
      writable: true
    }); 
    document.querySelector("#verFilters").style.display = "none";
    document.getElementById("verAlertDiv").innerHTML = `<span class="text" style="margin-bottom: 5px;">No se han podido obtener todas las versiones disponibles<br>Comprueba tu conexión a internet</span>`
    verInstalled("offline")
    firstLoadFinish()
  }
}
function verFilter(val){
  const filteredVersions = mineVerDb.filter(nombre => {
    return nombre.version.toLowerCase().includes(val.innerText);
  });

  function serverTemplate42(server) {
    return ` 
    <div class="card" >
          <div class="box">
            <div class="content">
              <h2>${server.clas}</h2>
              <h3>${server.mod} ${server.version}</h3>
              <btnModal class="selectVer" id="${server.mod}${server.version}">SELECCIONAR</btnModal>
              <p>${server.tag}</p>
            </div>
          </div>
        </div>`;
}
document.getElementById("verDiv").innerHTML = `${filteredVersions.map(serverTemplate42).join("")}`;
document.querySelectorAll('.selectVer').forEach(btn => {
  btn.addEventListener("click", onClickEventInstaller); // events bubble up to ancestors

});
function onClickEventInstaller(e){
  var result = e.target.id
  if(result.includes("Forge")){
    let verInfo = mineVerDb.find(element => element.version == result.replace("Forge",""));
    lastSec()
    setMineVer(verInfo.version, "Forge");
  }else{
    let verInfo = mineVerDb.find(element => element.version == result);
    lastSec()
    setMineVer(verInfo.version, verInfo.mod);
  }
}
}



function verInstalled(state){
  document.getElementById("verDiv").innerHTML = `<div style="width:100px; margin:auto; margin-top:100px;">
  <div class="loader22"></div>
  </div>`
  document.querySelector("#verFilters").style.display = "none";
document.querySelector("#verInstalled").style.display = "none";
if(state === "offline"){}else{
  document.querySelector("#verMine").style.display = "inline-block";
}
  const verInstalled = dirTree(minecraftData + "/versions");
  Object.defineProperty(window, 'versionesInst', {
    value: verInstalled,
    configurable: false,
    writable: true
  }); 
  function serverTemplate422(server) {
    if(server.children){
    const file = server.path+"/"+server.name+".json"
    fileof = jsonfile.readFileSync(file);
    if(fileof.inheritsFrom){
      if(server.name.includes("forge")){
      return ` 
      <div class="card" >
            <div class="box">
              <div class="content">
                <h2 style="font-size: 60px;">${fileof.inheritsFrom}</h2>
                <h3>${server.name}</h3>
                <btnModal class="selectInstalledVer" id="${server.name}">SELECCIONAR</btnModal>
                <p>Esta versión puede causar problemas, se recomienda usar las de SLauncher</p>
              </div>
            </div>
          </div>`;
      }else{
       return ` 
      <div class="card" >
            <div class="box">
              <div class="content">
                <h2 style="font-size: 60px;">${fileof.inheritsFrom}</h2>
                <h3>${server.name}</h3>
                <btnModal class="selectInstalledVer" id="${server.name}">SELECCIONAR</btnModal>
              </div>
            </div>
          </div>`;
      }
    }else{
      if(mineVerDb){
      if(mineVerDb.find(element => element.version == fileof.id)){
      }else{
        return ` 
      <div class="card" >
            <div class="box">
              <div class="content">
                <h3>${server.name}</h3>
                <btnModal class="selectInstalledVer" id="${server.name}">SELECCIONAR</btnModal>
              </div>
            </div>
          </div>`;
      }
      }else{
        return ` 
      <div class="card" >
            <div class="box">
              <div class="content">
                <h3>${server.name}</h3>
                <btnModal class="selectInstalledVer" id="${server.name}">SELECCIONAR</btnModal>
              </div>
            </div>
          </div>`;
      }

      }
    }

    }
    document.getElementById("verDiv").innerHTML = `${verInstalled.children.map(serverTemplate422).join("")}`;
document.querySelectorAll('.selectInstalledVer').forEach(btn => {
  btn.addEventListener("click", onClickEventInstaller23333); // events bubble up to ancestors

  function onClickEventInstaller23333(e){
    const file2 = minecraftData + "/versions/"+e.target.id+"/"+e.target.id+".json"
      fileof2 = jsonfile.readFileSync(file2);
    console.dir(jsonfile.readFileSync(file2))
    if(fileof2.type){
      storage.set("verFolderType",fileof2.type)
    }
    if(fileof2.inheritsFrom){
      setMineVer(fileof2.inheritsFrom, "", e.target.id);
    }
    lastSec();
  }

});
    }



function actualVersion(){
  if(storage.get("mineVer")){
    if(storage.get("verFolder")){
      setMineVer(storage.get("mineVer"), "", storage.get("verFolder"));
  }else{
  let verInfo = mineVerDb.find(element => element.version == storage.get("mineVer"));
  if(storage.get("Forge")==="true"){
    if(verInfo){
      setMineVer(verInfo.version, "Forge", "");
    }else{
      let lastVerInfo = mineVerDb.find(element => element.tag == "Última versión");
      setMineVer(lastVerInfo.version,  lastVerInfo.mod, "");
    }
  }else{
    if(verInfo){
      setMineVer(verInfo.version, "", "");
    }else{
      let lastVerInfo = mineVerDb.find(element => element.tag == "Última versión");
      setMineVer(lastVerInfo.version,  lastVerInfo.mod, "");
    }
  }
    }

  }else{
    let lastVerInfo = mineVerDb.find(element => element.tag == "Última versión");
    setMineVer(lastVerInfo.version,  lastVerInfo.mod, "");
  };
  firstLoadFinish()
  comprobar()
}


function setMineVer(ver, mod, folder){
  if(ver){
  storage.set("mineVer", ver);
  if(mod === 'Forge'){
    storage.set("Forge","true")
  }else{
    storage.set("Forge","")
  };

  if(folder){
    storage.set("verFolder", folder)
  }else{
    storage.set("verFolder", "")
  }
  if(storage.get("Forge") ==="true"){
    document.querySelector("#mineversion").textContent = "Forge "+ ver;
  }else{
    if(folder){
      document.querySelector("#mineversion").textContent = folder;
    }else{
      document.querySelector("#mineversion").textContent = ver;
    }
  }
}
}

document.getElementById("searchBar").addEventListener("keyup", (e) => {
  if(e.key === 'Enter') {
    executeSearch()    
  } 

})

function executeSearch(){
  if(document.getElementById("searchBar").value){
    if(sidebar.classList.contains("open")){
      sidebar.classList.remove("open");
    }
  document.getElementById("searchResults").innerHTML = `<div style="width:100px; margin:auto; margin-top:100px;"><div class="loader22"></div></div>`
  document.getElementById("searchText").innerText="Buscar '" + document.getElementById("searchBar").value + "'"
  wp.posts().categories(39).search(document.getElementById("searchBar").value).get( function( error, serverDb2 ) {
    console.log(JSON.stringify(serverDb2))
    if(error){
      document.getElementById("listaservers").innerHTML = `<span class="text" style="margin:auto; display:table;">Ha ocurrido un error en la búsqueda<br>Comprueba tu conexión a internet - Error: ${error.code}</span>`;
    }else{
      
  if(document.getElementById("searchBar").value){
    search(document.getElementById("searchBar").value);
  }else{
    lastSec();
  }
  var serversss = serverDb2.map(function(server){
    if(server.featured_media>0){
    return wp.media().id(server.featured_media).get().then( results => {
       if(server.title.rendered === storage.get("installed.name")){
        return `<div id="${server.title.rendered}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${results.source_url}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.excerpt.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>Minecraft</strong><br>${server.acf.config} ${server.acf.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span href="${server.acf.twitter}" class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}"style="padding: 16px 15px;" onclick="desinstalar()">Desinstalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
       }else{
        return `<div id="${server.title.rendered}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${results.source_url}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.excerpt.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>Minecraft</strong><br>${server.acf.config} ${server.acf.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span href="${server.acf.twitter}" class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}" onclick="onClickEvent(this.id)">Instalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
       }
      })
  }})
  Promise.all(serversss).then(function(results) {
    document.getElementById("searchResults").innerHTML = results.join("");
  })

  document.querySelectorAll('.button').forEach(btn => {
    btn.addEventListener("click", onClickEvent); // events bubble up to ancestors

  });
  document.querySelectorAll('.button2').forEach(btn => {
    btn.addEventListener("click", onClickEvent2); // events bubble up to ancestors

  });
  }
    })
  }
}

Number.prototype.formatBytes = function() {
    var units = ['B', 'KB', 'MB', '', 'TB'],
        bytes = this,
        i;
  
    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }
  
    return bytes.toFixed(2) + units[i];
  }
  
  let a = os.totalmem(); //bytes
  
  let z = a.formatBytes()
  let totalR = Math.round(z); //result is 230.15KB


document.addEventListener("DOMContentLoaded", function () { 
    document.querySelector("#totalRAM").innerHTML="TU RAM TOTAL: "+totalR+"GB"
    panel();
    reajustes();
    searchVersions();
  })

function lastSec(){
  if(lastSection === "complementos"){
    complementos();
  }
  if(lastSection === "panel"){
    panel();
  }
  if(lastSection === "ajustes"){
    ajustes();
  }
  if(lastSection === "bibl"){
    bibl();
  }
  if(lastSection === "packs"){
    packs();
  }
}

//SIDEBAR ITEMS
document.querySelector("#user").addEventListener("click", function(evento){
  ipcRenderer.send('cuenta');
})
    //Complementos
document.getElementById('complementos').addEventListener("click", function(evento){
  complementos();
})
  function complementos(){
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - COMPLEMENTOS";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="block";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
        document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secVersiones').style.display="none"
    document.querySelector('#secPacks').style.display="none"
    var lastSection = "complementos"
  }
  //Panel
  document.getElementById('panel').addEventListener("click", function(evento){
    panel();
  })
  function panel(){
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - PANEL";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="block";
    document.getElementById('secBibl').style.display="none";
        document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secVersiones').style.display="none"
    document.querySelector('#secPacks').style.display="none"
    Object.defineProperty(window, 'lastSection', {
      value: "panel",
      configurable: false,
      writable: true
    });
  }
  Object.defineProperty(window, 'packsloaded', {
    value: false,
    configurable: false,
    writable: true
  });
  function packs(){
    if(packsloaded){}else{requestdb()}
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - PANEL";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
        document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secVersiones').style.display="none"
    document.querySelector('#secPacks').style.display="block"
    Object.defineProperty(window, 'lastSection', {
      value: "packs",
      configurable: false,
      writable: true
    });
  }
  function search(s){
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - BÚSQUEDA '" + s + "'";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="block";
    document.querySelector('#secVersiones').style.display="none"
    document.querySelector('#secPacks').style.display="none"
  }
  function versiones(){
    if(storage.get("installed.name")){
      modalError("No puedes cambiar de versión mientras tienes un pack instalado. Para cambiar de versión desinstala el actual.")
    }else{
    document.title = "SECRECY LAUNCHER - ELEGIR VERSIÓN";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secVersiones').style.display="block";
    document.querySelector('#secPacks').style.display="none"
    searchVersions();
    }
  }
  //Biblioteca
  document.getElementById('bibl').addEventListener("click", function(evento){
    bibl();
  })
  function bibl(){
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - BIBLIOTECA";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="block";
    document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secPacks').style.display="none"
    packList()
    biblFiles();
    Object.defineProperty(window, 'lastSection', {
      value: "bibl",
      configurable: false,
      writable: true
    });
    //modalError("¡Vaya! Ha ocurrido un error cargando la biblioteca. Es posible que los servidores no estén preparados para esta función beta.");
  }
  //Ajustes
  document.getElementById('ajustes').addEventListener("click", function(evento){
    ajustes();
  })
  function ajustes(){
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.title = "SECRECY LAUNCHER - AJUSTES";
    document.querySelector('#secAustes').style.display="block";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="none";
    document.querySelector('#secVersiones').style.display="none"
    document.querySelector('#secPacks').style.display="none"
    Object.defineProperty(window, 'lastSection', {
      value: "ajustes",
      configurable: false,
      writable: true
    });
  }

//Comprobar instalados


//----------AJUSTES----------//

function reajustes() {
    if(storage.get("maxRam")){
      document.querySelector("#maxram").value = storage.get("maxRam")
    }else{
      storage.set("maxRam", "4");
    }
    if(storage.get("minRam")){
      document.querySelector("#minram").value = storage.get("minRam")
    }else{
      storage.set("minRam", "4");
    }
    if(storage.get("width")){
      document.querySelector("#width").value = storage.get("width")
    }else{
      storage.set("width",1280)
    }
    if(storage.get("height")){
      document.querySelector("#height").value = storage.get("height")
    }else{
      storage.set("height", 720)
    }
    if (storage.get("Xcomplementos") == "true"){
      document.getElementById("Zcomplementos").checked = true;
      document.querySelector('#comp').style.display="block";
    }else{
      document.querySelector('#comp').style.display="none";
      document.getElementById("Zcomplementos").checked = false;
    }
    if (storage.get("Xmenu") == "true"){
      document.getElementById("Zmenu").checked = true;
      document.querySelector('#btnMenu').style.display="none";
    }else{
      document.querySelector('#btnMenu').style.display="flex";
      document.getElementById("Zmenu").checked = false;
    }
    if (storage.get("Xpremium") == true){
      document.getElementById("Zpremium").checked = true;
    }else{
      document.getElementById("Zpremium").checked = false;
    }
    if (storage.get("Xfullscreen") === "true"){
      storage.set("Xfullscreen",true)
    }else{
      if (storage.get("Xfullscreen") === "false"){
      storage.set("Xfullscreen",false)
      }
    }

    if (storage.get("Xfullscreen") === true){
      document.getElementById("Zfullscreen").checked = true;
    }else{
      document.getElementById("Zfullscreen").checked = false;
    }
    if (storage.get("loginStatus") === "enabled"){
      if (storage.get("Xcerrarsesion") == "true"){
        document.getElementById("Zcerrarsesion").checked = true;
        document.querySelector('#cerrarsesion').style.display="none";
      }else{
        document.querySelector('#cerrarsesion').style.display="block";
        document.getElementById("Zcerrarsesion").checked = false;
      };
    }else{
      document.querySelector('#cerrarsesion').style.display="none";
      document.getElementById("Zcerrarsesion").checked = true;
      document.getElementById("Zcerrarsesion").disabled = true;
    }
  }
   
  function Xcomplementos() {
    if (document.getElementById("Zcomplementos").checked == true){
      storage.set("Xcomplementos", "true");
      reajustes();
    } else {
      storage.set("Xcomplementos", "false");
      reajustes();
    }
  }
  
  function Xmenu() {
    if (document.getElementById("Zmenu").checked == true){
      storage.set("Xmenu", "true");
      reajustes();
    } else {
      storage.set("Xmenu", "false");
      reajustes();
    }
  }

  function Xpremium() {
    if (document.getElementById("Zpremium").checked == true){
      storage.set("Xpremium", true);
      ipcRenderer.send( 'microsoftAccount' );
      setNameProfile()
    } else {
      storage.set("Xpremium", false);
      setNameProfile()
    }
  }
  
  function Xcerrarsesion() {
    if (document.getElementById("Zcerrarsesion").checked == true){
      storage.set("Xcerrarsesion", "true");
      reajustes();
    } else {
      storage.set("Xcerrarsesion", "false");
      reajustes();
    }
  }
  
  function Xfullscreen() {
    if (document.getElementById("Zfullscreen").checked == true){
      storage.set("Xfullscreen", true);
      reajustes();
    } else {
      storage.set("Xfullscreen", false);
      reajustes();
    }
  }

  function Xmaxram(){
    const val = document.querySelector("#maxram").value;
    storage.set("maxRam", val*1);
  }
  function Xminram(){
    const val = document.querySelector("#minram").value;
    storage.set("minRam", val*1);
  }
  function Xwidth(){
    const val = document.querySelector("#width").value;
    storage.set("width", val*1);
  }
  function Xheight(){
    const val = document.querySelector("#height").value;
    storage.set("height", val*1);
  }


function firstLoadFinish(){
  document.getElementById("loader").classList.add('fadeout');
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1000);
}
  
//BASE DE DATOS
function requestdb(){
  document.getElementById("listaservers").innerHTML = `<div style="width:100px; margin:auto; margin-top:100px;">
  <div class="loader22"></div>
  </div>`
  wp.posts().categories(39).sticky(false).get( function( error, posts ) {
  currentInstall = storage.get("installed.id")*1
    if(error){
    document.getElementById("listaservers").innerHTML = `<span class="text" style="margin:auto; display:table;">Ha ocurrido un error cargando los packs disponibles<br>Comprueba tu conexión a internet - Error: ${error.code}</span>`;
  }else{
    var serversss = posts.map(function(server){
      if(server.id === currentInstall){}else{
      if(server.featured_media>0){
      return wp.media().id(server.featured_media).get().then( results => {
         return `<div id="${server.title.rendered}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${results.source_url}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.excerpt.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>Minecraft</strong><br>${server.acf.config} ${server.acf.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span  class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${server.acf.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}" onclick="onClickEvent(this.id)">Instalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
      })
    }}})
    Promise.all(serversss).then(function(results) {
      wp.posts().categories(39).sticky(true).exclude(storage.get("installed.id")).get( function( error, posts ) {
        if(error){
          console.error(error)
        }else{
          var serverssss = posts.map(function(server){
            if(server.id === currentInstall){}else{
              if(server.featured_media>0){
              return wp.media().id(server.featured_media).get().then( results => {
                 return `<div id="${server.title.rendered}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${results.source_url}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.excerpt.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>Minecraft</strong><br>${server.acf.config} ${server.acf.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span  class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${server.acf.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}" onclick="onClickEvent(this.id)">Instalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
              })
            }}})
          Promise.all(serverssss).then(function(results8) {
            document.getElementById("listaservers").innerHTML =  results8.join("") + results.join("")

            Object.defineProperty(window, 'packsloaded', {
              value: true,
              configurable: false,
              writable: true
            });
          })
        };
      })
    })
  };
});
}

dirname = minecraftData+"/mods";

    function installerbtn (value){
      wp.posts().id(value).get( function( error, posts9 ) {
      let serverInfo = posts9
      console.log(serverInfo)
      fs.readdir(dirname, function(err, files) {
        if (err) {
           modalError(err);
        } else {
           if (!files.length) {
            fs.readdir(dirname, function(err, files) {
              if (err) {

              } else {
                 if (!files.length) {
                  if(lastSection==="panel"){}else{panel()}
                  document.querySelector("#gstartbutton").disabled = true;
                  document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
                  document.querySelector("#mineloadercontainer").style.display = "block";
                  if(serverInfo.acf.descarga){
                    wp.media().id(serverInfo.acf.descarga).get().then( results => {console.log(results);checkMineFolder(results.source_url, serverInfo.title.rendered, serverInfo.acf.version, serverInfo.acf.mineversion, serverInfo.acf.config, value);})
                    document.querySelector("#gstartbutton").textContent="Instalando el pack " + serverInfo.title.rendered;
                  }else{
                    setTimeout(() => {
                      modalError("¡Vaya! La descarga de este pack no esta disponible.")
                      comprobar()
                      minecraftClosed1();
                    }, 1000);
                  }
                 }
              }
          });
           }else{
            optionsModal();
            modalText("Parece que tienes ya instalados algunos mods, es necesario eliminarlos antes de continuar.");
            btnModalAccept.addEventListener("click", acceptremoveandcheckmine);
            function acceptremoveandcheckmine(){
              btnModalAccept.removeEventListener("click", acceptremoveandcheckmine);
              titleModal();
              modalText("Eliminando archivos...");
              fs.rm(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
                if (err) {
                  if(err.code === "EBUSY"){
                    modalError("No se puede ejecutar esta acción mientras tienes Tlauncher o Minecraft abierto.")
                  }else{
                  if( err.code === "ENOTEMPTY"){
                    modalError("Un mod no se ha podido eliminar correctamente. Este error se soluciona reiniciando la aplicación")
                  }else{
                    if( err.code === "EPERM"){
                      modalError("Un mod no se ha podido eliminar correctamente. Es necesario reiniciar la aplicación.");
                    }else{
                      modalError("Ha ocurrido un error: " + err)
                    }}
                  
                  }
                }else{
                  modalText("Archivos Eliminados");
                  storage.set("installed.name","")
                      setTimeout(() => {
                        closePopup()
                        if(lastSection==="panel"){}else{panel()}
                  document.querySelector("#gstartbutton").disabled = true;
                  document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
                  document.querySelector("#mineloadercontainer").style.display = "block";
                  if(serverInfo.acf.descarga){
                    wp.media().id(serverInfo.acf.descarga).get().then( results => {console.log(results);checkMineFolder(results.source_url, serverInfo.title.rendered, serverInfo.acf.version, serverInfo.acf.mineversion, serverInfo.acf.config);})
                    document.querySelector("#gstartbutton").textContent="Instalando el pack " + serverInfo.title.rendered;
                  }else{
                    setTimeout(() => {
                      modalError("¡Vaya! La descarga de este pack no esta disponible.")
                      comprobar()
                      minecraftClosed1();
                    }, 1000);
                  }
                      }, 600);
                }
              });
              
            }
            btnModalCancel.addEventListener("click", function(eventos){
              closePopup();
            })

           }
        }
    });
    })    
    }
    function onClickEvent(event) {
      panel()
    if(event){
      if(fs.existsSync(minecraftData + "/mods")){
      installerbtn(event);
      }else{
        fs.mkdir( minecraftData + "/mods", { recursive: true }, (error) => {
          if (error) {
            modalError("Ha ocurrido un error creando la carpeta mods: " + error);
          } else {
            console.log( minecraftData + "/mods" + " creado correctamente");
            installerbtn(event);
          }
        });
      }
    }}
    
    

function desinstalar(){
  fs.rm(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
    if (err) {
      if( err.code === "ENOTEMPTY"){
        modalError("Un mod no se ha podido eliminar correctamente. Este error se soluciona reiniciando la aplicación")
      }else{
        if( err.code === "EPERM"){
          modalError("Un mod no se ha podido eliminar correctamente. Es necesario reiniciar la aplicación.");
        }else{
          modalError(err);
        }
      
      }
    }else{
      storage.set("installed.name","");
      storage.set("installed.mods","");
      storage.set("installed.id","");
      modalOnlySuccess("Pack eliminado correctamente");
      comprobar()  
      document.getElementById("installed").innerHTML="";
      requestdb();
      if(document.querySelector("#secSearch").style.display === "block"){
        lastSec();
      };
    }
  });
}


function checkMineFolder(url, nombre, version, mineversion, config, value){
  if(url){
  if(lastSection==="panel"){}else{panel()}
  if(fs.existsSync(minecraftData + "/mods")){
    mineDownload(url, nombre, version, mineversion, config, value);
  }else{
    fs.mkdir( minecraftData + "/mods", { recursive: true }, (error) => {
      if (error) {
        modalError("Ha ocurrido un error creando la carpeta mods: " + error);
      } else {
        console.log( minecraftData + "/mods" + " creado correctamente");
        mineDownload(url, nombre, version, mineversion, config, value);
      }
    });
  }
}else{
  setTimeout(() => {
    modalError("¡Vaya! La descarga de este pack no esta disponible.")
comprobar()
    minecraftClosed1();
  }, 1000);
}
}




function biblFiles(){
  checkCurrentMods()
  if (fs.existsSync(minecraftData + "/mods")) {
    biblFiles2();
} else {
  document.getElementById("files").innerHTML = `<span class="text">No hay ningún mod instalado</span> <btnModal class="selectPack" onClick="biblFiles()">RECARGAR</btnModal><btnModal class="selectPack" style="margin-left:20px;" onClick="openModsFolder()">ABRIR CARPETA DE MODS</btnModal><div style="margin-bottom:20px;"></div>`
  storage.set("installed.name","");
}
  
  
}

function biblFiles2(){
  fs.readdir(minecraftData + "/mods", function(err, files) {
    if (err) {
       // some sort of error
    } else {
       if (!files.length) {
          storage.set("installed.name", "");
          document.getElementById("files").innerHTML = `<span class="text">No hay ningún mod instalado</span> <btnModal class="selectPack" onClick="biblFiles()">RECARGAR</btnModal><btnModal class="selectPack"  style="margin-left:20px;" onClick="openModsFolder()">ABRIR CARPETA DE MODS</btnModal><div style="margin-bottom:20px;"></div>`

       }else{
        
const tree = dirTree(minecraftData + "/mods");

var asa = parseInt(tree.children.length);
function serverTemplate2(server) {
  if(server.name.includes(".jar")){
  return `
  <div  style="background-color:#242629; margin-bottom:10px; border-radius:15px; margin-left:20px; margin-right:20px;"><i id="${server.name}" class='bx bxs-trash-alt deleteFile' style="color:#fff; font-size: 1.4em; margin-left:20px;"></i><span class="text">${server.name}</span></div>`;
  }
}

document.getElementById("files").innerHTML = `

<span style="display: inline-block; color: #ffffff; font-size: 20px; font-weight: 500; margin: 18px; margin-top:0px;">Tienes ${asa} mods activos</span>
<div style="margin-left: 18px; margin-bottom:20px;">
  <button id="save"class="cssbuttons-io-button" onClick="test()">
  <i class='bx bx-save' ></i>
  <span>Guardar</span>
  </button>
  <button class="cssbuttons-io-button" onclick="biblFiles()">
  <i class='bx bx-refresh'></i>
  <span>Recargar</span>
  </button>
  <button class="cssbuttons-io-button" onclick="openModsFolder()">
  <i class='bx bx-folder-open' ></i>
  <span>Abrir la carpeta de mods</span>
  </button>
</div>
${tree.children.map(serverTemplate2).join("")}
`;
if(storage.get("installed.name")){
  document.querySelector("#save").style.display="none";
}else{
  document.querySelector("#save").style.display="inline-flex";
}

function onClickEvent2(event){
  fs.unlink(minecraftData + "/mods/" + event.target.id, (err) => {
    if (err) {
      if(err.code === "EBUSY"){
        modalError("Se ha interrumpido el proceso debido a que no puedes tener Minecraft abierto o alguna app que gestiona los archivos durante este proceso.")
      }else{
        modalError(err);
      };
      return
    }
      modalOnlySuccess("Se ha eliminado el mod " + event.target.id + " correctamente");
      biblFiles();
  })
}
  
  
  document.querySelectorAll('.deleteFile').forEach(btn => {
    btn.addEventListener("click", onClickEvent2); // events bubble up to ancestors

  });}
       }
    }
)
}


function checkCurrentMods(){
  let currentMods = dirTree;
  if(existDir(minecraftData + "/mods")){
  fs.readdir((minecraftData + "/mods"), function(err, files) {
    if (err) {

    } else {
       if (!files.length) {
        
       }else{
  if(storage.get("installed.name")){
    if(JSON.stringify(storage.get("installed.mods"))===JSON.stringify(currentMods.children)){}else{
    }
  }
       }}})
      }
}

//Mine Download
function  mineDownload(url, nombre, version, mineversion, config, value) {
  const dllll = new DownloaderHelper (url, docuus + "/files/descargas");
  dllll.start();
  dllll.on('error',(err) => {
    modalError("Ha ocurrido un error - " + "\n" + err);
  });
  dllll.on('progress.throttled',(stats) => {
    mineloader.style.width = stats.progress + "%";
    document.querySelector("#gstartbutton").textContent="Descargando actualización de "+ nombre + " "+parseInt(stats.progress.toFixed(2))+" %";
  });
  dllll.on('end',(downloadInfo) => {
    di = downloadInfo.incomplete;
    archivo = downloadInfo.fileName;
    dirArchivo = downloadInfo.filePath;
    if(di === false){
      Object.defineProperty(window, 'toDelete', {
        value: dirArchivo,
        configurable: false,
        writable: true
      });
      document.querySelector("#gstartbutton").textContent= "Descomprimiendo archivos...";
      unzipMine(nombre, mineversion, config, version, value);
    }
    
  });
  
}



//mine Unzip
function unzipMine(nombre, mineversion, config, version, value){
  var zip = new StreamZip({
    file: dirArchivo
  , storeEntries: true
  });
  zip.on('ready', function () {
  zip.extract(null, minecraftData + "/mods", (err, count) => {
      console.log(err ? 'Extract error' : `Extracted ${count} entries`);
      zip.close();
      if(err){
        modalError(err);
      }else{
        let currentModsFolder = dirTree(minecraftData + "/mods");
        storage.set("installed.id",value);
        storage.set("installed.name",nombre);
        storage.set("version."+nombre, version);
        comprobar()
        if(document.querySelector('#secSearch').style.display==="block"){lastSec();}
        fs.unlink((toDelete), (err) => {if (err) {console.error(err)
        return}});
          setMineVer(mineversion, config)
        document.querySelector("#gstartbutton").textContent="Pack de "+nombre+ " instalado correctamente.";
        
        setTimeout(() => {
          if(storage.get("launch")==="true"){
            mineloader.style.width = "0%";
            launchMine();
          }else{
            mineloader.style.width = "0%";
            minecraftClosed1();
          }
        }, 1500);
        
        
      }
  });
  });
}



function comprobar() {
  if(storage.get("installed.id")){
    document.getElementById("versionsbutton").style.cursor="not-allowed"
    document.getElementById("versionsbutton").title="No puedes cambiar de versión mientras tienes un pack instalado. Para cambiar de versión desinstala el actual."
    wp.posts().id(storage.get("installed.id")).get( function( error, posts10 ) {
      serverIns = posts10
      if(document.getElementById(storage.get("installed.name"))){
      document.getElementById(storage.get("installed.name")).innerHTML = "";
      }
    if(storage.get("version."+serverIns.title.rendered)) {
      console.log(serverIns)
      wp.media().id(serverIns.featured_media).get().then( results => {
      if(storage.get("version."+serverIns.title.rendered) === serverIns.acf.version){
        document.getElementById("installed").innerHTML=`<div id="installed" style="display: flex; overflow: hidden; background-color: #242629; position: fixed; bottom: 100px; height: 155px; width: 500px; z-index: 17; box-shadow: 5px 5px 5px  black; transition: all 2s; border-radius:10px; margin-left: 30px; margin-right: 30%; animation-name: example2; animation-duration: 1s;"><div id="content" class="site-content"> <div class="ast-container"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-870 page type-page status-publish ast-article-single" id="post-870" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="870" class="elementor elementor-870"> <section class="elementor-section elementor-top-section elementor-element elementor-element-ad69163 elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="ad69163" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7f26a7d" data-id="7f26a7d" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-1714cb4 elementor-section-boxed " data-id="1714cb4" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="width: 1300px;"> <div class="elementor-container elementor-column-gap-default" ><div style="border-radius: 10px; width: 135px; height:135px; "> <img width="135" height="135" src="${results.source_url}" style="border-radius:10px;"> </div> </div>  </section> </div> </div> <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-717dd1b" data-id="717dd1b" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-180a9ea elementor-widget elementor-widget-heading" data-id="180a9ea" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${serverIns.title.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-1f02d87 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="1f02d87" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-d71b5d9" data-id="d71b5d9" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-eba6191 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="eba6191" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${serverIns.acf.config} ${serverIns.acf.mineversion}</h2>		</div> </div> </div> </div> </div>  <button class="button2" style=" box-sizing : content-box; text-align: center; margin: 0; margin-top: 10px;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall" onclick="onClickEvent2(this.id)">Desinstalar</span> </button> </section> </div> </div>  </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div><!-- #primary --> </div> <!-- ast-container --> </div>  </div></div>`;
        document.getElementById("installBibl").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${results.source_url}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button onclick="onClickEvent2(this.id)" class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; ;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall" onclick="onClickEvent2(this.id)">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2 class="elementor-heading-title elementor-size-default"><strong>Minecraft</strong><br>${serverIns.acf.config} ${serverIns.acf.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.acf.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
      } else {
        
        document.getElementById("installed").innerHTML=`<div id="installed" style="display: flex; overflow: hidden; background-color: #242629; position: fixed; bottom: 100px; height: 155px; width: 500px; z-index: 17; box-shadow: 5px 5px 5px  black; transition: all 2s; border-radius:10px; margin-left: 30px; margin-right: 30%; animation-name: example2; animation-duration: 1s;"><div id="content" class="site-content"> <div class="ast-container"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-870 page type-page status-publish ast-article-single" id="post-870" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="870" class="elementor elementor-870"> <section class="elementor-section elementor-top-section elementor-element elementor-element-ad69163 elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="ad69163" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-7f26a7d" data-id="7f26a7d" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-1714cb4 elementor-section-boxed " data-id="1714cb4" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="width: 1300px;"> <div class="elementor-container elementor-column-gap-default" ><div style="border-radius: 10px; width: 135px; height:135px; "> <img width="135" height="135" src="${results.source_url}" style="border-radius:10px;"> </div> </div>  </section> </div> </div> <div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-717dd1b" data-id="717dd1b" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-180a9ea elementor-widget elementor-widget-heading" data-id="180a9ea" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${serverIns.title.rendered}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-1f02d87 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="1f02d87" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-d71b5d9" data-id="d71b5d9" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-eba6191 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="eba6191" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${serverIns.acf.config} ${serverIns.acf.mineversion}</h2>		</div> </div> </div> </div> </div> <div id="actualizarpack" style="display:inline-block;"> <button onclick="onClickEvent2(this.id)" class="button2" style="display:inline-block; box-sizing : content-box; text-align: center; margin: 0; margin-right:10px; margin-top: 10px;"> <span style="display: inline-block; padding-left: 17px;" id="actualizar" onclick="onClickEvent2(this.id)">Actualizar</span> </button></div><button onclick="onClickEvent2(this.id)" class="button2" style="display:inline-block; box-sizing : content-box; text-align: center; margin: 0; margin-top: 10px;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall" onclick="onClickEvent2(this.id)">Desinstalar</span> </button> </section> </div> </div>  </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div><!-- #primary --> </div> <!-- ast-container --> </div>  </div></div>`;
        document.getElementById("installBibl").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${results.source_url}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.title.rendered}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button onclick="onClickEvent2(this.id)" class="button2" style="display: inline-block;"> <span style="display: inline-block; padding-left: 15px" id="actualizar">Actualizar</span> </button><button onclick="onClickEvent2(this.id)" class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; padding-left: px"> <span style="display: inline-block; padding-left: 17px;" id="uninstall" onclick="onClickEvent2(this.id)">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="Minecraft"><h2 class="elementor-heading-title elementor-size-default"><strong>Minecraft</strong><br>${serverIns.acf.config} ${serverIns.acf.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.acf.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.acf.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
      }
    })
    }
    })
    
    
  }else{
    document.getElementById("installed").innerHTML=``
    document.getElementById("installBibl").innerHTML=``
    document.getElementById("versionsbutton").style.cursor="default"
    document.getElementById("versionsbutton").title="Click para cambiar de versión"
    if(storage.get("Forge")==="true"){
      var mv = "Forge "+ storage.get("mineVer");
    }else{
      var mv = storage.get("mineVer");
    };
  }

  document.querySelectorAll('.button2').forEach(btn => {
    btn.addEventListener("click", onClickEvent2); // events bubble up to ancestors

  });
}

function onClickEvent2(event) {
  console.log(event)
    if(event === "uninstall"){
      desinstalar(); 
    }
    if(event === "play"){
      launchMine();
    }
    if(event === "actualizar"){
      if(storage.get("lastAct")==="panel"){}else{panel()}
      document.querySelector("#actualizarpack").style.display = "none";
      document.querySelector("#gstartbutton").disabled = true;
      document.querySelector("#gstartbutton").style.backgroundColor = "#414141"
      document.querySelector("#mineloadercontainer").style.display = "block";
      wp.posts().id(storage.get("installed.id")).get( function( error, posts11 ) {
        let serverIns = posts11
        document.querySelector("#gstartbutton").textContent = "Actualizando archivos del pack "+ serverIns.title.rendered;
              fs.rm(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
                if (err) {
                  if( err.code === "ENOTEMPTY"){
                    modalError("Un mod no se ha podido eliminar correctamente. Este error se soluciona reiniciando la aplicación")
                  }else{
                    if( err.code === "EPERM"){
                      modalError("Un mod no se ha podido eliminar correctamente. Es necesario reiniciar la aplicación.");
                    }else{
                      modalError(err);
                    }
                  
                  }
                }else{
                  storage.set("installed.name","");
                  document.querySelector("#gstartbutton").textContent = "Archivos adaptados"
                      setTimeout(() => {
                        document.querySelector("#gstartbutton").textContent = "Descargando actualización de " + serverIns.title.rendered;
                        wp.media().id(serverIns.acf.descarga).get().then( results => {checkMineFolder(results.source_url, serverIns.title.rendered, serverIns.acf.version, serverIns.acf.mineversion, serverIns.acf.config);})
                        
                      }, 600);
                }
              });
      })
      
    }
  }




function checkExecute(){
  wp.posts().categories(40).get( function( error, posts3 ) {
    if(error){
      document.querySelector("#gstartbutton").textContent = "Cargando en Offline..."
      executeMine()
    }else{
      let body = posts3[0].acf.java 
      const javaVer = JSON.parse(body);
      if(storage.get("java")){
        let javaPath1 = minecraftData+javaVer.path
        if(javaVer.javaId === storage.get("java")){
          if(fs.existsSync(javaPath1)){
          checkForge(storage.get("mineVer"));
          }else{
            installJava(javaVer.javaDownload, javaVer.javaId, javaPath1);
          }
        }else{
          installJava(javaVer.javaDownload, javaVer.javaId, javaPath1);
        }
      }else{
        installJava(javaVer.javaDownload, javaVer.javaId, javaPath1);
      }
    }
  
  })
}

function installJava(url, version, javaPath1){
  if(fs.existsSync(minecraftData+"/runtime")){
  DinstallJava(url, version, javaPath1);
}else{
  fs.mkdir( minecraftData+"/runtime", { recursive: true }, (error) => {
    if (error) {
      modalError("Ha ocurrido un error creando la carpeta de descargas de Slauncher: " + error.code);
    } else {
      console.log( minecraftData+"/runtime" + " creado correctamente");
      DinstallJava(url, version, javaPath1);
    }
  });
}
}

function returnForge(){
  if(storage.get("Forge")){
    return storage.get("forge."+(storage.get("mineVer")))
  }else{
    return
  }
}

function DinstallJava(url, version, javaPath1){
  const dllll = new DownloaderHelper (url, minecraftData + "/runtime", {override: true});
      dllll.start();
      document.querySelector("#mineloadercontainer").style.display = "block";
      document.querySelector("#gstartbutton").textContent = "Instalando Java...";
      dllll.on('error',(err) => {
        modalError("Ha ocurrido un error - " + "\n" + err);
      });
      dllll.on('progress.throttled',(stats) => {
        document.querySelector("#gstartbutton").textContent = "Instalando Java - "+stats.progress.toFixed(0)+" %";
        mineloader.style.width = stats.progress + "%";
      });
      dllll.on('end',(downloadInfo) => {
        di = downloadInfo.incomplete;
        archivo = downloadInfo.fileName;
        dirArchivo = downloadInfo.filePath;
        if(di === false){
          Object.defineProperty(window, 'toDelete', {
            value: dirArchivo,
            configurable: false,
            writable: true
          });
          var zip = new StreamZip({
            file: dirArchivo
          , storeEntries: true
          });
          zip.on('ready', function () {
          zip.extract(null, minecraftData + "/runtime", (err, count) => {
              console.log(err ? 'Extract error' : `Extracted ${count} entries`);
              zip.close();
              if(err){
                modalError(err);
              }else{
                storage.set("java", version);
                storage.set("javaDir", javaPath1);
                if(document.querySelector('#secSearch').style.display==="block"){lastSec();}
                checkForge(storage.get("mineVer"));
                progressBar.style.width = "0%";
              }
          });
          });
        }
      });
}

function returnAuth(){
  if(storage.get("Xpremium")=== true){
    return msmc.getMCLC().getAuth(storage.get("mineapi"))
  }else{
    return Authenticator.getAuth(storage.get("username.minecraft"))
  }
}


function checkPremium(){
  if(storage.get("Xpremium")){
    ipcRenderer.send( 'microsoftAccount' );
  }
}

  function executeMine(){
    storage.set("launch","")
  
 //   ipcRenderer.send("hide-me")
  
  let optsFS = {
    clientPackage: null,
    // For production launchers, I recommend not passing 
    // the getAuth function through the authorization field and instead
    // handling authentication outside before you initialize
    // MCLC so you can handle auth based errors and validation!
    authorization: returnAuth(),
  root: minecraftData,
  version: {
      number: storage.get("mineVer"),
      type: "release"
  },
  javaPath: storage.get("javaDir"),
  window: {
    fullscreen: storage.get('Xfullscreen'),
    width: storage.get("width"),
    height: storage.get("height")
  },
  forge: returnForge(),
  memory: {
      max: storage.get("maxRam")+"G",
      min: storage.get("minRam")+"G"
  }

}
let optsFolderVer = {
  clientPackage: null,
  authorization: returnAuth(),
root: minecraftData,
version: {
  custom: storage.get("verFolder"),  
  number: storage.get("mineVer"),
  type: storage.get("verFolderType")
},
javaPath: storage.get("javaDir"),
window: {
  fullscreen: storage.get('Xfullscreen'),
  width: storage.get("width"),
  height: storage.get("height")
},
memory: {
    max: storage.get("maxRam")+"G",
    min: storage.get("minRam")+"G"
}

}
if(storage.get("mineVer")){
  if(storage.get("verFolder")){launcher.launch(optsFolderVer);}else{
  if(storage.get("Forge")==="true"){
    if(storage.get("mineVer")>"1.16"){
      if (fs.existsSync(storage.get("forge."+(storage.get("mineVer"))))) {
        launcher.launch(optsFS);
      } else {
        storage.set("forge."+(storage.get("mineVer")), "");
        checkForge(storage.get("mineVer"));
      }
    }else{
      if (fs.existsSync(storage.get("forge."+(storage.get("mineVer"))))) {
        launcher.launch(optsFS);
      } else {
        storage.set("forge."+(storage.get("mineVer")), "");
        checkForge(storage.get("mineVer"));
      }
    }
  }else{
        launcher.launch(optsFS);
  }}
}else{
  modalError("No hay ninguna version seleccionada.")
  minecraftClosed1();
}
  
  launcher.on('close', (e) =>
  minecraftClosed1()
  );
  launcher.on('data', (e) =>
   data2(e)
  );
  launcher.on('debug', (e) =>
    data(e)
  );
  launcher.on('download-status', (e) =>
    downloadmine(e)
  );
  
  function downloadmine(e){
    console.warn(e);
    var dcurrent = e.current/e.total*100;
    document.querySelector("#mineloadercontainer").style.display = "block";
    document.querySelector("#gstartbutton").textContent = "Descargando archivos - "+e.name + " - " +dcurrent.toFixed()+" %"
    document.querySelector("#mineloader").style.width = e.current/e.total*100 + "%";
  }
  }
function data2(e){
  console.log(e)
  if(e.includes("Unable to launch")){
    modalError("Ha ocurrido un error cargando minecraft")
  }
  if(e.includes("Exception in thread ")){
    modalError("Ha ocurrido un error iniciando Minecraft - Err: "+e)
  }
}
function data(data){
  if(data.includes("Launching with arguments")){
    document.querySelector("#mineloadercontainer").style.display = "none";
    document.querySelector("#gstartbutton").textContent = "En ejecución";
    ipcRenderer.send("hide-me");
  }

  if(data.includes("Game crashed!")){
    modalError(data);
  }
  if(data.includes("Couldn't start Minecraft due to:")){
    modalError(data.replace("[MCLC]: ", ""));
  }
  if(data.includes("Error: A JNI error has occurred")){
    modalError("¡Vaya tu versión de Java parece que es incompatible!")
  }
  console.log(data)
}


function checkJava(){
  checkExecute();
}


function minecraftClosed1(){
  ipcRenderer.send("show-me")
  mineloader.style.width = "0%";
  document.querySelector("#gstartbutton").style.backgroundColor = "#04AA6D";
  document.querySelector("#gstartbutton").textContent = "Jugar";
  document.querySelector("#gstartbutton").disabled = false;
  document.querySelector("#mineloadercontainer").style.display = "none";
}

function checkForge(version){
  if(storage.get("Forge")==="true"){
    wp.posts().categories(40).get( function( error, posts4 ) {
      let body = posts4[0].acf.forge 
    if(error){
      modalError("Ha ocurrido un error procesando la instalación de forge.")
    }else{
      const forgeDown = JSON.parse(body);
      let forgeOF = forgeDown.find(element => element.ForgeVer == version);
      if(storage.get("forge."+forgeOF.ForgeVer)){
        if(storage.get("forgeVer."+forgeOF.ForgeVer)===forgeOF.Fversion){
        executeMine();
        }else{
          if(fs.existsSync(docuus+"/files/descargas")){
            download(forgeOF.download, forgeOF.ForgeVer, forgeOF.Fversion);
          }else{
            fs.mkdir( docuus+"/files/descargas", { recursive: true }, (error) => {
              if (error) {
                modalError("Ha ocurrido un error creando la carpeta de descargas de Slauncher: " + error.code);
              } else {
                console.log( docuus+"/files/descargas" + " creado correctamente");
                download(forgeOF.download, forgeOF.ForgeVer, forgeOF.Fversion);
              }
            });
          }
        }
      }else{
        if(fs.existsSync(docuus+"/files/descargas")){
          download(forgeOF.download, forgeOF.ForgeVer, forgeOF.Fversion);
        }else{
          fs.mkdir( docuus+"/files/descargas", { recursive: true }, (error) => {
            if (error) {
              modalError("Ha ocurrido un error creando la carpeta de descargas de Slauncher: " + error.code);
            } else {
              console.log( docuus+"/files/descargas" + " creado correctamente");
              download(forgeOF.download, forgeOF.ForgeVer, forgeOF.Fversion);
            }
          });
        }
      }
        
    }
  })
}else{
  executeMine();
}
}

function download(url, ForgeVer, Fversion) {
  const dllll = new DownloaderHelper (url, docuus + "/files/descargas");
  dllll.start();
  document.querySelector("#mineloadercontainer").style.display = "block";
  document.querySelector("#gstartbutton").textContent = "Instalando Forge "+ ForgeVer;
  dllll.on('error',(err) => {
    modalError("Ha ocurrido un error - " + "\n" + err);
  });
  dllll.on('progress.throttled',(stats) => {
    document.querySelector("#mineloader").style.width = stats.progress + "%";
    document.querySelector("#gstartbutton").textContent = "Instalando Forge "+ ForgeVer + " - " + parseInt(stats.progress.toFixed(2))+" %";
  });
  dllll.on('end',(downloadInfo) => {
    di = downloadInfo.incomplete;
    archivo = downloadInfo.fileName;
    dirArchivo = downloadInfo.filePath;
    if(di === false){
      storage.set("forge."+ForgeVer, dirArchivo);
      storage.set("forgeVer."+ForgeVer, Fversion);
      document.querySelector("#gstartbutton").textContent ="Forge instalado correctamente. Lanzando Minecraft...";
      executeMine();
      closePopup();
    }
  });
}

