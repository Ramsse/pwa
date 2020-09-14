//importacion de aerchivo utils
importScripts("js/sw-utils.js"); //para que la palabra no de error vamos al jshinc
//creamos caches
const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

//const app-shell-----todo lo que es necesario para mi aplicación
//cualquier libreria que este mal hace que no se instale el appshell
const APP_SHELL = [
  //"/",--sirve en desarrollo pero no al subirlo
  "index.html",
  "css/style.css",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js", //el corazon de la palicación
  "js/sw-utils.js", //IMPORTANTE PARA QUE NO DE ERROR EN LA IMPORTACIÓN QUE ENTRE SE GUARDE SE MANIFIESTE
];
//lo que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

//PARTE DE LA INSTALACIÓN
self.addEventListener("install", (e) => {
  //----------Promesa del static
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    cache.addAll(APP_SHELL);
  });
  //---------Promesa del Inmutable
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });
  //
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
  //
});

//PROCESO PARA QUE CADA VEZ QUE CAMBIE EL SERVICE WORKER BORRE LOS CACHES VIEJOS se puede usar
self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

//cache con network fallback--en caso de no ser encontrada en el cache se va a ir al network a traer la información
//empezamos con cache only- repaso
self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      //console.log(e.request.url);//vemosque pasan errores
      return fetch(e.request).then((newRes) => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
      });
    }

    //
  });
  //
  e.respondWith(respuesta);
});
