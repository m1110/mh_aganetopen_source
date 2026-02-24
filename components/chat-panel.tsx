import { type UseChatHelpers } from 'ai/react'
import { Modal, Button as GeistButton } from '@geist-ui/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { DataContext } from '@/context/DataContext'
import { useContext, useEffect, useState } from 'react'
// Correct the import path if necessary
import { useChatStore } from '../stores/chat' 
// import { textToSpeech, textToSpeechProxy } from '../lib/deepgramTTS'
// import { textToSpeechProxy } from '../lib/tts'
import { textToSpeechProxy } from '../lib/deepgramTTS'
import { createUniqueId } from '@/app/api/chat/utils/helper'
import { toast } from 'react-hot-toast'
import { addChatToFirebase as addChatToFirebaseAPI } from '../lib/conversation-api'




export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'setMessages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  setMessages,
}: ChatPanelProps) {

  const [ data, setData ] = useContext(DataContext);
  const { setIsLoading } = useChatStore()
  const [paywall, setPaywall] = useState<{visible:boolean; reason:'signup'|'payg'}>({visible:false, reason:'signup'})




  let hist: any;
    const sendMessageToAPI = async (newMessage: any) => {
        console.log('sending new message...')
        console.log({ newMessage })
        console.log({ hist })

        try {
            
            console.log(` before SET messages: `, messages )
            setMessages([...messages])
            console.log(` after SET messages`, messages)

            const searchParams = new URLSearchParams(window.location.search)
            setIsLoading(true)
            setMessages([...messages, newMessage])
            // console.log(`💎 messages: `, messages)
            // const response = await fetch('/api/vector/', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     messages: [...messages, newMessage],
            //     hist
            //   })
            // })
            // const res = await response.json();
            // console.log(`💎 res: `, res)
            // setIsLoading(false);

            // // Convert the response text to speech
            // console.log(`💎 res.content: `, res.content)

          

            await append(newMessage)
            .then( 
               async (result: any) => {
              console.log(`then() result: `, result)
              console.log(`then() messages: `, messages);
              console.log(`then() data: `, data)
              // const ttsUrl = await textToSpeech(result);
              // console.log(`💎 ttsUrl: `, ttsUrl)
              // const audio = new Audio(ttsUrl);
              // audio.play();
            })
            .catch((error: any) => {
              console.error(`Error in append:`, error);
            });

             // if results come back working use /add endpoint `https://guidelinebuddybackend-91e9844f3425.herokuapp.com/add`
            // await addNewMessagesToFirebase(newMessage)

        } catch (error) {
            console.error('Error sending message to API:', error);
        }
};


  const handleAppend = async (value: string) => {

    console.log(`1️⃣ data: `, data)


        const sendFunction = async (value: any) => {
            if(data.subscriptionType === "Standard" || data.subscriptionType === "Professional"){
                  try {
                    // manually sending it to /api/chat
                    const handleSend = (value: any) => {
                      const userMessage = { id: Date.now().toString(), content: value, role: 'user' };
                      sendMessageToAPI(userMessage);
                   };

                   console.log(`💎 data prior to handleSend(): `, data)
                   return handleSend(value)
                   
                  } catch (error) {
                    console.log(`message sent to agent error: `, error)
                  }
            }
        }

        let storageString = localStorage.getItem('userData');
        let storage = storageString ? JSON.parse(storageString) : {};
        storage = storage || {}
        let credits = storage.purse.trialCredits
        let newMsgs: any[]
        console.log(`💎 vercel messages: `, messages)

        await sendFunction(value)
}

const addChatToFirebase = async (conversationId: any, userId: any, messages: any) => {
  console.log('🔄 Adding chat to Firebase using parallel system');
  try {
      const responseData = await addChatToFirebaseAPI(conversationId, userId, messages);
      console.log('✅ Chat added to Firebase:', responseData);

      if (data.newConversation) {
        setData({ ...data, conversationId: responseData.conversationId, newConversation: false, messages: messages });
        
        // Update localStorage with the new conversation
        let existingData = localStorage.getItem('userData');
        let existingDataObject: any;
        if (existingData) {
          existingDataObject = JSON.parse(existingData);
        } else {
          existingDataObject = {};
        }

        const newConversation = {
          conversationId: responseData.conversationId,
          messages: messages
        };

        const updatedConversations = {
          ...existingDataObject.conversations,
          ...(responseData.conversationId ? { [responseData.conversationId]: newConversation } : {})
        };

        const newData = {
          ...existingDataObject,
          conversations: updatedConversations
        };

        localStorage.setItem('userData', JSON.stringify(newData));
      }
  } catch (error) {
      console.error('❌ Error adding chat to Firebase:', error);
      // Show user-friendly error message
      toast.error('Failed to save conversation. Please try again.');
  }
}

useEffect(() => {
      // console.log('Messages in ChatPanel:', messages)
}, [messages])

  // Stripe checkout helper (inside component)
  const handleCheckout = async (plan: 'pro' | 'payg') => {
    try {
      const uid = data?.userId ?? null
      const res = await fetch('https://guidelinebuddybackend-91e9844f3425.herokuapp.com/introspect/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: uid })
      })
      const json = await res.json()
      if (json.url) window.location.href = json.url
      else toast.error('Checkout error')
    } catch (err) {
      console.error(err)
      toast.error('Checkout error')
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              // await append({
              //   id,
              //   content: value,
              //   role: 'user'
              // }).then(async (result) => {
              //   console.log(`💎 result: `, result)
              //   console.log(`💎 messages: `, messages)
              //   console.log(`💎 data: `, data)
              // });
              let userMessage = {
                id: id || 'fallbackId',
                content: value,
                role: 'user' as 'user'
              }
              

              const newMessages = [...messages, userMessage]
              setMessages([...messages, userMessage])
              const reqId = await createUniqueId(16);
              console.log(`💎💎💎💎 reqId: `, reqId)
              
                let existingData = localStorage.getItem('userData')
                    let existingDataObject: any;
                    if(existingData){
                      existingDataObject = JSON.parse(existingData)
                    } else {
                      existingDataObject = {}
                    }
          
                    console.log(`LocalStorage - UseEffect`, existingDataObject.email)
                    
            

              const response = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  messages: [...messages, userMessage],
                  requestId: reqId,
                  localStorage: existingDataObject.userId,
                  audioConversation: data.audioConversation,
                }),
                // allow reading status for quota handling
              })

              if (response.status === 402) {
                try {
                  const quotaInfo = await response.json()
                  console.log('🚦 quota gate hit', quotaInfo)
                  if (quotaInfo.reason === 'signup' || quotaInfo.reason === 'payg') {
                    setPaywall({ visible: true, reason: quotaInfo.reason })
                  } else {
                    toast.error('Quota exceeded')
                  }
                } catch (err) {
                  console.error('error parsing quota json', err)
                }
                return
              }

              const res = await response.text()
              console.log(`💎💎💎💎 res: `, res)
              // 
              // await textToSpeech(res)

              try {
                const ttsUrl = await textToSpeechProxy(res);
                console.log(`💎 ttsUrl: `, ttsUrl);
                
                const audio = new Audio(ttsUrl);
                
                // Add event listeners for debugging
                audio.addEventListener('loadstart', () => console.log('Audio loading started'));
                audio.addEventListener('canplay', () => console.log('Audio can play'));
                audio.addEventListener('error', (e) => console.error('Audio error:', e));
                
                await audio.play();
                console.log('Audio playback started successfully');
              } catch (audioError) {
                console.error('Error with audio playback:', audioError);
                // Continue without audio - don't break the chat flow
              }

              let assistantMessage = {
                createdAt: new Date(),
                id: await createUniqueId(7),
                content: res,
                role: 'assistant' as 'assistant'
              }

              setMessages([...newMessages, assistantMessage]);
              // send messages to firebase
              console.log(`1. data.conversationId: `, data.conversationId)
              console.log(`2. data.userId: `, data.userId)
              console.log(`3. newMessages: `, [...newMessages, assistantMessage])
             return await addChatToFirebase(data.conversationId, data.userId, [...newMessages, assistantMessage])

            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>

      {/* Paywall Modal */}
      <Modal visible={paywall.visible} onClose={() => setPaywall(p => ({ ...p, visible: false }))} disableBackdropClick>
        <Modal.Title>
          {paywall.reason === 'signup' ? 'Daily Limit Reached' : 'Monthly Limit Reached'}
        </Modal.Title>
        <Modal.Subtitle>
          {paywall.reason === 'signup'
            ? 'Daily message limit reached (20/day). Subscribe for unlimited access or try again tomorrow.'
            : 'Continue with Pay-as-you-go billing to keep chatting.'}
        </Modal.Subtitle>
        <Modal.Content>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <GeistButton {...({ auto: true, type: 'success', placeholder: undefined, onClick: () => handleCheckout(paywall.reason === 'signup' ? 'pro' : 'payg') } as any)}>
                {paywall.reason === 'signup' ? 'Subscribe Now' : 'Enable PAYG'}
              </GeistButton>
              <GeistButton {...({ auto: true, type: 'secondary', placeholder: undefined, onClick: () => setPaywall(p => ({ ...p, visible: false })) } as any)}>
                Cancel
              </GeistButton>
          </div>
        </Modal.Content>
      </Modal>
    </div>
  )
}
