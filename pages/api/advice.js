import { getAdviceFromMistral } from "./helperFunction.js";

export default async function handler(req, res) {
  if (req.method === 'POST') {

  const { violations} = req.body;
  // console.log('violationIds:', violationIds);



  const mistralAdvice = []; // Changed to an array to hold multiple advice objects
    try {
      for (const violation of violations) {
        const advice = await getAdviceFromMistral(violation);
        let adviceObject={};
        console.log(violation)
        adviceObject['violation_id'] = violation.id;
        adviceObject['advice'] = advice;
        mistralAdvice.push(adviceObject); // Push the advice object to the array
      }

      res.status(200).json({ mistralAdvice }); // Send the array as advice
  } catch (error) {
    console.error('Error fetching advice:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
}