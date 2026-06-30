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

export const verifyAdmin = (req:Request, res:Response,next:NextFunction)=>{

    if("cargo" in req.body.usuario && req.body.usuario?.cargo !== "Administrativo"){
        return res.status(400).json({msg: " No tienes credenciales necesarias para entrar en este espacio "})
    }
    next()
}