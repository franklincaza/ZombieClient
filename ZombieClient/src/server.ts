import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json()); // Middleware para parsear JSON en requests

// Almacenamiento en memoria de estrategias históricas
const historicalStrategies: any[] = [];

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */


app.get('/api/defense/optimal-strategy', (req, res) => {
  const bullets = parseInt(req.query['bullets'] as string, 10);
  const secondsAvailable = parseInt(req.query['secondsAvailable'] as string, 10);

  if (isNaN(bullets) || isNaN(secondsAvailable)) {
    res.status(400).json({ error: 'Invalid bullets or secondsAvailable parameter' });
    return;
  }

  // Lógica para calcular la estrategia óptima basada en balas y tiempo disponibles

  // Definición de tipos de defensores con sus costos y puntajes
  const defenderTypes = [
    { tipo: 'Corredor', costoBalas: 4, tiempoDespliegue: 3, puntaje: 20 },
    { tipo: 'Tirador', costoBalas: 6, tiempoDespliegue: 5, puntaje: 35 },
    { tipo: 'Tanque', costoBalas: 10, tiempoDespliegue: 8, puntaje: 50 },
  ];

  let bulletsLeft = bullets;
  let timeLeft = secondsAvailable;
  const strategy: any[] = [];
  let totalScore = 0;
  let bulletsUsed = 0;
  let timeUsed = 0;

  // Estrategia simple: priorizar defensores con mayor puntaje por bala y tiempo
  defenderTypes.sort((a, b) => (b.puntaje / (b.costoBalas + b.tiempoDespliegue)) - (a.puntaje / (a.costoBalas + a.tiempoDespliegue)));

  for (const defender of defenderTypes) {
    let maxCantidadByBalas = Math.floor(bulletsLeft / defender.costoBalas);
    let maxCantidadByTiempo = Math.floor(timeLeft / defender.tiempoDespliegue);
    let cantidad = Math.min(maxCantidadByBalas, maxCantidadByTiempo);

    if (cantidad > 0) {
      strategy.push({
        tipo: defender.tipo,
        cantidad,
        puntajeTotal: cantidad * defender.puntaje,
      });

      bulletsUsed += cantidad * defender.costoBalas;
      timeUsed += cantidad * defender.tiempoDespliegue;
      totalScore += cantidad * defender.puntaje;

      bulletsLeft -= cantidad * defender.costoBalas;
      timeLeft -= cantidad * defender.tiempoDespliegue;
    }
  }

  res.json({
    strategy,
    totalScore,
    bulletsUsed,
    timeUsed,
  });
  return;
});

// Endpoint para registrar una estrategia real
app.post('/api/defense/strategy', (req, res) => {
  const strategy = req.body;

  if (
    !strategy ||
    typeof strategy.bullets !== 'number' ||
    typeof strategy.secondsAvailable !== 'number' ||
    !strategy.strategyDetails
  ) {
    res.status(400).json({ error: 'Invalid strategy data' });
    return;
  }

  // Guardar la estrategia en el almacenamiento en memoria
  historicalStrategies.push(strategy);

  res.status(201).json({ message: 'Strategy registered successfully' });
});

// Endpoint para obtener estrategias históricas ordenadas
app.get('/api/defense/strategies', (req, res) => {
  // Ordenar por balas descendente y luego por segundos descendente
  const sortedStrategies = historicalStrategies.sort((a, b) => {
    if (a.bullets !== b.bullets) return b.bullets - a.bullets;
    return b.secondsAvailable - a.secondsAvailable;
  });

  res.json(sortedStrategies);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
