import { UseChatHelpers } from 'ai/react'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import { DataContext } from '@/context/DataContext'
import { RowhomeSVG } from './rowhomeSVG'

const exampleMessages = [
  {
    heading: 'Cook',
    message: `How does Thomas Cook’s hero describes his experience of an inner critic?`
  },
  {
    heading: 'Improving',
    message: 'What has been promising for improving phobia, panic, and generalized anxiety disorders?: \n'
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  const [selected, setSelected] = useState("template");
  const [data, setData] = useContext(DataContext);
  useEffect(() => {
  }, [selected])

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
        </h1>
        <p className="leading-normal text-muted-foreground">
          MH
        </p>
        <div  style={{ flexDirection: 'column' }} className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div> */}
    </div>
  )
}
