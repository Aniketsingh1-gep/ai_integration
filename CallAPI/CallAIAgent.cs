using System.Text;
using System.Text.Json;

public class CallAIAgent
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CallAIAgent(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    private string BuildMessage(Dictionary<string, string> fileMap)
    {
        StringBuilder messageBuilder = new StringBuilder();
        foreach (var file in fileMap)
        {
            messageBuilder.AppendLine($"File Name: {file.Key}, Changes: {file.Value}");
        }
        Console.WriteLine("Message built for AI agent: " + messageBuilder.ToString());
        return messageBuilder.ToString();
    }

    public async Task<string> Invoke(Dictionary<string, string> fileMap, string PRBody,string existingBody)
    {
        AIAgentPayload agentPayload = new AIAgentPayload
        {
            bpc = 20210511,
            environment = "DEV",
            version = "1ac64535-37d5-44b0-b406-95a537780e0b",
            message = $"{BuildMessage(fileMap)}, Description: {PRBody}, Existing Content: {existingBody}",
            options = new Option
            {
                enableDebug = true,
                enableRelatedQuestions = true,
                sessionId = "d6a807ec-3151-4bba-8c10-3fe6279c7fd1",
                ReturnOnlyCurrentMessages = true
            }
        };

        var agentJson = JsonSerializer.Serialize(agentPayload);
        var agentContent = new StringContent(agentJson, Encoding.UTF8, "application/json");


        var agentClient = _httpClientFactory.CreateClient();


        var agentEndpoint = "https://api-build.gep.com/leo-portal-agentic-runtime-api/api/v1/agents/c8245f3f-648c-4131-bb3d-4d899a6c3507/invoke";

        // var authHeader = HttpContext.Request.Headers.Authorization.ToString();
        // Console.WriteLine("AuthHeader: " + authHeader);
        // if (string.IsNullOrEmpty(authHeader))
        // {
        //     Console.WriteLine("AuthHeader: " + authHeader);
        //     return Unauthorized("Missing or invalid Authorization header");
        // }


        // var subscriptionKey=HttpContext.Request.Headers["Ocp-Apim-Subscription-Key"].ToString();

        agentClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {Environment.GetEnvironmentVariable("AGENT_API_TOKEN")}");
        agentClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", $"{Environment.GetEnvironmentVariable("OCP-APIM-SUBSCRIPTION-KEY")}");


        try
        {
            //hitting the AI agent endpoint with the payload
            var agentResponse = await agentClient.PostAsync(agentEndpoint, agentContent);

            var resultContent = await agentResponse.Content.ReadAsStringAsync();

            if (!agentResponse.IsSuccessStatusCode)
            {
                throw new Exception($"AI agent error: {resultContent}");
            }

            using var jsonDoc = JsonDocument.Parse(resultContent);
            var jsonElement = jsonDoc.RootElement;

            Console.WriteLine(jsonElement.GetProperty("returnValue").GetProperty("messages")[1].GetProperty("content").GetString());

            return jsonElement.GetProperty("returnValue").GetProperty("messages")[1].GetProperty("content").GetString() ?? string.Empty;

        }
        catch (Exception ex)
        {
            throw new Exception($"Error calling AI agent: {ex.Message}", ex);
        }
    }
}