import { create, StateCreator } from 'zustand'
import { Message } from 'ai'

interface Chat {
  requestId: string | null
  question: string | null
  answer: string | null
  chatId: string | null
}

interface ChatState {
  requestId: string | null
  isLoading: boolean
  messages: Message[]
  chats: Chat[]
  addChat: (chat: {
    chatId: any
    question: any
    answer: any
    requestId: string
  }) => void
  setIsLoading: (status: boolean) => void
  setMessages: (messages: Message[]) => void
}

export const useChatStore = create<ChatState>((set, get, api) => ({
  requestId: null,
  isLoading: false,
  messages: [],
  chats: [],

  setIsLoading: (status: boolean) => set({ isLoading: status }),
  setMessages: (messages: Message[]) => set({ messages }),
  addChat: (chat: Chat) =>
    set((state: ChatState) => ({
      chats: [...state.chats, chat]
    }))
}))
