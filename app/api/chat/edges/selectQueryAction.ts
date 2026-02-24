import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { OpenAI, ChatOpenAI } from '@langchain/openai'
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

export const selectQueryAction = async (state: any) => {
  console.log(`🏁 selectQueryAction`)

  // Define the prompt template
  const promptTemplate = PromptTemplate.fromTemplate(`
        Analyze the following response and determine the appropriate action to take:

        Response:
        {conversation_locator}

        Based on the analysis, return one of the following actions:
        - bundleQueries
        - submitQuery
        - conversationLocator

        If the confidence is high and it's a continuation, return bundleQueries.
        If the confidence is high and it's a new chain-of-thought, return submitQuery.
        If the confidence is low, return conversationLocator.

        Output in the following format:
        Action: [action]
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
  const selectQueryActionChain = new LLMChain({
    llm: model as any,
    prompt: promptTemplate as any
  })

  const chatHistory = state.chatHistory
  const length = chatHistory.length
  const conversationLocatorResponse = chatHistory[length - 1].content
  // console.log(`🏁 QUERYMARSHALL AGENT: => followUpResponse: `, followUpResponse);

  // Call the language model to analyze the follow-up response
  const analysisResult = await selectQueryActionChain.call({
    conversation_locator: conversationLocatorResponse
  })

  // Extract the action from the language model's response
  const actionMatch = analysisResult.text.match(/Action:\s*(\w+)/i)
  const action = actionMatch ? actionMatch[1] : 'conversationLocator'

  console.log(`🏁 SELECTQUERYACTION => Action: `, action)

  const iterations = state.followIterations

  // Determine the next step based on the action and number of iterations
  if (action === 'bundleQueries') {
    console.log(
      `🏁 SELECTQUERYACTION AGENT: => NEED TO BUNDLE AND REWRITE QUERY. \n USE => bundleQueries \n Confidence High => END`
    )
    return 'bundleQueries'
  } else if (action === 'submitQuery') {
    console.log(
      `🏁 SELECTQUERYACTION AGENT: => QUERY VALIDATED. \n USE => submitQuery \n Confidence High => END`
    )
    return 'submitQuery'
  } else if (action === 'conversationLocator') {
    console.log(
      `🏁 SELECTQUERYACTION AGENT: => RELOOP.  HAVING HARD TIME UNDERSTANDING. \n Use => conversationLocator \n Confidence Low => END`
    )
    return 'conversationLocator'
  } else {
    console.log(`🏁 SELECTQUERYACTION AGENT => defaulting to conversationLocator => END`)
    return 'conversationLocator'
  }
}
