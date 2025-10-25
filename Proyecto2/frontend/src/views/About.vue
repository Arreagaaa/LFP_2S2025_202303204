<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <button
        @click="$router.push('/')"
        class="mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Volver al Editor
      </button>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <h1 class="text-4xl font-bold mb-2">JavaBridge</h1>
            <p class="text-xl text-blue-300">Traductor de Java a Python</p>
            <p class="text-sm text-gray-400 mt-2">Version 1.0.0</p>
          </div>

          <div class="border-t border-white/20 pt-6">
            <h2 class="text-2xl font-bold mb-4">Informacion del Proyecto</h2>
            
            <div class="space-y-4">
              <div class="bg-white/5 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Descripcion</h3>
                <p class="text-gray-300">
                  JavaBridge es un traductor automatico de codigo Java a Python que implementa
                  analisis lexico y sintactico manual (sin uso de expresiones regulares).
                  Soporta tipos de datos basicos, estructuras de control (if, for, while),
                  operaciones aritmeticas y logicas.
                </p>
              </div>

              <div class="bg-white/5 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Curso</h3>
                <p class="text-gray-300">
                  Lenguajes Formales y de Programacion<br>
                  Facultad de Ingenieria<br>
                  Universidad de San Carlos de Guatemala
                </p>
              </div>

              <div class="bg-white/5 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Desarrollador</h3>
                <p class="text-gray-300">
                  Carnet: 202303204<br>
                  Proyecto 2 - Segundo Semestre 2025
                </p>
              </div>

              <div class="bg-white/5 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Caracteristicas</h3>
                <ul class="text-gray-300 space-y-2">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Analizador lexico con AFD implementado manualmente
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Analizador sintactico descendente recursivo
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Traduccion de tipos de datos (int, double, char, String, boolean)
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Soporte para estructuras de control (if-else, for, while)
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Generacion de reportes HTML (tokens, errores lexicos y sintacticos)
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Interfaz web moderna y responsiva
                  </li>
                </ul>
              </div>

              <div class="bg-white/5 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-300 mb-2">Tecnologias Utilizadas</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                      <span class="text-green-400 font-bold text-sm">JS</span>
                    </div>
                    <span class="text-gray-300">JavaScript (ES6+)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                      <span class="text-green-400 font-bold text-sm">V</span>
                    </div>
                    <span class="text-gray-300">Vue 3</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                      <span class="text-blue-400 font-bold text-sm">TW</span>
                    </div>
                    <span class="text-gray-300">Tailwind CSS</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center">
                      <span class="text-green-500 font-bold text-sm">N</span>
                    </div>
                    <span class="text-gray-300">Node.js + Express</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center text-gray-400 text-sm">
          <p>Copyright 2025 - JavaBridge</p>
          <p class="mt-1">Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
};
</script>
