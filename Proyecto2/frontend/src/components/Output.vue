<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg font-semibold">🐍 Salida Python</span>
        <span v-if="hasContent" class="text-xs bg-white/20 px-2 py-0.5 rounded">
          {{ status }}
        </span>
      </div>
      <button
        v-if="pythonCode"
        @click="copyToClipboard"
        class="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition"
      >
        📋 Copiar
      </button>
    </div>

    <!-- Output Area -->
    <div class="flex-1 overflow-auto">
      <div v-if="!hasContent" class="h-full flex items-center justify-center text-gray-400">
        <div class="text-center">
          <div class="text-6xl mb-4">🐍</div>
          <p class="text-lg">El código Python aparecerá aquí</p>
          <p class="text-sm mt-2">Ejecuta el análisis para ver resultados</p>
        </div>
      </div>

      <div v-else-if="hasErrors" class="p-4">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex items-start">
            <span class="text-2xl mr-3">❌</span>
            <div class="flex-1">
              <h3 class="text-red-800 font-semibold mb-2">Errores Encontrados</h3>
              <p class="text-red-700 text-sm mb-3">
                Se encontraron {{ errors.length }} error(es) léxico(s). 
                No se puede generar código Python.
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
    <div class="bg-gray-100 px-4 py-2 text-xs text-gray-600 flex justify-between">
      <span>Python Output</span>
      <span v-if="pythonCode">{{ pythonCode.split('\n').length }} líneas</span>
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
        alert('✅ Código copiado al portapapeles');
      } catch (err) {
        console.error('Error al copiar:', err);
        alert('❌ Error al copiar al portapapeles');
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
