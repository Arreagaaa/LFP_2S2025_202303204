public class PruebaElseIf {
    public static void main(String[] args) {
        // Prueba completa de estructuras Java
        int edad = 25;
        double promedio = 85.5;
        char letra = 'A';
        String nombre = "Juan";
        boolean activo = true;
        
        // Prueba de else if simple
        if (edad < 18) {
            System.out.println("Menor de edad");
        } else if (edad >= 18) {
            System.out.println("Mayor de edad");
        }
        
        // Prueba de else if múltiple
        if (promedio >= 90.0) {
            System.out.println("Excelente");
        } else if (promedio >= 80.0) {
            System.out.println("Muy bueno");
        } else if (promedio >= 70.0) {
            System.out.println("Bueno");
        } else if (promedio >= 60.0) {
            System.out.println("Regular");
        } else {
            System.out.println("Necesita mejorar");
        }
        
        // Prueba de else if con operaciones
        int numero = 15;
        if (numero > 20) {
            System.out.println("Mayor a 20");
            numero = numero - 10;
        } else if (numero > 10) {
            System.out.println("Entre 11 y 20");
            numero = numero + 5;
        } else if (numero > 5) {
            System.out.println("Entre 6 y 10");
            numero = numero * 2;
        } else {
            System.out.println("Menor o igual a 5");
            numero = numero + 1;
        }
        
        // Prueba de for con else if dentro
        for (int i = 0; i < 5; i++) {
            if (i == 0) {
                System.out.println("Primera iteracion");
            } else if (i == 4) {
                System.out.println("Ultima iteracion");
            } else {
                System.out.println("Iteracion intermedia");
            }
        }
        
        // Prueba de while con else if
        int contador = 10;
        while (contador > 0) {
            if (contador > 7) {
                System.out.println("Alto");
            } else if (contador > 3) {
                System.out.println("Medio");
            } else {
                System.out.println("Bajo");
            }
            contador--;
        }
        
        // Prueba de operadores comparación
        int x = 10;
        int y = 20;
        
        if (x == y) {
            System.out.println("Iguales");
        } else if (x != y) {
            System.out.println("Diferentes");
        }
        
        if (x < y) {
            System.out.println("x es menor");
        } else if (x > y) {
            System.out.println("x es mayor");
        }
        
        if (x <= 10) {
            System.out.println("x menor o igual a 10");
        } else if (x >= 10) {
            System.out.println("x mayor o igual a 10");
        }
        
        // Prueba de incremento y decremento
        int valor = 5;
        valor++;
        System.out.println(valor);
        valor--;
        System.out.println(valor);
        
        // Prueba con booleanos
        if (activo == true) {
            System.out.println("Esta activo");
        } else if (activo == false) {
            System.out.println("Esta inactivo");
        }
        
        System.out.println("Fin del programa");
    }
}
