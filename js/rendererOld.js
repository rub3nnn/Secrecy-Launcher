



//OnLoad
resetpopup()







//Menú Items




//----------Functions----------

//Enviar notificación
function notificacion(msg) {
let myNotification = new Notification('SECRECY LAUNCHER', {icon: './img/logo.png',
    body: msg
  });
  myNotification.onclick = () => {
    console.log('Notification clicked');
    ipcRenderer.send('restore');
  }
}

//function Open
function open(nombre1){
  childProcess.exec(storage.get(nombre1) , function (err, stdout, stderr) {
    if (err) {
    console.log(storage.get(nombre1));
    console.error(err);
    modalError(err);
    return;
    }});
}

//function OpenClose
function openclose(pathcompleto){
  childProcess.exec(pathcompleto , function (err, stdout, stderr) {
    if (err) {
    console.error(err);
    modalError(err);
    return;
    }else{
    ipcRenderer.send('close-me');
    }
  });
}

//Function Download
function download(url, path, nombre1) {
  const dll = new DownloaderHelper (url, path);
  dll.start();
    document.getElementById("desc").textContent="Preparando para la descarga...";
    modal.style.display = "block";
    btnModals.style.display = "none";
    btnCloseModals.style.display = "none";
    check.style.display = "none";
    cross.style.display = "none";
  dll.on('error',(err) => {
    document.getElementById('cross').style.display = "block";
    document.getElementById('check').style.display = "none";
    progressBar.style.width = '0';
    document.getElementById("desc").textContent="Ha ocurrido un error - " + "\n" + err;
    btnCloseModals.style.display = "block";
  });
  dll.on('progress',(stats) => {
    progressBar.style.width = stats.progress + "%";
    document.getElementById("desc").textContent="DESCARGANDO " + nombre1;
  });
  dll.on('end',(downloadInfo) => {
    notificacion("DESCARGA FINALIZADA");
    di = downloadInfo.incomplete;
    if(di === false){
      check.style.display = "block";
      archivo = downloadInfo.fileName;
      dirArchivo = downloadInfo.filePath;
      storage.set(nombre1, downloadInfo.filePath);
      document.getElementById("desc").textContent= nombre1 + " DESCARGADO";
      setTimeout(() => {
        btnCloseModals.style.display = "block";
        btnModals.style.display = "block";
      }, 300);
    }
  });
}

function showOpenModalbtns(){
  btnModals.style.display = "block";
  btnCloseModals.style.display = "block";
}

//Mine Download
function mineDownload(url, nombre, version, mineversion, config) {
  const dllll = new DownloaderHelper (url, docuus + "/files/descargas");
  dllll.start();
  resetpopup();
  desc.style.display = "block";
  document.querySelector("#bar-container").style.display = "block";
  bar.style.display = "block";
  document.querySelector("#subdesc").style.display = "block";
  dllll.on('error',(err) => {
    document.getElementById('cross').style.display = "block";
    progressBar.style.width = '0';
    desc.textContent="Ha ocurrido un error - " + "\n" + err;
    btnCloseModals.style.display = "block";
  });
  dllll.on('progress.throttled',(stats) => {
    progressBar.style.width = stats.progress + "%";
    document.getElementById("subdesc").textContent= parseInt(stats.progress.toFixed(2))+" %";
  });
  dllll.on('end',(downloadInfo) => {
    di = downloadInfo.incomplete;
    archivo = downloadInfo.fileName;
    dirArchivo = downloadInfo.filePath;
    if(di === false){
    document.getElementById("desc").textContent= "DESCOMPRIMIENDO ARCHIVOS...";
      unzipMine(nombre, mineversion, config);
    }
    
  });
  
}

function unzipMine(nombre, mineversion, config){
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
        tlauncherconfig(nombre, mineversion, config);
      }
  });
  });
}

function tlauncherconfig(nombre, mineversion, config) {
  if(fs.existsSync(appData + "/.tlauncher/tlauncher-2.0.properties")){
    fs.unlink(appData + "/.tlauncher/tlauncher-2.0.properties", (err => {
      if (err) {
        console.log(err);
        document.getElementById("subdesc").textContent= "";
        cross.style.display = "block";
        check.style.display = "none";
        document.getElementById("bar-container").style.display = "none";
        document.getElementById("desc").textContent= "No se ha podido modificar correctamente Tlauncher. Recuerde usar el lanzador en la versión " + mineversion;
        setTimeout(() => {
          btnCloseModals.style.display = "block";
          btnModals.style.display = "block";
        }, 1000);
      }else {
        const dlll = new DownloaderHelper (config, appData + "/.tlauncher");
        dlll.start();
        dlll.on('error',(err) => {
          document.getElementById('cross').style.display = "block";
          document.getElementById("bar-container").style.display = "none";
          document.getElementById("desc").textContent= "No se ha podido modificar correctamente Tlauncher. Recuerde usar el lanzador en la versión " + mineversion;
          btnCloseModals.style.display = "block";
          btnModals.style.display = "block";
        });
        dlll.on('progress.throttled',(stats) => {
          progressBar.style.width = stats.progress + "%";
          document.getElementById("desc").textContent="Configurando Tlauncher ";
          document.getElementById("subdesc").textContent= parseInt(stats.progress.toFixed(2))+" %";
        });
        dlll.on('end',(downloadInfo) => {
          di = downloadInfo.incomplete;
          if(di === false){
            document.getElementById("subdesc").textContent= "";
            cross.style.display = "none";
            check.style.display = "block";
            document.getElementById("bar-container").style.display = "none";
            document.getElementById("desc").textContent="Pack de "+nombre+ " instalado correctamente.";
            
            setTimeout(() => {
              btnCloseModals.style.display = "block";
             btnModals.style.display = "block";
            }, 1000);
          }
        });
      }
    }));
  }else{
    document.getElementById("subdesc").textContent= "";
    cross.style.display = "none";
    check.style.display = "block";
    document.getElementById("bar-container").style.display = "none";document.getElementById("desc").textContent= "No se ha podido modificar correctamente Tlauncher. Recuerde usar el lanzador en la versión " + mineversion;
    
    setTimeout(() => {
      btnCloseModals.style.display = "block";
     btnModals.style.display = "block";
    }, 1000);
  }
}

//Function descargas locales
function downloadLocal(url, path, nombre1){
  if(fs.existsSync(path)){
    download(url, docuus + path, nombre1);
  }else{
    fs.mkdir( docuus + path, { recursive: true }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log( docuus + path + " creado correctamente");
        download(url, docuus + path, nombre1);
      }
    });
  }
}



  

//----------Pop Up modal----------//

//Boton Abrir archivo
btnModals.addEventListener("click", function(eventos){
  closePopup();
  open("TLauncher");
})

//Boton Cerrar PopUp
document.getElementById('btnCloseModal').addEventListener("click", function(evento){
  closePopup();
})

//function Cerrar PopUp
function closePopup(){
  modal.style.display = "none"; 
  comprobar();
  progressBar.style.width = '0';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  document.querySelector("#bar-container").style.display = "none";
  bar.style.display = "none";
  document.querySelector("#subdesc").style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  document.querySelector(".modalImg").style.display="none";
}

function resetpopup(){
  progressBar.style.width = '0';
  check.style.display = "none";
  cross.style.display = "none";
  desc.style.display = "none";
  document.querySelector("#bar-container").style.display = "none";
  bar.style.display = "none";
  document.querySelector("#subdesc").style.display = "none";
  btnModals.style.display = "none";
  btnModalAccept.style.display = "none";
  btnCloseModals.style.display = "none";
  btnModalCancel.style.display = "none";
  document.querySelector(".modalImg").style.display="none";
}

//Functions Mensajes
function modalError(msg){
  cross.style.display = "block";
  document.getElementById("desc").textContent=msg;
  modal.style.display = "block";
  btnCloseModals.style.display = "block";
}

function modalSuccess(msg){
  check.style.display = "block";
  document.getElementById("desc").textContent=msg;
  modal.style.display = "block";
  btnCloseModals.style.display = "block";
}

function modalInfo(msg){
  document.getElementById("desc").textContent=msg;
  modal.style.display = "block";
  btnCloseModals.style.display = "block";
}

function modalNotif(msg){
  document.querySelector(".modalImg").style.display = "block";
  document.getElementById("desc").textContent=msg;
  modal.style.display = "block";
  btnCloseModals.style.display = "block";
}

//----------Botones generales----------//

//Instalar TLauncher
insMine.addEventListener("click", function(evento){
  downloadLocal("https://secrecycraft.com/files/TLauncher.exe", "/files/descargas/", "TLauncher")
})


//Abrir TLauncher C:\XboxGames\Minecraft Launcher\Content
boton.addEventListener("click", function(evento){
    open("TLauncher");
    
})


//Instalar Fortnite
insFortnite.addEventListener("click", function(evento){
    modalInfo('Este juego depende de la plataforma "EpicGames". Instala el juego a través del Programa de inicio de Epic Games y estará disponible en Secrecy Launcher.')
})


//Abrir Fortnite
abFortnite.addEventListener("click", function(evento){
    ipcRenderer.send('hide-me');
    open(__dirname + '/files/default/Fortnite.url');
    ipcRenderer.send('close-me');
})

//----------Botones Complementos----------//

//Instalar Complemento Mapa Minecraft
CompMine1.addEventListener("click", function(eventos){
  modalError("Este complemento solo es compatible para conectar con Servidores de Secrecy. No es posible instalarlo mientras no haya ninguno activo.");
})








