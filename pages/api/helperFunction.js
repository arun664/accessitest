import axios from "axios";
export async function getAdviceFromMistral(violation) {
    // Construct the prompt to specify the JSON format we want
    const prompt = `For the accessibility violation with description ${violation.description} provide a short advice to help developers fix it. The response should be in one line stating the advice`;
  
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions', // Use the chat completion endpoint
      {
        model: "pixtral-12b-2409", // Model for generating text
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt }, // Include the prompt in the message
            ],
          },
        ],
        max_tokens: 300, // Maximum number of tokens for the response
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    // Parse the JSON response from Mistral (likely in the format you specified)

    // console.log(response.data.choices[0].message.content);
    // console.log(response.data.choices[0].message.content.advice);
    let adviceData = response.data.choices[0].message.content;
    adviceData = adviceData.trim();
    // const adviceObject = JSON.parse(adviceData);
    //  console.log(adviceObject);
    // console.log(adviceData);
    // const adviceObject = JSON.parse(adviceData);
    // console.log(adviceObject);
    // console.log(adviceObject);
    // if (Array.isArray(adviceObject)) {
    //   // If it's an array, extract the first element
    //   return adviceObject[0];
    // } else {
    //   // If it's an object, return it directly
    //   return adviceObject;
    // }
    return adviceData
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn('Rate limit exceeded for Mistral API. Skipping advice for this violation.');
      return 'Rate Limit Exceeded'; // Return a specific message for rate limit errors
    }else {
      console.error("Error fetching advice from Mistral:", error);
      throw new Error('Failed to retrieve advice from Mistral');
    }
  }
  }
  