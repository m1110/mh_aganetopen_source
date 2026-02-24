import { createClient } from '@deepgram/sdk';

const deepgram = createClient("33c69a1fb20e122ee76510f230722cfafa9cf921");



const getAudioBuffer = async (response: any) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

export const textToSpeech = async (text: string) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: 'aura-perseus-en',
      encoding: 'linear16',
      container: 'wav',
    }
  );

  const stream = await response.getStream();
  if (stream) {
    const buffer = await getAudioBuffer(stream);
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } else {
    throw new Error('Error generating audio');
  }
};

export const textToSpeechProxy = async (text: string) => {
    try {
        // 'http://localhost:5028/api/proxy/deepgram'
        // 'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/api/proxy/deepgram'
        console.log(`textToSpeechProxy: `, text)
      const response = await fetch( 'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/api/proxy/deepgram' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      const blob = await response.blob();
      console.log(`got the blob:`, blob)
      // Ensure the blob has the correct MIME type
      const audioBlob = new Blob([blob], { type: 'audio/wav' });
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error in text-to-speech proxy call:', error);
      throw error;
    }
  };