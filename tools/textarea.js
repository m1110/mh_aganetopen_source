import React from 'react';
import { Textarea } from "@nextui-org/react"

function TextArea({ style, ...props }, ref) {
    return (
        <Textarea
        variant="faded"
        className="max-w-xs"
        size='lg'
        onHeightChange={ () => console.log('height changed')}
        minRows={10}
          css={{
            display: 'flex',
            marginTop: '50px',
            padding: '0.2rem', 
            fontSize: '0.875rem',
            width: '80%', 
            marginLeft: '10%',
            cursor: props.disabled ? 'not-allowed' : undefined,
            opacity: props.disabled ? 0.5 : 1, 
            ...style
          }}
          ref={ref}
          {...props}
        />
    )
}

export default React.forwardRef(TextArea);

