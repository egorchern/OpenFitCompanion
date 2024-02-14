import { Card } from '@mui/material';
import Markdown from 'react-markdown'
export default function Message(props: any){
    const {role, message, createdAt} = props;
    const dateTime = new Date(createdAt * 1000).toISOString()
    const className = role === "user" ? "userMessage" : "assistantMessage"
    return (
        <Card sx={{
            p: 2,
            m: 2
        }} className={className}>
            <p>{dateTime}</p>
            <p>Role: <strong>{role}</strong></p>
            <Markdown>
                {message}
            </Markdown>
        </Card>
    )
}