// using Microsoft.OpenApi.Models;
using DotNetEnv;
DotNetEnv.Env.Load();



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

// app.UseAuthorization();

app.MapControllers();

app.Run();
