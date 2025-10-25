import express from "express";
import cors from "cors";
import { Lexer } from "./lexer/Lexer.js";
import { ReportGenerator } from "./reports/ReportGenerator.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Ruta principal
 */
app.get("/", (req, res) => {
  res.json({
    message: "JavaBridge Backend API",
    version: "1.0.0",
    endpoints: {
      analyze: "POST /api/analyze",
      tokenReport: "POST /api/report/tokens",
      errorReport: "POST /api/report/errors",
    },
  });
});

/**
 * Análisis léxico
 * POST /api/analyze
 * Body: { code: string }
 */
app.post("/api/analyze", (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó código para analizar",
      });
    }

    // Crear analizador léxico
    const lexer = new Lexer(code);
    const result = lexer.analyze();

    res.json({
      success: true,
      tokens: result.tokens,
      errors: result.errors,
      hasErrors: result.errors.length > 0,
    });
  } catch (error) {
    console.error("Error en análisis:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

/**
 * Generar reporte HTML de tokens
 * POST /api/report/tokens
 * Body: { tokens: array }
 */
app.post("/api/report/tokens", (req, res) => {
  try {
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron tokens",
      });
    }

    const html = ReportGenerator.generateTokenReport(tokens);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({
      success: false,
      error: "Error generando reporte",
      details: error.message,
    });
  }
});

/**
 * Generar reporte HTML de errores léxicos
 * POST /api/report/errors
 * Body: { errors: array }
 */
app.post("/api/report/errors", (req, res) => {
  try {
    const { errors } = req.body;

    if (!errors || !Array.isArray(errors)) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron errores",
      });
    }

    const html = ReportGenerator.generateLexicalErrorReport(errors);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({
      success: false,
      error: "Error generando reporte",
      details: error.message,
    });
  }
});

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api/analyze`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
