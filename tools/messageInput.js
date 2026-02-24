import React, { useState, useContext } from 'react';
import TextArea from "./textarea";
import { Button } from "@nextui-org/react";
import {Input} from "@nextui-org/react";

const MessageInput = ({ handleSendMessage, metadata, setMetadata, isLoading, setInputText, inputText }) => {

    const placeholder = "Transcripts added here";

    const handleCTA = () => {
        handleSendMessage(inputText, metadata);
    };

    const handleKeyDownCTA = (e) => {
        if (e.key === "Enter" ) {
            handleSendMessage(inputText, metadata);
        }
    }
    

    return(
        // <html lang="en" suppressHydrationWarning>
        <>
        <div style={{ marginBottom: '0px' }} >
            
        <Input 
            placeholder='Title and date'
            size='lg'
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            isDisabled={isLoading}
            css={{
                display: 'flex',
                marginTop: '10px',
                padding: '0.2rem', 
                fontSize: '0.875rem',
                width: '80%', 
                marginLeft: '10%',
                marginBottom: 100,
                paddingBottom: 10, 
                paddingTop: 150
        
              }}
            />
            <div style={{ marginTop: 30}}></div>
            <TextArea 
            style={{ maginTop: 0, paddingTop: 0, paddingBottom: `25px`, paddingLeft: '20px'}}
            placeholder={placeholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDownCTA}
            isDisabled={isLoading}
            />
            <div style={{ marginTop: 30}}></div>
            <Button 
             auto
             flat
             disabled={isLoading}
             color={'secondary'}
             style={{ width: '80%', marginLeft: '10%'}}
             onPress={handleCTA}
             css={{
                '&:hover': {
                    transform: 'translateY(-5px)',
                    '&:after': {
                        transform: 'scaleX(1.5) scaleY(1.6)', 
                        opacity: 0
                    }
                },
                '&:active': {
                    transform: 'translateY(-2px)'
                }
             }}
            >
                Submit Transcripts 🖋
            </Button>

        </div>
        </>
        // </html>
    )
}

export default MessageInput;