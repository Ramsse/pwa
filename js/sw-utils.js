//archivo auxiliar del service worker que nos ayuda a pasar cierta logica

//Guardar en el cache Dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  if (res.ok) {
    //------------promesa----
    return caches.open(dynamicCache).then((cache) => {
      cache.put(req, res.clone());
      return res.clone(); //--otra promesa
    });
    //------------
  } else {
    return res;
  }
  //function
}
