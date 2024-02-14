import { useEffect, useMemo, useRef } from "react"
import { GetThread } from "../../hooks/AI"
import Message from "./Message"
import { Card, Divider } from "@mui/material"

export default function DialogueWindow() {
    const { data, status } = GetThread(1)
    const messagesEndRef: any = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    const messages = useMemo(() => {
        if (!data) {
            return null
        }
        const arr = [].concat(data.data).reverse()
        console.log(arr)
        return arr.map((obj: any) => {
            return {
                role: obj?.role,
                message: obj?.content[0]?.text?.value,
                createdAt: obj?.created_at
            }
        })
    }, [data])
    useEffect(() => {
        scrollToBottom()
    }, [data]);
    console.log(data)
    return (
        <div className="chatWindow">
            {
                messages ? (
                    messages.map((message: any, index: number) => {
                        return (
                            <Card variant='outlined' key={index} sx={{
                                p: 2,
                                m: 2
                            }}>
                                <Message {...message} />
                            </Card>
                        )
                    })
                ) : null
            }
            <div ref={messagesEndRef} />
        </div>
    )
}