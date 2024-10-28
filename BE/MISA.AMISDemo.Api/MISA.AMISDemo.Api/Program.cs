using MISA.AMISDemo.Core;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Exceptions;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Core.Services;
using MISA.AMISDemo.Infrastructure.Interface;
using MISA.AMISDemo.Infrastructure.MISADatabaseContext;
using MISA.AMISDemo.Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
Common.ConnectionString = builder.Configuration.GetConnectionString("Database1");

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

//Config DI
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IMISADbContext, MySqlDbContext>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IBaseRepository<Employee>, EmployeeRepository>();

builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
    builder => builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader());
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<HandleExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAllOrigins");

app.Run();
