import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";

const pineconeVectorStore = async (userMessage: string) => {
    let trial = {};

    console.log("Pinecone Vector Store called...");

    if(!userMessage){
        throw new Error('No userMessage provided. Need an input for Pinecone search.');
    }

    console.log("userMessage received: ", userMessage);
    
    try {
        const client = new Pinecone();
        const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string) as any;

        // now connect to vector store
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.key
        }), 
            { pineconeIndex }
            
        );
            
            // now Search
            const filteredSearch = await vectorStore.similaritySearch(userMessage, 10, { project: 'introspect-v2' })
            // console.log(`🔎 filteredSearch`, filteredSearch);

            let contextArr = [];
            let meta_data = {}
            if(filteredSearch.length > 1){
            filteredSearch.forEach((result) => {
                const pageContent = result.pageContent
                const pageNumber = result.metadata.pageNo
                const totalPages = result.metadata.totalPages
                const chunkNumber = result.metadata.chunkNumber
                const url = result.metadata.url
                const relevant_data_object = { pageContent, pageNumber, totalPages, chunkNumber, url }
                contextArr.push(relevant_data_object)
            })
            } else {
                contextArr.push(filteredSearch[0])
            }

            const array = { relevant_context_and_metadata: contextArr }
            console.log('array:', array)
            return array;

    } catch (error) {
        console.error(error);
    }

  }

export default pineconeVectorStore;