const apiKey = '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';
const promptText = 'Once upon a time,';
const maxTokens = 50; // Maximum number of tokens to generate

fetch('https://api.openai.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'text-davinci-004', // Or any other model you want to use
    prompt: promptText,
    max_tokens: maxTokens,
  }),
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  console.log('Response:', data.choices[0].text);
})
.catch(error => {
  console.error('Error:', error);
});