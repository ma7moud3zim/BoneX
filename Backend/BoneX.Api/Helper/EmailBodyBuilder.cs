namespace BoneX.Api.Helper;

public static class EmailBodyBuilder
{
    public static string GenerateEmailBody(string template, Dictionary<string, string> templateModel)
    {
        //var templatePath = $"{Directory.GetCurrentDirectory()}/Templates/{template}.html";
        //var streamReader = new StreamReader(templatePath);
        //var body = streamReader.ReadToEnd();
        //streamReader.Close();

        //foreach (var item in templateModel)
        //    body = body.Replace(item.Key, item.Value);

        //return body;

        var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", $"{template}.html");
        if (!File.Exists(templatePath))
        {
            throw new FileNotFoundException($"Template '{template}.html' not found.");
        }
        var body = File.ReadAllText(templatePath);

        foreach (var item in templateModel)
        {
            body = body.Replace(item.Key, item.Value);
        }

        return body;
    }
}
