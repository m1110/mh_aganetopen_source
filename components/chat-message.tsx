// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import Image from 'next/image'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'

export interface ChatMessageProps {
  message: Message
  userImage?: string
}

export function ChatMessage({ message, userImage, ...props }: ChatMessageProps) {
  // Helper function to validate if the userImage is a valid URL
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    // Check if it's a valid URL and not just an ID
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      // If it's not a valid URL (like just an ID), return false
      return false;
    }
  };

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? (
          userImage && isValidImageUrl(userImage) ? (
            <Image
              src={userImage}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-md object-cover w-8 h-8"
            />
          ) : (
            <IconUser />
          )
        ) : (
          <Image
            src="https://stripe-camo.global.ssl.fastly.net/2602c0865c071384d056ccec257f10942041865c5dccdc5a32f3aae7b76e7c93/68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423859574e6a64463878516c6c784d464a4663585a52626e56326247395866475a7358327870646d56665231597a4f444275634856716430314a576c41784e5452585a4568314e454e31303050504b577241624a/6d65726368616e745f69643d616363745f314259713052457176516e75766c6f5726636c69656e743d5041594d454e545f50414745"
            alt="Assistant Avatar"
            width={16}
            height={16}
            className="rounded"
          />
        )}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
