import { NextRequest, NextResponse } from 'next/server'
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import graph from './graph'
import pineconeVectorStore from './context/pinecone'


export const runtime = 'edge'
export const maxDuration = 200

let trial = {}

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`
}

export async function POST(req: any, res: any) {

  const body = await req.json()
  console.log('body in route.ts => ', body)

  // === Early quota check =============================================
  try {
    const userIdentifier = body.localStorage || null // null for anonymous/guest

    const quotaResp = await fetch(
      'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/introspect-ai/usage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdentifier })
      }
    )

    if (quotaResp.status === 200) {
      const quotaJson = await quotaResp.json()
      if (!quotaJson.allowed) {
        console.log('⛔️ quota exceeded', quotaJson)
        return new NextResponse(JSON.stringify(quotaJson), {
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      // attach usage info for downstream nodes if needed
      body.usage = quotaJson
    } else {
      console.warn('⚠️ quota endpoint non-200', quotaResp.status)
    }
  } catch (err) {
    console.error('quota check failed', err)
  }

  const messages = body.messages ?? []
  const formattedChatHistory = body.chatHistory ?? []
  const data = body.data ?? ''
  const lastMsg = messages[messages.length - 1].content
  const pineconeContext = await pineconeVectorStore(lastMsg);

  const requestId = body.requestId
  console.log('requestId:', requestId)

  const userEmail = body.localStorage
  console.log(`🐤 body.localStorage`, body.localStorage)
  

  const functionResult = await graph(
    lastMsg,
    messages,
    requestId,
    pineconeContext,
    userEmail
  )

  console.log('🦋 userEmail', userEmail)

  function getAIResponseContent(functionResult: any) {
    if (
      functionResult &&
      functionResult.chat_history &&
      functionResult.chat_history.length > 0
    ) {
      // Find the last AIMessage in the chat_history
      for (let i = functionResult.chat_history.length - 1; i >= 0; i--) {
        const message = functionResult.chat_history[i];
        if (message.lc_namespace.includes('langchain_core') && message.lc_kwargs.content) {
          return message.lc_kwargs.content;
        }
      }
    }
    return null;
  }

  
  
  const aiResponseContent = await getAIResponseContent(functionResult);
  console.log(aiResponseContent); 
      
  // console.log('**********', pineconeContext?.relevant_context_and_metadata)

  // return new NextResponse(JSON.stringify(pineconeContext?.relevant_context_and_metadata), {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })


  if (functionResult !== undefined && functionResult !== null) {
    console.log('functionResult:', functionResult)
    const jsonResponse = JSON.stringify(functionResult)
    console.log('jsonResponse:', jsonResponse)

    return new NextResponse(aiResponseContent, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } else {
    // Handle the case when fnResult is void
    return new NextResponse(null)
  }
}