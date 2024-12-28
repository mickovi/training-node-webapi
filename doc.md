### Event loop en JavaScript
- JS es un lenguaje de programación para interactuar con elementos HTML,cada tipo de elemento define eventos que pueden interactuar con ese elemento, por ejemplo, los eventos del elemento *button*.
- Los *callbacks* son funciones de JS que pueden especificar evento ¿asociandolo? la API de un navegador, cuando el navegador detecta un evento, agrega el callback a la cola que puede ser ejecutada por el runtime de JavaScript.
- El runtime de JavaScript tiene un único hilo llamado *main thread*, el cual es responsable de ejecutar los callbacks.
- El main thread se ejecuta en un bucle, llamado *event loop* el cual toma los callbacks desde la cola de eventos y los ejecuta.
- El event loop es cómo el código nativo del navegador, el cual está sujeto al sistema operativo, interactúa con el código de JavaScript, en cual se ejecuta en un entorno de ejecución compatible.
- Los eventos a menudo ocurren en grupos, como cuando el puntero se mueve a través de varios elementos, y por lo tanto la cola puede contener múltiples callbacks esperando ser ejecutados.
- Detrás de escena, el navegador utiliza hilos nativos para realizar la solicitud HTTP y esperar la respuesta, que luego se pasa al entorno de ejecución de JavaScript utilizando un callback.
### Event loop en Node

El event loop y el main thread son mantenidos en node, por lo que el código de JavaScript en el lado del servidor se ejecuta de la misma manera que en el lado del cliente