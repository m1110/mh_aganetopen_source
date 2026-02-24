import { AIMessage } from '@langchain/core/messages'
import { submitQueriesChain } from '../nodes/submitQueriesChain'

export const submitQueries = async (state: any) => {
  console.log(`🤖 Submit Queries Agent`)

  const submitQueries = await submitQueriesChain.call({
    user_query: state.input,
    chat_history: JSON.stringify(state.chatHistory)
  })

  const submitQueriesResult = submitQueries.text
  const submitQueriesMessage = new AIMessage(submitQueriesResult)
  const updatedChatHistory = [...state.chatHistory, submitQueriesMessage]

  return {
    ...state,
    chatHistory: updatedChatHistory,
    // followIterations: state.followIterations,
    // request_id: state.request_id,
  }
}
