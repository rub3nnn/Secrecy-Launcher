//consts & vars 
const Store = require('electron-store')
const storage = new Store()
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

//query & ById
var modal = document.getElementById("myModal");
const instaladoMinecraft = document.querySelectorAll(".Minecraft");
const btnModals = document.querySelector("#btnModal");
const btnCloseModals = document.querySelector("#btnCloseModal");
const btnModalCancel = document.querySelector("#btnModalCancel");
const btnModalAccept = document.querySelector("#btnModalAccept");
const progressBar = document.getElementById('bar');
const check = document.getElementById('check');
const CompMine1 = document.querySelector("#CompMine1");
const biblMine = document.querySelector("#biblMine");
const biblFortnite = document.querySelector("#biblFortnite");
const biblMods = document.querySelector("#biblMods");
const mineLaunch = document.querySelector("#mineLaunch");
const modalTitle = document.querySelector("#modalTitle");
const subdesc = document.querySelector("#subdesc");
const barContainer = document.querySelector("#bar-container");
const modalImg = document.querySelector(".modalImg");
const play = document.querySelector("#play");
const recargar = document.querySelector("#recargar")

function downloadModal(){ 
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
function downloadModal(){
  if(modal.style.display === "block"){}else{
    modal.style.display = "block";
    body.style.overflow = "hidden";
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
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
  requestdb();
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
  checkJava();
}

recargar.addEventListener("click", function(eventos){
  reload();
})

function reload(){
  document.getElementById("loader").classList.remove('fadeout');
  document.getElementById("loader").classList.add('fadein');
  document.getElementById("loader").style.display = "flex";
  setTimeout(() => {
    document.getElementById("loader").classList.remove('fadein');
    requestdb();
    reajustes();
    panel();
    biblFiles();
    if(sidebar.classList.contains("open")){
      sidebar.classList.remove("open");
    };
  }, 500);
}
function recargarSkip(){
    requestdb();
    reajustes();
    panel();
    biblFiles()
}

//OnLoad
document.getElementById("profile").src=(storage.get("perfilFoto"));
document.getElementById("username").innerText=storage.get("username");
requestdb();
request('https://secrecycraft.com/db/notif.html', function (error, response, body) {
  const notifData = JSON.parse(body);
  if(error){
    console.log("Ha ocurrido un error comprobando notificaciones.")
  }else{
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


document.getElementById("searchBar").addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredServers = serverDb.filter(nombre => {
    return nombre.name.toLowerCase().includes(searchString);
  });
  if(e.target.value){
    search(e.target.value);
  }else{
    lastSec();
  }
  console.log(filteredServers);
  document.getElementById("searchText").innerText="Buscar '" + e.target.value + "'"
  function serverTemplate3(server) {
    if(server.name === storage.get("installed")){
    return `<div id="${server.name}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.img}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.name}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.desc}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.gameImg}" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${server.game}"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>${server.game}</strong><br>${server.config} ${server.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span href="${server.twitter}" class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"><button class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; ;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall">Desinstalar</span> </button>	 		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
    }else{
    return `<div id="${server.name}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.img}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.name}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.desc}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.gameImg}" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${server.game}"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>${server.game}</strong><br>${server.config} ${server.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span href="${server.twitter}" class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}">Instalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
    }
  }
  
  document.getElementById("searchResults").innerHTML = `${filteredServers.map(serverTemplate3).join("")}`;
  document.querySelectorAll('.button').forEach(btn => {
    btn.addEventListener("click", onClickEvent); // events bubble up to ancestors

  });
  document.querySelectorAll('.button2').forEach(btn => {
    btn.addEventListener("click", onClickEvent2); // events bubble up to ancestors

  });
})

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
  })

function lastSec(){
  let lastSection = storage.get("lastSec");
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
}

//SIDEBAR ITEMS
document.querySelector("#logout").addEventListener("click", function(evento){
    ipcRenderer.send('logout');
})
    //Complementos
document.getElementById('complementos').addEventListener("click", function(evento){
  complementos();
})
  function complementos(){
    document.title = "SECRECY LAUNCHER - COMPLEMENTOS";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="block";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="none";
    storage.set("lastSec", "complementos")
  }
  //Panel
  document.getElementById('panel').addEventListener("click", function(evento){
    panel();
  })
  function panel(){
    document.title = "SECRECY LAUNCHER - PANEL";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="block";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="none";
    storage.set("lastSec", "panel")
  }
  function search(s){
    document.title = "SECRECY LAUNCHER - BÚSQUEDA '" + s + "'";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="block";
  }
  //Biblioteca
  document.getElementById('bibl').addEventListener("click", function(evento){
    bibl();
  })
  function bibl(){
    document.title = "SECRECY LAUNCHER - BIBLIOTECA";
    document.querySelector('#secAustes').style.display="none";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="block";
    biblFiles();
    storage.set("lastSec", "bibl")
    //modalError("¡Vaya! Ha ocurrido un error cargando la biblioteca. Es posible que los servidores no estén preparados para esta función beta.");
  }
  //Ajustes
  document.getElementById('ajustes').addEventListener("click", function(evento){
    ajustes();
  })
  function ajustes(){
    document.title = "SECRECY LAUNCHER - AJUSTES";
    document.querySelector('#secAustes').style.display="block";
    document.getElementById('secComplementos').style.display="none";
    document.getElementById('secPanel').style.display="none";
    document.getElementById('secBibl').style.display="none";
    document.querySelector('#secSearch').style.display="none";
    storage.set("lastSec", "ajustes")
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
      storage.set("width","1280")
    }
    if(storage.get("height")){
      document.querySelector("#height").value = storage.get("height")
    }else{
      storage.set("height", "720")
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
    if (storage.get("Xfullscreen") == "true"){
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
      storage.set("Xfullscreen", "true");
      reajustes();
    } else {
      storage.set("Xfullscreen", "false");
      reajustes();
    }
  }

  function Xmaxram(){
    const val = document.querySelector("#maxram").value;
    storage.set("maxRam", val);
  }
  function Xminram(){
    const val = document.querySelector("#minram").value;
    storage.set("minRam", val);
  }
  function Xwidth(){
    const val = document.querySelector("#width").value;
    storage.set("width", val);
  }
  function Xheight(){
    const val = document.querySelector("#height").value;
    storage.set("height", val);
  }



  
//BASE DE DATOS
function requestdb(){
request('https://secrecycraft.com/db/servers.html', function (error, response, body) {
  if(error){
    document.getElementById("loader").classList.add('fadeout');
    if(error.code === "ECONNRESET"){
      modalError("No se ha podido conectar con el servidor debido a que tu equipo no tiene conexión a internet.")
    }
    if(error.code === "ETIMEDOUT"){
      modalError("La respuesta del servidor ha tardado demasiado. Comprueba tu conexión a internet.")
    }else{
    modalError("Ha ocurrido un error adquiriendo los datos del servidor. Error: " + error.code);
    };
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 1000);
    
  }else{
    const serverData = JSON.parse(body);
    Object.defineProperty(window, 'serverDb', {
      value: serverData,
      configurable: false,
      writable: true
    });
    
    function serverTemplate(server) {
      return `<div id="${server.name}"<div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-29ad6d7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="29ad6d7" data-element_type="section"> <div class="elementor-container elementor-column-gap-default"> <div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-d020d4d" data-id="d020d4d" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-f75bde5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="f75bde5" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-70caa4e" data-id="70caa4e" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-3e91a29 elementor-widget elementor-widget-image" data-id="3e91a29" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.img}">															</div> </div> </div> </div> <div class="elementor-column elementor-col-66 elementor-inner-column elementor-element elementor-element-9827de8" data-id="9827de8" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.name}</h2>		</div> </div> <div class="elementor-element elementor-element-b0987d8 elementor-widget elementor-widget-heading" data-id="b0987d8" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default">${server.desc}</h2>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img src="${server.gameImg}" height="60" width="60">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${server.game}"><h2  class="elementor-heading-title 4 elementor-size-default"><strong>${server.game}</strong><br>${server.config} ${server.mineversion}</h2></div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span href="${server.twitter}" class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.instagram}"  class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${server.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container"> <button class="button"> <span id="${server.id}">Instalar</span> </button>		</div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div></div>`;
    }
    
    document.getElementById("listaservers").innerHTML = `${serverData.map(serverTemplate).join("")}`;
    
    document.getElementById("loader").classList.add('fadeout');
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 1000);

comprobar();
biblFiles();
document.querySelectorAll('.button').forEach(btn => {
  btn.addEventListener("click", onClickEvent); // events bubble up to ancestors

});

    
    

  };
  
  
});
}

dirname = minecraftData+"/mods";

    function installerbtn (value){
      let serverInfo = serverDb.find(element => element.id == value);
      
      fs.readdir(dirname, function(err, files) {
        if (err) {
           modalError(err);
        } else {
           if (!files.length) {
            fs.readdir(dirname, function(err, files) {
              if (err) {

              } else {
                 if (!files.length) {
                  
                  checkMineFolder(serverInfo.descarga, serverInfo.name, serverInfo.version, serverInfo.mineversion, serverInfo.config);
                  document.getElementById("desc").textContent="INSTALANDO EL PACK DE " + serverInfo.name;
                 }
              }
          });
           }else{
            optionsModal();
            modalText("Parece que tienes ya instalados algunos mods, es necesario eliminarlos antes de continuar.");
            btnModalAccept.addEventListener("click", function(eventos){
              titleModal();
              modalText("Eliminando archivos...");
              fs.rmdir(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
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
                  storage.set("installed","");
                  modalText("Archivos Eliminados");
                      setTimeout(() => {
                        modalDesc("INSTALANDO EL PACK DE " + serverInfo.name);
                        checkMineFolder(serverInfo.descarga, serverInfo.name, serverInfo.version, serverInfo.mineversion, serverInfo.config);
                      }, 600);
                }
              });
              
            })
            btnModalCancel.addEventListener("click", function(eventos){
              closePopup();
            })

           }
        }
    });
        
    }
    function onClickEvent(event) {
    if(event.target.id){
      if(fs.existsSync(minecraftData + "/mods")){
      installerbtn(event.target.id);
      }else{
        fs.mkdir( minecraftData + "/mods", { recursive: true }, (error) => {
          if (error) {
            modalError("Ha ocurrido un error creando la carpeta mods: " + error);
          } else {
            console.log( minecraftData + "/mods" + " creado correctamente");
            installerbtn(event.target.id);
          }
        });
      }
    }}
    
    

function desinstalar(){
  fs.rmdir(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
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
      storage.set("installed","");
      storage.set("mineVer","");
      storage.set("Forge","");
      modalOnlySuccess("Pack eliminado correctamente");
      document.getElementById("installed").innerHTML="";
      requestdb();
      if(document.querySelector("#secSearch").style.display === "block"){
        lastSec();
      };
    }
  });
}


function checkMineFolder(url, nombre, version, mineversion, config){
  if(fs.existsSync(minecraftData + "/mods")){
    mineDownload(url, nombre, version, mineversion, config);
  }else{
    fs.mkdir( minecraftData + "/mods", { recursive: true }, (error) => {
      if (error) {
        modalError("Ha ocurrido un error creando la carpeta mods: " + error);
      } else {
        console.log( minecraftData + "/mods" + " creado correctamente");
        mineDownload(url, nombre, version, mineversion, config);
      }
    });
  }
}

const dirTree = require("directory-tree");


function biblFiles(){
  if (fs.existsSync(minecraftData + "/mods")) {
    biblFiles2();
} else {
  document.getElementById("files").innerHTML = `<span class="text">No hay ningún mod instalado</span>`
  storage.set("installed","");
}
  
  
}

function biblFiles2(){
  fs.readdir(minecraftData + "/mods", function(err, files) {
    if (err) {
       // some sort of error
    } else {
       if (!files.length) {
          storage.set("installed", "");
          document.getElementById("files").innerHTML = `<span class="text">No hay ningún mod instalado</span>`

       }else{
        
const tree = dirTree(minecraftData + "/mods");

function serverTemplate2(server) {
  return `
  
  <div  style="background-color:#242629; margin-bottom:10px; border-radius:15px; margin-left:20px; margin-right:20px;"><i id="${server.name}" class='bx bxs-trash-alt deleteFile' style="color:#fff; font-size: 1.4em; margin-left:20px;"></i><span class="text">${server.name}</span></div>`;
}

document.getElementById("files").innerHTML = `
<span style="display: inline-block; color: #ffffff; font-size: 20px; font-weight: 500; margin: 18px; margin-top:0px;">Tienes ${tree.children.length} mods activos</span>
  ${tree.children.map(serverTemplate2).join("")}
`;

function onClickEvent2(event){
  fs.unlink(minecraftData + "/mods/" + event.target.id, (err) => {
    if (err) {
      if(err.code === "EBUSY"){
        modalError("Se ha interrumpido el proceso debido a que no puedes tener TLauncher o Minecraft abierto durante este proceso.")
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

//Mine Download
function  mineDownload(url, nombre, version, mineversion, config) {
  const dllll = new DownloaderHelper (url, docuus + "/files/descargas");
  dllll.start();
  downloadModal();
  dllll.on('error',(err) => {
    modalError("Ha ocurrido un error - " + "\n" + err);
  });
  dllll.on('progress.throttled',(stats) => {
    progressBar.style.width = stats.progress + "%";
    modalSubDesc(parseInt(stats.progress.toFixed(2))+" %");
  });
  dllll.on('end',(downloadInfo) => {
    di = downloadInfo.incomplete;
    archivo = downloadInfo.fileName;
    dirArchivo = downloadInfo.filePath;
    if(di === false){
      storage.set("toDelete", dirArchivo)
    document.getElementById("desc").textContent= "DESCOMPRIMIENDO ARCHIVOS...";
      unzipMine(nombre, mineversion, config, version);
    }
    
  });
  
}



//mine Unzip
function unzipMine(nombre, mineversion, config, version){
  preDownloadModal()
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
        storage.set("installed",nombre);
        storage.set("version-"+nombre, version);
        storage.set("mineVer", mineversion);
        requestdb();
        if(document.querySelector('#secSearch').style.display==="block"){lastSec();}
        fs.unlink((storage.get("toDelete")), (err) => {if (err) {console.error(err)
        return}});
        if(config === "Forge"){
            storage.set("Forge","true")
        };
        modalSuccess("Pack de "+nombre+ " instalado correctamente.");
        progressBar.style.width = "0%";
        
      }
  });
  });
}



function comprobar() {
  
  if(storage.get("installed")){
    let serverIns = serverDb.find(element => element.name == storage.get("installed"))
    document.getElementById(storage.get("installed")).innerHTML = "";
    if(storage.get("version-"+serverIns.name)) {
      if(storage.get("version-"+serverIns.name) === serverIns.version){
        document.getElementById("installed").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${serverIns.img}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.name}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block;" id="play">Jugar</span> </button><button class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; ;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="${serverIns.gameImg}" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${serverIns.game}"><h2 class="elementor-heading-title elementor-size-default"><strong>${serverIns.game}</strong><br>${serverIns.config} ${serverIns.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
        document.getElementById("installBibl").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${serverIns.img}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.name}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block;" id="play">Jugar</span> </button><button class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; ;"> <span style="display: inline-block; padding-left: 17px;" id="uninstall">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="${serverIns.gameImg}" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${serverIns.game}"><h2 class="elementor-heading-title elementor-size-default"><strong>${serverIns.game}</strong><br>${serverIns.config} ${serverIns.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
      } else {
        document.getElementById("installed").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${serverIns.img}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.name}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block; padding-left: 15px" id="actualizar">Actualizar</span> </button><button class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; padding-left: px"> <span style="display: inline-block; padding-left: 17px;" id="uninstall">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="${serverIns.gameImg}" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${serverIns.game}"><h2 class="elementor-heading-title elementor-size-default"><strong>${serverIns.game}</strong><br>${serverIns.config} ${serverIns.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
        document.getElementById("installBibl").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 290px;"> <div style="width:390px;" class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-09e109a" data-id="09e109a" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-widget-container"> <img height="300px" width="300px" style="border-radius: 15px;" src="${serverIns.img}">															</div> </div> </div> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-34752d9 elementor-widget elementor-widget-heading" data-id="34752d9" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <h2 class="elementor-heading-title elementor-size-default" style="margin-top: 10px;">${serverIns.name}</h2>		</div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block; padding-left: 15px" id="actualizar">Actualizar</span> </button><button class="button2" style="display: inline-block; box-sizing : content-box; text-align: center; padding-left: px"> <span style="display: inline-block; padding-left: 17px;" id="uninstall">Desinstalar</span> </button>		</div> </div> <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="${serverIns.gameImg}" >															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class="${serverIns.game}"><h2 class="elementor-heading-title elementor-size-default"><strong>${serverIns.game}</strong><br>${serverIns.config} ${serverIns.mineversion}</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5ec8183" data-id="5ec8183" data-element_type="column"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-9ea9b52 elementor-shape-rounded elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="9ea9b52" data-element_type="widget" data-widget_type="social-icons.default"> <div class="elementor-widget-container"> <div class="elementor-social-icons-wrapper elementor-grid"> <span class="elementor-grid-item"> <a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-f821bc2" href="${serverIns.twitter}" target="_blank"> <span class="elementor-screen-only">Twitter</span> <i class="fab fa-twitter"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.youtube}" class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-8823dc0" target="_blank"> <span class="elementor-screen-only">Youtube</span> <i class="fab fa-youtube"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.instagram}" class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-5a87026" target="_blank"> <span class="elementor-screen-only">Instagram</span> <i class="fab fa-instagram"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.discord}" class="elementor-icon elementor-social-icon elementor-social-icon-discord elementor-repeater-item-63d7e64" target="_blank"> <span class="elementor-screen-only">Discord</span> <i class="fab fa-discord"></i>					</a> </span> <span class="elementor-grid-item"> <a href="${serverIns.web}" class="elementor-icon elementor-social-icon elementor-social-icon-link elementor-repeater-item-e9df7e1" target="_blank"> <span class="elementor-screen-only">Link</span> <i class="fas fa-link"></i>					</a> </span> </div> </div> </div> </div> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
      }
    }
    
  }else{
    document.getElementById("installed").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 150px;"> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated" >  <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class=""><h2 class="elementor-heading-title elementor-size-default"><strong>Minecraft</strong><br>Sincronizado con pack</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" style="margin-bottom:0px;margin-top:15px;" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block; padding-bottom:30px;padding-top:30px; " onclick="launchMine();">Jugar</span> </button>		</div> </div></div></section> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
    document.getElementById("installBibl").innerHTML=`<div style="margin-bottom:20px;" id="primary" class="content-area primary"> <div id="primary" class="content-area primary"> <main id="main" class="site-main"> <article class="post-340 page type-page status-publish ast-article-single" id="post-340" itemtype="https://schema.org/CreativeWork" itemscope="itemscope"> <header class="entry-header ast-header-without-markup"> </header><!-- .entry-header --> <div class="entry-content clear" itemprop="text"> <div data-elementor-type="wp-page" data-elementor-id="340" class="elementor elementor-340"> <section class="elementor-section elementor-top-section elementor-element elementor-element-abd5e64 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="abd5e64" data-element_type="section"> <div class="elementor-container elementor-column-gap-default" style="height: 150px;"> <div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9827de8" data-id="9827de8" style="width: 100%;" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated" >  <section class="elementor-section elementor-inner-section elementor-element elementor-element-fe17890 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe17890" data-element_type="section"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-df44e69" data-id="df44e69" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <section class="elementor-section elementor-inner-section elementor-element elementor-element-d7a9621 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d7a9621" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="margin-bottom: 0px"> <div class="elementor-container elementor-column-gap-no"> <div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-43a3132" data-id="43a3132" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"> <div class="elementor-widget-wrap elementor-element-populated"> <div class="elementor-element elementor-element-7cff09e elementor-widget__width-auto elementor-widget elementor-widget-image" data-id="7cff09e" data-element_type="widget" data-widget_type="image.default"> <div class="elementor-widget-container"> <img height="60px" width="60px" src="https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Bedrock_Edition_App_Store_icon.png/revision/latest/scale-to-width-down/250?cb=20210914141811">															</div> </div> <div class="elementor-element elementor-element-a8dc8a7 elementor-widget__width-auto elementor-widget elementor-widget-heading" data-id="a8dc8a7" data-element_type="widget" data-widget_type="heading.default"> <div class="elementor-widget-container"> <div class=""><h2 class="elementor-heading-title elementor-size-default"><strong>Minecraft</strong><br>Sincronizado con pack</h2>	</div>	</div> </div> </div> </div> </div> </section> </div> </div> <div class="elementor-element elementor-element-5e28485 elementor-widget elementor-widget-html" style="margin-bottom:0px;margin-top:15px;" data-id="5e28485" data-element_type="widget" data-widget_type="html.default"> <div class="elementor-widget-container" style="display: inline-block;"> <button class="button2" style="display: inline-block;"> <span style="display: inline-block; padding-bottom:30px;padding-top:30px; " onclick="launchMine();">Jugar</span> </button></div> </div></div></section> </div> </div> </section> </div> </div> </div> </section> </div> </div><!-- .entry-content .clear --> </article><!-- #post-## --> </main><!-- #main --> </div> </div>`;
  }

  document.querySelectorAll('.button2').forEach(btn => {
    btn.addEventListener("click", onClickEvent2); // events bubble up to ancestors

  });
}

function onClickEvent2(event) {
    if(event.target.id === "uninstall"){
      desinstalar(); 
    }
    if(event.target.id === "play"){
      launchMine();
    }
    if(event.target.id === "actualizar"){
      let serverIns = serverDb.find(element => element.name == storage.get("installed"))
      titleModal();
              modalText("Actualizando archivos...");
              fs.rmdir(minecraftData + "/mods", { recursive: true, force: true }, (err) => {
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
                  storage.set("installed","");
                  modalText("Archivos preparados");
                      setTimeout(() => {
                        modalDesc("ACTUALIZANDO EL PACK DE " + serverIns.name);
                        checkMineFolder(serverIns.descarga, serverIns.name, serverIns.version, serverIns.mineversion, serverIns.config);
                      }, 600);
                }
              });
    }
  }

  const { Client, Authenticator, offline } = require('minecraft-launcher-core');
const e = require('express');
const { versions } = require('process');
  const launcher = new Client();


function checkExecute(){
  checkForge(storage.get("mineVer"));
}

  function executeMine(){
 //   ipcRenderer.send("hide-me")
  
    let optsForge = {
          
      clientPackage: null,
      // For production launchers, I recommend not passing 
      // the getAuth function through the authorization field and instead
      // handling authentication outside before you initialize
      // MCLC so you can handle auth based errors and validation!
      authorization: Authenticator.getAuth(storage.get('username')),
      root: minecraftData,
      version: {
          number: storage.get("mineVer"),
          type: "release"
      },
      window: {
        fullscreen: storage.get('Xfullscreen'),
        width: storage.get("width"),
        height: storage.get("height")
      },
      forge: storage.get("forge-"+(storage.get("mineVer"))),
      memory: {
          max: storage.get("maxRam")+"G",
          min: storage.get("minRam")+"G"
      }
    }
    let opts = {
        clientPackage: null,
        // For production launchers, I recommend not passing 
        // the getAuth function through the authorization field and instead
        // handling authentication outside before you initialize
        // MCLC so you can handle auth based errors and validation!
        authorization: Authenticator.getAuth(storage.get('username')),
        root: minecraftData,
        version: {
            number: storage.get("mineVer"),
            type: "release"
        },
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
    if(storage.get("Forge")==="true"){
      ipcRenderer.send("hide-me")
      launcher.launch(optsForge);
    }else{
      launcher.launch(opts)
      ipcRenderer.send("hide-me")
    }
  }else{
    modalError("SLauncher no soporta carga independiente. Es necesario instalar un pack de mods antes de iniciar el juego.")
  }
  
  launcher.on('close', (e) => 
  ipcRenderer.send("show-me")
  );
  launcher.on('data', (e) =>
    console.log(e)
  );
  launcher.on('debug', (e) =>
    console.log(e)
  );
  }

function data(data){
  if(data.includes("Game crashed!")){
    modalError(data);
    
  }else{
    console.log(e);
  }
}


function checkJava(){
  var spawn = require('child_process').spawn('java', ['-version']);
    spawn.on('error', function(err){
      modalError("Es necesario tener instalado Java 8. Una vez instalado reinicia SLauncher.")
      window.open("https://java-for-minecraft.com/es/", '_blank').focus();
    })
    spawn.stderr.on('data', function(data) {
        data1 = data.toString();
        if(data1.includes("64-Bit")){
          checkExecute();
        }
    })
}



function checkForge(version){
  request('https://secrecycraft.com/db/forge.html', function (error, response, body) {
    if(error){
      modalError("Ha ocurrido un error procesando la instalación de forge.")
    }else{
      const forgeDown = JSON.parse(body);
      let forgeOF = forgeDown.find(element => element.ForgeVer == version);
      console.log(forgeOF);
      if(storage.get("forge-"+forgeOF.ForgeVer)){
        if(storage.get("forgeVer-"+forgeOF.ForgeVer)===forgeOF.Fversion){
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
}

function download(url, ForgeVer, Fversion) {
  const dllll = new DownloaderHelper (url, docuus + "/files/descargas");
  dllll.start();
  modalText("Instalando Forge "+ ForgeVer)
  downloadModal();
  dllll.on('error',(err) => {
    modalError("Ha ocurrido un error - " + "\n" + err);
  });
  dllll.on('progress.throttled',(stats) => {
    progressBar.style.width = stats.progress + "%";
    modalSubDesc(parseInt(stats.progress.toFixed(2))+" %");
  });
  dllll.on('end',(downloadInfo) => {
    di = downloadInfo.incomplete;
    archivo = downloadInfo.fileName;
    dirArchivo = downloadInfo.filePath;
    if(di === false){
      storage.set("forge-"+ForgeVer, dirArchivo);
      storage.set("forgeVer-"+ForgeVer, Fversion);
      modalText("Forge instalado correctamente. Lanzando Minecraft...");
      executeMine();
      closePopup();
    }
    
  });
}