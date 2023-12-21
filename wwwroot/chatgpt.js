window.chatGPT = {
    sendMessage: function (message, apiKey, dotNetReference) {
        console.log('sendMessage', message);
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message }
                ]
            })
        })
            .then(response => {
                if (response.status === 429) {
                    console.log('Rate limit exceeded. Retrying after a delay...');
                    setTimeout(() => window.chatGPT.sendMessage(message, apiKey, dotNetReference), 1000); // Retry after 1 second
                } else if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Request failed with status: ' + response.status);
                }
            })
            .then(data => {
                dotNetReference.invokeMethodAsync('ReceiveMessage', data.choices[0].message.content);
            })
            .catch(error => console.error('Error:', error));
    }
};