using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;




[ApiController]
[Route("api/[controller]")]
public class PRController : ControllerBase
{

    private readonly IHttpClientFactory _httpClientFactory;

    public PRController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }


    [HttpPost]
    public async Task<IActionResult> ReceivePullRequest([FromBody] PullRequestPayload payload)
    {
        if (payload == null) return BadRequest("Payload is null");

        CallCommitsUrl callCommitsUrl = new CallCommitsUrl(_httpClientFactory);


        //hitting the github rest api endpoint to get the files changed in the pull request
        //and the changes associated with each file
        await callCommitsUrl.Invoke(payload);


        return Ok("Pull request processed successfully.");

    }
}
