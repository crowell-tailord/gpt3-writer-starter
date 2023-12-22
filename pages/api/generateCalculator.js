import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Return an average price one would pay for the following item and only return a numeric value: ";

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    // const response = await openai.completions.create({
    //     model: 'gpt-3.5-turbo-instruct',
    //     prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    //     // temperature: 0.8,
    //     max_tokens: 250,
    // })
    // const reply = response.choices[0].text;
    // // const basePromptOutput = baseCompletion.data.choices.pop();
    // console.log('r',reply)
    // res.status(200).json({ output: reply });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          "role": "system",
          "content": basePromptPrefix
        },
        {
          "role": "user",
          "content": req.body.userInput
        }
      ],
      temperature: 0.5,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('res',response.choices[0].message.content)
    const reply = response.choices[0].message.content;
    res.status(200).json({output:reply})
}

export default generateAction;

