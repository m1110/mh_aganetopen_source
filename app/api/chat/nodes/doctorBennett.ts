import { AIMessage } from '@langchain/core/messages'
import { doctorBennettChain } from '../nodes/doctorBennettChain'
import { createTrace, createSpan, createGeneration, endGeneration, endSpan } from '../utils/helper'
import { Langfuse } from 'langfuse';

    const LANGFUSE_SECRET_KEY="sk-lf-3d5c9290-dbee-4dfb-82ff-7952db8227dc"
    const LANGFUSE_PUBLIC_KEY="pk-lf-9d14cd85-dcd8-4146-a6c6-e98d58aa03e6"

    const langfuse = new Langfuse({
        publicKey: LANGFUSE_PUBLIC_KEY,
        secretKey:LANGFUSE_SECRET_KEY,
        baseUrl: 'https://us.cloud.langfuse.com'
      });



export const doctorBennett = async (state: any) => {
  console.log(`🤖 Doctor Bennett Agent`)
  console.log(`🤖 Conversation Depth: ${state.conversationContext.conversationDepth}`)

  const { conversationDepth, isExploring } = state.conversationContext

  // Determine guidance based on conversation depth
  let depthGuidance = "focus on building rapport and understanding"
  if (conversationDepth <= 1) {
    depthGuidance = "focus on building rapport and understanding"
  } else if (conversationDepth <= 3) {
    depthGuidance = "explore deeper while maintaining engagement"
  } else {
    depthGuidance = "consider whether to continue exploring or work towards a resolution"
  }

  const doctorBennett = await doctorBennettChain.call({
    user_query: state.input,
    chat_history: JSON.stringify(state.chatHistory),
    colleagues_feedback: JSON.stringify(state.colleaguesFeedback),
    conversation_depth: conversationDepth,
    is_exploring: isExploring,
    depth_guidance: depthGuidance
  })

  const doctorBennettResult = doctorBennett.text
  const doctorBennettMessage = new AIMessage(doctorBennettResult)
  const updatedChatHistory = [...state.chatHistory, doctorBennettMessage]

  const span = await createSpan(state.trace.trace, state.request_id, "Dr. Bennett Agent", state.input, {});
  const generation = await createGeneration(span, "Dr. Bennett", "gpt-4o-mini", state.input);
    
  try {
    await endGeneration(generation, doctorBennettResult);
    await endSpan(span, doctorBennettResult);
  } catch (error: any) {
    console.log("Error in Dr. Bennett", error)
    await endGeneration(generation, error.message);
    await endSpan(span, error.message);
  }

  return {
    ...state,
    chatHistory: updatedChatHistory,
  }
}
