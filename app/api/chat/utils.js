import {
  HumanMessage,
  AIMessage,
  SystemMessage
} from '@langchain/core/messages'
import { createUniqueId } from './utils/helper'

export function initializeAgentState(
  input,
  chatHistory,
  requestId,
  userEmail,
  tracing
) {
  console.log('🚀 === Initializing Agent State ===')
  console.log('📝 Input:', input)
  console.log('💬 Chat History:', chatHistory)
  console.log('🔑 Request ID:', requestId)
  console.log('🔍 Tracing:', JSON.stringify(tracing, null, 2))

  return {
    input: {
      value: (x, y) => y,
      default: () => input
    },
    chatHistory: {
      value: (x, y) => y,
      default: () => chatHistory
    },
    iterations: {
      value: (x, y) => y,
      default: () => 0
    },
    request_id: {
      value: () => requestId,
      default: () => requestId
    },
    colleaguesFeedback: {
      value: (x, y) => [y],
      default: () => []
    },
    audioConversation: {
      value: () => '',
      default: () => ''
    },
    user: {
      value: () => userEmail,
      default: () => userEmail
    },
    trace: {
      value: () => tracing,
      default: () => tracing
    },
    conversationContext: {
      value: (oldVal, newVal) => ({
        ...oldVal,
        ...newVal,
        conversationDepth: (oldVal?.conversationDepth || 0) + (newVal?.depthIncrement || 0),
        lastNodeVisited: newVal?.lastNodeVisited || oldVal?.lastNodeVisited,
        isExploring: newVal?.isExploring ?? oldVal?.isExploring,
        topicContext: newVal?.topicContext || oldVal?.topicContext || [],
        lastUpdateTime: newVal?.lastUpdateTime || new Date().toISOString()
      }),
      default: () => ({
        conversationDepth: chatHistory.length > 0 ? Math.floor(chatHistory.length / 2) : 0,
        lastNodeVisited: null,
        isExploring: true,
        topicContext: [],
        lastUpdateTime: new Date().toISOString()
      })
    }
  }
}


export function convertMessagesToBaseMessages(messages) {
  return messages.map(message => {
    switch (message.role) {
      case 'user':
      case 'human':
        return new HumanMessage({ content: message.content })
      case 'assistant':
        return new AIMessage({ content: message.content })
      case 'system':
        return new SystemMessage({ content: message.content })
      default:
        return new HumanMessage({ content: message.content })
    }
  })
}

export function formatDate() {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const dayOfWeek = dayNames[new Date().getDay()]
  const month = monthNames[new Date().getMonth()] // getMonth() returns a zero-based index
  const day = new Date().getDate()
  const year = new Date().getFullYear()

  return `${dayOfWeek} ${month} ${day}, ${year}`
}

export function formatTime() {
  let hours = new Date().getHours()
  const minutes = new Date().getMinutes()

  // Convert 24-hour time format to 12-hour format with AM/PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours === 0 ? 12 : hours // Convert 0 to 12 for 12 AM

  // Make sure minutes are two digits
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes

  return `${hours}:${minutesFormatted} ${amOrPm}`
}

export function appendToChatHistory(chatHistory, message) {
  const baseMessage = convertMessagesToBaseMessages([message])[0]
  chatHistory.push(baseMessage)
}
