var builder = WebApplication.CreateBuilder(args);

var customerMap = new Dictionary<Guid, Customer>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CorsPolicy");
app.UseHttpsRedirection();

app.MapPost("/customers", (CreateCustomerRequest request) =>
{
    var customer = new Customer
    {
        Id = Guid.NewGuid(),
        Name = request.Name,
        Email = request.Email
    };
    customerMap.Add(customer.Id, customer);
    return Results.Ok(customer);
});

app.MapGet("/customers", () =>
{
    return Results.Ok(customerMap.Values);
});

app.MapGet("/customers/{id}", (Guid id) =>
{
    var customer = customerMap.GetValueOrDefault(id);
    if (customer is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(customer);
});

app.Run();

record Customer
{
    public Guid Id { get; init; }

    public required string Name { get; init; }

    public required string Email { get; init; }
}

record CreateCustomerRequest
{
    public required string Name { get; init; }
    public required string Email { get; init; }
}
