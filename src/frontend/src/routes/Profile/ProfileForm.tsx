import { Button, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { IFormInputs } from "./types"
import { MutateProfile, QueryProfile } from "../../hooks/profile"
import { useQueryClient } from "react-query"
import { error } from "console"

const fitnessLevels = ["Beginner", "Intermediate", "Advanced"]
const daysOfWeek = ["None", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
export interface profileFormProps{
    values: any
}
function ProfileForm(props: profileFormProps) {
    const {values} = props
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        defaultValues: {
            age: 0,
            height: 0,
            weight: 0,
            currentFitnessLevel: fitnessLevels[0],
            MET_Target: 750,
            gymDays: [daysOfWeek[0]]
        }, values: values
    })
    console.log(errors)
    const mutation = MutateProfile()
    const onSubmitForm: SubmitHandler<IFormInputs> = (data) => {
        mutation.mutate(data as any)
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="profileForm">
            <Controller
                name="age"
                rules={{
                    required: true,
                    min: 1
                }}
                control={control}
                render={({ field }) => (
                    <TextField InputLabelProps={{shrink: !!field.value}} value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                )}
            />
            <Controller
                name="height"
                rules={{
                    required: true,
                    min: 1
                }}
                control={control}
                render={({ field }) => (
                    <TextField
                        InputProps={{
                            endAdornment: <InputAdornment position="end">cm</InputAdornment>
                        }}
                        InputLabelProps={{shrink: !!field.value}}
                        value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                )}
            />
            <Controller
                name="weight"
                rules={{
                    required: true,
                    min: 1
                }}
                control={control}
                render={({ field }) => (
                    <TextField
                        InputProps={{
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>
                        }}
                        InputLabelProps={{shrink: !!field.value}}
                        value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                )}
            />
            <Controller
                name="currentFitnessLevel"
                rules={{
                    required: true,
                }}
                control={control}
                render={({ field }) => (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="FitnessLevelLabel">{field.name}</InputLabel>
                        <Select
                            labelId="FitnessLevelLabel"
                            id="FitnessLevel"
                            value={field.value}
                            onChange={field.onChange}
                            label={field.name}
                        >
                            {fitnessLevels.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}
            />
            <Controller
                name="gymDays"
                rules={{
                    required: true,
                }}
                control={control}
                render={({ field }) => (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="strengthTrainingDaysLabel">{field.name}</InputLabel>
                        <Select
                            labelId="strengthTrainingDaysLabel"
                            id="strengthTrainingDays"
                            value={field.value}
                            multiple
                            onChange={field.onChange}
                            label={field.name}
                        >
                            {daysOfWeek.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)}
                        </Select>
                        <FormHelperText id="outlined-weight-helper-text">WHO recommends 2 strength training days per week</FormHelperText>
                    </FormControl>
                )}
            />
            <Controller
                name="MET_Target"
                rules={{
                    required: true,
                }}
                control={control}
                render={({ field }) => (
                    <FormControl >
                        
                        <TextField InputLabelProps={{shrink: !!field.value}} value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                        <FormHelperText id="outlined-weight-helper-text">WHO recommends a minimum of 450-900 MET per week</FormHelperText>
                    </FormControl>
                )}
            />
            <Controller
                name="excludeActivitiesKeywords"
                control={control}
                render={({ field }) => (
                    <FormControl className="doubleColumn">
                        <TextField InputLabelProps={{shrink: !!field.value}} multiline value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                        <FormHelperText id="outlined-weight-helper-text">Activities you don't wish to be recommended. Example: push-up, bench press</FormHelperText>
                    </FormControl>

                )}
            />
            <Controller
                name="homeEquipment"
                control={control}
                render={({ field }) => (
                    <FormControl className="doubleColumn">
                        <TextField InputLabelProps={{shrink: !!field.value}} multiline value={field.value} type='number' label={field.name} onChange={field.onChange} variant="outlined" />
                        <FormHelperText id="outlined-weight-helper-text">AI will not recommend exercises that uses equipment that you don't have other than on gym-going days</FormHelperText>
                    </FormControl>

                )}
            />
            <Button type="submit" variant="contained">Submit</Button>
        </form>
    )
}
export default ProfileForm