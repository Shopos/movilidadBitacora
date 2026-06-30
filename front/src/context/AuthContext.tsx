import { createContext,useContext,useEffect,useState} from "react";
import type {ReactNode} from "react"

export type usuarioLog = {
    id_usuario:number,
    correo:string,
    nombre:string,
    cargo:string
}
export type AuthContextType = {
    usuario: usuarioLog | null
    token: string | null
    cargando: boolean
    autenticado: boolean
    login: (correo:string,pass:string)=>Promise<{ok:boolean ; msg?:string}>
    logOut:()=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: ReactNode}){
    const [usuario,setUsuario] = useState<usuarioLog|null>(null)
    const [token, setToken] = useState<string|null>(null)
    const [cargando, setCargando] = useState(true)


    const login = async (correo:string, pass:string) =>{
        try{
            const res = await fetch('http://localhost:4000/usuarios/login' ,{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({correo,pass})
            })
            const data = await res.json()

            if(!res.ok){
                return {ok:false, msg:data.error || "Credenciales invalidas"}
            }
            setUsuario(data.usuario)
            setToken(data.token)
            localStorage.setItem("token",data.token)
            return {ok:true, usuario: data.usuario}
        }catch(e){
            return {ok:false, msg:" ERROR AL CONECTAR CON SERVIDOR "}
        }
    }

    const logOut = () =>{
        setUsuario(null)
        setToken(null)
        localStorage.removeItem("token")
    }

    useEffect(()=>{
        const restaurarSesion = async()=>{
            const tokenSaved = localStorage.getItem("token")
            if(!tokenSaved){
                setCargando(false)
                return
            }
            try{
                const res = await fetch('http://localhost:4000/usuarios/perfil',{
                    headers:{ Authorization: `Bearer ${tokenSaved}`}
                })
                if(!res.ok){
                    throw new Error( "Token invalido")
                }
                const data = await res.json()
                setUsuario(data.usuario)
                setToken(tokenSaved)
            }catch(e){
                return localStorage.removeItem("token")
            }finally{
                setCargando(false)
            }
        }
        restaurarSesion()
    },[])

    return (
        <AuthContext.Provider value={{usuario,token
            ,cargando, autenticado:!!usuario,login,logOut
        }}>{children}</AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth debe estar dentro de un AuthProvider")
    return context
}