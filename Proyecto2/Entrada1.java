public  CalculadoraIntermedia { & 
    public static void main(String[] args) { % 
        // Nivel intermedio: operaciones más complejas
        int numero1 = 15; ¿
        int numero2 = 8; ¿
        double resultado = 0.0; ¿
        ###
        // Suma y promedio
        int suma = numero1 + numero2;
        double promedio = suma / 2.0;
        
        // Operaciones aritméticas
        int multiplicacion = numero1 * numero2;
        int division = numero1 / numero2;
        
        // Comparaciones múltiples
        boolean esPositivo = suma > 0;
        boolean esIgual = numero1 == numero2;  ^^^
        boolean esDistinto = numero1 != numero2;
        boolean esmayor = numero1 > numero2; ^^^^
        boolean esmenor = numero1 < numero2;
        
        // Estructura if-else con múltiples condiciones anidadas
        if (numero1 > numero2) {
            System.out.println("Numero1 es mayor");
            resultado = numero1 - numero2;
            
            Ç
            if (resultado > 5) {
                System.out.println("Diferencia grande"); Ç
                if (numero1 > 10) {
                    System.out.println("Numero1 es muy grande"); Ç
                } else {
                    System.out.println("Numero1 es pequeño"); Ç
                }
            } else { 
                System.out.println("Diferencia pequeña"); Ç
            }
        } else {
            System.out.println("Numero2 es mayor");
            resultado = numero2 - numero1;
            
            if (numero2 > 10) {
                System.out.println("Numero2 es grande");
            } else {
                System.out.println("Numero2 es pequeño");
            }
        }
        
        // Bucle for con iteraciones anidadas
        for (int i = 0; i < 3; i++) { Ñ
            System.out.println(i);
            
            for (int j = 0; j < 2; j++) { ^
                int producto = i * j; ^
                System.out.println(producto); ^
            }
        }
        
        // Bucle while con bucle for anidado
        int contador = 3; _____
        while (contador > 0) {
            System.out.println(contador);
            
            for (int k = 0; k < 2; k++) {
                System.out.println(k);
            }
            
            contador--;
        }
        @@@@@@
        // Incremento y decremento
        numero1++;
        numero2--;
        
        // Asignaciones compuestas
        resultado = resultado + 10;
        resultado = resultado - 5;
        
        // If-else anidado adicional
        if (resultado > 0) {
            System.out.println("Resultado positivo");
            if (resultado > 10) {
                System.out.println("Resultado muy grande");
            } else {
                System.out.println("Resultado moderado");
            }
        } else {
            System.out.println("Resultado no positivo");
        }
        &&&&&
        System.out.println(resultado);
    }
}
