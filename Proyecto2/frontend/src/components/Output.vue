<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="bg-[#0f172a] border-b border-slate-700/50 px-5 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-sm font-medium text-slate-300">Salida Python</span>
        <span v-if="hasContent" class="text-xs text-emerald-400 bg-emerald-950 px-2 py-1 rounded">
          {{ status }}
        </span>
      </div>
      <button
        v-if="pythonCode"
        @click="copyToClipboard"
        class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition flex items-center gap-2 text-slate-300 border border-slate-700"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        Copiar
      </button>
    </div>

    <!-- Output Area -->
    <div class="flex-1 overflow-auto bg-[#0f172a]">
      <div v-if="!hasContent" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
            <svg class="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-lg text-slate-400 mb-2">El codigo Python aparecera aqui</p>
          <p class="text-sm text-slate-600">Ejecuta el analisis para ver resultados</p>
        </div>
      </div>

      <div v-else-if="hasErrors" class="p-6">
        <div class="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-red-300 font-semibold mb-2">Errores Encontrados</h3>
              <p class="text-red-400/80 text-sm mb-4">
                Se encontraron {{ errors.length }} error(es). No se puede generar codigo Python.
              </p>
              <div class="space-y-3">
                <div
                  v-for="(error, index) in errors"
                  :key="index"
                  class="bg-slate-900/50 border border-slate-800 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-mono text-sm font-bold text-red-400 bg-red-950/50 px-2 py-1 rounded">
                      '{{ error.char }}'
                    </span>
                    <span class="text-xs text-slate-500">
                      Linea {{ error.line }}, Columna {{ error.column }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-400">{{ error.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="h-full p-6">
        <pre class="code-output text-sm text-slate-300"><code>{{ pythonCode }}</code></pre>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-[#0f172a] border-t border-slate-700/50 px-5 py-2 text-xs text-slate-500 flex justify-between">
      <span>UTF-8 | Python</span>
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
.code-output {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  line-height: 1.6;
}

pre {
  margin: 0;
  padding: 0;
}

code {
  display: block;
  color: #e2e8f0;
}
</style>
