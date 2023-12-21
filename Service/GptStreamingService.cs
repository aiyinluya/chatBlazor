// GptStreamingService.cs
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace chatBlazor.Service
{
    public class GptStreamingService
    {
        private readonly HttpClient httpClient;

        public GptStreamingService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task StreamGptResponseAsync(string userInput, string apiKey, DotNetObjectReference<chatBlazor.Pages.Chat> dotNetReference)
        {
            try
            {
                string gptApiUrl = "https://api.openai.com/v1/chat/completions";

                // 构造请求内容
                string jsonContent = $"{{\"input\": \"{userInput}\"}}";
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                // 设置请求头部
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                // 发送 POST 请求
                using (HttpResponseMessage response = await httpClient.PostAsync(gptApiUrl, content, CancellationToken.None))
                using (var responseStream = await response.Content.ReadAsStreamAsync())
                using (var reader = new StreamReader(responseStream, Encoding.UTF8))
                {
                    while (!reader.EndOfStream)
                    {
                        string line = await reader.ReadLineAsync();

                        // 处理逐行的数据，例如将其发送到前端
                        // dotNetReference.InvokeMethodAsync("ReceiveMessage", line);
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                // 捕获 HTTP 请求异常
                Console.WriteLine($"HTTP 请求异常: {ex.Message}");
            }
            catch (Exception ex)
            {
                // 捕获其他异常
                Console.WriteLine($"发生异常: {ex.Message}");
            }
        }
    }
}
