const inFortnite = document.querySelector("#inFortnite");
const noFortnite = document.querySelector("#noFortnite");
const insFortnite = document.querySelector("#insFortnite");
const abFortnite = document.querySelector("#abFortnite");


if (fs.existsSync('C:/Program Files/Epic Games/Fortnite/FortniteGame/Content/Splash/Splash.bmp')) {
    noFortnite.style.display = "none"
    insFortnite.style.display = "none"
  } else {
    inFortnite.style.display = "none"
    abFortnite.style.display = "none"
  }

insFortnite.addEventListener("click", function(evento){
	// Aquí todo el código que se ejecuta cuando se da click al botón
    ipcRenderer.send('hide-me');
    window.open('loading game.html', '_blank', 'width=300,height=500,frame=false,nodeIntegration=no,parent:top,skipTaskbar=true,alwaysOnTop=true')
    childProcess.exec(__dirname + '/Fortnite.url', function (err, stdout, stderr) {
        if (err) {
        console.error(err);
        alert(err);
        ipcRenderer.send('close');
        return;
    }
    console.log(stdout);
    
    ipcRenderer.send('close-me');
//        process.exit(0);// exit process once it is opened
    })
})

abFortnite.addEventListener("click", function(evento){
	// Aquí todo el código que se ejecuta cuando se da click al botón
    ipcRenderer.send('hide-me');
    window.open('loading game.html', '_blank', 'width=300,height=500,frame=false,nodeIntegration=no,parent:top,skipTaskbar=true,alwaysOnTop=true')
    childProcess.exec(__dirname + '/Fortnite.url', function (err, stdout, stderr) {
        if (err) {
        console.error(err);
        alert(err);
        ipcRenderer.send('close');
        return;
    }
    console.log(stdout);
    
    ipcRenderer.send('close-me');
//        process.exit(0);// exit process once it is opened
    })
})