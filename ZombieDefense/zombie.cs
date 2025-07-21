using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace ZombieDefense.Models
{
    public class Zombie
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = null!;
        public int TiempoDisparos { get; set; }
        public int BalasNecesarias { get; set; }
        public int NivelAmenaza { get; set; }
        public int Puntaje { get; set; }

        public ICollection<Eliminado> Eliminados { get; set; } = new List<Eliminado>();
    }

    public class Simulacion
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public int TiempoDisponible { get; set; }
        public int BalasDisponibles { get; set; }

        public ICollection<Eliminado> Eliminados { get; set; } = new List<Eliminado>();
    }

    public class Eliminado
    {
        public int Id { get; set; }
        public int ZombieId { get; set; }
        public Zombie Zombie { get; set; } = null!;
        public int SimulacionId { get; set; }
        public Simulacion Simulacion { get; set; } = null!;
        public int PuntosObtenidos { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class ZombieDb : DbContext
    {
        public ZombieDb(DbContextOptions options) : base(options) { }
        public DbSet<Zombie> Zombie { get; set; } = null!;
        public DbSet<Simulacion> Simulacion { get; set; } = null!;
        public DbSet<Eliminado> Eliminado { get; set; } = null!;
    }
}
