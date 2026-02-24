import { conversationLocatorChain } from "./conversationLocatorChain";
import { AIMessage } from '@langchain/core/messages'
// import io from 'socket.io-client'
// import { fireTraceEvent, fireTraceGenerationEnd } from '../../utils/helper'

export const conversationLocator = async (state: any) => {
    console.log(`🤖 Conversation Locator Agent`)

    const phrases = [
        "jumping on it...",
        "sure...let me look into that",
        "I'm all over it coach...",
        "looking coach...",
        "Let me take a deep dive into that..."
      ];

      // Step 2: Function to select a random phrase
      function getRandomPhrase() {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return phrases[randomIndex];
      }

      const environment = process.env.NEXT_PUBLIC_URL_BASE;
      const serverHref = `${environment}`;


    // const socket = io(serverHref, {
    //     transports: ['websocket'],
    //     withCredentials: true,
    // });

    // socket.on('connect', () => {
    //     console.log('Websocket ', socket.id, ' connected')
    //     // Emit an event to Assist JS
    //     socket.emit('serverEvent', {
    //         requestId: state.request_id,
    //         input: state.input,
    //         chatHistory: state.chatHistory,
    //         assistantMsg: getRandomPhrase(),
    //         updateType: 'replace'
    //     })
    // });

    // socket.on('reconnect', attempt => {
    //     console.log('Websocket ', socket.id, ' reconnected.')
    //     // Emit the event again on reconnect to ensure the latest message is sent
    //     socket.emit('serverEvent', {
    //         requestId: state.request_id,
    //         input: state.input,
    //         chatHistory: state.chatHistory,
    //         assistantMsg: getRandomPhrase(),
    //         updateType: 'replace'
    //     })
    // });

    // socket.on('disconnect', (reason, details) => {
    //   if (socket.active) {
    //     console.log('Websocket ', socket.id, ' disconnected : ', reason, '. Will try reconnect');
    //   } else {
    //     console.log('Websocket ', socket.id, ' disconnected : ', reason);
    //   }
    // });

    // const {generation, output} = await fireTraceEvent(
    //   state.request_id, 
    //   "Dev Team", 
    //   "metadata", 
    //   ["Conversation Stage Evaluator"], 
    //   "INFO", 
    //   "Analyzing Conversation Stage", 
    //   state.chatHistory[state.chatHistory.length - 1].lc_kwargs.content, 
    //   'output pending...',
    //   "🤖 Follow Up Agent",
    //   "gpt-4o-mini"
    // );

    const conversationLocator = await conversationLocatorChain.call({
        user_query: state.input,
        chat_history: JSON.stringify(state.chatHistory)

    });

    // await fireTraceGenerationEnd(generation, output);

    const conversationLocatorResult = conversationLocator.text
    const conversationLocatorMessage = new AIMessage(conversationLocatorResult);
    const updatedChatHistory = [...state.chatHistory, conversationLocatorMessage];


    

    return {
        ...state,
        chatHistory: updatedChatHistory,
      };
}