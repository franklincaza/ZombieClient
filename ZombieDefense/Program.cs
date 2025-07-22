using Microsoft.OpenApi.Models;
using ZombieDefense.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5154);
});

builder.Services.AddDbContext<ZombieDb>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ZombieDefense API",
        Description = "Game the strategy zombie",
        Version = "v1"
    });

    // Agregar esquema de seguridad ApiKey
    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "ApiKey needed to access the endpoints. ApiKey: X-API-KEY",
        Type = SecuritySchemeType.ApiKey,
        Name = "X-API-KEY",
        In = ParameterLocation.Header,
        Scheme = "ApiKeyScheme"
    });

    var securityRequirement = new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                },
                Scheme = "ApiKeyScheme",
                Name = "ApiKey",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    };

    c.AddSecurityRequirement(securityRequirement);
});

// Swagger para documentación OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZombieDefense API V1");
});

app.UseWhen(context => !context.Request.Path.StartsWithSegments("/swagger") && !context.Request.Path.Equals("/"), appBuilder =>
{
    appBuilder.UseMiddleware<ApiKeyMiddleware>();
});

app.MapGet("/", () => "🧟 Zombie dennse Api Funcionando...");

// Endpoints CRUD para Zombies
app.MapGet("/zombies", async (ZombieDb db) => await db.Zombie.ToListAsync());

app.MapGet("/zombies/{id}", async (int id, ZombieDb db) =>
    await db.Zombie.FindAsync(id) is Zombie zombie ? Results.Ok(zombie) : Results.NotFound());

app.MapPost("/zombies", async (Zombie zombie, ZombieDb db) =>
{
    db.Zombie.Add(zombie);
    await db.SaveChangesAsync();
    return Results.Created($"/zombies/{zombie.Id}", zombie);
});

app.MapPut("/zombies/{id}", async (int id, Zombie inputZombie, ZombieDb db) =>
{
    var zombie = await db.Zombie.FindAsync(id);
    if (zombie == null) return Results.NotFound();

    zombie.Tipo = inputZombie.Tipo;
    zombie.TiempoDisparos = inputZombie.TiempoDisparos;
    zombie.BalasNecesarias = inputZombie.BalasNecesarias;
    zombie.NivelAmenaza = inputZombie.NivelAmenaza;
    zombie.Puntaje = inputZombie.Puntaje;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/zombies/{id}", async (int id, ZombieDb db) =>
{
    var zombie = await db.Zombie.FindAsync(id);
    if (zombie == null) return Results.NotFound();

    db.Zombie.Remove(zombie);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Endpoints CRUD para Simulaciones
app.MapGet("/simulaciones", async (ZombieDb db) => await db.Simulacion.ToListAsync());

app.MapGet("/simulaciones/{id}", async (int id, ZombieDb db) =>
    await db.Simulacion.FindAsync(id) is Simulacion simulacion ? Results.Ok(simulacion) : Results.NotFound());

app.MapPost("/simulaciones", async (Simulacion simulacion, ZombieDb db) =>
{
    db.Simulacion.Add(simulacion);
    await db.SaveChangesAsync();
    return Results.Created($"/simulaciones/{simulacion.Id}", simulacion);
});

app.MapPut("/simulaciones/{id}", async (int id, Simulacion inputSimulacion, ZombieDb db) =>
{
    var simulacion = await db.Simulacion.FindAsync(id);
    if (simulacion == null) return Results.NotFound();

    simulacion.Fecha = inputSimulacion.Fecha;
    simulacion.TiempoDisponible = inputSimulacion.TiempoDisponible;
    simulacion.BalasDisponibles = inputSimulacion.BalasDisponibles;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/simulaciones/{id}", async (int id, ZombieDb db) =>
{
    var simulacion = await db.Simulacion.FindAsync(id);
    if (simulacion == null) return Results.NotFound();

    db.Simulacion.Remove(simulacion);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Endpoints CRUD para Eliminados
app.MapGet("/eliminados", async (ZombieDb db) => await db.Eliminado.Include(e => e.Zombie).Include(e => e.Simulacion).ToListAsync());

app.MapGet("/eliminados/{id}", async (int id, ZombieDb db) =>
    await db.Eliminado.Include(e => e.Zombie).Include(e => e.Simulacion).FirstOrDefaultAsync(e => e.Id == id) is Eliminado eliminado ? Results.Ok(eliminado) : Results.NotFound());

app.MapPost("/eliminados", async (Eliminado eliminado, ZombieDb db) =>
{
    eliminado.Timestamp = DateTime.UtcNow;
    db.Eliminado.Add(eliminado);
    await db.SaveChangesAsync();
    return Results.Created($"/eliminados/{eliminado.Id}", eliminado);
});

app.MapPut("/eliminados/{id}", async (int id, Eliminado inputEliminado, ZombieDb db) =>
{
    var eliminado = await db.Eliminado.FindAsync(id);
    if (eliminado == null) return Results.NotFound();

    eliminado.ZombieId = inputEliminado.ZombieId;
    eliminado.SimulacionId = inputEliminado.SimulacionId;
    eliminado.PuntosObtenidos = inputEliminado.PuntosObtenidos;
    eliminado.Timestamp = inputEliminado.Timestamp;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/eliminados/{id}", async (int id, ZombieDb db) =>
{
    var eliminado = await db.Eliminado.FindAsync(id);
    if (eliminado == null) return Results.NotFound();

    db.Eliminado.Remove(eliminado);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Endpoint para crear datos de prueba
app.MapPost("/datos-prueba", async (ZombieDb db) =>
{
    // Crear zombies
    var zombie1 = new Zombie { Tipo = "Caminante", TiempoDisparos = 5, BalasNecesarias = 3, NivelAmenaza = 1, Puntaje = 10 };
    var zombie2 = new Zombie { Tipo = "Corredor", TiempoDisparos = 3, BalasNecesarias = 2, NivelAmenaza = 2, Puntaje = 20 };
    db.Zombie.AddRange(zombie1, zombie2);

    // Crear simulacion
    var simulacion = new Simulacion { Fecha = DateTime.UtcNow, TiempoDisponible = 60, BalasDisponibles = 100 };
    db.Simulacion.Add(simulacion);

    await db.SaveChangesAsync();

    // Crear eliminados
    var eliminado1 = new Eliminado { ZombieId = zombie1.Id, SimulacionId = simulacion.Id, PuntosObtenidos = 10, Timestamp = DateTime.UtcNow };
    var eliminado2 = new Eliminado { ZombieId = zombie2.Id, SimulacionId = simulacion.Id, PuntosObtenidos = 20, Timestamp = DateTime.UtcNow };
    db.Eliminado.AddRange(eliminado1, eliminado2);

    await db.SaveChangesAsync();

    return Results.Ok("Datos de prueba creados correctamente");
});

app.MapGet("/api/defense/optimal-strategy", async (int bullets, int secondsAvailable, ZombieDb db) =>
{
    var zombies = await db.Zombie.ToListAsync();

    // Definir clase para resultado de estrategia
    var strategy = new List<object>();

    // Programación dinámica para mochila multidimensional (balas y tiempo)
    // Variables discretas para DP: balas y tiempo
    int maxBullets = bullets;
    int maxTime = secondsAvailable;

    // Crear DP array: dp[balas, tiempo] = puntaje máximo
    int[,] dp = new int[maxBullets + 1, maxTime + 1];

    // Para reconstruir la solución, guardar qué zombie se eligió y cuántas veces
    var choice = new (int count, int zombieIndex)[maxBullets + 1, maxTime + 1];

    for (int i = 0; i < zombies.Count; i++)
    {
        var z = zombies[i];
        int b = z.BalasNecesarias;
        int t = z.TiempoDisparos;
        int p = z.Puntaje;

        // Iterar en reversa para evitar reutilización múltiple en el mismo paso
        for (int bulletsLeft = maxBullets; bulletsLeft >= b; bulletsLeft--)
        {
            for (int timeLeft = maxTime; timeLeft >= t; timeLeft--)
            {
                int maxCount = Math.Min(bulletsLeft / b, timeLeft / t);
                for (int count = 1; count <= maxCount; count++)
                {
                    int newBullets = bulletsLeft - count * b;
                    int newTime = timeLeft - count * t;
                    int newScore = dp[newBullets, newTime] + count * p;
                    if (newScore > dp[bulletsLeft, timeLeft])
                    {
                        dp[bulletsLeft, timeLeft] = newScore;
                        choice[bulletsLeft, timeLeft] = (count, i);
                    }
                }
            }
        }
    }

    // Reconstruir la solución
    int remBullets = maxBullets;
    int remTime = maxTime;
    var resultCounts = new int[zombies.Count];

    while (remBullets > 0 && remTime > 0)
    {
        var c = choice[remBullets, remTime];
        if (c.count == 0) break;
        resultCounts[c.zombieIndex] += c.count;
        remBullets -= c.count * zombies[c.zombieIndex].BalasNecesarias;
        remTime -= c.count * zombies[c.zombieIndex].TiempoDisparos;
    }

    int totalScore = 0;
    for (int i = 0; i < zombies.Count; i++)
    {
        if (resultCounts[i] > 0)
        {
            strategy.Add(new
            {
                Tipo = zombies[i].Tipo,
                Cantidad = resultCounts[i],
                PuntajeTotal = resultCounts[i] * zombies[i].Puntaje
            });
            totalScore += resultCounts[i] * zombies[i].Puntaje;
        }
    }

    return Results.Ok(new
    {
        Strategy = strategy,
        TotalScore = totalScore,
        BulletsUsed = maxBullets - remBullets,
        TimeUsed = maxTime - remTime
    });
})
.WithName("GetOptimalStrategy")
.WithSummary("Obtiene la estrategia óptima de defensa dado el número de balas y segundos disponibles");

app.Run();
