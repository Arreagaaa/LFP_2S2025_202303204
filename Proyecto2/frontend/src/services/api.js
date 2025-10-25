import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para comunicación con el backend
 */
export const apiService = {
    /**
     * Analiza código Java
     * @param {string} code - Código Java a analizar
     * @returns {Promise} Resultado del análisis
     */
    async analyze(code) {
        try {
            const response = await axios.post(`${API_URL}/analyze`, { code });
            return response.data;
        } catch (error) {
            console.error('Error al analizar código:', error);
            throw error;
        }
    },

    /**
     * Genera reporte HTML de tokens
     * @param {Array} tokens - Array de tokens
     * @returns {Promise<string>} HTML del reporte
     */
    async getTokenReport(tokens) {
        try {
            const response = await axios.post(`${API_URL}/report/tokens`, 
                { tokens },
                { responseType: 'text' }
            );
            return response.data;
        } catch (error) {
            console.error('Error al generar reporte de tokens:', error);
            throw error;
        }
    },

    /**
     * Genera reporte HTML de errores
     * @param {Array} errors - Array de errores
     * @returns {Promise<string>} HTML del reporte
     */
    async getErrorReport(errors) {
        try {
            const response = await axios.post(`${API_URL}/report/errors`, 
                { errors },
                { responseType: 'text' }
            );
            return response.data;
        } catch (error) {
            console.error('Error al generar reporte de errores:', error);
            throw error;
        }
    }
};
