<template>
  <div class="min-h-screen bg-[#0f172a] text-white overflow-y-auto">
    <div class="max-w-7xl mx-auto px-8 py-8">
      <!-- Header con boton de regreso -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button
            @click="$router.push('/')"
            class="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-slate-200">Ayuda</h1>
        </div>
        <button
          class="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>

      <p class="text-slate-400 mb-8">Informacion del sistema y del estudiante</p>

      <!-- Grid de 2 columnas -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Informacion del Estudiante -->
        <div class="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-200">Informacion del Estudiante</h2>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Nombre</span>
              <span class="text-slate-300 font-medium">Christian Javier Rivas Arreaga</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Carnet</span>
              <span class="text-blue-400 font-mono">202303204</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Curso</span>
              <span class="text-slate-300">Lenguajes Formales y de Programacion</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Proyecto</span>
              <span class="text-slate-300">JavaBridge - Traductor Java a Python</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Semestre</span>
              <span class="text-slate-300">Segundo Semestre 2025</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-500 text-sm">Seccion</span>
              <span class="text-slate-300">C</span>
            </div>
          </div>
        </div>

        <!-- Informacion del Sistema -->
        <div class="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-slate-200">Informacion del Sistema</h2>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Nombre del Sistema</span>
              <span class="text-slate-300 font-medium">JavaBridge</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Empresa</span>
              <span class="text-slate-300">Universidad de San Carlos</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Version</span>
              <span class="text-emerald-400 font-mono">1.0.0 (Beta)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Backend</span>
              <span class="text-slate-300 font-mono">Node.js + Express</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-700/30">
              <span class="text-slate-500 text-sm">Frontend</span>
              <span class="text-slate-300 font-mono">Vue 3 + Tailwind CSS</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-500 text-sm">Base de Datos</span>
              <span class="text-slate-300">En Memoria (JSON)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Caracteristicas del Sistema -->
      <div class="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-slate-200">Caracteristicas del Sistema</h2>
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <!-- Dia 1 -->
          <div class="bg-slate-900/30 border border-blue-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">DIA 1</span>
            </div>
            <ul class="space-y-2 text-sm text-slate-400">
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Analisis lexico (AFD manual)</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Reconocimiento de tokens</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Deteccion de errores lexicos</span>
              </li>
            </ul>
          </div>

          <!-- Dia 2 -->
          <div class="bg-slate-900/30 border border-emerald-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">DIA 2</span>
            </div>
            <ul class="space-y-2 text-sm text-slate-400">
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Analisis sintactico (Parser)</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Construccion de AST</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Traduccion Java → Python</span>
              </li>
            </ul>
          </div>

          <!-- Adicional -->
          <div class="bg-slate-900/30 border border-amber-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">ADICIONAL</span>
            </div>
            <ul class="space-y-2 text-sm text-slate-400">
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Reportes HTML profesionales</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Interfaz Vue + Tailwind</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>API REST con Express</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center text-slate-600 text-sm mt-8">
        <p>Copyright © 2025 - JavaBridge</p>
        <p class="mt-1">Universidad de San Carlos de Guatemala - Facultad de Ingenieria</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
};
</script>
