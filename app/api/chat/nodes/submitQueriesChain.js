import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI, ChatOpenAI } from '@langchain/openai'
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const promptTemplate = PromptTemplate.fromTemplate(`
        The previous agent has shared conversation analysis. 
        It determined that this query is a new chain of thought. 

        User query:
        {user_query}

        Chat History:
        {chat_history}

        
        Simply return the original user query.

        Output in the following format:
        User Query: [query]
    
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

export const submitQueriesChain = new LLMChain({
  llm: model,
  prompt: promptTemplate
})
