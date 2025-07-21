-- Consulta para analizar cuántos zombies de cada tipo se eliminaron por simulación

SELECT 
    s.Id AS SimulacionId,
    s.Fecha,
    z.Tipo AS TipoZombie,
    COUNT(e.Id) AS CantidadEliminados
FROM Eliminados e
INNER JOIN Zombies z ON e.ZombieId = z.Id
INNER JOIN Simulaciones s ON e.SimulacionId = s.Id
GROUP BY s.Id, s.Fecha, z.Tipo
ORDER BY s.Id, z.Tipo;
