import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI, ChatOpenAI } from '@langchain/openai'
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const graphDecisioning = async (state: any) => {
  console.log(`🏁 GRAPH DECISIONING => START`)

  const promptTemplate = PromptTemplate.fromTemplate(`
        Analyze the user query and chat history to identify whether the user is looking for a counseling conversation (maybe IFS related), or if the latest message is
        a comment, thought, or question which can be answered with general intelligence. 

        Consider the conversation depth and context:
        Current Depth: {conversationDepth}
        Last Node: {lastNodeVisited}
        Is Exploring: {isExploring}
        

    <COUNSOLING EXAMPLES>
        User: "sup"
        Rationale: Casual greeting that should start a counseling conversation.
        Analysis: Counseling

        User: "hey"
        Rationale: Casual greeting that should start a counseling conversation.
        Analysis: Counseling

        User: "what's up"
        Rationale: Casual greeting that should start a counseling conversation.
        Analysis: Counseling

        User: "I'm having a bad day"
        Rationale: Talking about a personal topic they'd like to explore.
        Analysis: Counseling

        User: "Why does she have a problem with me?"
        Rationale: Seems like something about an interpersonal relationship.
        Analysis: Counseling
    
        User: "How would you feel if I did that?"
        Rationale: This is a hypothetical scenario.
        Analysis: Counseling

        User: "When is a good time to talk?"
        Rationale: User wants to talk about something personal.
        Analysis: Counseling

        User: "Did you watch the game last night?"
        Rationale: User is engaging in small talk or casual conversation to get to know the counselor better.
        Analysis: Counseling
    </COUNSOLING EXAMPLES>

    <GENERAL INTELLIGENCE EXAMPLES>
        User: "Can you remember our conversation from last week?"
        Rationale: User is asking about a technical question.
        Analysis: General Intelligence

        User: "How does this work?"
        Rationale: User is asking about a technical question.
        Analysis: General Intelligence

        User: "Thanks"
        Rationale: This is indicating gratitude. Therefore, this can be responded to with general intelligence.
        Analysis: General Intelligence
    </GENERAL INTELLIGENCE EXAMPLES>


    <USER QUERY>
    {user_query}
    </USER QUERY>

    <CHAT HISTORY>
    {chatHistory}
    </CHAT HISTORY>

    Output format:
    [General Intelligence / Counseling / End]

    Note: Only output "End" if:
    1. The user explicitly indicates they want to end the conversation
    2. The conversation has reached a natural conclusion after at least 3 turns
    3. The user has said goodbye or thank you in a way that clearly indicates finality

    `)

  // Initialize the language model
  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
    verbose: false
  })

  // const geminiModel = new ChatGoogleGenerativeAI({
  //   model: 'gemini-pro',
  //   temperature: 0,
  //   verbose: false
  // })

  // Create the LLM chain
  // @ts-ignore
  const graphDecisioningChain = new LLMChain({
    llm: model as any,
    prompt: promptTemplate as any
  })

  const chatHistory = state.chatHistory
  const length = chatHistory.length
  const followUpResponse = chatHistory[length - 1].content

  const { conversationDepth, lastNodeVisited, isExploring } = state.conversationContext

  const analysisResult = await graphDecisioningChain.call({
    user_query: state.input,
    chatHistory: state.chatHistory,
    conversationDepth,
    lastNodeVisited,
    isExploring
  })

  const actionMatch = analysisResult.text.match(/\s*(\w+)/i)
  const action = actionMatch ? actionMatch[1] : 'counseling'

  console.log(`🏁 GRAPH DECISIONING => Action: `, action)
  console.log(`🏁 GRAPH DECISIONING => Depth: `, conversationDepth)

  // Update conversation context
  const contextUpdate = {
    depthIncrement: 1,
    lastNodeVisited: action,
    isExploring: true,
    lastUpdateTime: new Date().toISOString()
  }

  // Don't increment depth for quick acknowledgements
  if (state.input.toLowerCase().match(/^(thanks|thank you|ok|got it|bye|goodbye)$/)) {
    contextUpdate.depthIncrement = 0
  }

  // Update the state with new context
  state.conversationContext = {
    ...state.conversationContext,
    ...contextUpdate
  }

  const updatedDepth = state.conversationContext.conversationDepth + contextUpdate.depthIncrement
  console.log(`🏁 GRAPH DECISIONING => Updated Depth: `, updatedDepth)

  // Determine if we should continue exploring
  if (updatedDepth < 3 || state.conversationContext.isExploring) {
    if (action === 'Counseling') {
      console.log(`👩‍💻 GRAPH DECISIONING AGENT: => COUNSELING`)
      return 'patientCounselor'
    } else if (
      action === 'General Intelligence' ||
      action === 'General' ||
      action === 'Intelligence'
    ) {
      console.log(`👩‍💻 GRAPH DECISIONING AGENT: => GENERAL INTELLIGENCE`)
      return 'generalIntelligence'
    }
  }

  // Only end if we've had enough depth or user explicitly wants to end
  if (
    action === 'End' && 
    (updatedDepth >= 3 || state.input.toLowerCase().match(/^(bye|goodbye|thank|thanks|that's all)$/))
  ) {
    console.log(`👋 GRAPH DECISIONING AGENT: => END`)
    state.conversationContext.isExploring = false
    return 'end'
  }

  // Default to continuing the conversation
  return lastNodeVisited === 'Counseling' ? 'patientCounselor' : 'generalIntelligence'
}