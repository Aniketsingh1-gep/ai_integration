public class PullRequestPayload
{
    public string? Url { get; set; } // start from here
    public long Id { get; set; }
    public int Number { get; set; }
    public string? State { get; set; }
    public string? Title { get; set; }
    public string? Body { get; set; }
    public User? User { get; set; }
    public Branch? Head { get; set; }
    public Branch? Base { get; set; }
    public bool Merged { get; set; }
    public bool? Mergeable { get; set; }
    public DateTime Created_At { get; set; }
    public DateTime Updated_At { get; set; }
}

public class User
{
    public string? Login { get; set; }
    public long Id { get; set; }
    public string? Html_Url { get; set; }
}

public class Branch
{
    public string? Label { get; set; }
    public string? Ref { get; set; }
    public string? Sha { get; set; }
    public Repo? Repo { get; set; }
}

public class Repo
{
    public string? Full_Name { get; set; }
    public string? Html_Url { get; set; }
}

