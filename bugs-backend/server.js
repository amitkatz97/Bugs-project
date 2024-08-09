import express, { query } from 'express'
import cors from 'cors'
import fs from "fs";
import path from 'path'
import cookieParser from 'cookie-parser'
// import { BugsService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js';
import { userRoutes } from './api/user/user.routes.js';
import PDFDocument from 'pdfkit'; 
import { authRoutes } from './api/auth/auth.routes.js';

const app = express()


const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
    credentials: true
}

//* App Configuration 
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//*Router
app.use('/api/bug',bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)






app.get('/api/bug/download-pdf', (req, res) => {
    const filePath = "./data/data.json"
    const fileContent = fs.readFileSync(filePath, "utf-8")

    const doc = new PDFDocument()
    const filename = "bugs1.pdf"
    const filePathPdf = path.join("./dowloads", filename)
    const writeStream = fs.createWriteStream(filePathPdf);
    doc.pipe(writeStream);

    doc.fontSize(12);
    doc.text('Data from File:', { underline: true });
    doc.moveDown();
    doc.text(fileContent);

    doc.end()
    try {
        writeStream.on('finish', () => {
            // Set headers to force download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            
            // Send the file as response
            const fileStream = fs.createReadStream(filePathPdf).pipe(res);
            // fileStream.pipe(res);
            loggerService.info("file sent to download")
        });
    } catch (err) {
        console.log("err while downloading", err)
        throw err
    }

})




const PORT = process.env.PORT || 3030
app.listen(PORT, () => {loggerService.info(`Server ready at port ${PORT}`)})