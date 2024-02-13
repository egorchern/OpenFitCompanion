import { Button, TextField } from "@mui/material"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { IFormInputs } from "./types"


function ProfileForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: {
            age: 0
        },
    })
    console.log(errors)
    const onSubmitForm: SubmitHandler<IFormInputs> = (data) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Controller
                name="age"
                rules={{
                    required: true,
                    min: 1
                }}
                control= {control}
                render = {({field}) => (
                    <TextField value={field.value} label={field.name} onChange={field.onChange} variant="outlined" />
                )}
            />
            <Button type="submit" variant="contained">Submit</Button>
        </form>
    )
}
export default ProfileForm