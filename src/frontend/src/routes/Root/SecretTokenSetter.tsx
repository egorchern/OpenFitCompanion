import { Button, TextField } from "@mui/material";
import { useState } from "react";

const API_SECRET = localStorage.getItem("API_SECRET") ?? ''
export default function SecretTokenSetter() {
    const [secretValue, setSecretValue] = useState(API_SECRET)
    const [isSet, setIsSet] = useState(!!API_SECRET)
    const handleSubmit = () => {
        if (!secretValue){
            return
        }
        setIsSet(true)
        localStorage.setItem("API_SECRET", secretValue)
    }
    const handleReset = () => {
        setSecretValue('')
        setIsSet(false)
        localStorage.removeItem("API_SECRET")
    }
    return (

        <form className="flex-horizontal">
            {!isSet ? (
                <>
                    <TextField id="API-SECRET" label='API SECRET' variant='outlined' onChange={(e) => {setSecretValue(e.target.value)}} />
                    <Button onClick={handleSubmit} variant="contained">Set</Button>
                </>
            ) : (
                <>
                    <p>API secret has been set.</p>
                    <Button variant="contained" onClick={handleReset}>Reset</Button>
                </>
            )}

        </form>
    )
}