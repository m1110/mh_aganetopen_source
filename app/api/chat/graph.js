import {
  initializeAgentState,
  convertMessagesToBaseMessages
} from './utils'
import { createMainWorkflow } from './workflow'
import { MemorySaver } from '@langchain/langgraph';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { createTrace } from './utils/helper'

const graph = async (
  input,
  pastMessages,
  requestId,
  pineconeContext,
  userEmail
) => {
  
console.log('[ENTERED GRAPH]')
const chatHistory = convertMessagesToBaseMessages(pastMessages)
const memory = new MemorySaver();
console.log('MemorySaver instance:', memory);
const searchTool = new TavilySearchResults({ maxResults: 1 })

async function initializeTracing(input, user) {
  console.log({input})
  console.log({user})
  try {
    console.log('Attempting to create trace...');
    const trace = await createTrace(input, user, { }, ["Agent Trace"], requestId);
    
    if (!trace) {
      throw new Error('Trace creation failed: Returned undefined');
    }

    console.log('🙌 trace created!', trace)

  return { trace };
  } catch (error) {
    console.error('Error in tracecreation:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
}



let tracing = null;
  try {
    tracing = await initializeTracing(input, userEmail)
    // console.log('Tracing initialized:', tracing);
  } catch (error) {
    console.error('Failed to initialize tracing:', error);
    // Continue execution without tracing
  }

console.log('🎯 Input [GRAPH]:', input)
console.log('📜 Chat History [GRAPH]:', chatHistory)
console.log('🔑 Request ID [GRAPH]:', requestId)
console.log('📧 User Email [GRAPH]:', userEmail)
console.log('🔍 Tracing [GRAPH]:', JSON.stringify(tracing, null, 2))
const agentState = initializeAgentState(
  input,
  chatHistory,
  requestId,
  userEmail,
  tracing || JSON.stringify(tracing, null, 2)
)



const mainWorkflow = createMainWorkflow(agentState)

  try {
    const app = mainWorkflow.compile()

    const runnable = await app.invoke({
      input,
      chatHistory,
      pineconeContext
    })

    const rChatHistory = runnable.chatHistory

    const responseObject = {
      input,
      chat_history: rChatHistory,
      output: rChatHistory[rChatHistory.length - 1].lc_kwargs.content
    }

    console.log('responseObject:', responseObject.output)
    
    let jsonOutput

    try {
      jsonOutput = JSON.parse(responseObject.output)
    } catch (e) {
      return {
        input,
        chat_history: rChatHistory,
        request_id: requestId
      }
    }

    jsonOutput.request_id = requestId

    // const flaskAppDataResponse = await flaskAppCustomLLM(jsonOutput)
    // console.log('flaskAppDataResponse:', flaskAppDataResponse)

    return responseObject;

  } catch (error) {
    console.log('Error in workflow:', error)

    throw error
  }

}

export default graph