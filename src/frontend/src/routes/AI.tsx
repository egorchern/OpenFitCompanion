import { GetThread } from "../hooks/AI"
import DialogueWindow from "./AI/DialogueWindow"

export default function AI(){
    return (
        <main className="flex-vertical">
            <h1>AI</h1>
            <DialogueWindow/>
        </main>
    )
}