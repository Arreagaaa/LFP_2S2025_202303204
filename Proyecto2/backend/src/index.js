import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { Translator } from "./translator/Translator.js";
import { ReportGenerator } from "./reports/ReportGenerator.js";

const app = express();
const PORT = 3000;

// Crear directorio de reportes si no existe
const reportsDir = path.join(process.cwd(), "reportes");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Ruta principal
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

// Analisis completo: Lexico + Sintactico + Traduccion - POST /api/analyze - Body: { code: string }
app.post("/api/analyze", (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó código para analizar",
      });
    }

    // FASE 1: Analisis lexico
    const lexer = new Lexer(code);
    const lexResult = lexer.analyze();

    // Si hay errores lexicos, detener aqui
    if (lexResult.errors.length > 0) {
      return res.json({
        success: false,
        phase: "lexical",
        tokens: lexResult.tokens,
        lexicalErrors: lexResult.errors,
        syntaxErrors: [],
        pythonCode: null,
      });
    }

    // FASE 2: Analisis sintactico
    const parser = new Parser(lexResult.tokens);
    const parseResult = parser.parse();

    // Si hay errores sintacticos, detener aqui
    if (!parseResult.success || parseResult.errors.length > 0) {
      return res.json({
        success: false,
        phase: "syntax",
        tokens: lexResult.tokens,
        lexicalErrors: [],
        syntaxErrors: parseResult.errors,
        symbolTable: parseResult.symbolTable,
        pythonCode: null,
      });
    }

    // FASE 3: Traduccion a Python
    const translator = new Translator(parseResult.ast, lexResult.tokens);
    const pythonCode = translator.translate();

    res.json({
      success: true,
      phase: "complete",
      tokens: lexResult.tokens,
      lexicalErrors: [],
      syntaxErrors: [],
      symbolTable: parseResult.symbolTable,
      pythonCode: pythonCode,
    });
  } catch (error) {
    console.error("Error en analisis:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

// Generar reporte HTML de tokens - POST /api/report/tokens - Body: { tokens: array }
app.post("/api/report/tokens", (req, res) => {
  try {
    const { tokens, lexicalErrors = [] } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron tokens",
      });
    }

    const html = ReportGenerator.generateTokenReport(tokens, lexicalErrors);

    // Guardar reporte en archivo
    const fileName = `reporte_tokens_${Date.now()}.html`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, html, "utf8");

    console.log(`Reporte de tokens guardado: ${filePath}`);

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

// Generar reporte HTML de errores lexicos - POST /api/report/errors - Body: { errors: array }
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

    // Guardar reporte en archivo
    const fileName = `reporte_errores_lexicos_${Date.now()}.html`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, html, "utf8");

    console.log(`Reporte de errores lexicos guardado: ${filePath}`);

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

// Generar reporte HTML de errores sintacticos - POST /api/report/syntax - Body: { errors: array }
app.post("/api/report/syntax", (req, res) => {
  try {
    const { errors } = req.body;

    if (!errors || !Array.isArray(errors)) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron errores sintácticos",
      });
    }

    const html = ReportGenerator.generateSyntaxErrorReport(errors);

    // Guardar reporte en archivo
    const fileName = `reporte_errores_sintacticos_${Date.now()}.html`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, html, "utf8");

    console.log(`Reporte de errores sintacticos guardado: ${filePath}`);

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

// Health check
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
