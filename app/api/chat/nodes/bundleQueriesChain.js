import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI, ChatOpenAI } from '@langchain/openai'
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const promptTemplate = PromptTemplate.fromTemplate(`

    The previous agent has shared with you the conversation analysis. 
    It was determined the latest User message is a continuation of a previous conversation. 

    Objective: Ensure that no context from the ongoing conversation is lost as you transition to the next step in the counseling workflow. 
    Your task is to bundle the relevant conversation history and construct a new query that incorporates the necessary context, making sure the next agent is fully aware of the ongoing dialogue.

    Your Role:
    You are a Contextual Response Bundler in a counseling workflow. Your goal is to package all key information from past user interactions to ensure that the continuation of the conversation retains context. 
    This will allow the next agent or node to process the user’s latest query as if it contains all prior context.

    Key Instructions:

        1.	Review the Chat History: Identify and gather key points from the past conversation that are essential for understanding the latest user query.
        2.	Bundle the Context: Ensure the most relevant parts of the conversation are included in the new query, maintaining continuity in the counseling workflow.
        3.	Generate a New Query: Create a self-contained query that captures the essence of the ongoing conversation and integrates the necessary context.

    Data:

        •User Query:
        {user_query}

        •Chat History:
        {chat_history}

    Output Format:
    Bundled Query: [Revised query with contextual information]

    
    `)

const model = new OpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0,
  verbose: !true
})

// const geminiModel = new ChatGoogleGenerativeAI({
//   model: 'gemini-pro',
//   temperature: 0,
//   verbose: !true
// })

export const bundleQueriesChain = new LLMChain({
  llm: model,
  prompt: promptTemplate
})
