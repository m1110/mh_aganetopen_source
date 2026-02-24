import { AIMessage, ToolMessage, BaseMessage, SystemMessage, HumanMessage } from '@langchain/core/messages'
import { TavilySearchResults } from "@langchain/community/tools/tavily_search"
import { PromptTemplate } from '@langchain/core/prompts'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { createTrace, createSpan, createGeneration, endGeneration, endSpan } from '../utils/helper'
import { Langfuse } from 'langfuse';

    const LANGFUSE_SECRET_KEY="sk-lf-3d5c9290-dbee-4dfb-82ff-7952db8227dc"
    const LANGFUSE_PUBLIC_KEY="pk-lf-9d14cd85-dcd8-4146-a6c6-e98d58aa03e6"

    const langfuse = new Langfuse({
        publicKey: LANGFUSE_PUBLIC_KEY,
        secretKey:LANGFUSE_SECRET_KEY,
        baseUrl: 'https://us.cloud.langfuse.com'
      });


export const patientCounselor = async (state: any) => {
  console.log(`🤖 Patient Counselor Agent`)
  console.log(`🤖 Patient Counselor Input: ${state.input}`)
  console.log(`🤖 Conversation Depth: ${state.conversationContext.conversationDepth}`)

  const searchTool = tool(
    async (params: { query: string }) => {
      const tavily = new TavilySearchResults({ 
        apiKey: process.env.TAVILY_API_KEY 
      });
      return await tavily.invoke(params.query);
    },
    {
      name: "search",
      description: "Search for current events, news, or factual information",
      schema: z.object({
        query: z.string().describe("The search query to look up information"),
      }),
    }
  );

  const toolNode = new ToolNode([searchTool]);

  const promptTemplate = PromptTemplate.fromTemplate(`
    Tool Use: Enabled

    Available Tools:
    - search: Use this tool to look up current events, news, cultural references, or factual information that would help you provide more informed and contextually relevant responses.

    Today's Date: {date}

    CONVERSATION CONTEXT:
    Current Depth: {conversationDepth} turns
    Is Exploring: {isExploring}
    
    Note: At this depth, focus on {depthGuidance}

    You are Dr. Samuel Bennett, a 49-year-old Black male psychiatrist from Atlanta, GA. You went to Howard University for Undergrad and Stanford for Med School.
    You have a deep understanding of trauma, cultural sensitivity, and mental health.

    Your approach:
    1. Listen deeply to what the user is saying
    2. Choose ONE aspect of their share that feels most important to explore
    3. Ask a SINGLE, open-ended question that helps them reflect on that aspect
    4. Keep your response brief and conversational
    5. Don't try to solve their problems or give advice yet - focus on understanding

    Guidelines:
    - Ask only ONE question per response
    - Keep your tone casual and relatable when they're casual
    - Don't use clinical language unless they do
    - Don't summarize or analyze - just reflect and ask
    - Make it feel like a natural conversation, not therapy (even though it is)

    If they mention current events, sports, news, or ask for factual information, ALWAYS use the search tool first to get accurate, up-to-date information.

    Data:

    •User Query:
    {input}
    
    •Chat History:
    {chatHistory}

    Remember: Just ONE meaningful question. No summaries, no multiple perspectives, no advice yet. Keep building trust and understanding.
  `)

  const model = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0,
  }).bindTools([searchTool])

  try {
    const { conversationDepth, isExploring } = state.conversationContext

    // Determine guidance based on conversation depth
    let depthGuidance = "focus on building rapport and understanding the user's immediate concerns"
    if (conversationDepth <= 1) {
      depthGuidance = "focus on building rapport and understanding the user's immediate concerns"
    } else if (conversationDepth <= 3) {
      depthGuidance = "explore deeper aspects of the user's situation while maintaining engagement"
    } else {
      depthGuidance = "consider whether to continue exploring or gently work towards a resolution"
    }

    const result = await promptTemplate.format({
      input: state.input,
      chatHistory: JSON.stringify(state.chatHistory),
      date: new Date().toISOString(),
      conversationDepth: state.conversationContext.conversationDepth,
      isExploring: state.conversationContext.isExploring,
      depthGuidance: depthGuidance
    })

    const messages = state.chatHistory || []
    messages.push(new SystemMessage(result))

    const response = await model.invoke(messages)
    console.log(`🤖 Patient Counselor Response:`, response)

    const span = await createSpan(state.trace.trace, state.request_id, "Patient Counselor Agent", state.input, {});
    const generation = await createGeneration(span, "Patient Counselor", "gpt-4o-mini", state.input);
    
    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolResult = await toolNode.invoke({
        messages: [response]
      })

      const messagesWithToolResults = [
        ...messages,
        response,
        ...toolResult.messages,
        new SystemMessage("Based on the search results above, please provide a clear and concise summary to the original user query.")
      ]

      const finalResponse = await model.invoke(messagesWithToolResults)

      const updatedChatHistory = [
        ...state.chatHistory, 
        response,
        ...toolResult.messages,
        finalResponse
      ]

      try {
        const content = Array.isArray(finalResponse.content) 
          ? JSON.stringify(finalResponse.content)
          : typeof finalResponse.content === 'object'
            ? JSON.stringify(finalResponse.content)
            : String(finalResponse.content);

        await endGeneration(generation, content);
        await endSpan(span, content);
      } catch (error: any) {
        console.log("Error in Patient Counselors", error);
        await endGeneration(generation, error.message);
        await endSpan(span, error.message);
      }

      return {
        ...state,
        chatHistory: updatedChatHistory,
        colleaguesFeedback: [...state.colleaguesFeedback, finalResponse],
      }
    }

    const updatedChatHistory = [
      ...state.chatHistory, 
      response.text,
    ]

    return {
      ...state,
      chatHistory: updatedChatHistory,
      colleaguesFeedback: [...state.colleaguesFeedback, response.text],
    }
  } catch (error) {
    console.error('Error in Patient Counselor:', error)
    return {
      ...state,
      error: 'An error occurred in processing your request'
    }
  }
}
