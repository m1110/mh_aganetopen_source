// Migration utilities for Introspect conversation system

import { getMessagesByUserV1, getMessagesByUserV2 } from './conversation-api';

export interface MigrationStats {
  totalUsers: number;
  migratedUsers: number;
  failedUsers: number;
  totalConversations: number;
  migratedConversations: number;
  failedConversations: number;
}

export interface ConversationComparison {
  conversationId: string;
  v1MessageCount: number;
  v2MessageCount: number;
  v1LastMessage?: string;
  v2LastMessage?: string;
  isConsistent: boolean;
  differences: string[];
}

export const compareConversationData = async (userId: string): Promise<ConversationComparison[]> => {
  const comparisons: ConversationComparison[] = [];
  
  try {
    // Fetch data from both systems
    const v1Data = await getMessagesByUserV1(userId);
    const v2Data = await getMessagesByUserV2(userId);
    
    const v1Conversations = v1Data.conversations || {};
    const v2Conversations = v2Data.conversations || {};
    
    // Get all unique conversation IDs
    const allConversationIds = Array.from(new Set([
      ...Object.keys(v1Conversations),
      ...Object.keys(v2Conversations)
    ]));
    
    for (const conversationId of allConversationIds) {
      const v1Conversation = v1Conversations[conversationId];
      const v2Conversation = v2Conversations[conversationId];
      
      const v1MessageCount = v1Conversation?.messages?.length || 0;
      const v2MessageCount = v2Conversation?.messages?.length || 0;
      const v1LastMessage = v1Conversation?.messages?.[v1MessageCount - 1]?.content;
      const v2LastMessage = v2Conversation?.messages?.[v2MessageCount - 1]?.content;
      
      const differences: string[] = [];
      
      if (v1MessageCount !== v2MessageCount) {
        differences.push(`Message count mismatch: V1=${v1MessageCount}, V2=${v2MessageCount}`);
      }
      
      if (v1LastMessage !== v2LastMessage) {
        differences.push(`Last message mismatch: V1="${v1LastMessage}", V2="${v2LastMessage}"`);
      }
      
      const isConsistent = differences.length === 0;
      
      comparisons.push({
        conversationId,
        v1MessageCount,
        v2MessageCount,
        v1LastMessage,
        v2LastMessage,
        isConsistent,
        differences
      });
    }
    
    return comparisons;
  } catch (error) {
    console.error('Error comparing conversation data:', error);
    throw error;
  }
};

export const validateUserData = async (userId: string): Promise<{
  isValid: boolean;
  issues: string[];
  stats: {
    v1Conversations: number;
    v2Conversations: number;
    consistentConversations: number;
  };
}> => {
  try {
    const comparisons = await compareConversationData(userId);
    
    const issues: string[] = [];
    let consistentConversations = 0;
    
    for (const comparison of comparisons) {
      if (!comparison.isConsistent) {
        issues.push(`Conversation ${comparison.conversationId}: ${comparison.differences.join(', ')}`);
      } else {
        consistentConversations++;
      }
    }
    
    const v1Conversations = comparisons.filter(c => c.v1MessageCount > 0).length;
    const v2Conversations = comparisons.filter(c => c.v2MessageCount > 0).length;
    
    return {
      isValid: issues.length === 0,
      issues,
      stats: {
        v1Conversations,
        v2Conversations,
        consistentConversations
      }
    };
  } catch (error) {
    console.error('Error validating user data:', error);
    return {
      isValid: false,
      issues: [`Validation error: ${error}`],
      stats: {
        v1Conversations: 0,
        v2Conversations: 0,
        consistentConversations: 0
      }
    };
  }
};

export const logMigrationStatus = (userId: string): void => {
  console.log(`🔍 Migration Status Check for User: ${userId}`);
  validateUserData(userId)
    .then(result => {
      console.log(`📊 Validation Results:`, result);
      if (!result.isValid) {
        console.warn(`⚠️ Issues found:`, result.issues);
      } else {
        console.log(`✅ All conversations are consistent`);
      }
    })
    .catch(error => {
      console.error(`❌ Migration status check failed:`, error);
    });
}; 