// Parallel API functions for Introspect conversation system

import { isV2ConversationsEnabled, logFeatureFlagStatus } from './feature-flags';

// Re-export for use in other components
export { isV2ConversationsEnabled } from './feature-flags';

const BACKEND_URL = 'https://guidelinebuddybackend-91e9844f3425.herokuapp.com';

export interface ConversationMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'function' | 'data' | 'system' | 'tool';
  createdAt?: Date;
  messageId?: string;
}

export interface Conversation {
  conversationId: string;
  messages: ConversationMessage[];
  createdAt?: Date;
  updatedAt?: Date;
  version?: string;
}

export interface AddChatResponse {
  msg: string;
  conversationId?: string;
  chat: ConversationMessage[];
  version?: string;
}

export interface GetMessagesResponse {
  conversations: Record<string, Conversation>;
  version?: string;
}

// V1 API Functions (existing)
export const addChatToFirebaseV1 = async (
  conversationId: string | undefined,
  userId: string,
  messages: ConversationMessage[]
): Promise<AddChatResponse> => {
  try {
    console.log('📡 V1 - Adding chat to Firebase');
    
    const response = await fetch(`${BACKEND_URL}/addChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        userId,
        newMessages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`V1 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ V1 - Chat added successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ V1 - Error adding chat:', error);
    throw error;
  }
};

export const getMessagesByUserV1 = async (userId: string): Promise<GetMessagesResponse> => {
  try {
    console.log('📡 V1 - Fetching messages by user');
    
    const response = await fetch(`${BACKEND_URL}/getMessagesByUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`V1 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ V1 - Messages fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ V1 - Error fetching messages:', error);
    throw error;
  }
};

// V2 API Functions (new)
export const addChatToFirebaseV2 = async (
  conversationId: string | undefined,
  userId: string,
  messages: ConversationMessage[]
): Promise<AddChatResponse> => {
  try {
    // console.log('📡 V2 - Adding chat to Firebase');
    
    const response = await fetch(`${BACKEND_URL}/addChatV2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        userId,
        newMessages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`V2 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ V2 - Chat added successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ V2 - Error adding chat:', error);
    throw error;
  }
};

export const getMessagesByUserV2 = async (userId: string): Promise<GetMessagesResponse> => {
  try {
    // console.log('📡 V2 - Fetching messages by user');
    
    const response = await fetch(`${BACKEND_URL}/getMessagesByUserV2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`V2 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ V2 - Messages fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ V2 - Error fetching messages:', error);
    throw error;
  }
};

// Smart API Functions (with fallback)
export const addChatToFirebase = async (
  conversationId: string | undefined,
  userId: string,
  messages: ConversationMessage[]
): Promise<AddChatResponse> => {
  logFeatureFlagStatus();
  
  if (isV2ConversationsEnabled()) {
    try {
      console.log('🔄 Using V2 conversation system');
      return await addChatToFirebaseV2(conversationId, userId, messages);
    } catch (v2Error) {
      console.warn('⚠️ V2 failed, falling back to V1:', v2Error);
      try {
        return await addChatToFirebaseV1(conversationId, userId, messages);
      } catch (v1Error) {
        console.error('❌ Both V1 and V2 failed:', v1Error);
        throw v1Error;
      }
    }
  } else {
    console.log('🔄 Using V1 conversation system');
    return await addChatToFirebaseV1(conversationId, userId, messages);
  }
};

export const getMessagesByUser = async (userId: string): Promise<GetMessagesResponse> => {
  logFeatureFlagStatus();
  
  if (isV2ConversationsEnabled()) {
    console.log('🔄 Using V2 conversation system with V1 merge');
    
    try {
      // Kick off both requests in parallel
      const [v2Result, v1Result] = await Promise.allSettled([
        getMessagesByUserV2(userId),
        getMessagesByUserV1(userId)
      ]);

      // Extract successful results (keep empty object on failure so merge still works)
      const v2Conversations =
        v2Result.status === 'fulfilled' ? v2Result.value.conversations || {} : {};
      const v1Conversations =
        v1Result.status === 'fulfilled' ? v1Result.value.conversations || {} : {};

      // Merge conversations, prioritizing V2 over V1 for duplicates
      const mergedConversations: Record<string, Conversation> = { ...v1Conversations, ...v2Conversations };

      console.log(`📊 Parallel merge complete: V1(${Object.keys(v1Conversations).length}) + V2(${Object.keys(v2Conversations).length}) ➜ ${Object.keys(mergedConversations).length} total`);

      if (Object.keys(mergedConversations).length === 0) {
        // No conversations anywhere – surface a 404-like error to caller
        throw new Error('No conversations found for this user');
      }

      return {
        conversations: mergedConversations,
        version: 'v2-parallel'
      };

    } catch (parallelError) {
      console.warn('⚠️ Parallel fetch failed, falling back to V1:', parallelError);
      try {
        return await getMessagesByUserV1(userId);
      } catch (v1Error) {
        console.error('❌ Both V1 and V2 failed:', v1Error);
        throw v1Error;
      }
    }
  } else {
    console.log('🔄 Using V1 conversation system');
    return await getMessagesByUserV1(userId);
  }
};

// New function to migrate a V1 conversation to V2
export const migrateConversationToV2 = async (
  conversationId: string,
  userId: string,
  messages: ConversationMessage[]
): Promise<AddChatResponse> => {
  console.log(`🔄 Migrating conversation ${conversationId} to V2`);
  
  try {
    // Save to V2 with the same conversation ID
    const response = await addChatToFirebaseV2(conversationId, userId, messages);
    console.log(`✅ Successfully migrated conversation ${conversationId} to V2`);
    return response;
  } catch (error) {
    console.error(`❌ Failed to migrate conversation ${conversationId} to V2:`, error);
    throw error;
  }
}; 