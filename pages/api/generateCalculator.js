import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "Return an average dollar amount for the following item and only return a numeric value: ";

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 250,
    })

    const basePromptOutput = baseCompletion.data.choices.pop();

    // const secondPrompt =
    //     `
    // Take the character name below and write a 1-2 sentence bio for the player.

    // Name: ${basePromptOutput.text}

    // Bio:
    // `

    // const secondPromptCompletion = await openai.createCompletion({
    //     model: 'text-davinci-003',
    //     prompt: `${secondPrompt}`,
    //     temperature: 0.85,
    //     max_tokens: 250,
    // })

    // const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({ output: basePromptOutput });
}

export default generateAction;