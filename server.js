// 1. Importar las librerías necesarias
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// 2. Inicializar la aplicación de Express
const app = express();
const PORT = 3000;

// --- CONEXIÓN A MONGODB ---
// ¡CORRECCIÓN PARA DOCKER!
// Usamos 'host.docker.internal' para que el contenedor pueda conectarse
// a la base de datos que se ejecuta en tu computadora (el host).
const MONGO_URI = 'mongodb://host.docker.internal:27017/estudioJuridicoDB';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- MODELO DE DATOS PARA EL FORMULARIO ---
const contactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  asunto: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const Contacto = mongoose.model('Contacto', contactoSchema);


// 3. Configurar 'middleware'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 4. --- RUTAS DE LA API ---
app.post('/api/contacto', async (req, res) => {
  try {
    const nuevoMensaje = new Contacto({
      nombre: req.body.nombre,
      email: req.body.email,
      asunto: req.body.asunto,
      mensaje: req.body.mensaje,
    });
    await nuevoMensaje.save();
    console.log('Mensaje guardado:', nuevoMensaje);
    res.status(201).json({ message: 'Mensaje recibido y guardado con éxito.' });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ message: 'Error interno del servidor. No se pudo guardar el mensaje.' });
  }
});

// --- RUTA PRINCIPAL ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('Presiona CTRL+C para detener el servidor.');
});

