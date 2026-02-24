'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState, useContext, useEffect, useCallback } from 'react'
import { Modal, Text, Button as GeistButton } from '@geist-ui/react';
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { DataContext } from '../context/DataContext';
import { SidebarList } from './sidebar-list'
import { Sidebar } from './sidebar'
import { SidebarFooter } from './sidebar-footer'
import { ClearHistory } from './clear-history'
import { ThemeToggle } from './theme-toggle'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { getMessagesByUser } from '../lib/conversation-api'



const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

interface ExtendedButtonProps extends React.ComponentProps<typeof GeistButton> {
  css?: any;
}

const ExtendedButton: React.FC<ExtendedButtonProps> = (props) => {
  return <GeistButton {...props} />;
}


export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [data, setData]= useContext(DataContext)
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const [queryParams, setQueryParams] = useState<any>({});
  const [queryStringKeys, setQueryStringKeys] = useState<any>({});
  const [updatedUserConversations, setUpdatedUserConversations] = useState<boolean>(false)
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [localStorageUser, setLocalStorageUser] = useState(null)

  
  const { messages, append, reload, stop, isLoading, input, setInput, setMessages } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken,
        data,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })

    useEffect(() => {
      let existingData = localStorage.getItem('userData')
          let existingDataObject: any;
          if(existingData){
            existingDataObject = JSON.parse(existingData)
          } else {
            existingDataObject = {}
          }

          console.log(`LocalStorage - UseEffect`, existingDataObject)
          setLocalStorageUser(existingDataObject)
    }, [])

    const handleGetChats = useCallback(async () => {
      if (typeof window === 'undefined') return;

      // Only fetch conversations if we have a valid userId
      if (!data?.userId) {
        console.log('No userId available, skipping conversation fetch');
        return;
      }

      const updateLocal = async (conversations: any) => {
        let existingData = localStorage.getItem('userData')
        let existingDataObject: any;
        if(existingData){
          existingDataObject = JSON.parse(existingData)
        } else {
          existingDataObject = {}
        }

        console.log(`localData`, existingDataObject)
        const newData = {
            ...existingDataObject,
            conversations: conversations,
        };
        localStorage.setItem('userData', JSON.stringify(newData));
        const updatedData = localStorage.getItem('userData')
        let updated: any;
        if(updatedData){
          updated = JSON.parse(updatedData)
        }else {
          updated = {}
        }
      }

      let _localUserData: any = localStorage.getItem('userData')
      let localUserData =  _localUserData ? JSON.parse(_localUserData) : null
      console.log(`localUserData`, localUserData)
      
      // Check if we have a valid userId in localStorage
      if(localUserData?.userId){
        try {
          console.log('🔄 Fetching conversations using parallel system');
          const body = await getMessagesByUser(localUserData?.userId);
          const conversations = body.conversations;
          console.log(`✅ Conversations fetched successfully`);

          setUpdatedUserConversations(true);
          return updateLocal(conversations);
        } catch (error) {
          console.error('❌ Error fetching conversations:', error);
          toast.error('Failed to load conversations. Please refresh the page.');
        }
      } else {
        console.log(`no user id`);
      }
    }, [data?.userId]);


    const handleButtonClick = async () => {
      const handleRedirect = async () => {

        const introspectCallbackLink = async () => {
          if( window.location.origin === 'http://localhost:3001' ) {
            return `http://localhost:3001/callback`
          } else {
            return `https://introspect-puce.vercel.app/callback`
          }
        }
  
        const callbackLink = await introspectCallbackLink()
          
          return setTimeout(() => {
            const stateData = {
                apiKey: process.env.NEXT_PUBLIC_firebase_api_key,
                orgId: '1'
              };
              const stateString = JSON.stringify(stateData);
              window.location.href = window.location.origin === 'http://localhost:3000' ? `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.labels%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20&response_type=code&client_id=462950416408-1plgg3tn3jf10mp2uu45tfpk354ulmkc.apps.googleusercontent.com&redirect_uri=${window.location.origin}/callback&flowName=GeneralOAuthFlow` : `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.labels%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20&response_type=code&client_id=462950416408-1plgg3tn3jf10mp2uu45tfpk354ulmkc.apps.googleusercontent.com&redirect_uri=${window.location.origin}/callback&flowName=GeneralOAuthFlow`
        }, 200);
        }

        await handleRedirect()
    }

    const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null
    const userDataObj = userData ? JSON.parse(userData) : null
    const usersId = userDataObj ? userDataObj.userId : null

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('userData')
        const userDataObj = userData ? JSON.parse(userData) : null
        
        if (userDataObj) {
          console.log('🔄 Loading user data into DataContext:', userDataObj);
          
          // Load all user data into DataContext
          setData({
            ...data,
            userId: userDataObj.userId,
            email: userDataObj.email,
            name: userDataObj.name,
            familyName: userDataObj.familyName,
            image: userDataObj.image,
            subscriptionType: userDataObj.subscriptionType,
            subscriptionId: userDataObj.subscriptionId,
            purseId: userDataObj.purseId,
            socialId: userDataObj.socialId,
            lastChatId: userDataObj.lastChatId,
            purse: userDataObj.purse,
            trialCredits: userDataObj.trialCredits,
            featuredCredits: userDataObj.featuredCredits,
            conversationId: userDataObj.conversationId,
            emailVerified: userDataObj.emailVerified
          });
          
          console.log('✅ DataContext populated with user data');
        }
      }
    }, [])
 
    useEffect(() => {
      if (typeof window !== 'undefined') {
        // Parse the query parameters from window.location
        const searchParams = new URLSearchParams(window.location.search);
        const params: any = {};
        const key: any = {};
        searchParams.forEach((value, key) => {
          console.log('key', key)
          console.log('params[key]', params[key])
          console.log('value', value)
          params[key] = value;
        });
        setQueryStringKeys(key)
        console.log('params', params)
        setQueryParams(params); // Set the parsed query parameters in state

        // If we have authentication data in query params, update localStorage and DataContext
        if (params.authed === 'true' && params.userId) {
          console.log('🔄 Processing authentication data from query params:', params);
          
          // Get existing user data from localStorage
          const existingUserData = localStorage.getItem('userData');
          const existingData = existingUserData ? JSON.parse(existingUserData) : {};
          
          // Update user data with query params
          const updatedUserData = {
            ...existingData,
            userId: params.userId,
            email: params.email || existingData.email,
            emailVerified: params.emailVerified === 'true'
          };
          
          // Save updated data to localStorage
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          
          // Update DataContext with the new data
          setData({
            ...data,
            userId: params.userId,
            email: params.email || existingData.email,
            emailVerified: params.emailVerified === 'true',
            subscriptionType: existingData.subscriptionType
          });
          
          console.log('✅ Updated DataContext with query params:', {
            userId: params.userId,
            email: params.email,
            emailVerified: params.emailVerified
          });
        }
      }
    }, []);

    useEffect(() => {
      // fetch conversations once we have a stable callback
      handleGetChats();
    }, [handleGetChats])

    useEffect(() => {
      if(updatedUserConversations){
        // populate the conversations in the chat list
      }
    }, [updatedUserConversations])

    useEffect(() => {
      // console.log('Messages in Chat:', messages)
    }, [messages])

    useEffect(() => {
      console.log(`📢 data`, data)
      setMessages(data.messages)
  }, [data, setData])

    const handleRequestCode = async () => {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      setIsRequestingCode(true);
      try {
        const response = await fetch('https://guidelinebuddybackend-91e9844f3425.herokuapp.com/introspect-ai/codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          toast.success('Code sent to email!');
          setIsRequestingCode(false);
          setIsVerifyingCode(true);
        } else {
          const result = await response.json();
          toast.error(result.error || 'Failed to send code');
          setIsRequestingCode(false);
        }
      } catch (error) {
        toast.error('Failed to send code');
        setIsRequestingCode(false);
      }
    };

    const handleVerifyCode = async () => {
      if (!code) {
        toast.error('Please enter the verification code');
        return;
      }

      try {
        const response = await fetch('https://guidelinebuddybackend-91e9844f3425.herokuapp.com/introspect-ai/codes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        });

        if (response.ok) {
          const result = await response.json();
          toast.success('Code verified successfully!');

          // Handle successful verification
          const data = result.data;
          localStorage.setItem('userData', JSON.stringify({
            name: data.username,
            email: data.email,
            familyName: data.familyName,
            image: data.userImage || data.image,
            userId: data.userID,
            subscriptionId: data.subscriptionID,
            subscriptionType: data.subscriptionType,
            subscriptionStatus: data.subscriptionStatus,
            purseId: data.purseID,
            socialId: data.socialID,
            lastChatId: data.lastChatID,
            purse: data.purse,
            trialCredits: data.trialCredits,
            featuredCredits: data.featuredCredits,
            chats: data.chats || data.messages
          }));

          const origin = window.location.origin;
          window.location.href = `${origin}/?authed=true&email=${email}&userId=${data.userID}&emailVerified=true`;
        } else {
          const result = await response.json();
          toast.error(result.error || 'Invalid code');
        }
      } catch (error) {
        toast.error('Failed to verify code');
      }
    };

  return (
    <>
      <Toaster />
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <>

          { userData === null || (userDataObj.userId == "" || userDataObj.userId == undefined || userDataObj.userId == null) ? (
              <Modal visible={true} disableBackdropClick onClose={() => console.log('dont close')}>
                <Modal.Title>MH AI</Modal.Title>
                <Modal.Subtitle>Sign Up / Login</Modal.Subtitle>
                <Modal.Content style={{ }}>
                  <div style={{ display: 'flex', justifyContent: 'center'}}>
                    {/* @ts-ignore */}
                    <ExtendedButton 
                      auto 
                      color={'primary'} 
                      css={({ 
                        borderRadius: 4, 
                        paddingTop: '15px', 
                        paddingBottom: '18px', 
                        paddingLeft: '50px', 
                        paddingRight: '50px', 
                        fontSize: '18px' 
                      } as any)} 
                      onClick={handleButtonClick} 
                      className='buttonPulse' 
                      id={'buttonPulse'} 
                      placeholder={undefined} 
                      >
                      <span style={{ 
                        paddingTop: '0px', 
                        bottom: '100px', 
                        cursor: 'pointer' 
                      }}>{'continue with Google'}</span>
                      <span>
                        <img style={{ marginLeft: '20%'}} src={`https://res.cloudinary.com/demebg3w1/image/upload/v1666959797/googleLogoNoBG_xeoztw.png`} width={25} />
                      </span>
                    </ExtendedButton>
                  </div>
                  
                  <div style={{ paddingTop: '20px'}}></div>

                  <div style={{ paddingTop: '40px', borderBottom: '1px solid #ccc' }}></div>
                  <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>OR</div>
                  <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isRequestingCode || isVerifyingCode}
                      style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        marginRight: '10px',
                        width: '200px'
                      }}
                    />
                    <button
                      onClick={isVerifyingCode ? handleVerifyCode : handleRequestCode}
                      disabled={isRequestingCode}
                      className="px-5 py-2.5 rounded-md bg-blue-600 text-white cursor-pointer transition-colors hover:bg-blue-700"
                    >
                      {isVerifyingCode ? 'Verify Code' : 'Request Code'}
                    </button>
                  </div>

                  {isVerifyingCode && (
                    <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Verification Code"
                        style={{ 
                          padding: '10px', 
                          borderRadius: '5px', 
                          border: '1px solid #ccc', 
                          width: '200px'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ marginTop: '10%', display: 'flex', justifyContent: 'center'}} >
                    <Text style={{ fontSize: '12px'}}>By continuing, you agree to our </Text> 
                    <Link href="/terms-of-service" style={{ marginLeft: '4px', textDecoration: 'underline' }}>
                      <Text style={{ fontSize: '12px'}}>Terms of Service</Text>
                    </Link>
                  </div>

                </Modal.Content>
              </Modal>
            ) : null}
          <EmptyScreen setInput={setInput} />
          </>
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        setMessages={setMessages}  
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
