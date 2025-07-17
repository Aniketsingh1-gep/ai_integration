public class AIAgentPayload
{
    public long bpc { get; set; } // Business Process Code
    public string? environment { get; set; } // Environment name
    public string? version { get; set; } // Version of the application
    public string? message { get; set; } // Commit message
    public Option? options { get; set; } // Options for the pull request
}

public class Option
{
    public bool enableDebug { get; set; } // Enable debug mode
    public bool enableRelatedQuestions { get; set; } // Enable related questions
    public string? sessionId { get; set; } // Session ID for tracking
    public bool ReturnOnlyCurrentMessages { get; set; } // Return only current messages
}