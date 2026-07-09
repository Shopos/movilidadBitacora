import path from "path"
import fs from "fs"
import multer, {FileFilterCallback} from "multer"
import { Request } from "express"

const BASE_UPLOADS = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(__dirname,'..','..','uploads')

const buildStorage=(subCarpeta:string)=>{
    return multer.diskStorage({
        destination:(_req,_file,cb)=>{
            const dir = path.join(BASE_UPLOADS,subCarpeta)
            fs.mkdirSync(dir,{recursive:true})
            cb(null,dir)
        },
        filename:(_req,file,cb)=>{
            const ext = path.extname(file.originalname).toLowerCase()
            const nombre= `${subCarpeta.replace('/','_')}_${Date.now()}${ext}`
            cb(null,nombre)
        }
    })
}

function fileFilter(_req:Request, file:Express.Multer.File, cb:FileFilterCallback){
    const permitido = ['image/jpeg','image/png','image/webp']
    if(permitido.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error('Solo se permiten imágenes JPEG, PNG, WEBP.'));
    }
}

export function eliminarImagenAnterior(rutaRelativa:string|null|undefined):void{
    if(!rutaRelativa){
        return
    }
    const rutaAbsoluta = path.join(BASE_UPLOADS, rutaRelativa)
    fs.unlink(rutaAbsoluta, (err)=>{
        if(err && err.code !== 'ENOENT'){
            console.error("Error al eliminar imagen anterior")
        }
    })
}

const LimitSize = {fileSize: 5*1024*1024}

export const uploadImageTableroInicio = multer({ storage: buildStorage('viajes/inicio'), limits:LimitSize, fileFilter})
export const uploadImageComprobante = multer({storage: buildStorage('viajes/comprobante'),limits:LimitSize, fileFilter})
export const uploadImageTableroFin = multer({storage: buildStorage('viajes/fin'), limits:LimitSize, fileFilter})