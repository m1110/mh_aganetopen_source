import { StateGraph, END } from '@langchain/langgraph'
import { graphDecisioning } from './edges/graphDecisioning'
import { generalIntelligence } from './nodes/generalIntelligence'
import { selectQueryAction } from './edges/selectQueryAction';
import { patientCounselor } from './nodes/patientCounselor';
import { doctorBennett } from './nodes/doctorBennett';
import { conversationLocator } from './nodes/conversationLocator';
import { bundleQueries } from './nodes/bundleQueries';
import { submitQueries } from './nodes/submitQueries';
import { searchTool } from './nodes/generalIntelligenceChain'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { createTrace, createSpan, createGeneration, endGeneration, endSpan, createEvent } from './utils/helper'
import { Langfuse } from 'langfuse';

export function createMainWorkflow(agentState) {

    // Create tool node
    const toolNode = new ToolNode([searchTool]);

    const workflow = new StateGraph({
        channels: agentState,
    });
    console.log(`📊 main graph`)

    const LANGFUSE_SECRET_KEY="sk-lf-3d5c9290-dbee-4dfb-82ff-7952db8227dc"
    const LANGFUSE_PUBLIC_KEY="pk-lf-9d14cd85-dcd8-4146-a6c6-e98d58aa03e6"

    const langfuse = new Langfuse({
        publicKey: LANGFUSE_PUBLIC_KEY,
        secretKey:LANGFUSE_SECRET_KEY,
        baseUrl: 'https://us.cloud.langfuse.com'
      });

    
    workflow.addNode("go", async (state) => { 
        
        const span = await createSpan(state.trace.trace, state.request_id, "Starting Agent", state.input, {});
        // trace: any, spanId: string, requestId: string, name: string, input: string, metadata: any
        const event = await createEvent(state.trace.trace, span.id, state.request_id, "Identify Next Steps", state.input, {})

        // trace: any, requestId: string, name: string, input: string, metadata: any
        // span: any, name: string, model: string, input: string, prompt: object
        
        // const generation = await createGeneration(span, "Go", "gpt-4o-mini", state.input);
        
        try {
            // await endGeneration(generation, 'Finding 1st Node');
            await endSpan(span, 'Passing to next agent');
        } catch (error) {
            console.log("Error in 1st Node", error)
            await endSpan(span, error.message);
            // await endEvent(event, 'Passing to the next agent')
        }
    return {...state} 
    
    });
    workflow.addNode("end", (state) => { console.log('ending now.....end state:'); return {...state} });
    workflow.addNode("generalIntelligence", generalIntelligence);
    workflow.addNode("patientCounselor", patientCounselor);
    workflow.addNode("doctorBennett", doctorBennett);
    workflow.addNode("tools", toolNode);
    
    workflow.setEntryPoint("go");

    workflow.addConditionalEdges("go", async (state) => { 
        let graphDecision = await graphDecisioning(state); 
        console.log('graphDecision:', graphDecision)
        return graphDecision;
    }, { 
        generalIntelligence: "generalIntelligence",
        patientCounselor: "patientCounselor",
        end: "end"  
    });

    workflow.addEdge("go", END);
    workflow.addEdge("patientCounselor", "doctorBennett");
    workflow.addEdge("doctorBennett", "end");
    workflow.addEdge("generalIntelligence", END);

    workflow.addConditionalEdges(
        "generalIntelligence",
        (state) => {
            try {
                const messages = state.chatHistory;
                const lastMessage = messages[messages.length - 1];
                
                if (lastMessage?.tool_calls?.length) {
                    console.log('Tool calls found:', lastMessage.tool_calls);
                    return "tools";
                }
                return END;
            } catch (error) {
                console.error('Error in conditional edge:', error);
                return END;
            }
        },
        {
            tools: "tools",
            [END]: END
        }
    );

    
    workflow.addConditionalEdges(
        "patientCounselor",
        (state) => {
            try {
                const lastMessage = state.chatHistory[state.chatHistory.length - 1];
                console.log('Checking for tool calls in:', lastMessage);
                
                if (lastMessage?.additional_kwargs?.tool_calls?.length) {
                    console.log('Tool calls found:', lastMessage.additional_kwargs.tool_calls);
                    return "tools";
                }
                return "doctorBennett";
            } catch (error) {
                console.error('Error in conditional edge:', error);
                return "doctorBennett"; // Default path on error
            }
        },
        {
            tools: "tools",
            doctorBennett: "doctorBennett"
        }
    );

    workflow.addEdge("tools", "patientCounselor");
    

    return workflow;
}
