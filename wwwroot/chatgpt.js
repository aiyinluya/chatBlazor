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

document.addEventListener('DOMContentLoaded', function () {
    var clipboard = new ClipboardJS('.copy-button', {
        text: function (trigger) {
            // 获取相邻的 message-text 元素
            var messageTextElement = trigger.previousElementSibling;

            // 如果找到 message-text 元素
            if (messageTextElement) {
                // 创建一个临时 div 元素
                var tempDiv = document.createElement('div');

                // 设置其 innerHTML 为 message-text 元素的 innerHTML
                tempDiv.innerHTML = messageTextElement.innerHTML;

                // 返回纯文本内容
                return tempDiv.textContent || tempDiv.innerText;
            }

            // 如果未找到 message-text 元素，则返回空字符串
            return '';
        }
    });

    clipboard.on('success', function (e) {
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        alert('Copy failed. Please try selecting the text manually.');
    });
});
