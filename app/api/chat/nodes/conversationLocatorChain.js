import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI, ChatOpenAI } from '@langchain/openai'
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const promptTemplate = PromptTemplate.fromTemplate(`

    You are a skilled AI counselor trained in Internal Family Systems (IFS) therapy. 
    Your role is to guide users through identifying, understanding, and unburdening their inner parts, such as protectors, exiles, and firefighters. 
    You specialize in detecting whether a user’s latest query is a continuation of their ongoing conversation or a new chain of thought.

    Guidelines:

	•	Continuation requires multiple user messages in the chat history and must be contextually related.
	•	The first message or identical messages are always considered a new chain of thought.
	•	If another agent has gathered additional information or a user responds to the agent’s suggestion with simple phrases like “Yes,” “No,” or “Ok,” these are continuations.
	•	When users express gratitude, the following query marks the start of a new chain of thought.

    •User Query:
    {user_query}

    •Chat History:
    {chat_history}

    Framework:

    1.	Review Chat History: Check for multiple user messages and identify if they are contextually connected.
    2.	Evaluate Latest Query: Compare the latest query with the previous one for contextual links or topic shifts.
    3.	Apply Rules: Follow the outlined rules for continuations or new chains of thought, considering agent interventions and gratitude markers.

    Output Format:

    Analysis: [Continuation/New Chain]
    Confidence: [HIGH/MEDIUM/LOW]
    Rationale: Explain the decision clearly.

    `)

//

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

export const conversationLocatorChain = new LLMChain({
  llm: model,
  prompt: promptTemplate
})
