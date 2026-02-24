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

// export const textToSpeechProxy = async (text: string) => {
//     try {
//         // 'http://localhost:5030/api/proxy/deepgram'
//         // 'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/api/proxy/deepgram'
//       console.log(`textToSpeechProxy: `, text)
//       const response = await fetch( 
//         // 'https://guidelinebuddybackend-91e9844f3425.herokuapp.com/api/tts' 
//         'http://localhost:5030/api/tts'
//         , {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text }),
//       });
  
//       const blob = await response.blob();
//       const contentType = response.headers.get('Content-Type');
//       const reader = new FileReader();
//         reader.onload = () => {
//           const arrayBuffer = reader.result as ArrayBuffer;
//           const uint8Array = new Uint8Array(arrayBuffer);
//           console.log('Audio data:', uint8Array);
//           // Inspect the audio data for any issues or inconsistencies
//         };
//         reader.readAsArrayBuffer(blob);

//         const audioBlob = new Blob([blob], { type: 'audio/mp3' });
//         const audioUrl = URL.createObjectURL(audioBlob);
        
//         return audioUrl;
//     } catch (error) {
//       console.error('Error in text-to-speech proxy call:', error);
//       throw error;
//     }
//   };

export const textToSpeechProxy = async (text: string) => {
  try {
    console.log(`textToSpeechProxy: `, text);
    const response = await fetch(
      'http://localhost:5030/api/tts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    console.log(`got the audio blob:`, audioBlob);

    // Create an object URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(`audioUrl:`, audioUrl);

    // Create an audio element and play the audio
    const audio = new Audio(audioUrl);
    audio.play();

    return audioUrl;
  } catch (error) {
    console.error('Error in text-to-speech proxy call:', error);
    throw error;
  }
};