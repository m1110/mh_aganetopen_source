import { conversationLocator } from '../nodes/conversationLocator'
import { AIMessage } from '@langchain/core/messages'
import { bundleQueriesChain } from '../nodes/bundleQueriesChain'
// import { fireTraceEvent, fireTraceGenerationEnd } from '../../utils/helper'

export const bundleQueries = async (state: any) => {
  console.log(`🤖 bundleQueries Agent`)


//   const {generation, output} = await fireTraceEvent(
//     state.request_id, 
//     "Dev Team", 
//     {gender: state.gender, team_id: state.team_id, school: state.school}, 
//     ["ReQuery Agent"], 
//     "INFO", 
//     "reconstruct query after continuation", 
//     state.chatHistory[state.chatHistory.length - 1].lc_kwargs.content, 
//     'requerying pending...',
//     "🤖 ReQuery Agent",
//     "gpt-4o-mini"
// );

  const bundleQueries = await bundleQueriesChain.call({
    user_query: state.input,
    chat_history: JSON.stringify(state.chatHistory)
  })

//   await fireTraceGenerationEnd(generation, output)

  console.log(`🤖 bundleQueries Agent state.chatHistory[state.chatHistory.length - 1].lc_kwargs.content`, state.chatHistory[state.chatHistory.length - 1].lc_kwargs.content)

  
  const bundleQueriesResult = bundleQueries.text
  const bundleQueriesMessage = new AIMessage(bundleQueriesResult)
  const updatedChatHistory = [...state.chatHistory, bundleQueriesMessage]

  console.log(`🤖 bundleQueriesResult: `, bundleQueriesResult)

  return {
    ...state,
    chatHistory: updatedChatHistory,
    // followIterations: state.followIterations,
    bundle: bundleQueriesResult,
    // request_id: state.request_id,
  }
}
