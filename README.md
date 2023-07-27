# Aplicación web móvil
Este repositorio contiene los archivos de un servidor web desplegado en cada nodo (Raspberry Pi) de una MANET

## Instalación de NodeJS en RPi
1. Repositorio de versión LTS release
```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```
2. Instalación
```
sudo apt install nodejs
```
3. Comprobación
```
node -v
```
## Descripción de los directorios y archivos
1. El archivo server.js hace uso de modulos express y socketio para desplegar la página web y realizar acciones tanto a nivel del frontend como el backend.
2. Archivos package-lock.json y package.json contienen toda la información de los módulos de la aplicación web empleados.
3. El directorio certs contiene los certificados autofirmados empleados por la aplicación mediante HTTPS
4. El directorio public contiene todos los archivos de css (estilos propios y de bootstrap), js (bootstrap) e imágenes usados para el frontend.
5. El directorio routes contiene un index.js encargado de direccionar las rutas hacia las diferentes páginas de la aplicación.
6. El directorio scripts contiene las acciones de los botones de la página de Control que se ejecutan en el backend.
7. El directorio views contiene los distintos html (archivos ejs) de cáda página de la aplicación. Una carpeta denominada partials contiene una sección de código desarrollado para una barra de navegación (navbar) que se muestra en el encabezado de cada página.
