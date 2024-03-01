import { Card } from "@mui/material";
import { ActivityItem } from "../../components/types";

export default function ExerciseItem(props: ActivityItem){
    return (
        <Card sx={{
            p: 2,
            maxWidth: "55em"
        }} className="full-width">
            <h3 style={{textAlign: "center"}}>{props.exerciseTitle}</h3>
            <p>Category: {props.exerciseCategory}</p>
            <p>Intensity: {props.exerciseIntensityCategory}</p>
            <p>Exercise Duration: {props.exerciseDuration} minutes</p>
            <p>Metabolic Equivalent minutes: {props.exerciseMETMinutes}</p>
            <p>{props.exerciseNotes}</p>
            {
                props.youtubeUrl ? (
                    <><p>Video example: </p><iframe style={{
                        width: "100%",
                        aspectRatio: "16/9 auto"
                    }} title={props.exerciseTitle + " Youtube Video"} src={props.youtubeUrl}>

                    </iframe></>
                ) : null
            }
            
        </Card>
    )
}