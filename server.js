const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const dgram = require('dgram');

const app = express();
const port = 3000;

// Configuración de Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const routes = require('./routes/index');
app.use('/', routes);

// Opciones de HTTPS con certificados autofirmados
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs/clave-privada.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs/certificado.pem'))
};

// Crear servidor HTTPS
const server = https.createServer(options, app).listen(port, () => {
  console.log(`Aplicación web disponible en https://localhost:${port}`);
});

// Iniciar Socket.IO en el servidor
const io = require('socket.io')(server);

// Proceso FFmpeg para redirigir el audio desde el navegador hacia las Raspberry Pi
const ffmpegProcessOut = spawn('ffmpeg', [
  '-f', 'f32le',
  '-ar', '48000',
  '-ac', '1',
  '-i', 'pipe:0',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-f', 'mpegts',
  'udp://localhost:12345'
]);

// Escuchar eventos de salida de FFmpeg para redirigir
ffmpegProcessOut.stderr.on('data', (data) => {
  console.error(`stderr (redirigir): ${data}`);
});

ffmpegProcessOut.on('close', (code) => {
  console.log(`Proceso de FFmpeg (redirigir) finalizado con código de salida ${code}`);
});

// Proceso FFmpeg para recibir el audio desde la Raspberry Pi 2 y transmitirlo al navegador del cliente
const ffmpegProcessIn = spawn('ffmpeg', [
  '-i', 'udp://localhost:12345',
  '-acodec', 'aac',
  '-f', 'adts',
  'pipe:1'
]);

// Escuchar eventos de salida de FFmpeg para recibir
ffmpegProcessIn.stderr.on('data', (data) => {
  console.error(`stderr (recibir): ${data}`);
});

ffmpegProcessIn.on('close', (code) => {
  console.log(`Proceso de FFmpeg (recibir) finalizado con código de salida ${code}`);
});

let scriptProcess;

app.post('/apagarNodo', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess = exec('bash ./scripts/apagarNodo.sh');
  scriptProcess.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess2;

app.post('/reiniciarNodo', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess2 = exec('bash ./scripts/reiniciarNodo.sh');
  scriptProcess2.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess2.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess3;

app.post('/olsr', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess3 = exec('bash ./scripts/olsr.sh');
  scriptProcess3.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess3.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess4;

app.post('/batman', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess4 = exec('bash ./scripts/batman.sh');
  scriptProcess4.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess4.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess5;

app.post('/tcpdumpStart', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess5 = exec('bash ./scripts/tcpdumpstart.sh');
  scriptProcess5.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess5.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess6;

app.post('/tcpdumpStop', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess6 = exec('bash ./scripts/tcpdumpstop.sh');
  scriptProcess6.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess6.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess7;

app.post('/ina219Start', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess7 = exec('bash ./scripts/ina219start.sh');
  scriptProcess7.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess7.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});

let scriptProcess8;

app.post('/ina219Stop', (req, res) => {
  console.log('Ejecutando el script...');
  scriptProcess8 = exec('bash ./scripts/ntpconfigura.sh');
  scriptProcess8.stdout.on('data', (data) => {
    console.log(`Salida del script: ${data}`);
  });
  scriptProcess8.stderr.on('data', (data) => {
    console.error(`Error del script: ${data}`);
  });
  res.redirect('/control');
});


// Escucha de conexiones de clientes
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Escuchar eventos de audio desde el cliente y escribirlos en el proceso FFmpeg para redirigir
  socket.on('audio', (data) => {
    ffmpegProcessOut.stdin.write(data);
  });

  // Redirigir la salida del proceso FFmpeg de recibir al cliente
  ffmpegProcessIn.stdout.on('data', (data) => {
    socket.emit('audio', data);
  });

  // Escuchar eventos de mensajes desde el cliente y enviarlos por UDP a la Raspberry Pi 2
  socket.on('message', (message) => {
    const udpClient = dgram.createSocket('udp4');
    udpClient.send(message, 12347, "localhost", (err) => {
      if (err) {
        console.error('Error al enviar mensaje por UDP:', err);
      }
      udpClient.close();
    });
  });

  // Transmitir los mensajes al cliente
  socket.on('message', (message) => {
    io.emit('message', message);
  });

  // Detener transmisión y recepción al cerrar la conexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    //ffmpegProcessOut.stdin.end();
    //ffmpegProcessIn.stdin.end();
  });
});
