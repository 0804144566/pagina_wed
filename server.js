// 1. Importar las librerías necesarias
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// 2. Inicializar la aplicación de Express
const app = express();
const PORT = 3000;

// --- CONEXIÓN A MONGODB ---
const MONGO_URI = 'mongodb://localhost:27017/estudioJuridicoDB';

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
// ESTAS LÍNEAS SON MUY IMPORTANTES
// express.json() permite que el servidor entienda los datos JSON que envía el formulario.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Sirve los archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// 4. --- RUTAS DE LA API ---

// Ruta para manejar el envío del formulario de contacto
app.post('/api/contacto', async (req, res) => {
  try {
    // req.body contiene los datos del formulario (nombre, email, etc.)
    console.log('Datos recibidos del formulario:', req.body);

    const nuevoMensaje = new Contacto({
      nombre: req.body.nombre,
      email: req.body.email,
      asunto: req.body.asunto,
      mensaje: req.body.mensaje,
    });
    
    // Guardamos el nuevo mensaje en la base de datos
    await nuevoMensaje.save();

    console.log('Mensaje guardado en la base de datos.');
    
    // Enviamos una respuesta de éxito al frontend
    res.status(201).json({ message: 'Mensaje recibido y guardado con éxito.' });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ message: 'Error interno del servidor. No se pudo guardar el mensaje.' });
  }
});


// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('Presiona CTRL+C para detener el servidor.');
});

