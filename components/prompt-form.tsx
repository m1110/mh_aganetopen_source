import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useState, useRef, useContext, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconArrowElbow,
  IconAudio,
  IconPlus,
  IconUp
} from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { DataContext } from '../context/DataContext'
export interface PromptProps {
  onSubmit: (value: string) => Promise<void>
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()

  const [transcribed, setTranscribed] = useState<any>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [audioURL, setAudioURL] = useState<string>('')
  const [buttonHover, setButtonHover] = useState<boolean>(false)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [ data, setData ] = useContext(DataContext);
  let recordingChunks: BlobPart[] = []

  const router = useRouter()

  const transcribeAudio = async (audioBlob: any, mimeType: any) => {
    console.log('MIME type before conversion:', mimeType)

    // Convert audio to webm if the mimeType is mp4
    if (mimeType === 'audio/mp4') {
      console.log('Converting audio from mp4 to webm...')
      console.log('Conversion complete, new MIME type:', mimeType)
    }

    console.log('inside transcribeAudio')
    console.log('mimeType', mimeType)
    console.log('audioBlob', audioBlob)
    const formData = new FormData()

    formData.append(
      'file',
      audioBlob,
      mimeType === 'audio/mp4' ? 'recording.mp4' : 'recording.webm'
    )
    formData.append('model', 'whisper-1')
    const _formData = new FormData()
    _formData.append('file', audioBlob)

    console.log('just appended audioBlob')

    try {
      const response = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: formData
        }
      )

      if (!response.ok) {
        console.log('response not ok')
        console.log(`response.status:`, response.status)
        console.log(`response:`, response)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('just got result')
      console.log(`result: `, result)
      console.log(`result.text:`, result.text)
      // set data.audioConversation to true
      setData({ ...data, audioConversation: true })
      setTranscribed(result.text)
      setInput(result.text)
      return result.text
    } catch (error) {
      console.error('Failed to transcribe audio:', error)
      console.log(`failed to transcribe audio: ${error}`)
    }
  }

  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false
        },
        video: false
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      let mediaRecorder: any

      const checkSupportedMimeTypes = () => {
        const mimeTypesToTest = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'video/webm;codecs=opus',
          'video/webm',
          'audio/ogg;codecs=opus',
          'audio/ogg',
          'audio/mp4;codecs=opus',
          'audio/mp4',
          'audio/mp3;codecs=opus',
          'audio/mp3',
          'audio/mpga;codecs=opus',
          'audio/mpga',
          'audio/wav;codecs=opus',
          'audio/wav',
          'audio/mpeg;codecs=opus',
          'audio/mpeg'
        ]

        console.log('Checking supported MIME types...')
        mimeTypesToTest.forEach(mimeType => {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            console.log(`Supported: ${mimeType}`)
          } else {
            console.log(`Not Supported: ${mimeType}`)
          }
        })
      }

      checkSupportedMimeTypes()

      // Try to create a MediaRecorder with the desired mimeType if supported
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        })
      } else {
        // Otherwise, fall back to the browser's default mimeType
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/mp4',
          audioBitsPerSecond: 128000
        })
      }
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event: any) => {
        console.log('how many events are there? events.data: ', event)
        recordingChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        // const audioBlob = new Blob(audioChunks);
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        setTimeout(async () => {
          console.log(`mimeType: `, mimeType)
          const audioBlob = new Blob(recordingChunks, { type: mimeType })

          const audioUrls = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrls)
          console.log({ audio })
          console.log(`recordingChunks: `, recordingChunks)

          console.log(audioBlob.type) // Should be 'audio/webm'

          const url = URL.createObjectURL(audioBlob)
          setAudioURL(url) // Optionally update state with URL for playback
          console.log('mediaRecorder stopped, transcribe next...')
          await transcribeAudio(audioBlob, mimeType) // Pass the blob for transcription
        }, 2000)
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start(1000);
      }
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing your microphone', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      console.log(`mediaRecorderRef.current: `, mediaRecorderRef.current)
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    console.log({ isRecording })
  }, [setIsRecording, isRecording])

  const audioButtonClass = cn(
    'bg-blue-500 p-3 rounded-full transition-colors',
    isRecording ? 'bg-red-500' : 'bg-blue-500',
    isRecording ? 'hover:bg-red-500' : 'hover:bg-blue-600'
  )

  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setIsTyping(input.trim().length > 0)
  }, [input])

  return (
    <form
      className="my-8 w-full"
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="flex w-full space-x-3">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="How can I help?"
          spellCheck={false}
          className="cursor-pointer border border-border-neutral text-text-hard bg-surface-lighter rounded-3xl px-4 py-3 w-full focus-within:outline-none"
        />
        <div className="my-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {isTyping ? (
                  <button
                    type="submit"
                    disabled={isLoading || input === ''}
                    className={audioButtonClass}
                  >
                    <IconUp />
                    <span className="sr-only">Send message</span>
                  </button>
                ) : (
                  <button
                    className={audioButtonClass}
                    onClick={() => {
                      if (isRecording) {
                        stopRecording()
                      } else {
                        startRecording()
                      }
                      setIsRecording(!isRecording)
                    }}
                  >
                    <IconAudio className="text-white" />
                  </button>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-center">
              {isTyping ? 'Send message' : 'Talk'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
