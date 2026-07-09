import { useRef,useState, type ChangeEvent } from "react"
import { resolverSubidaImagen } from "../utils/auxiliar"


const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
interface Props{
    idViaje:number,
    tipo:'foto-inicio'|'foto-fin'|'foto-comprobante',
    label?:string,
    capture?:'environment'|'user'|'',
    rutaActual?:string,
    onSubida?: (rutaRelativa:string)=>void
}
function imageUploader({idViaje,tipo,label,capture,rutaActual,onSubida} :Props){

    const inputRef = useRef<HTMLInputElement>(null)
    const [preview,setPreview] = useState<string|null>(null)
    const [subiendo,setSubiendo] = useState<boolean>(false)
    const urlMostrar = preview ?? (rutaActual ? `${API}/uploads/${rutaActual}`:null)

    const handleSeleccion =(e:ChangeEvent<HTMLInputElement>)=>{
        const archivo = e.target.files?.[0]
        if(!archivo){
            return
        }
        if(preview){
            URL.revokeObjectURL(preview)
        }
        setPreview(URL.createObjectURL(archivo))
    }

    const handleSubir = async() =>{
        const archivo = inputRef.current?.files?.[0]
        if(!archivo){
            //Se debe seleccionar un archivo primero
            return
        }
        setSubiendo(true)
        const res = await resolverSubidaImagen(idViaje,tipo,archivo)
        if(res){
            //Imagen subida
            const clave = Object.keys(res).find(k=>k!=='msg')
            if(clave && onSubida){
                onSubida((res as Record<string,string>)[clave])
            }
            setPreview(null)
            if(inputRef.current){
                inputRef.current.value = ""
            }
        }else{
            //No se pudo guardar
            console.log("No se logro guardar imagen")
        }
    }

    const handleCancelar = () =>{
        if(preview){
            URL.revokeObjectURL(preview)
        }    
        setPreview(null)
        if(inputRef.current){
            inputRef.current.value = ""
        }
    }

    return(
        <div>
            <div onClick={()=>inputRef.current?.click()}>
                <label>{label}</label>
                {urlMostrar ? (
                    <img src={urlMostrar} alt="preview"></img>
                ):(
                    <span>
                        {capture ? 'Fotografiar':'Seleccionar imagen'}
                    </span>)
                }
            </div>
            <input 
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            {...(capture ? {capture}:{})}
            onChange={handleSeleccion}
            />
            {preview && (
                <>
                <button onClick={handleCancelar} disabled={subiendo}>Cancelar</button>
                <button onClick={handleSubir} disabled={subiendo}>{subiendo ? "...subiendo":"Confirmar"}</button>
                </>
            )}
        </div>
    )
}
export default imageUploader