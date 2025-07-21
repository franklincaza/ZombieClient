-- Tabla bitácora para auditoría de cambios en Eliminados
CREATE TABLE EliminadosAudit (
    AuditId INT IDENTITY(1,1) PRIMARY KEY,
    EliminadoId INT,
    ZombieId INT,
    SimulacionId INT,
    PuntosObtenidos INT,
    Timestamp DATETIME,
    Operacion NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE'
    FechaOperacion DATETIME DEFAULT GETDATE()
);

-- Trigger para auditar INSERT, UPDATE y DELETE en Eliminados
CREATE TRIGGER trg_Eliminados_Audit
ON Eliminados
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Auditoría para INSERT
    INSERT INTO EliminadosAudit (EliminadoId, ZombieId, SimulacionId, PuntosObtenidos, Timestamp, Operacion)
    SELECT 
        i.Id, i.ZombieId, i.SimulacionId, i.PuntosObtenidos, i.Timestamp, 'INSERT'
    FROM inserted i
    LEFT JOIN deleted d ON i.Id = d.Id
    WHERE d.Id IS NULL;

    -- Auditoría para UPDATE
    INSERT INTO EliminadosAudit (EliminadoId, ZombieId, SimulacionId, PuntosObtenidos, Timestamp, Operacion)
    SELECT 
        i.Id, i.ZombieId, i.SimulacionId, i.PuntosObtenidos, i.Timestamp, 'UPDATE'
    FROM inserted i
    INNER JOIN deleted d ON i.Id = d.Id;

    -- Auditoría para DELETE
    INSERT INTO EliminadosAudit (EliminadoId, ZombieId, SimulacionId, PuntosObtenidos, Timestamp, Operacion)
    SELECT 
        d.Id, d.ZombieId, d.SimulacionId, d.PuntosObtenidos, d.Timestamp, 'DELETE'
    FROM deleted d
    LEFT JOIN inserted i ON d.Id = i.Id
    WHERE i.Id IS NULL;
END;
