-- Script para crear tablas Zombies, Simulaciones y Eliminados con claves foráneas

CREATE TABLE Zombies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Tipo NVARCHAR(100) NOT NULL,
    TiempoDisparos INT NOT NULL,
    BalasNecesarias INT NOT NULL,
    NivelAmenaza INT NOT NULL
);

CREATE TABLE Simulaciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Fecha DATETIME NOT NULL,
    TiempoDisponible INT NOT NULL,
    BalasDisponibles INT NOT NULL
);

CREATE TABLE Eliminados (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ZombieId INT NOT NULL,
    SimulacionId INT NOT NULL,
    PuntosObtenidos INT NOT NULL,
    Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Eliminados_Zombie FOREIGN KEY (ZombieId) REFERENCES Zombies(Id),
    CONSTRAINT FK_Eliminados_Simulacion FOREIGN KEY (SimulacionId) REFERENCES Simulaciones(Id)
);
