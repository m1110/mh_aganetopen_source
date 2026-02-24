        
        let conditions = `if the user message is associated with a first or last name, assume the data returned is their name.`
        let extractValues = async (userMessage: any) => `The user was asked for one or more of the following fields: 
    
        let state: { [key: string]: string | null } = {
          "First Name": null,
          "Last Name": null,
          "address": null,
          "date and start time": null,
          "email": null,
          "Phone Number": null,
        };
        
        and responded with: "${userMessage}". Compare the users response to the state object. ${conditions} Extract the values. Output a single array with field name as the first element and the value as the second element. Don't include any commentary or additional words. Only output the array e.g. [ '$field', '$value' ] `;

        export default extractValues;