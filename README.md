# Aplicación web móvil
Este repositorio contiene los archivos de un servidor web desplegado en cada nodo (Raspberry Pi) de una MANET para el proyecto de tesis denominado Aplicación de MANET's como Sistema de Comunicación en la Movilidad Sostenible. 

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
## Descripción de directorios y archivos
1. El archivo server.js hace uso de modulos express y socketio para desplegar la página web y realizar acciones tanto a nivel del frontend como el backend.
2. Los archivos package-lock.json y package.json contienen toda la información de los módulos de la aplicación web empleados.
3. El directorio certs contiene los certificados autofirmados empleados por la aplicación mediante HTTPS
4. El directorio public contiene todos los archivos de css (estilos propios y de bootstrap), js (bootstrap) e imágenes usados para el frontend.
5. El directorio routes contiene un index.js encargado de direccionar las rutas hacia las diferentes páginas de la aplicación.
6. El directorio scripts contiene las acciones de los botones de la página de Control que se ejecutan en el backend.
7. El directorio views contiene los distintos html (archivos ejs) de cáda página de la aplicación. Una carpeta denominada partials contiene una sección de código desarrollado para una barra de navegación (navbar) que se muestra en el encabezado de cada página.

## Despliegue de la aplicación en RPi con NodeJS
1. Clonación del repositorio en la RPi
```
sudo git clone https://github.com/josandotavalo/BCSweb.git
```
2. Instalación de módulos de node
```
cd BCSweb
sudo npm install
sudo npm start
```
3. Acceso a la aplicación web por medio de un navegador
- Abra un navegador
- Digite la dirección https://IP_RPi:3000
  
## Despliegue de la aplicación en RPi con PM2
1. Instalación de pm2
```
sudo npm install -g pm2
```
2. Configuración de pm2
```
pm2 start server.js --name mynodeapp
pm2 starup systemd
pm2 save
```
3. Comprobación de la aplicación
```
pm2 show mynodeapp
```
