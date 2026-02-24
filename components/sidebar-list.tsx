"use client"

import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { DataContext } from '../context/DataContext'
import { useContext, useEffect, useState } from 'react'
import { useChat } from 'ai/react'

export interface SidebarListProps {
  userId?: string;
}

export function SidebarList({ userId }: SidebarListProps) {
  const [_data, _setData] = useState<any>(null);
  const [data, setData] = useContext(DataContext);
  const { messages, setMessages, append } = useChat({
    initialMessages: [],
    id: 'chat-id',
    onResponse(response) {
      if (response.status === 401) {
        console.error(response.statusText)
      }
    }
  })

  useEffect(() => {
    // fetch conversations from localStorage
    const localData = localStorage.getItem('userData');
    const parsedData = JSON.parse(localData || '{}');
    _setData(parsedData);

  }, []);

  const handleRemoveChat = (conversationId: string) => {
    const updatedData = { ..._data };
    delete updatedData.conversations[conversationId];
    _setData(updatedData);
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };

  const conversationsArray = _data ? Object.values(_data.conversations || {}) : [];

  // Sort conversations by the timestamp of the last message
  const sortedConversations = conversationsArray.sort((a: any, b: any) => {
    const lastMessageA = a.messages[a.messages.length - 1];
    const lastMessageB = b.messages[b.messages.length - 1];
    return new Date(lastMessageB.createdAt).getTime() - new Date(lastMessageA.createdAt).getTime();
  });

  return (
    <div className="flex-1 overflow-auto bg-background text-xs"> {/* Added text-xs class */}
      {sortedConversations.length ? (
        <div className="space-y-2 px-2">
          {sortedConversations.map((chat: any) => {
            return (
              <SidebarItem
                key={chat.conversationId}
                chat={chat}
                setMessages={setMessages}
                messages={messages}
                onRemove={handleRemoveChat} // Pass the remove handler
              >
                <SidebarActions
                  chat={chat.messages[chat.messages.length - 1].content}
                  removeChat={removeChat}
                  shareChat={shareChat}
                />
              </SidebarItem>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">No chat history</p>
        </div>
      )}
    </div>
  )
}
