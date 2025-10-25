<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-700 to-green-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-green-600">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-lg font-semibold">Salida Python</span>
        <span v-if="hasContent" class="text-xs bg-green-800/50 px-2 py-1 rounded">
          {{ status }}
        </span>
      </div>
      <button
        v-if="pythonCode"
        @click="copyToClipboard"
        class="px-3 py-1 bg-green-800/50 hover:bg-green-700/50 rounded text-sm transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        Copiar
      </button>
    </div>

    <!-- Output Area -->
    <div class="flex-1 overflow-auto">
      <div v-if="!hasContent" class="h-full flex items-center justify-center text-gray-400">
        <div class="text-center">
          <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-lg">El codigo Python aparecera aqui</p>
          <p class="text-sm mt-2">Ejecuta el analisis para ver resultados</p>
        </div>
      </div>

      <div v-else-if="hasErrors" class="p-4">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1">
              <h3 class="text-red-800 font-semibold mb-2">Errores Encontrados</h3>
              <p class="text-red-700 text-sm mb-3">
                Se encontraron {{ errors.length }} error(es). 
                No se puede generar codigo Python.
              </p>
              <div class="space-y-2">
                <div
                  v-for="(error, index) in errors"
                  :key="index"
                  class="bg-white p-3 rounded border border-red-200"
                >
                  <div class="flex justify-between items-start mb-1">
                    <span class="font-mono text-sm font-bold text-red-600">
                      '{{ error.char }}'
                    </span>
                    <span class="text-xs text-gray-500">
                      Línea {{ error.line }}, Columna {{ error.column }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700">{{ error.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="h-full">
        <pre class="p-4 code-editor text-sm"><code>{{ pythonCode }}</code></pre>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 text-xs text-gray-300 flex justify-between">
      <span>Python Output</span>
      <span v-if="pythonCode">{{ pythonCode.split('\n').length }} lineas</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Output',
  props: {
    pythonCode: {
      type: String,
      default: ''
    },
    errors: {
      type: Array,
      default: () => []
    },
    status: {
      type: String,
      default: 'Listo'
    }
  },
  computed: {
    hasContent() {
      return this.pythonCode || this.errors.length > 0;
    },
    hasErrors() {
      return this.errors.length > 0;
    }
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.pythonCode);
        alert('Codigo copiado al portapapeles');
      } catch (err) {
        console.error('Error al copiar:', err);
        alert('Error al copiar al portapapeles');
      }
    }
  }
}
</script>

<style scoped>
pre code {
  color: #2d3748;
  display: block;
}
</style>
