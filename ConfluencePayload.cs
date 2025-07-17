using Microsoft.OpenApi.Expressions;

public class ConfluencePayload
{
    public string? id { get; set; }
    public string? type { get; set; }
    public string? title { get; set; }
    public Space? space { get; set; }
    public Body? body { get; set; }

    public Version? version { get; set; }

}

public class Space
{
    public string? key { get; set; }
}

public class Body
{
    public Storage? storage { get; set; }
}

public class Storage
{
    public string? value { get; set; }
    public string? representation { get; set; }
}

public class Version
{
    public int number { get; set; }
}