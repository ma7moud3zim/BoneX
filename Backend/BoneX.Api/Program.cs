using AspNetCore.Scalar;
using BoneX.Api;
using Microsoft.AspNetCore.Builder;

//var builder = WebApplication.CreateBuilder(args);

//builder.WebHost.UseWebRoot("wwwroot");

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = "wwwroot" // ? Set WebRootPath correctly at startup
});

builder.Services.AddHttpClient();

builder.Services.AddDependencies(builder.Configuration);

var app = builder.Build();


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
//{
app.UseSwagger();

app.UseSwaggerUI();
//}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

//app.UseExceptionHandler();

app.Run();
