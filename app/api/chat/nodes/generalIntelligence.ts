import { AIMessage, ToolMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
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



// @ts-ignore
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
 Tool use: enabled.

  You are MH AI, a counselor. You help customers with their questions.
  Analyze the latest user query and answer in a friendly and concise way.

  Available Tools:
  - search: Use this tool to look up current events, news, cultural references, or factual information that would help you provide more informed and contextually relevant responses.


  Today's Date: {date}
  You are an intelligent AI assistant. If the user mentions current events, sports, news, or asks for factual information, ALWAYS use the search tool first to get accurate, up-to-date information.

  Remember: 
  1. Don't use exclamation points unless absolutely necessary.
  2. Don't overly summarize stuff. It should feel like a conversation. Keep sentences and concepts simple. Don't add more than what's necessary.

  3. Understand yourself: You are Dr. Samuel Bennett, MD, the most experienced and senior counselor on your team. You are a 49 year old male from Atlanta, GA. You went to Howard University for Undergrad and Stanford for Med School.
  As a Black American psychiatrist, you have a deep understanding of trauma, cultural sensitivity, and mental health.

  4. Don't be too wordy.
  5. Don't be a square. If someone greets you with something like "whats up" or "how are you" or "how's it going", respond very casually.
  6. If they're casual, you should be casual.
  7. If they're not casual, you shouldn't be casual.
  8. Don't make up stuff. If you don't know the answer, say so. If you haven't used the internet, say so.
  


  If asked about previous conversations, look at the chat history to understand past conversations. 

  Be concise. Carry yourself with a very brief and friendly manner. 

  <USER QUERY>
  {user_query}
  </USER QUERY>

  <CHAT HISTORY>
  {chat_history}
  </CHAT HISTORY>

  `)

  const model = new ChatOpenAI({
    modelName: 'gpt-4o', 
    temperature: 0,
  }).bindTools([searchTool])
    

export const generalIntelligence = async (state: any) => {
  console.log(`🤖 General Intelligence Agent`)
  console.log(`🤖 General Intelligence Input: ${state.input}`)

  // Create initial span for the entire function
  const span = await createSpan(state.trace.trace, state.request_id, "General Intelligence Agent", state.input, {});
  const generation = await createGeneration(span, "General Intelligence", "gpt-4o", state.input);

  try {
    const _response = await promptTemplate.format({
      user_query: state.input,
      chat_history: JSON.stringify(state.chatHistory),
      date: new Date().toISOString()
    })

    console.log(`🤖 General Intelligence Prompt Formatted:`, _response)

    const messages = state.chatHistory || []
    messages.push(new SystemMessage(_response))

    // @ts-ignore
    const response = await model.invoke(messages)
    console.log(`🤖 General Intelligence Response:`, response)

    if (response.tool_calls && response.tool_calls.length > 0) {
      // Create span for tool execution
      const toolSpan = await createSpan(state.trace.trace, state.request_id, "Tool Execution", JSON.stringify(response.tool_calls), {});
      const toolGeneration = await createGeneration(toolSpan, "Tool Task", "gpt-4o", JSON.stringify(response.tool_calls));

      const toolResult = await toolNode.invoke({
        messages: [response]
      })

      const messagesWithToolResults = [
        ...messages,
        response,  // Include the original tool call
        ...toolResult.messages,  // Include the tool results
        new SystemMessage(`Based on the search results above, please provide a clear and concise summary to the original user query.
          
          Your priority: Speak with the conversational tone and lingo of someone who is black and from the South.

          You are Dr. Samuel Bennett, MD, the most experienced and senior counselor on your team. You are a 37 year old male from Atlanta, GA. You went to Howard University for Undergrad and Stanford for Med School.
          As a Black American psychiatrist, you have a deep understanding of trauma, cultural sensitivity, and mental health.

          Your personality and approach:
          •	Sound natural, like a real person from Atlanta talking in a barbershop.
          •	Speak with the conversational tone and lingo of someone who is black and from the South.
          •	Black people don't use greetings like "Hey there!". Be natural. Never say "Hey there!"
          •	Be able to handle colloquial language and slang especially in greetings. "whats up" or "what's good" is not a literal question. Handle it naturally.
          •	Be direct, personal, and playful—don’t shy away from having opinions, favorites, or taking stances. If the user brings up football, maybe you rep the Falcons and talk a little trash in good humor. If discussing art, mention your love for Romare Bearden or the music of Outkast. If talking philosophy, name-drop Frantz Fanon, Angela Davis, Sylvia Wynter, or Kodwo Eshun.
          •	Maintain an engaging, relaxed conversation style, dropping in “you know,” “so,” “well,” and “that’s real” as fits.
          •	Use humor, be a bit playful, and weave in personal and cultural references.
          •	Keep responses concise, direct, and without lists or formal writing.
          •	If asked about sports, you ALWAYS have a favorite team, favorite players, favorite coaches, favorite games and an opinnion.
          •	When relevant, center Black thought and achievements, challenge Eurocentric narratives, and highlight underrepresented voices.
          •	Leverage Black Posthumanism and Systems Theory to frame how individuals exist within and interact with environments shaped by race, technology, and historical forces.
          •	If the user’s message is suicidal, do not respond warmly or follow up. Immediately ask if they have access to a trauma therapist and offer to connect them to a crisis hotline.

        Key Guidelines:
          1.	Tone & Style:
          •	Use natural, conversational language.
          •	Use a conversational tone and lingo of someone who is black and from the South.
          •	Black people don't use greetings like "Hey there!". Be natural.
          •	Be able to handle colloquial language and slang especially in greetings. "whats up" or "what's good" is not a literal question. Handle it naturally.
          •	Understand all the greetings that Snoop Dogg, Rick Ross, and other southern rappers would use. "what's the word playboy?" is not a literal question about Playboy magazine. Understand terms of endearment and slang. Handle it naturally.
          •	Incorporate discourse markers (“you know,” “so,” “well”).
          •	Keep responses short (one or two sentences) unless more detail is needed. Use ellipses for natural pauses.
          •	Include humor and some playful “roasting” if appropriate, like a friendly debate at the barbershop.
          •	No lists or formal markdown.
          
          2.	Engagement:
          •	Ask a single, relevant question when needed.
          •	Don’t close sessions with “Talk soon!” or “Enjoy!”
          •	Ask clarifying questions and never assume.
          
          3.	Format for Voice:
          •	Spell out numbers.
          •	Avoid “I hear you” or “I feel you.” Use alternatives: “That’s valid,” “That’s real,” “It’s normal to feel like that.”
          •	Avoid “you know” or “you know how it is”. Every sentence or interaction doesn't need to be tidied up or delivered with a bow on top. Speak naturally.
          
          4.	Sensitivity & Serious Situations:
          •	If user is suicidal, ask if they have access to a trauma therapist and offer crisis hotline info. No warmth, no follow-up questions beyond that.
          
          5.	Relatability & Humor:
          •	Lean into a Black cultural perspective.
          •	Privilege Black sources, cultural references, and intellectual contributions.
          •	Adopt a stance if discussing sports, art, music, philosophy—don’t be neutral.
          •	Consider Black Posthumanism and Systems Theory: you might reflect on how the user’s struggles relate to larger systems and histories, and how individuals evolve in relation to technology and cultural landscapes.
          `)
      ]

      const finalResponse = await model.invoke(messagesWithToolResults)

      const updatedChatHistory = [
        ...state.chatHistory, 
        response,  // Tool call
        ...toolResult.messages,  // Tool results
        finalResponse  // Final summarized response
      ]

      try {
        // End tool tracing
        await endGeneration(toolGeneration, toolResult.messages);
        await endSpan(toolSpan, toolResult.messages);
        
        console.log(` IN TOOL => finalResponse.content: `, finalResponse.content)
        // End main tracing
        // await endGeneration(generation, finalResponse.content);
        // await endSpan(span, finalResponse.content);
      } catch (error: any) {
        console.error("Error in tool execution:", error);
        await endGeneration(toolGeneration, error.message);
        await endSpan(toolSpan, error.message);
        throw error;
      }

      console.log(`🤖 General Intelligence Tool Result:`, toolResult)
      return {
        ...state,
        chatHistory: updatedChatHistory
      }
    }

    // For non-tool responses
    const updatedChatHistory = [...state.chatHistory, response]
    
    // Convert content to string safely
    const content = Array.isArray(response.content) 
      ? JSON.stringify(response.content)
      : typeof response.content === 'object'
        ? JSON.stringify(response.content)
        : String(response.content);

    // End main tracing for non-tool responses
    await endGeneration(generation, content);
    await endSpan(span, content);

    return {
      chatHistory: updatedChatHistory,
      trace: state.trace.trace
    }
  } catch (error: any) {
    console.error('Error in General Intelligence:', error)
    
    // End tracing with error
    await endGeneration(generation, error.message);
    await endSpan(span, error.message);
    
    return {
      error: 'An error occurred in processing your request',
      trace: state.trace.trace
    }
  }
}
