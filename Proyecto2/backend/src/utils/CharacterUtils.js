// Utilidades para validacion de caracteres sin usar expresiones regulares

export class CharacterUtils {
    // Verifica si es una letra (a-z, A-Z)
    static isLetter(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    // Verifica si es un digito (0-9)
    static isDigit(char) {
        if (!char) return false;
        const code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    // Verifica si es alfanumerico (letra o digito)
    static isAlphanumeric(char) {
        return this.isLetter(char) || this.isDigit(char);
    }

    // Verifica si es un espacio en blanco
    static isWhitespace(char) {
        return char === ' ' || char === '\t' || char === '\n' || char === '\r';
    }

    // Verifica si es un guion bajo
    static isUnderscore(char) {
        return char === '_';
    }

    // Verifica si puede iniciar un identificador
    static canStartIdentifier(char) {
        return this.isLetter(char) || this.isUnderscore(char);
    }

    // Verifica si puede continuar un identificador
    static canContinueIdentifier(char) {
        return this.isAlphanumeric(char) || this.isUnderscore(char);
    }
}
