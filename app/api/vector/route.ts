import { NextRequest, NextResponse } from 'next/server'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import pineconeVectorStore from '../chat/context/pinecone'


export const runtime = 'edge'
export const maxDuration = 120

let trial = {}

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`
}

export async function POST(req: any, res: any) {

  const body = await req.json()

  const messages = body.messages ?? []
  console.log(`💎🤖 messages: `, messages)
  const formattedChatHistory = body.chatHistory ?? []
  const data = body.data ?? ''
  const lastMsg = messages[messages.length - 1].content
  const pineconeContext = await pineconeVectorStore(lastMsg);
  console.log(`💎🤖 pineconeContext: `, pineconeContext)

      
  if (pineconeContext !== undefined && pineconeContext !== null) {
    const jsonResponse = JSON.stringify(pineconeContext)

    return new NextResponse(jsonResponse, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } else {
    return new NextResponse(null)
  }
}