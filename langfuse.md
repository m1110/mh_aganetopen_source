Docs
Langfuse is an open-source LLM engineering platform that helps teams collaboratively debug, analyze, and iterate on their LLM applications.

Overview: Core platform features
Develop
Observability: Instrument your app and start ingesting traces to Langfuse (Quickstart, Tracing)
Track all LLM calls and all other relevant logics in your app
Async SDKs for Python and JS/TS
@observe() decorator for Python
Integrations for OpenAI SDK, Langchain, LlamaIndex, LiteLLM, Flowise and Langflow
API
Langfuse UI: Inspect and debug complex logs and user sessions (Demo, Tracing, Sessions)
Prompt Management: Manage, version and deploy prompts from within Langfuse (Prompt Management)
Prompt Engineering: Test and iterate on your prompts with the LLM Playground
Monitor
Analytics: Track metrics (LLM cost, latency, quality) and gain insights from dashboards & data exports (Analytics, Daily Metrics API)
Evals: Collect and calculate scores for your LLM completions (Scores & Evaluations)
Run model-based evaluations within Langfuse
Collect user feedback
Annotate observations in Langfuse
Test
Experiments: Track and test app behaviour before deploying a new version
Datasets let you test expected in and output pairs and benchmark performance before deployiong
Track versions and releases in your application (Experimentation, Prompt Management)


Why Langfuse?
We wrote a concise manifesto on: Why Langfuse?

Open-source
Model and framework agnostic
Built for production
Incrementally adoptable - start with a single LLM call or integration, then expand to full tracing of complex chains/agents
Use the GET API to build downstream use cases
Challenges of building LLM applications and how Langfuse helps

In implementing popular LLM use cases – such as retrieval augmented generation, agents using internal tools & APIs, or background extraction/classification jobs – developers face a unique set of challenges that is different from traditional software engineering:

Tracing & Control Flow: Many valuable LLM apps rely on complex, repeated, chained or agentic calls to a foundation model. This makes debugging these applications hard as it is difficult to pinpoint the root cause of an issue in an extended control flow.

With Langfuse, it is simple to capture the full context of an LLM application. Our client SDKs and integrations are model and framework agnostic and able to capture the full context of an execution. Users commonly track LLM inference, embedding retrieval, API usage and any other interaction with internal systems that helps pinpoint problems. Users of frameworks such as Langchain benefit from automated instrumentation, otherwise the SDKs offer an ergonomic way to define the steps to be tracked by Langfuse.

Output quality: In traditional software engineering, developers are used to testing for the absence of exceptions and compliance with test cases. LLM-based applications are non-deterministic and there rarely is a hard-and-fast standard to assess quality. Understanding the quality of an application, especially at scale, and what ‘good’ evaluation looks like is a main challenge. This problem is accelerated by changes to hosted models that are outside of the user’s control.

With Langfuse, users can attach scores to production traces (or even sub-steps of them) to move closer to measuring quality. Depending on the use case, these can be based on model-based evaluations, user feedback, manual labeling or other e.g. implicit data signals. These metrics can then be used to monitor quality over time, by specific users, and versions/releases of the application when wanting to understand the impact of changes deployed to production.

Mixed intent: Many LLM apps do not tightly constrain user input. Conversational and agentic applications often contend with wildly varying inputs and user intent. This poses a challenge: teams build and test their app with their own mental model but real world users often have different goals and lead to many surprising and unexpected results.

With Langfuse, users can classify inputs as part of their application and ingest this additional context to later analyze their users behavior in-depth.



Introduction to Observability & Traces in Langfuse
A trace in Langfuse consists of the following objects:

A trace typically represents a single request or operation. It contains the overall input and output of the function, as well as metadata about the request, such as the user, the session, and tags.
Each trace can contain multiple observations to log the individual steps of the execution.
Observations are of different types:
Events are the basic building blocks. They are used to track discrete events in a trace.
Spans represent durations of units of work in a trace.
Generations are spans used to log generations of AI models. They contain additional attributes about the model, the prompt, and the completion. For generations, token usage and costs are automatically calculated.
Observations can be nested.



Quickstart
This quickstart helps you to integrate your LLM application with Langfuse. It will log a single LLM call to get started.

Create new project in Langfuse
Create Langfuse account or self-host
Create a new project
Create new API credentials in the project settings
Log your first LLM call to Langfuse
npm i langfuse
# or
yarn add langfuse
 
# Node.js < 18
npm i langfuse-node
 
# Deno
import { Langfuse } from "https://esm.sh/langfuse"

.env
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_BASEURL="https://cloud.langfuse.com" # 🇪🇺 EU region
# LANGFUSE_BASEURL="https://us.cloud.langfuse.com" # 🇺🇸 US region

Example usage, most of the parameters are optional and depend on the use case. For more information, see the typescript SDK docs.

server.ts
import { Langfuse } from "langfuse";
 
const langfuse = new Langfuse();
 
const trace = langfuse.trace({
  name: "my-AI-application-endpoint",
});
 
// Example generation creation
const generation = trace.generation({
  name: "chat-completion",
  model: "gpt-3.5-turbo",
  modelParameters: {
    temperature: 0.9,
    maxTokens: 2000,
  },
  input: messages,
});
 
// Application code
const chatCompletion = await llm.respond(prompt);
 
// End generation - sets endTime
generation.end({
  output: chatCompletion,
});

Done, now visit the Langfuse interface to look at the trace you just created.

All Langfuse platform features
This was a very brief introduction to get started with Langfuse. Explore all Langfuse platform features in detail.



Prompt Management
Use Langfuse to effectively manage and version your prompts. Langfuse prompt management is a Prompt CMS (Content Management System).

What is prompt management?
Prompt management is a systematic approach to storing, versioning and retrieving prompts in LLM applications. Key aspects of prompt management include version control, decoupling prompts from code, monitoring, logging and optimizing prompts as well as integrating prompts with the rest of your application and tool stack.

Why use prompt management?
Can't I just hardcode my prompts in my application and track them in Git? Yes, well... you can and all of us have done it.

Typical benefits of using a CMS apply here:

Decoupling: deploy new prompts without redeploying your application.
Non-technical users can create and update prompts via Langfuse Console.
Quickly rollback to a previous version of a prompt.
Platform benefits:

Track performance of prompt versions in Langfuse Tracing.
Performance benefits compared to other implementations:

No latency impact after first use of a prompt due to client-side caching and asynchronous cache refreshing.
Support for text and chat prompts.
Edit/manage via UI, SDKs, or API.
Langfuse prompt object
Example prompt in Langfuse with custom config
{
  "name": "movie-critic",
  "type": "text",
  "prompt": "Do you like {{movie}}?",
  "config": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.5,
    "supported_languages": ["en", "fr"]
  },
  "version": 1,
  "labels": ["production", "staging", "latest"],
  "tags": ["movies"]
}

name: Unique name of the prompt within a Langfuse project.
type: The type of the prompt content (text or chat). Default is text.
prompt: The text template with variables (e.g. This is a prompt with a {{variable}}). For chat prompts, this is a list of chat messages each with role and content.
config: Optional JSON object to store any parameters (e.g. model parameters or model tools).
version: Integer to indicate the version of the prompt. The version is automatically incremented when creating a new prompt version.
labels: Labels that can be used to fetch specific prompt versions in the SDKs.
When using a prompt without specifying a label, Langfuse will serve the version with the production label.
latest points to the most recently created version.
You can create any additional labels, e.g. for different environments (staging, production) or tenants (tenant-1, tenant-2).
How it works
Create/update prompt
If you already have a prompt with the same name, the prompt will be added as a new version.

// Create a text prompt
await langfuse.createPrompt({
  name: "movie-critic",
  type: "text",
  prompt: "Do you like {{movie}}?",
  labels: ["production"], // directly promote to production
  config: {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    supported_languages: ["en", "fr"],
  }, // optionally, add configs (e.g. model parameters or model tools) or tags
});
 
// Create a chat prompt
await langfuse.createPrompt({
  name: "movie-critic-chat",
  type: "chat",
  prompt: [{ role: "system", content: "You are an expert on {{movie}}" }],
  labels: ["production"], // directly promote to production
  config: {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    supported_languages: ["en", "fr"],
  }, // optionally, add configs (e.g. model parameters or model tools) or tags
});

If you already have a prompt with the same name, the prompt will be added as a new version.

Use prompt
At runtime, you can fetch the latest production version from Langfuse.

import { Langfuse } from "langfuse";
 
// Iniitialize the Langfuse client
const langfuse = new Langfuse();
 
// Get current `production` version
const prompt = await langfuse.getPrompt("movie-critic");
 
// Insert variables into prompt template
const compiledPrompt = prompt.compile({ movie: "Dune 2" });

Chat prompts

// Get current `production` version of a chat prompt
const chatPrompt = await langfuse.getPrompt("movie-critic-chat", undefined, {
  type: "chat",
}); // type option infers the prompt type (default is 'text')
 
// Insert variables into chat prompt template
const compiledChatPrompt = chatPrompt.compile({ movie: "Dune 2" });

Optional parameters

// Get specific version of a prompt (here version 1)
const prompt = await langfuse.getPrompt("movie-critic", 1);
 
// Get specific label
const prompt = await langfuse.getPrompt("movie-critic", undefined, {
  label: "staging",
});
 
// Get latest prompt version. The 'latest' label is automatically maintained by Langfuse.
const prompt = await langfuse.getPrompt("movie-critic", undefined, {
  label: "latest",
});
 
// Extend cache TTL from default 1 to 5 minutes
const prompt = await langfuse.getPrompt("movie-critic", undefined, {
  cacheTtlSeconds: 300,
});
 
// Number of retries on fetching prompts from the server. Default is 2.
const promptWithMaxRetries = await langfuse.getPrompt(
  "movie-critic",
  undefined,
  {
    maxRetries: 5,
  }
);
 
// Timeout per call to the Langfuse API in milliseconds. Default is 10 seconds.
const promptWithFetchTimeout = await langfuse.getPrompt(
  "movie-critic",
  undefined,
  {
    fetchTimeoutMs: 5000,
  }
);

Attributes

// Raw prompt including {{variables}}. For chat prompts, this is a list of chat messages.
prompt.prompt;
 
// Config object
prompt.config;

Link with Langfuse Tracing (optional)
Add the prompt object to the generation call in the SDKs to link the generation in Langfuse Tracing to the prompt version. This linkage enables tracking of metrics by prompt version and name, such as "movie-critic", directly in the Langfuse UI. Metrics like scores per prompt version provide insights into how modifications to prompts impact the quality of the generations. If a fallback prompt is used, no link will be created.

This is currently unavailable when using the LangChain or LlamaIndex integration.

langfuse.generation({
    ...
+   prompt: prompt
    ...
})

Rollbacks (optional)
When a prompt has a production label, then that version will be served by default in the SDKs. You can quickly rollback to a previous version by setting the production label to that previous version in the Langfuse UI.

End-to-end examples
The following example notebooks include end-to-end examples of prompt management:

Example OpenAI Functions
Example Langchain (Python)
Example Langchain (JS/TS)
We also used Prompt Management for our Docs Q&A Chatbot and traced it with Langfuse. You can get view-only access to the project by signing up to the public demo.

Caching in client SDKs
Langfuse prompts are served from a client-side cache in the SDKs. Therefore, Langfuse Prompt Management does not add any latency to your application when a cached prompt is available from a previous use. Optionally, you can pre-fetch prompts on application startup to ensure that the cache is populated (example below).

Optional: Pre-fetch prompts on application start
To ensure that your application never hits an empty cache at runtime (and thus adding an initial delay of fetching the prompt), you can pre-fetch the prompts during the application startup. This pre-fetching will populate the cache and ensure that the prompts are readily available when needed.

Example implementations:

import express from "express";
import { Langfuse } from "langfuse";
 
// Initialize the Express app and Langfuse client
const app = express();
const langfuse = new Langfuse();
 
async function fetchPromptsOnStartup() {
  // Fetch and cache the production version of the prompt
  await langfuse.getPrompt("movie-critic");
}
 
// Call the function during application startup
fetchPromptsOnStartup();
 
app.get("/get-movie-prompt/:movie", async (req, res) => {
  const movie = req.params.movie;
  const prompt = await langfuse.getPrompt("movie-critic");
  const compiledPrompt = prompt.compile({ movie });
  res.json({ prompt: compiledPrompt });
});
 
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

Optional: Customize caching duration (TTL)
The caching duration is configurable if you wish to reduce network overhead of the Langfuse Client. The default cache TTL is 60 seconds. After the TTL expires, the SDKs will refetch the prompt in the background and update the cache. Refetching is done asynchronously and does not block the application.

// Get current `production` version and cache prompt for 5 minutes
const prompt = await langfuse.getPrompt("movie-critic", undefined, {
  cacheTtlSeconds: 300,
});

Performance measurement of inital fetch (empty client-side cache)
We measured the execution time of the following snippet with fully disabled caching.

prompt = langfuse.get_prompt("perf-test")
prompt.compile(input="test")

Results from 1000 sequential executions in a local jupyter notebook using Langfuse Cloud (includes network latency):

Performance Chart

count  1000.000000
mean      0.178465 sec
std       0.058125 sec
min       0.137314 sec
25%       0.161333 sec
50%       0.165919 sec
75%       0.171736 sec
max       0.687994 sec

Optional: Guaranteed availability
Implementing this is usually not necessary as it adds complexity to your application and the Langfuse API is highly available. However, if you require 100% availability, you can use the following options.

The Langfuse API has high uptime and prompts are cached locally in the SDKs to prevent network issues from affecting your application.

However, get_prompt()/getPrompt() will throw an exception if:

No local (fresh or stale) cached prompt is available -> new application instance fetching prompt for the first time
and network request fails -> networking or Langfuse API issue (after retries)
To gurantee 100% availability, there are two options:

Pre-fetch prompts on application startup and exit the application if the prompt is not available.
Provide a fallback prompt that will be used in these cases.
Option 1: Pre-fetch prompts on application startup and exit if not available
import { Langfuse } from "langfuse";
 
// Initialize Langfuse client
const langfuse = new Langfuse();
 
async function fetchPromptsOnStartup() {
  try {
    // Fetch and cache the production version of the prompt
    await langfuse.getPrompt("movie-critic");
  } catch (error) {
    console.error("Failed to fetch prompt on startup:", error);
    process.exit(1); // Exit the application if the prompt is not available
  }
}
 
// Call the function during application startup
fetchPromptsOnStartup();
 
// Your application code here

Option 2: Fallback
import { Langfuse } from "langfuse";
const langfuse = new Langfuse();
 
// Get `text` prompt with fallback
const prompt = await langfuse.getPrompt("movie-critic", undefined, {
  fallback: "Do you like {{movie}}?",
});
 
// Get `chat` prompt with fallback
const chatPrompt = await langfuse.getPrompt("movie-critic-chat", undefined, {
  type: "chat",
  fallback: [{ role: "system", content: "You are an expert on {{movie}}" }],
});
 
// True if the prompt is a fallback
prompt.isFallback;

Example: Langfuse Prompt Management with Langchain (JS)
Langfuse Prompt Management helps to version control and manage prompts collaboratively in one place.

This example demonstrates how to use Langfuse Prompt Management together with Langchain JS.

const langfuseParams = {
    publicKey: "",
    secretKey: "",
    baseUrl: "https://cloud.langfuse.com",
    flushAt: 1 // cookbook-only, send all events immediately
}

import {Langfuse} from "npm:langfuse"
const langfuse = new Langfuse(langfuseParams)

Simple example
Add new prompt
We add the prompt used in this example via the SDK. Alternatively, you can also edit and version the prompt in the Langfuse UI.

Name that identifies the prompt in Langfuse Prompt Management
Prompt with topic variable
Config including modelName, temperature
labels to include production to immediately use prompt as the default
For the sake of this notebook, we will add the prompt in Langfuse and use it right away. Usually, you'd update the prompt from time to time in Langfuse and your application fetches the current production version.

const prompt =  await langfuse.createPrompt({
    name: "jokes",
    prompt: "Tell me a joke about {{topic}}",
    config: {
      modelName: "gpt-4",
      temperature: 1,
    }, // optionally, add configs (e.g. model parameters or model tools)
    labels: ["production"] // directly promote to production
});

Prompt in Langfuse

Prompt in Langfuse

Run example
Get current prompt version from Langfuse
const prompt = await langfuse.getPrompt("jokes")

The prompt includes the prompt string

prompt.prompt

[32m"Tell me a joke about {{topic}}"[39m

and the config object

prompt.config

{ modelName: [32m"gpt-4"[39m, temperature: [33m1[39m }

Transform prompt into Langchain PromptTemplate
Use the utility method .getLangchainPrompt() to transform the Langfuse prompt into a string that can be used in Langchain.

Context: Langfuse declares input variables in prompt templates using double brackets ({{input variable}}). Langchain uses single brackets for declaring input variables in PromptTemplates ({input variable}). The utility method .getLangchainPrompt() replaces the double brackets with single brackets.

import { PromptTemplate } from "npm:@langchain/core/prompts"
 
const promptTemplate = PromptTemplate.fromTemplate(
    prompt.getLangchainPrompt()
  );

Setup Langfuse Tracing for Langchain JS
We'll use the native Langfuse Tracing for Langchain JS when executing this chain. This is fully optional and can be used independently from Prompt Management.

import { CallbackHandler } from "npm:langfuse-langchain"
const langfuseLangchainHandler = new CallbackHandler(langfuseParams)

Create chain
We use the modelName and temperature stored in prompt.config.

import { ChatOpenAI } from "npm:@langchain/openai"
import { RunnableSequence } from "npm:@langchain/core/runnables";
 
const model = new ChatOpenAI({
    modelName: prompt.config.modelName,
    temperature: prompt.config.temperature
});
const chain = RunnableSequence.from([promptTemplate, model]);

Invoke chain
const res = await chain.invoke(
    { topic: "Europe and the Americas" },
    { callbacks: [langfuseLangchainHandler] }
);

View trace in Langfuse
As we passed the langfuse callback handler, we can explore the execution trace in Langfuse.

Trace in Langfuse

OpenAI functions and JsonOutputFunctionsParser
Add prompt to Langfuse
const prompt =  await langfuse.createPrompt({
    name: "extractor",
    prompt: "Extracts fields from the input.",
    config: {
      modelName: "gpt-4",
      temperature: 0,
      schema: {
        type: "object",
        properties: {
          tone: {
            type: "string",
            enum: ["positive", "negative"],
            description: "The overall tone of the input",
          },
          word_count: {
            type: "number",
            description: "The number of words in the input",
          },
          chat_response: {
            type: "string",
            description: "A response to the human's input",
          },
        },
        required: ["tone", "word_count", "chat_response"],
      }
    }, // optionally, add configs (e.g. model parameters or model tools)
    labels: ["production"] // directly promote to production
});

Prompt in Langfuse

Prompt in Langfuse

Fetch prompt
const extractorPrompt = await langfuse.getPrompt("extractor")

Transform into schema

const extractionFunctionSchema = {
    name: "extractor",
    description: prompt.prompt,
    parameters: prompt.config.schema,
}

Build chain
import { ChatOpenAI } from "npm:@langchain/openai";
import { JsonOutputFunctionsParser } from "npm:langchain/output_parsers";
 
// Instantiate the parser
const parser = new JsonOutputFunctionsParser();
 
// Instantiate the ChatOpenAI class
const model = new ChatOpenAI({ 
    modelName: prompt.config.modelName,
    temperature: prompt.config.temperature
});
 
// Create a new runnable, bind the function to the model, and pipe the output through the parser
const runnable = model
  .bind({
    functions: [extractionFunctionSchema],
    function_call: { name: "extractor" },
  })
  .pipe(parser);

Invoke chain
import { HumanMessage } from "npm:@langchain/core/messages";
 
// Invoke the runnable with an input
const result = await runnable.invoke(
    [new HumanMessage("What a beautiful day!")],
    { callbacks: [langfuseLangchainHandler] }
);

View trace in Langfuse

Fine-tuning
Langfuse is open-source and data tracked with Langfuse is open. You can easily trace your application, collect user feedback, and then use the data to fine-tune a model for your specific use case.

Export generations
The generations table in Langfuse allows you to export all LLM calls recorded with Langfuse. All filters applied to the table will be applied to the export, thus, you can e.g. filter for a specific model or minimum evaluation threshold and then export the generations.

Available export formats:

CSV
JSON

Model Usage & Cost
Across Langfuse, usage and cost are tracked for LLM generations:

Usage: token/character counts
Cost: USD cost of the generation
Both usage and cost can be either

ingested via API, SDKs or integrations
or inferred based on the model parameter of the generation. Langfuse comes with a list of predefined popular models and their tokenizers including OpenAI, Anthropic, and Google models. You can also add your own custom model definitions or request official support for new models via GitHub. Inferred cost are calculated at the time of ingestion.
Ingested usage and cost are prioritized over inferred usage and cost:

Yes
No
Yes
No
use usage
Ingested Observation
Usage (tokens or other unit)
Cost (in USD)
Includes usage?
Use tokenizer
Includes cost?
Use model price/unit
Via the Daily Metrics API, you can retrieve aggregated daily usage and cost metrics from Langfuse for downstream use in analytics, billing, and rate-limiting. The API allows you to filter by application type, user, or tags.

Ingest usage and/or cost
If available in the LLM response, ingesting usage and/or cost is the most accurate and robust way to track usage in Langfuse.

Many of the Langfuse integrations automatically capture usage and cost data from the LLM response. If this does not work as expected, please create an issue on GitHub.

@observe(as_type="generation")
def anthropic_completion(**kwargs):
  # optional, extract some fields from kwargs
  kwargs_clone = kwargs.copy()
  input = kwargs_clone.pop('messages', None)
  model = kwargs_clone.pop('model', None)
  langfuse_context.update_current_observation(
      input=input,
      model=model,
      metadata=kwargs_clone
  )
 
  response = anthopic_client.messages.create(**kwargs)
 
  langfuse_context.update_current_observation(
      usage={
          "input": response.usage.input_tokens,
          "output": response.usage.output_tokens,
          # "total": int,  # if not set, it is derived from input + output
          "unit": "TOKENS", # any of: "TOKENS", "CHARACTERS", "MILLISECONDS", "SECONDS", "IMAGES"
 
          # Optionally, also ingest usd cost. Alternatively, you can infer it via a model definition in Langfuse.
          # Here we assume the input and output cost are 1 USD each.
          "input_cost": 1,
          "output_cost": 1,
          # "total_cost": float, # if not set, it is derived from input_cost + output_cost
      }
  )
 
  # return result
  return response.content[0].text
 
@observe()
def main():
  return anthropic_completion(
      model="claude-3-opus-20240229",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
 
main()

You can also update the usage and cost via generation.update() and generation.end().

Compatibility with OpenAI
For increased compatibility with OpenAI, you can also use the following attributes to ingest usage:

const generation = langfuse.generation({
  // ...
  usage: {
    // usage
    promptTokens: integer,
    completionTokens: integer,
    totalTokens: integer, // optional, derived from prompt + completion
  },
  // ...
});

You can also ingest OpenAI-style usage via generation.update() and generation.end().

Infer usage and/or cost
If either usage or cost are not ingested, Langfuse will attempt to infer the missing values based on the model parameter of the generation at the time of ingestion. This is especially useful for some model providers or self-hosted models which do not include usage or cost in the response.

Langfuse comes with a list of predefined popular models and their tokenizers including OpenAI, Anthropic, Google. Check out the full list (you need to sign-in).

You can also add your own custom model definitions (see below) or request official support for new models via GitHub.

Usage
If a tokenizer is specified for the model, Langfuse automatically calculates token amounts for ingested generations.

The following tokenizers are currently supported:

Model	Tokenizer	Used package	Comment
gpt-4o	o200k_base	tiktoken	
gpt*	cl100k_base	tiktoken	
claude*	claude	@anthropic-ai/tokenizer	According to Anthropic, their tokenizer is not accurate for Claude 3 models. If possible, send us the tokens from their API response.
Cost
Model definitions include prices per unit (input, output, total).

Langfuse automatically calculates cost for ingested generations at the time of ingestion if (1) usage is ingested or inferred, (2) and a matching model definition includes prices.

Custom model definitions
You can flexibly add your own model definitions to Langfuse. This is especially useful for self-hosted or fine-tuned models which are not included in the list of Langfuse maintained models.

Model definitions can also be managed programmatically via the Models API (reference):

GET    /api/public/models
POST   /api/public/models
GET    /api/public/models/{id}
DELETE /api/public/models/{id}

Models are matched to generations based on:

Generation Attribute	Model Attribute	Notes
model	match_pattern	Uses regular expressions, e.g. (?i)^(gpt-4-0125-preview)$ matches gpt-4-0125-preview.
unit	unit	Unit on the usage object of the generation (e.g. TOKENS or CHARACTERS) needs to match.
start_time	start_time	Optional, can be used to update the price of a model without affecting past generations. If multiple models match, the model with the most recent model.start_time that is earlier than generation.start_time is used.
User-defined models take priority over models maintained by Langfuse.

Further details

When using the openai tokenizer, you need to specify the following tokenization config. You can also copy the config from the list of predefined OpenAI models. See the OpenAI documentation for further details. tokensPerName and tokensPerMessage are required for chat models.

{
  "tokenizerModel": "gpt-3.5-turbo", // tiktoken model name
  "tokensPerName": -1, // OpenAI Chatmessage tokenization config
  "tokensPerMessage": 4 // OpenAI Chatmessage tokenization config
}

Troubleshooting
Usage and cost are missing for historical generations. Except for changes in prices, Langfuse does not retroactively infer usage and cost for existing generations when model definitions are changed. You can request a batch job (Langfuse Cloud) or run a script (self-hosting) to apply new model definitions to existing generations.

Last updated on July 29, 2024

Model-based Evaluations in Langfuse
Model-based evaluations (LLM-as-a-judge) are a powerful tool to automate the evaluation of LLM applications integrated with Langfuse. With model-based evalutions, LLMs are used to score a specific session/trace/LLM-call in Langfuse on criteria such as correctness, toxicity, or hallucinations.

There are two ways to run model-based evaluations in Langfuse:

Via the Langfuse UI (beta)
Via external evaluation pipeline
Via Langfuse UI (beta)
Where is this feature available?
Hobby
Public Beta
Pro
Public Beta
Team
Public Beta
Self Hosted
Not Available
Store an API key
To use evals, you have to bring your own LLM API keys. To do so, navigate to the settings page and insert your API key. We store them encrypted on our servers.

Create an eval template
First, we need to specify the evaluation template:

Select the model and its parameters.
Customise one of the Langfuse managed prompt templates or write your own.
We use function calling to extract the evaluation output. Specify the descriptions for the function parameters score and reasoning. This is how you can direct the LLM to score on a specific range and provide specific reasoning for the score.
Langfuse
Create an eval config
Second, we need to specify on which traces Langfuse should run the template we created above.

Select the evaluation template to run.
Specify the name of the scores which will be created as a result of the evaluation.
Filter which newly ingested traces should be evaluated. (Coming soon: select existing traces)
Specify how Langfuse should fill the variables in the template. Langfuse can extract data from trace, generations, spans, or event objects which belong to a trace. You can choose to take Input, Output or metadata form each of these objects. For generations, spans, or events, you also have to specify the name of the object. We will always take the latest object that matches the name.
Reduce the sampling to not run evals on each trace. This helps to save LLM API cost.
Add a delay to the evaluation execution. This is how you can ensure all data arrived at Langfuse servers before evaluation is exeucted.
Langfuse
See the progress
Once the configuration is saved, Langfuse will start running the evals on the traces that match the filter. You can see the progress on the config page or the log table.

Langfuse

See scores
Upon receiving new traces, navigate to the trace detail view to see the associated scores.

Langfuse

Via External Evaluation Pipeline
Where is this feature available?
Hobby
Full
Pro
Full
Team
Full
Self Hosted
Full
Pipeline
Langfuse
Application
Pipeline
Langfuse
Application
User
Ingest new traces
Fetch traces via SDK/API
Run custom evaluation function/package
Add score to trace via SDK/API
Analyze evaluation scores via UI & API
User
You can run your own model-based evals on data in Langfuse by fetching traces from Langfuse (e.g. via the Python SDK) and then adding evaluation results as scores back to the traces in Langfuse. This gives you full flexibility to run various eval libraries on your production data and discover which work well for your use case.

The example notebook is a good template to get started with building your own evaluation pipeline.

Custom Scores via API/SDKs
Langfuse gives you full flexibility to ingest custom scores via the Langfuse SDKs or API. The scoring workflow allows you to run custom quality checks on the output of your workflows at runtime, or to run custom human evaluation workflows.

Exemplary use cases:

Custom internal workflow tooling: build custom internal tooling that helps you manage human-in-the-loop workflows. Ingest scores back into Langfuse, optionally following your custom schema by referencing a config.
Deterministic rules at runtime: e.g. check if output contains a certain keyword, adheres to a specified structure/format or if the output is longer than a certain length.
Automated data pipeline: continuously monitor the quality by fetching traces from Langfuse, running custom evaluations, and ingesting scores back into Langfuse.
How to add scores
You can add scores via the Langfuse SDKs or API. Scores can take one of three data types:

Numeric: used to record scores that fall into a numerical range
Categorical: used to record string score values
Boolean: used to record binary score values
SDK ingestion examples by data type
Numeric score values must be provided as float.

Python SDK example

langfuse.score(
    id="unique_id" # optional, can be used as an indempotency key to update the score subsequently
    trace_id=message.trace_id,
    observation_id=message.generation_id, # optional
    name="correctness",
    value=0.9,
    data_type="NUMERIC" # optional, inferred if not provided
    comment="Factually correct", # optional
)

JavaScript/TypeScript SDK example

await langfuse.score({
  id: "unique_id", // optional, can be used as an indempotency key to update the score subsequently
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "correctness",
  value: 0.9,
  dataType: "NUMERIC", // optional, inferred if not provided
  comment: "Factually correct", // optional
});

→ More details in Python SDK docs and JS/TS SDK docs. See API reference for more details on POST/GET score configs endpoints.

How to ensure your scores comply with a certain schema
Given your scores are required to follow a specific schema such as data range, name or data type, you can define and reference a score configuration (config) on your scores. Configs are helpful when you want to standardize your scores for future analysis. They can be defined in the Langfuse UI or via our API.

Whenever you provide a config, the score data will be validated against the config. The following rules apply:

Score Name: Must equal the config's name
Score Data Type: When provided, must match the config's data type
Score Value: Must match the config's data type and be within the config's value range:
Numeric: Value must be within the min and max values defined in the config (if provided, min and max are optional and otherwise are assumed as -∞ and +∞ respectively)
Categorical: Value must map to one of the categories defined in the config
Boolean: Value must equal 0 or 1
Score ingestion referencing configs via SDK
When ingesting numeric scores, you can provide the value as a float. If you provide a configId, the score value will be validated against the config's numeric range, which might be defined by a minimum and/or maximum value.

langfuse.score(
    trace_id=message.trace_id,
    observation_id=message.generation_id, # optional
    name="accuracy",
    value=0.9,
    comment="Factually correct", # optional
    id="unique_id" # optional, can be used as an indempotency key to update the score subsequently
    config_id="78545-6565-3453654-43543" # optional, to ensure that the score follows a specific min/max value range
    data_type="NUMERIC" # optional, possibly inferred
)

await langfuse.score({
  traceId: message.traceId,
  observationId: message.generationId, // optional
  name: "accuracy",
  value: 0.9,
  comment: "Factually correct", // optional
  id: "unique_id", // optional, can be used as an indempotency key to update the score subsequently
  configId: "78545-6565-3453654-43543", // optional, to ensure that the score follows a specific min/max value range
  dataType: "NUMERIC", // optional, possibly inferred
});

→ More details in Python SDK docs and JS/TS SDK docs. See API reference for more details on POST/GET score configs endpoints.

Creating Score Config object in Langfuse
A score config includes the desired score name, data type, and constraints on score value range such as min and max values for numerical data types and custom categories for categorical data types. See API reference for more details on POST/GET score configs endpoints. Configs are crucial to ensure that scores comply with a specific schema therefore standardizing them for future analysis.

Attribute	Type	Description
id	string	Unique identifier of the score config.
name	string	Name of the score config, e.g. user_feedback, hallucination_eval
dataType	string	Can be either NUMERIC, CATEGORICAL or BOOLEAN
isArchived	boolean	Whether the score config is archived. Defaults to false
minValue	number	Optional: Sets minimum value for numerical scores. If not set, the minimum value defaults to -∞
maxValue	number	Optional: Sets maximum value for numerical scores. If not set, the maximum value defaults to +∞
categories	list	Optional: Defines categories for categorical scores. List of objects with label value pairs
description	string	Optional: Provides further description of the score configuration
Detailed Score Ingestion Examples
Certain score properties might be inferred based on your input. If you don't provide a score data type it will always be inferred. See tables below for details. For boolean and categorical scores, we will provide the score value in both numerical and string format where possible. The score value format that is not provided as input, i.e. the translated value is referred to as the inferred value in the tables below. On read for boolean scores both numerical and string representations of the score value will be returned, e.g. both 1 and True. For categorical scores, the string representation is always provided and a numerical mapping of the category will be produced only if a score config was provided.

For example, let's assume you'd like to ingest a numeric score to measure accuracy. We have included a table of possible score ingestion scenarios below.

Value	Data Type	Config Id	Description	Inferred Data Type	Valid
0.9	Null	Null	Data type is inferred	NUMERIC	Yes
0.9	NUMERIC	Null	No properties inferred		Yes
depth	NUMERIC	Null	Error: data type of value does not match provided data type		No
0.9	NUMERIC	78545	No properties inferred		Conditional on config validation
0.9	Null	78545	Data type inferred	NUMERIC	Conditional on config validation
depth	NUMERIC	78545	Error: data type of value does not match provided data type		No
Data pipeline example
Pipeline
Langfuse
Application
Pipeline
Langfuse
Application
User
Ingest new traces
Fetch traces via SDK/API
Run custom evaluation function/package
Add score to trace via SDK/API
Analyze evaluation scores via UI & API
User
You can run custom evaluations on data in Langfuse by fetching traces from Langfuse (e.g. via the Python SDK) and then adding evaluation results as scores back to the traces in Langfuse.

The example notebook is a good template to get started with building your own evaluation pipeline.

Monitor LLM Security
There are a host of potential safety risks involved with LLM-based applications. These include prompt injection, leakage of personally identifiable information (PII), or harmful prompts. Langfuse can be used to monitor and protect against these security risks, and investigate incidents when they occur.

What is LLM Security?
LLM Security involves implementing protective measures to safeguard LLMs and their infrastructure from unauthorized access, misuse, and adversarial attacks, ensuring the integrity and confidentiality of both the model and data. This is crucial in AI/ML systems to maintain ethical usage, prevent security risks like prompt injections, and ensure reliable operation under safe conditions.

How does LLM Security work?
LLM Security can be addressed with a combination of

LLM Security libraries for run-time security measures
Langfuse for the ex-post evaluation of the effectiveness of these measures
1. Run-time security measures
There are several popular security libraries that can be used to mitigate security risks in LLM-based applications. These include: LLM Guard, Prompt Armor, NeMo Guardrails, Microsoft Azure AI Content Safety, Lakera. These libraries help with security measures in the following ways:

Catching and blocking a potentially harmful or inappropriate prompt before sending to the model
Redacting sensitive PII before being sending into the model and then un-redacting in the response
Evaluating prompts and completions on toxicity, relevance, or sensitive material at run-time and blocking the response if necessary
2. Monitoring and evaluation of security measures with Langfuse
Use Langfuse tracing to gain visibility and confidence in each step of the security mechanism. These are common workflows:

Manually inspect traces to investigate security issues.
Monitor security scores over time in the Langfuse Dashboard.
Validate security checks. You can use Langfuse scores to evaluate the effectiveness of security tools. Integrating Langfuse into your team's workflow can help teams identify which security risks are most prevalent and build more robust tools around those specific issues. There are two main workflows to consider:
Annotations (in UI). If you establish a baseline by annotating a share of production traces, you can compare the security scores returned by the security tools with these annotations.
Automated evaluations. Langfuse's model-based evaluations will run asynchronously and can scan traces for things such as toxicity or sensitivity to flag potential risks and identify any gaps in your LLM security setup. Check out the docs to learn more about how to set up these evaluations.
Track Latency. Some LLM security checks need to be awaited before the model can be called, others block the response to the user. Thus they quickly are an essential driver of overall latency of an LLM application. Langfuse can help disect the latencies of these checks within a trace to understand whether the checks are worth the wait.
Get Started
See how we use the open source library LLM Guard to anonymize and deanonymize PII and trace with Langfuse. All examples easily translate to other libraries.

JS/TS SDK
Github repository langfuse/langfuse-js
CI test status
npm langfuse
npm langfuse-node
If you are working with Node.js, Deno, or Edge functions, the langfuse library is the simplest way to integrate Langfuse into your application. The library queues calls to make them non-blocking.

Supported runtimes:

 Node.js
 Edge: Vercel, Cloudflare, ...
 Deno
Want to capture data (e.g. user feedback) from the browser? Use LangfuseWeb

Installation
npm i langfuse
# or
yarn add langfuse
 
# Node.js < 18
npm i langfuse-node
 
# Deno
import { Langfuse } from "https://esm.sh/langfuse"

.env
LANGFUSE_SECRET_KEY="sk-lf-...";
LANGFUSE_PUBLIC_KEY="pk-lf-...";
LANGFUSE_BASEURL="https://cloud.langfuse.com"; # 🇪🇺 EU region
# LANGFUSE_BASEURL="https://us.cloud.langfuse.com"; # 🇺🇸 US region

import { Langfuse } from "langfuse"; // or "langfuse-node"
 
// without additional options
const langfuse = new Langfuse();
 
// with additional options
const langfuse = new Langfuse({
  release: "v1.0.0",
  requestTimeout: 10000,
});

Optional constructor parameters:

Variable	Description	Default value
release	The release number/hash of the application to provide analytics grouped by release.	process.env.LANGFUSE_RELEASE or common system environment names
requestTimeout	Timeout in ms for requests	10000
enabled	Set to false to disable sending events	true if api keys are set, otherwise false
In short-lived environments (e.g. serverless functions), make sure to always call langfuse.shutdownAsync() at the end to await all pending requests. (Learn more)

End-to-end example
JS SDK & Vercel AI SDK
Making calls
Each backend execution is logged with a single trace.
Each trace can contain multiple observations to log the individual steps of the execution.
Observations can be of different types
Events are the basic building block. They are used to track discrete events in a trace.
Spans represent durations of units of work in a trace.
Generations are spans which are used to log generations of AI model. They contain additional attributes about the model and the prompt/completion and are specifically rendered in the Langfuse UI.
Observations can be nested.
Create a trace
Traces are the top-level entity in the Langfuse API. They represent an execution flow in a LLM application usually triggered by an external event.

// Example trace creation
const trace = langfuse.trace({
  name: "chat-app-session",
  userId: "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
  metadata: { user: "user@langfuse.com" },
  tags: ["production"],
});
 
// Example update, same params as create, cannot change id
trace.update({
  metadata: {
    tag: "long-running",
  },
});
 
// Properties
trace.id; // string
 
// Create observations
trace.event({});
trace.span({});
trace.generation({});
 
// Add scores
trace.score({});

langfuse.trace() takes the following parameters

parameter	type	optional	description
id	string	yes	The id of the trace can be set, defaults to a random id. Set it to link traces to external systems or when grouping multiple runs into a single trace (e.g. messages in a chat thread).
name	string	yes	Identifier of the trace. Useful for sorting/filtering in the UI.
input	object	yes	The input of the trace. Can be any JSON object.
output	object	yes	The output of the trace. Can be any JSON object.
metadata	object	yes	Additional metadata of the trace. Can be any JSON object. Metadata is merged when being updated via the API.object.
sessionId	string	yes	Used to group multiple traces into a session in Langfuse. Use your own session/thread identifier.
userId	string	yes	The id of the user that triggered the execution. Used to provide user-level analytics.
version	string	yes	The version of the trace type. Used to understand how changes to the trace type affect metrics. Useful in debugging.
tags	string[]	yes	Tags are used to categorize or label traces. Traces can be filtered by tags in the UI and GET API. Tags can also be changed in the UI. Tags are merged and never deleted via the API.
public	boolean	yes	You can make a trace public to share it via a public link. This allows others to view the trace without needing to log in or be members of your Langfuse project.
Observations
Events are the basic building block. They are used to track discrete events in a trace.
Spans represent durations of units of work in a trace.
Generations are spans which are used to log generations of AI models. They contain additional attributes about the model, the prompt/completion. For generations, token usage and model cost are automatically calculated.
Observations can be nested.
Create an Event
Events are used to track discrete events in a trace.

// Example event
const event = trace.event({
  name: "get-user-profile",
  metadata: {
    attempt: 2,
    httpRoute: "/api/retrieve-person",
  },
  input: {
    userId: "user__935d7d1d-8625-4ef4-8651-544613e7bd22",
  },
  output: {
    firstName: "Maxine",
    lastName: "Simons",
    email: "maxine.simons@langfuse.com",
  },
});
 
// Properties
event.id; // string
event.traceId; // string
event.parentObservationId; // string | undefined
 
// Create children
event.event({});
event.span({});
event.generation({});
 
// Add scores
event.score({});

*.event() takes the following parameters

parameter	type	optional	description
id	string	yes	The id of the event can be set, defaults to a random id.
startTime	Date	yes	The time at which the event started, defaults to the current time.
name	string	yes	Identifier of the event. Useful for sorting/filtering in the UI.
metadata	object	yes	Additional metadata of the event. Can be any JSON object. Metadata is merged when being updated via the API.
level	string	yes	The level of the event. Can be DEBUG, DEFAULT, WARNING or ERROR. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
statusMessage	string	yes	The status message of the event. Additional field for context of the event. E.g. the error message of an error event.
input	object	yes	The input to the event. Can be any JSON object.
output	object	yes	The output to the event. Can be any JSON object.
version	string	yes	The version of the event type. Used to understand how changes to the event type affect metrics. Useful in debugging.
Create a Span
Spans represent durations of units of work in a trace. We generated convenient SDK functions for generic spans as well as LLM spans.

// Example span creation
const span = trace.span({
  name: "embedding-retrieval",
  input: {
    userInput: "How does Langfuse work?",
  },
});
 
// Example update
span.update({
  metadata: {
    httpRoute: "/api/retrieve-doc",
    embeddingModel: "bert-base-uncased",
  },
});
 
// Application code
const retrievedDocs = await retrieveDoc("How does Langfuse work?");
 
// Example end - sets endTime, optionally pass a body
span.end({
  output: {
    retrievedDocs,
  },
});
 
// Properties
span.id; // string
span.traceId; // string
span.parentObservationId; // string | undefined
 
// Create children
span.event({});
span.span({});
span.generation({});
 
// Add scores
span.score({});

*.span() takes the following parameters

parameter	type	optional	description
id	string	yes	The id of the span can be set, otherwise a random id is generated.
startTime	Date	yes	The time at which the span started, defaults to the current time.
endTime	Date	yes	The time at which the span ended.
name	string	yes	Identifier of the span. Useful for sorting/filtering in the UI.
metadata	object	yes	Additional metadata of the span. Can be any JSON object. Metadata is merged when being updated via the API.
level	string	yes	The level of the span. Can be DEBUG, DEFAULT, WARNING or ERROR. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
statusMessage	string	yes	The status message of the span. Additional field for context of the event. E.g. the error message of an error event.
input	object	yes	The input to the span. Can be any JSON object.
output	object	yes	The output to the span. Can be any JSON object.
version	string	yes	The version of the span type. Used to understand how changes to the span type affect metrics. Useful in debugging.
Create a Generation
Generations are used to log generations of AI model. They contain additional attributes about the model and the prompt/completion and are specifically rendered in the Langfuse UI.

// Example generation creation
const generation = trace.generation({
  name: "chat-completion",
  model: "gpt-3.5-turbo",
  modelParameters: {
    temperature: 0.9,
    maxTokens: 2000,
  },
  input: messages,
});
 
// Application code
const chatCompletion = await llm.respond(prompt);
 
// Example update
generation.update({
  completionStartTime: new Date(),
});
 
// Example end - sets endTime, optionally pass a body
generation.end({
  output: chatCompletion,
});
 
// Properties
generation.id; // string
generation.traceId; // string
generation.parentObservationId; // string | undefined
 
// Create children
generation.event({});
generation.span({});
generation.generation({});
 
// Add scores
generation.score({});

*.generation() takes the following parameters

parameter	type	optional	description
id	string	yes	The id of the generation can be set, defaults to random id.
name	string	yes	Identifier of the generation. Useful for sorting/filtering in the UI.
startTime	Date	yes	The time at which the generation started, defaults to the current time.
completionStartTime	Date	yes	The time at which the completion started (streaming). Set it to get latency analytics broken down into time until completion started and completion duration.
endTime	Date	yes	The time at which the generation ended.
model	string	yes	The name of the model used for the generation.
modelParameters	object	yes	The parameters of the model used for the generation; can be any key-value pairs.
input	object	yes	The input to the generation - the prompt. Can be any JSON object or string.
output	object	yes	The output to the generation - the completion. Can be any JSON object or string.
usage	object	yes	The usage object supports the OpenAi structure with (promptTokens, completionTokens, totalTokens) and a more generic version (input, output, total, unit, inputCost, outputCost, totalCost) where unit can be of value "TOKENS", "CHARACTERS", "MILLISECONDS", "SECONDS", "IMAGES". Refer to the docs on how to automatically calculate tokens and costs by Langfuse.
metadata	object	yes	Additional metadata of the generation. Can be any JSON object. Metadata is merged when being updated via the API.
level	string	yes	The level of the generation. Can be DEBUG, DEFAULT, WARNING or ERROR. Used for sorting/filtering of traces with elevated error levels and for highlighting in the UI.
statusMessage	string	yes	The status message of the generation. Additional field for context of the event. E.g. the error message of an error event.
version	string	yes	The version of the generation type. Used to understand how changes to the generation type affect metrics. Reflects e.g. the version of a prompt.
prompt	Langfuse prompt	yes	Pass the prompt fetched from Langfuse Prompt Management via langfuse.getPrompt() in order to link the generation to a specific prompt version for analytics in Langfuse.
Nesting of observations
Nesting of observations (spans, events, generations) is helpful to structure the trace in a hierarchical way.

# Simple example; there are no limits to how you nest observations
- trace: chat-app-session
  - span: chat-interaction
    - event: get-user-profile
    - generation: chat-completion

There are two options to nest observations:

const trace = langfuse.trace({ name: "chat-app-session" });
 
const span = trace.span({ name: "chat-interaction" });
 
span.event({ name: "get-user-profile" });
span.generation({ name: "chat-completion" });

Create score
Scores are used to evaluate executions/traces. They are attached to a single trace. If the score relates to a specific step of the trace, the score can optionally also be attached to the observation to enable evaluating it specifically.

Links

Learn more about Scores in Langfuse
Report scores from the browser (e.g. user feedback) using the Web SDK
await langfuse.score({
  traceId: message.traceId,
  observationId: message.generationId,
  name: "quality",
  value: 1,
  comment: "Factually correct",
});
 
// alternatively
trace.score({});
span.score({});
event.score({});
generation.score({});

parameter	type	optional	description
traceId	string	no	The id of the trace to which the score should be attached. Automatically set if you use {trace,generation,span,event}.score({})
observationId	string	yes	The id of the observation to which the score should be attached. Automatically set if you use {generation,span,event}.score({})
name	string	no	Identifier of the score.
value	number	no	The value of the score. Can be any number, often standardized to 0..1
comment	string	yes	Additional context/explanation of the score.
Shutdown
The Langfuse SDKs sends events asynchronously to the Langfuse server. You should call shutdown to exit cleanly before your application exits.

langfuse.shutdown();
// or
await langfuse.shutdownAsync();

Debugging
Issues with the SDKs can be caused by various reasons ranging from incorrectly configured API keys to network issues.

The SDK does not throw errors to protect your application process. Instead, you can optionally listen to errors:

langfuse.on("error", (error) => {
  // Whatever you want to do with the error
  console.error(error);
});

Alternatively, you can enable debugging to get detailed logs of what's happening in the SDK.

langfuse.debug();

Short lived execution environments (lambda, serverless, Vercel, Cloudflare)
The SDK is optimize to run in the background to queue and flush all requests. Events can get lost if the process exits before all requests are flushed. To ensure all events are sent, use one of the following patterns:

Option 1: Waiting for flushAsync but returning immediately
Some platforms/frameworks support waiting for promises after the response but before exiting the process. This is the preferred way to ensure all events are sent without blocking the process.

Note: Most of these execution environments have a timeout after which the process is killed. Some of them lack observability to monitor these dangling promises.

Cloudflare workers: waitUntil (mdn, example)

Vercel (e.g. NextJs): waitUntil

npm i @vercel/functions

import { waitUntil } from "@vercel/functions";
// within the api handler
waitUntil(langfuse.flushAsync());

Option 2: shutdownAsync
When the process exits use await langfuse.shutdownAsync() to make sure all requests are flushed and pending requests are awaited. Call this once at the end of your process.

Example:

const langfuse = new Langfuse({
  secretKey: "sk-lf-...",
  publicKey: "pk-lf-...",
})
 
export const handler() {
  const trace = langfuse.trace({ name: "chat-app-session" });
 
  trace.event({ name: "get-user-profile" });
  const span = trace.span({ name: "chat-interaction" });
  span.generation({ name: "chat-completion", model: "gpt-3.5-turbo", input: prompt, output: completion });
 
  // So far all requests are queued
 
  // Now we want to flush and await all pending requests before the process exits
  await langfuse.shutdownAsync();
}

Upgrading from v2.x.x to v3.x.x
This release includes breaking changes only for users of the Langchain JS integration. The upgrade is non-breaking for all other parts of the SDK.

Upgrading from v1.x.x to v2.x.x
You can automatically migrate your codebase using grit, either online or with the following CLI command:

npx @getgrit/launcher apply langfuse_node_v2

The grit binary executes entirely locally with AST-based transforms. Be sure to audit its changes: we suggest ensuring you have a clean working tree beforehand, and running git add --patch afterwards.

Dropped support for Node.js < 16
As most of our users are using a modern JS/TS stack, we decided to drop support for Node < 16.

Rename prompt and completion to input and output
To ensure consistency throughout Langfuse, we have renamed the prompt and completion parameters in the generation function to input and output, respectively. This change brings them in line with the rest of the Langfuse API.

More generalized usage object
We improved the flexibility of the SDK by allowing you to ingest any type of usage while still supporting the OpenAI-style usage object.

v1.x.x

langfuse.generation({
  name: "chat-completion",
  usage = {
    promptTokens: 50,
    completionTokens: 49,
    totalTokens: 99,
  },
});

v2.x.x

The usage object supports the OpenAi structure with {'promptTokens', 'completionTokens', 'totalTokens'} and a more generic version {'input', 'output', 'total', 'unit'} where unit can be of value "TOKENS", "CHARACTERS", "MILLISECONDS", "SECONDS", "IMAGES". For some models the token counts are automatically calculated by Langfuse. Create an issue to request support for other units and models.

// Generic style
langfuse.generation({
  name = "my-claude-generation",
  usage = {
    input: 50,
    output: 49,
    total: 99,
    unit: "TOKENS",
  },
});
 
// OpenAI style
langfuse.generation({
  name = "my-openai-generation",
  usage = {
    promptTokens: 50,
    completionTokens: 49,
    totalTokens: 99,
  }, // defaults to "TOKENS" unit
});
 
// set ((input and/or output) or total), total is calculated automatically if not set

Upgrading from v0.x to v1.x
Deprecation of externalTraceId
We deprecated the external trace id to simplify the API. Instead, you can now (optionally) directly set the trace id when creating the trace. Traces are still upserted in case a trace with this id already exists in your project.

// v0.x
const trace = langfuse.trace({ externalId: "123" });
// When manually linking observations and scores to the trace
const span = langfuse.span({ traceId: "123", traceIdType: "EXTERNAL" });
const score = langfuse.score({ traceId: "123", traceIdType: "EXTERNAL" });
 
// v1.x
const trace = langfuse.trace({ id: "123" });
// When manually linking observations and scores to the trace
const span = langfuse.span({ traceId: "123" });
const score = langfuse.score({ traceId: "123" });

Changes

The traceIdType property is deprecated
The externalId property on traces is deprecated
Ingestion of externalIds via older versions of the SDK or the API is still supported. However, we will remove support for this in the future and migrate all existing traces to the new format. We monitor the usage of deprecated properties on Langfuse Cloud and will reach out to you if we detect that you are still using them before a breaking change is introduced.

Introduction of shutdownAsync
With v1.0.0 we introduced the shutdownAsync method to make sure all requests are flushed and pending requests are awaited before the process exits. flush is still available but does not await pending requests that are already flushed.

This is especially important for short-lived execution environments such as lambdas and serverless functions.

export const handler() {
  // Lambda / serverless function
 
  // v0.x
  await langfuse.flush();
 
  // v1.x
  await langfuse.shutdownAsync();
}

Example
We integrated the Typescript SDK into the Vercel AI Chatbot project. Check out the blog post for screenshots and detailed explanations of the inner workings of the integration. The project includes:

Streamed responses from OpenAI
Conversations
Collection of user feedback on individual messages using the Web SDK


Query Traces
Langfuse is open-source and data tracked with Langfuse is open. You can query/export data via: SDKs, API, and Langfuse UI.

Common use cases:

Train or fine-tune models on the production traces in Langfuse. E.g. to create a small model after having used a large model in production for a specific use case.
Collect few-shot examples to improve quality of output.
Programmatically create datasets.
Want to learn more about the Langfuse data model? Check out our introduction to tracing in Langfuse.

SDKs
Via the SDKs for Python and JS/TS you can easily query the API without having to write the HTTP requests yourself.

npm install langfuse

import { Langfuse } from "langfuse";
const langfuse = new Langfuse({
  secretKey: "sk-lf-...",
  publicKey: "pk-lf-...",
  baseUrl: "https://cloud.langfuse.com", // 🇪🇺 EU region
  // baseUrl: "https://us.cloud.langfuse.com", // 🇺🇸 US region
});
 
// Fetch list of traces, supports filters and pagination
const traces = await langfuse.fetchTraces();
 
// Fetch a single trace by ID
const trace = await langfuse.fetchTrace("traceId");
 
// Fetch list of observations, supports filters and pagination
const observations = await langfuse.fetchObservations();
 
// Fetch a single observation by ID
const observation = await langfuse.fetchObservation("observationId");
 
// Fetch list of sessions
const sessions = await langfuse.fetchSessions();

JS/TS SDK reference including all available filters:

fetchTraces()
fetchTrace()
fetchObservations()
fetchObservation()
fetchSessions()
API
All data in Langfuse is available via the API. Refer to the API reference for more information.

Example routes:

GET /api/public/traces
GET /api/public/traces/:traceId
 
GET /api/public/observations
GET /api/public/observations/:observationId
 
GET /api/public/sessions
 
GET /api/public/scores
GET /api/public/scores/:scoreId

Export via UI
This is currently only available for the generations table in the UI. We're working on adding more export options for other objects.

All filters applied to the table will be applied to the export.

Available export formats:

CSV
JSON
Download generations in Langfuse UI

Trouble exporting?
If you're having trouble exporting data, please let us know and we'll help you out.

