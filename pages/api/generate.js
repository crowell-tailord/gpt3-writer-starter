// import { Configuration, OpenAIApi } from 'openai';

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAIApi(configuration);

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const basePromptPrefix = "Write me a DnD character name, in fantasy lore style, written by JRR Tolkien using inspiration from the following words: ";

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        // prompt: `${basePromptPrefix}${req.body.userInput}\n`,
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
        temperature: 0.8,
        max_tokens: 250,
    })
    // response.choices[0].message.content
    const basePromptOutput = baseCompletion.choices[0].message.content;

    const secondPrompt =
        `
    Take the character name below and write a 1-2 sentence bio for the player.

    Name: ${basePromptOutput}

    Bio:
    `

    const secondPromptCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        // prompt: `${secondPrompt}`,
        messages: [
            // {
            //   "role": "system",
            //   "content": basePromptPrefix
            // },
            {
              "role": "user",
              "content": secondPrompt
            }
        ],
        temperature: 0.85,
        max_tokens: 250,
    })

    const secondPromptOutput = secondPromptCompletion.choices[0].message.content;
    console.log(basePromptOutput, secondPromptOutput)

    res.status(200).json({ output: secondPromptOutput });
}

export default generateAction;