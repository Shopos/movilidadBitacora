import { Request,Response,NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

declare global  {
    namespace Express{
        interface Request{
            usuario? : string | JwtPayload
        }
    }
}
interface UsuarioPayload{
    correo:string,
    cargo:string,
    estado:string,
}

/**Verifica que el token JWT sea autentico y no este expirado debido al tiempo */
export const autenticarJWT = (req:Request,res:Response, next:NextFunction):void =>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader?.startsWith('Bearer ')){
        res.status(401).json({msg: "Acceso denegado: sin token"})
        return
    }
    const token = authHeader.split(' ')[1]    
    try{
        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new Error('JWT no encontrado en variables')
        }
        const decoded = jwt.verify(token,secret)
        req.usuario = decoded
        next()
    }catch(e){
        res.status(403).json({msg: "Token expirado"})
    }
}
/**Verifica que la solicitud enviada sea de un usuario con cargo Administrativo */
export const verifyAdmin = (req:Request, res:Response, next:NextFunction)=>{
    const user = req.usuario as UsuarioPayload | undefined
    if(!user && user!.cargo !== "Administrativo"){
        return res.status(400).json({msg: " No tienes credenciales necesarias para entrar en este espacio "})
    }
    next()
}