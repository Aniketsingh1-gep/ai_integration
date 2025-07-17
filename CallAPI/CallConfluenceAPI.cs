using System.Text;
using System.Text.Json;

public class CallConfluenceAPI
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CallConfluenceAPI(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    

    public async Task Invoke(Dictionary<string, Dictionary<string, string>> confluenceMap, string PRBody)
    {
        var confluenceClient = _httpClientFactory.CreateClient("ConfluenceAPI");

        var username = Environment.GetEnvironmentVariable("CONFLUENCE_USERNAME");

        var apiToken = Environment.GetEnvironmentVariable("CONFLUENCE_API_TOKEN");

        var authString = $"{username}:{apiToken}";

        var base64Auth = Convert.ToBase64String(Encoding.ASCII.GetBytes(authString));

        Console.WriteLine($"Base64Auth: {base64Auth}");

        confluenceClient.DefaultRequestHeaders.Add("User-Agent", "Nexxe-PRProject/1.0");

        confluenceClient.DefaultRequestHeaders.Add("Accept", "*/*");

        confluenceClient.DefaultRequestHeaders.Add("Authorization", $"Basic ZGFrc2hqYWluMTkwNUBnbWFpbC5jb206QVRBVFQzeEZmR0YwUEFXUUM0Yk5LcldtUGI2bEpGdGhCeVZJZmpKNzJlX2gyeHNyYmpZbGJldkxsMHhZRlk2dUN6OWFzN0dRZGV0ZktTdjZlR2t3eERocG0yNkZnMTNnRUpuOUZYa0YzZTAxUV8zN0pEdjA5eDJhei13Q0loaVdZMHdOdTM5M0NBYXotOUx5VDk2M3QzR2kwRU5BZ3VaMjlPVnVQbmg0aEE4Z1dyN0pPb3h3Z0drPUUwQTQzMzM3");



        try
        {
            //checking if the page already exists in Confluence
            //if it exists, we will update the page with the new content
            

            //i have to remove it later
            //this is a map of confluence page titles to their IDs
            Dictionary<string, string> confluenceTitleToID = new Dictionary<string, string>();
            
            confluenceTitleToID.Add("test.py", "2064386");
            confluenceTitleToID.Add("test_2.py", "2064395");
            confluenceTitleToID.Add("grid-numeric-lib", "2752515");

            for (int i = 0; i < confluenceMap.Count; i++)
            {
                var confluencePageTitle = confluenceMap.Keys.ElementAt(i);
                var fileMap = confluenceMap[confluencePageTitle];


                var existingConfluenceResponse = await confluenceClient.GetAsync($"https://{username}.atlassian.net/wiki/rest/api/content/{confluenceTitleToID[confluencePageTitle]}?expand=body.storage,version,space");

                var existingBody = "";


                if (!existingConfluenceResponse.IsSuccessStatusCode)
                {
                    //calling the AI agent to generate the content for the Confluence page
                    CallAIAgent callAIAgent = new CallAIAgent(_httpClientFactory);

                    string finalBody = await callAIAgent.Invoke(fileMap, PRBody, existingBody);

                    ConfluencePayload confluencePayload = new ConfluencePayload
                    {
                        type = "page",
                        title = "Python Test 2",
                        space = new Space { key = Environment.GetEnvironmentVariable("CONFLUENCE_SPACE_KEY") },
                        body = new Body
                        {
                            storage = new Storage
                            {
                                value = finalBody,
                                representation = "storage"
                            }
                        }
                    };


                    var confluenceJson = JsonSerializer.Serialize(confluencePayload);

                    var confluenceContent = new StringContent(confluenceJson, Encoding.UTF8, "application/json");


                    //since page didn't exist, we will create a new page in Confluence
                    //we will use the POST method to create a new page
                    //when we hit post request to this endpoint, we can map the corresponding title of the page to its ID
                    var confluencePostResponse = await confluenceClient.PostAsync($"https://{username}.atlassian.net/wiki/rest/api/content", confluenceContent);

                    var responseBody = await confluencePostResponse.Content.ReadAsStringAsync();

                    Console.WriteLine(confluencePostResponse.StatusCode);
                    Console.WriteLine(responseBody);
                }



                else
                {
                    //since page already exists, we will read the existing content of the page
                    var existingContent = await existingConfluenceResponse.Content.ReadAsStringAsync();
                    var existingJsonDoc = JsonDocument.Parse(existingContent);
                    var existingJsonElement = existingJsonDoc.RootElement;

                    existingBody = existingJsonElement.GetProperty("body").GetProperty("storage").GetProperty("value").GetString();

                    var spaceKey = existingJsonElement.GetProperty("space").GetProperty("key").GetString();

                    var title = existingJsonElement.GetProperty("title").GetString();

                    var id = existingJsonElement.GetProperty("id").GetString();

                    var version = existingJsonElement.GetProperty("version").GetProperty("number").GetInt32();


                    //now we will call the AI agent to generate the content for the Confluence page based on the files changed in the PR, the existing content of the page and the PR body
                    CallAIAgent callAIAgent = new CallAIAgent(_httpClientFactory);

                    string finalBody = await callAIAgent.Invoke(fileMap, PRBody, existingBody);


                    ConfluencePayload confluencePayload = new ConfluencePayload
                    {
                        id = id,
                        type = "page",
                        title = title,
                        space = new Space { key = spaceKey },
                        body = new Body
                        {
                            storage = new Storage
                            {
                                value = finalBody,
                                representation = "storage"
                            }
                        },
                        version = new Version { number = version + 1 }
                    };
                    var confluenceJson = JsonSerializer.Serialize(confluencePayload);

                    var confluenceContent = new StringContent(confluenceJson, Encoding.UTF8, "application/json");


                    //since page already exists, we will update the page with the new content
                    //we will use the PUT method to update the existing page
                    var response = await confluenceClient.PutAsync($"https://{username}.atlassian.net/wiki/rest/api/content/{id}", confluenceContent);
                    Console.WriteLine(response.Content.ReadAsStringAsync()); 
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calling Confluence API: {ex.Message}");
            throw;
        }
    }
}