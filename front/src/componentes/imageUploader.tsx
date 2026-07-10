import { useRef,useState, type ChangeEvent } from "react"


const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
interface Props{
    onArchivoReady: (archivo:File,previewURL:string)=>void
    onCancelar?: ()=>void
    label?:string,
    capture?:'environment'|'user'|'',
    rutaActual?:string
}

/**Componente para la subida de imagenes
 * -->Sirve para la seleccion de las mismas, esta devuelve el archivo elegido al componente padre para su tramitacion
 */
function imageUploader({onArchivoReady,onCancelar,label,capture,rutaActual} :Props){

    const inputRef = useRef<HTMLInputElement>(null)
    const [preview,setPreview] = useState<string|null>(null)
    const urlMostrar = preview ?? (rutaActual ? `${API}/uploads/${rutaActual}`:null)

    const handleSeleccion =(e:ChangeEvent<HTMLInputElement>)=>{
        const archivo = e.target.files?.[0]
        if(!archivo){
            return
        }
        if(preview){
            URL.revokeObjectURL(preview)
        }
        const nuevaUrl = URL.createObjectURL(archivo)
        setPreview(nuevaUrl)
        onArchivoReady(archivo,nuevaUrl)
    }

    const handleCancelar = () =>{
        if(preview){
            URL.revokeObjectURL(preview)
        }    
        setPreview(null)
        if(inputRef.current){
            inputRef.current.value = ""
        }
        onCancelar?.()
    }

    return(
        <div>
            <div onClick={()=>inputRef.current?.click()}>
                <label style={{display:"flex", color:"black"}}>{label}</label>
                {urlMostrar ? (
                    <img src={urlMostrar} alt="preview"></img>
                ):(
                    <label>
                        {capture ? 'Fotografiar':'Seleccionar imagen'}
                    </label>)
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
                    <button onClick={handleCancelar}>Cancelar</button>
                </>
            )}
        </div>
    )
}
export default imageUploader