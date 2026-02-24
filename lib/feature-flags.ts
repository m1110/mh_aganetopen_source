// Feature flag utilities for Introspect conversation system

export const isV2ConversationsEnabled = (): boolean => {
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    // For client-side, we can check localStorage or make an API call
    // For now, we'll use the environment variable
    return process.env.NEXT_PUBLIC_INTROSPECT_CONVERSATION_V2_ENABLED === 'true';
  }
  
  // For server-side, use the environment variable
  return process.env.INTROSPECT_CONVERSATION_V2_ENABLED === 'true';
};

export const getConversationVersion = (): 'v1' | 'v2' => {
  return isV2ConversationsEnabled() ? 'v2' : 'v1';
};

export const logFeatureFlagStatus = (): void => {
  const version = getConversationVersion();
  console.log(`🔧 Introspect Frontend - Using conversation version: ${version}`);
}; 