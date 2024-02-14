import Markdown from 'react-markdown'
export default function Message(props: any){
    const {role, message, createdAt} = props;
    const dateTime = new Date(createdAt * 1000).toISOString()

    return (
        <div>
            <p>{dateTime}</p>
            <p>Role: <strong>{role}</strong></p>
            <Markdown>
                {message}
            </Markdown>
        </div>
    )
}