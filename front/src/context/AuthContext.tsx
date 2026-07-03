import { createContext,useContext,useEffect,useState} from "react";
import type {ReactNode} from "react"

export type usuarioLog = {
    id:number,
    correo:string,
    nombre:string,
    cargo:string
}
export type AuthContextType = {
    usuario: usuarioLog | null
    token: string | null
    cargando: boolean
    autenticado: boolean
    login: (correo:string,pass:string)=>Promise<{ok:boolean ; msg?:string; usuario?:usuarioLog}>
    logOut:()=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: {children: ReactNode}){
    const [usuario,setUsuario] = useState<usuarioLog|null>(null)
    const [token, setToken] = useState<string|null>(null)
    const [cargando, setCargando] = useState(true)

    /**Metodo para iniciar sesion dentro del sistema
     * 
     * Verifica las credenciales enviadas desde inicioSesion hacia el back
     * Si esto ocurre regresa al usuario encontrado
     * Almacena dentro del componente al usuario
     * Guarda en localStorage el token jwt del usuario para futuras consultas y verificaciones
     */
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
            return {ok:false, msg:" Error al conectar con servidor "}
        }
    }

    /**Cierra sesion del usuario eliminando de la memoria del componente al usuario y al token generado
     * elimina de localStorage el token
    */
    const logOut = () =>{
        setUsuario(null)
        setToken(null)
        localStorage.removeItem("token")
    }

    /**Verificar la identidad del usuario que no ha cerrado sesion
     * Si el usuario refresca la ventana o navega a otra, permite volver a identificar al usuario mientras se tenga el token de sesion del mismo
     * Si esto ocurre vuelve a almacenar en memoria al usuario
     * Si el token deja de tener validez, elimina el token y retorna --> debe volver a iniciar sesion
     * 
     */
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
                if(res.status === 401 || res.status === 403){
                    localStorage.removeItem("token")
                    setCargando(false)
                    return
                }
                if(!res.ok){
                    setCargando(false)
                    throw new Error( "Token invalido")
                }
                
                const data = await res.json()
                setUsuario(data.usuario)
                setToken(tokenSaved)
            }catch(e){
                setCargando(false)
                console.log({msg: "Error al comprobar token",e})
            }finally{
                setCargando(false)
            }
        }
        restaurarSesion()
    },[])

    return (
        <AuthContext.Provider value={{usuario,token,cargando, autenticado: !!usuario, login, logOut}}>{children}</AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth debe estar dentro de un AuthProvider")
    return context
}