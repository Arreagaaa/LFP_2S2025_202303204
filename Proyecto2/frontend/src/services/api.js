import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Servicio para comunicacion con el backend
const api = {
  // Analiza codigo Java
  async analyze(code) {
    try {
      const response = await axios.post(`${API_URL}/analyze`, { code });
      return response.data;
    } catch (error) {
      console.error("Error al analizar codigo:", error);
      throw error;
    }
  },

  // Genera reporte HTML de tokens
  async getTokenReport(tokens, lexicalErrors = []) {
    try {
      const response = await axios.post(
        `${API_URL}/report/tokens`,
        { tokens, lexicalErrors },
        { responseType: "text" }
      );
      return response.data;
    } catch (error) {
      console.error("Error al generar reporte de tokens:", error);
      throw error;
    }
  },

  // Genera reporte HTML de errores lexicos
  async getErrorReport(errors) {
    try {
      const response = await axios.post(
        `${API_URL}/report/errors`,
        { errors },
        { responseType: "text" }
      );
      return response.data;
    } catch (error) {
      console.error("Error al generar reporte de errores:", error);
      throw error;
    }
  },

  // Genera reporte HTML de errores sintacticos
  async getSyntaxErrorReport(errors) {
    try {
      const response = await axios.post(
        `${API_URL}/report/syntax`,
        { errors },
        { responseType: "text" }
      );
      return response.data;
    } catch (error) {
      console.error("Error al generar reporte de errores sintacticos:", error);
      throw error;
    }
  },
};

export default api;
