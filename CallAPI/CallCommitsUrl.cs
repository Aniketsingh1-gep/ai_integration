using System.Text.Json;

public class CallCommitsUrl
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CallCommitsUrl(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
    public async Task Invoke(PullRequestPayload payload)
    {
        var commitsUrlClient = _httpClientFactory.CreateClient();
        
        commitsUrlClient.DefaultRequestHeaders.Add("User-Agent", "Nexxe-PRProject/1.0");
        commitsUrlClient.DefaultRequestHeaders.Add("Accept", "*/*");

        try
        {
            // Fetching the files changed in the pull request along with the changes associated with each file

            var fileResponse = await commitsUrlClient.GetAsync($"https://api.github.com/repos/{payload.Head.Repo.Full_Name}/pulls/{payload.Number}/files");

            if (!fileResponse.IsSuccessStatusCode)
            {
                throw new Exception($"Error fetching commits: {fileResponse.ReasonPhrase}");
            }

            var fileContent = await fileResponse.Content.ReadAsStringAsync();

            using var jsonDoc = JsonDocument.Parse(fileContent);
            var jsonElement = jsonDoc.RootElement;


            //i have to remove it later
            //storing the file names and their changes in a dictionary
            //key is the file name and value is the changes associated with that file (patch)
            Dictionary<string, Dictionary<string, string>> confluenceMap = new Dictionary<string, Dictionary<string,string>>();

            foreach (var file in jsonElement.EnumerateArray())
            {
                var fileName = file.GetProperty("filename").GetString();
                var patch = file.GetProperty("patch").GetString();


                //i have to remove it later
                fileName = $"packages/components/{fileName}";
                
                int secondSlashIndex = fileName.IndexOf('/', fileName.IndexOf('/') + 1);

                int thirdSlashIndex = fileName.IndexOf('/', secondSlashIndex + 1);

                string confluencePageTitle = fileName.Substring(secondSlashIndex + 1, thirdSlashIndex - secondSlashIndex - 1);

                if(!confluenceMap.ContainsKey(confluencePageTitle))
                {
                    confluenceMap[confluencePageTitle] = new Dictionary<string, string>();
                }

                //later will change confluencePageTitle to fileName
                confluenceMap[confluencePageTitle].Add(fileName, patch);
            }
            

            CallConfluenceAPI callConfluenceAPI = new CallConfluenceAPI(_httpClientFactory);

            // Invoking the Confluence API with the file map and PR body
            //payload.Body is the PR body
            await callConfluenceAPI.Invoke(confluenceMap, payload.Body);

        }
        catch (Exception ex)
        {
            throw new Exception($"Error calling commits API: {ex.Message}", ex);
        }
    }
}