import { Langfuse } from "langfuse"

export function formatDate(d: any) {
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const dayOfWeek = dayNames[d.getDay()]
  const month = monthNames[d.getMonth()] // getMonth() returns a zero-based index
  const day = d.getDate()
  const year = d.getFullYear()

  return `${dayOfWeek} ${month} ${day}, ${year}`
}

export function formatTime(d: any) {
  let hours = d.getHours()
  const minutes = d.getMinutes()

  // Convert 24-hour time format to 12-hour format with AM/PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours === 0 ? 12 : hours // Convert 0 to 12 for 12 AM

  // Make sure minutes are two digits
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes

  return `${hours}:${minutesFormatted} ${amOrPm}`
}

export const createUniqueId = (length: any) => {
  const createNewDocumentId = async (length_: any) => {
    let chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('')
    if (typeof length_ !== 'number') {
      length_ = Math.floor(Math.random() * chars.length)
    }
    var newSessionId = ''
    for (var i = 0; i < length_; i++) {
      newSessionId += chars[Math.floor(Math.random() * chars.length)]
    }
    return newSessionId
  }
  return createNewDocumentId(length)
}


    const LANGFUSE_SECRET_KEY="sk-lf-3d5c9290-dbee-4dfb-82ff-7952db8227dc"
    const LANGFUSE_PUBLIC_KEY="pk-lf-9d14cd85-dcd8-4146-a6c6-e98d58aa03e6"

    const langfuse = new Langfuse({
        publicKey: LANGFUSE_PUBLIC_KEY,
        secretKey:LANGFUSE_SECRET_KEY,
        baseUrl: 'https://us.cloud.langfuse.com'
      });

export const createTrace = async (input: string, user: string, metadata: any, tags: string[], request_id: any) => {
  // console.log('Creating trace with:', { userId, metadata, tags });
  const _id = createUniqueId(7)
  try {
    const trace = langfuse.trace({
      input: input,
      name: `chat interaction`,
      id: request_id,
      userId: user || "internal",
      metadata: metadata || {},
      tags: tags || [],
    });
    console.log({
      id: request_id,
      userId: user || "internal",
      metadata: metadata || {},
      tags: tags || [],
    })
    // console.log('Trace response:', trace);
    if (!trace) {
      throw new Error('Langfuse returned undefined trace');
    }
    await langfuse.flushAsync()
    return trace
  } catch (error) {
    console.error('Error creating trace:', error);
    throw error;
  }
};

export const createEvent = async (trace: any, spanId: string, requestId: string, name: string, input: string, metadata: any, outputData: any) => {
  if (!trace) {
    console.error('Trace is undefined in createEvent');
    throw new Error('Trace is undefined');
  }
  try {
    const event = langfuse.event({
      traceId: trace.id,
      parentObservationId: spanId,
      name: name,
      input: input || "",
      metadata: metadata || {},
    });
    // console.log(`Created event: ${name}`, event);
    await langfuse.flushAsync();

    // event.update({
    //   output: outputData
    // });

    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// export const endEvent = async (event: any, data: any) => {
//   event.update({
//     output: data
//   });
//   await langfuse.flushAsync()
// }

export const createSpan = async (trace: any, requestId: string, name: string, input: string, metadata: any) => {
  if (!trace) {
    console.error('Trace is undefined in createSpan');
    throw new Error('Trace is undefined');
  }
  try {
    const span = langfuse.span({
      traceId: trace.id,
      name: name,
      input: input || "",
      metadata: metadata || {},
    })
    // console.log(`Created span: ${name}`, span);
    await langfuse.flushAsync()
    return span;
  } catch (error) {
    console.error('Error creating span:', error);
    throw error;
  }
};



export const createGeneration = async (span: any, name: string, model: string, input: string) => {
  console.log('Creating generation...');
  try {
    const generation = await span.generation({
      name: name,
      model: model,
      modelParameters: {
        temperature: 0.1,
      },
      input: input,
      version: "1.0",
      // prompt: prompt
    });
    // console.log(`Created generation: ${name}`, generation);
    await langfuse.flushAsync()
    return generation;
  } catch (error) {
    console.error('Error creating generation:', error);
    throw error;
  }
};

export const endSpan = async (span: any, output: string) => {
  console.log('Ending span...');
  try {
    
    if (span && typeof span.end === 'function') {
      console.log('end is a function');
      await span.end({
        output: output,
      });
      console.log('Span ended successfully');
      await langfuse.flushAsync()
    } else if (span && typeof span.update === 'function') {
      console.log('update is a function');
      await span.update({
        output: output,
        end_time: new Date().toISOString()
      });
      await langfuse.flushAsync()
      console.log('Span updated successfully');
    } else {
      console.error('Failed to end span: neither end nor update methods are available', span);
    }
  } catch (error) {
    console.error('Error resolving or ending span:', error);
  }
};

export const endGeneration = async (generationPromise: Promise<any>, output: any) => {
  console.log('Ending generation...');
  try {
    const generation = await generationPromise;
    // console.log('Resolved generation:', generation);
    
    if (generation && typeof generation.end === 'function') {
      console.log('end is a function');
      await generation.end({
        output: output,
      });
      console.log('Generation ended successfully');
      await langfuse.flushAsync()
    } else if (generation && typeof generation.update === 'function') {
      console.log('update is a function');
      await generation.update({
        output: output,
        end_time: new Date().toISOString()
      });
      console.log('Generation updated successfully');
      await langfuse.flushAsync()
    } else {
      console.error('Failed to end generation: neither end nor update methods are available', generation);
    }
  } catch (error) {
    console.error('Error resolving or ending generation:', error);
  }
};