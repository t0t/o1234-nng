import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar multer para guardar las miniaturas
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'src/thumbnails'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos
app.use(express.static(__dirname));

// Endpoint para subir miniaturas
app.post('/api/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    res.json({ path: `/src/thumbnails/${req.file.filename}` });
});

// Endpoint para eliminar miniaturas
app.delete('/api/delete-thumbnail/:id', (req, res) => {
    const thumbnailPath = path.join(__dirname, 'src/thumbnails', `${req.params.id}.png`);
    
    fs.unlink(thumbnailPath, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error al eliminar miniatura:', err);
            return res.status(500).json({ error: 'Error al eliminar la miniatura' });
        }
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
