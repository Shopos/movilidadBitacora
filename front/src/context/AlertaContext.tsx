import { createContext,useContext, useState, } from "react"
import type { ReactNode } from "react"
import type {AlertColor} from "@mui/material/Alert"
import {Alert,Snackbar} from '@mui/material'

export type AlertContextType = {
    showAlerta: ( mensaje: string, severity?: AlertColor )=>void
}

const AlertContext = createContext<AlertContextType|undefined>(undefined)

export const AlertProvider=({children}:{children:ReactNode})=>{
    const [alerta,setAlerta] = useState({
        open:false,
        msg:"",
        severity: 'info' as AlertColor,//'success'|'info'|'warning'|'error'
    })

    const showAlerta = (mensaje:string, severity:AlertColor='info')=>{
        setAlerta({open:true,msg:mensaje,severity})
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?:string)=>{
        if(reason === 'clickaway')return
        setAlerta(prev=>({...prev, open:false}))
    }

    return(
        <AlertContext.Provider value={{ showAlerta }}>
            {children}
            <Snackbar open={alerta.open} onClose={handleClose} autoHideDuration={2500}>
                <Alert severity={alerta.severity} variant="filled" sx={{ width: '100%' }}>{alerta.msg}</Alert>
            </Snackbar>
        </AlertContext.Provider>
    )
}

export const useAlerta=()=>{
    const context = useContext(AlertContext)
    if(!context) throw Error ('useAlert debe estar dentro de AlertProvider')
    return context
}