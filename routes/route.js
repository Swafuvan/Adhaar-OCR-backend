import express from 'express'
import { AdhaarDetails } from '../Controller/Controller.js'
import multer from 'multer';
const router = express.Router()

const storage = multer.memoryStorage(); // or use diskStorage for saving files to disk
const upload = multer({ storage: storage });

router.post('/api/submit', upload.fields([{ name: 'front' }, { name: 'back' }]),AdhaarDetails );



export default router