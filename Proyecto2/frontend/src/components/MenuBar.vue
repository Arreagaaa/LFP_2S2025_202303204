<template>
  <div class="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 border-b-2 border-blue-700 shadow-xl">
    <div class="flex items-center px-3 py-2">
      <!-- Logo -->
      <div class="flex items-center gap-2 px-3 py-2 font-bold text-blue-400 text-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>
        <span class="text-white">JavaBridge</span>
      </div>

      <!-- Menus -->
      <div class="flex-1 flex items-center gap-1">
        <!-- ARCHIVO -->
        <div class="relative" ref="archivoMenu">
          <button
            @click="toggleMenu('archivo')"
            class="px-4 py-2 hover:bg-blue-800/50 rounded text-sm font-medium transition text-white"
          >
            Archivo
          </button>
          <div
            v-if="openMenu === 'archivo'"
            class="absolute top-full left-0 mt-1 bg-slate-800 border border-blue-600 rounded shadow-2xl min-w-[220px] z-50 fade-in"
          >
            <button
              @click="handleAction('nuevo')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Nuevo</span>
              <span class="ml-auto text-xs text-gray-400">Ctrl+N</span>
            </button>
            <button
              @click="handleAction('abrir')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Abrir</span>
              <span class="ml-auto text-xs text-gray-400">Ctrl+O</span>
            </button>
            <div class="border-t border-blue-700/50"></div>
            <button
              @click="handleAction('guardar')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Guardar</span>
              <span class="ml-auto text-xs text-gray-400">Ctrl+S</span>
            </button>
            <button
              @click="handleAction('guardarPython')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Guardar Python como...</span>
            </button>
            <div class="border-t border-blue-700/50"></div>
            <button
              @click="handleAction('salir')"
              class="w-full text-left px-4 py-2 hover:bg-red-700/30 text-sm flex items-center gap-3 text-red-400"
            >
              <span>Salir</span>
            </button>
          </div>
        </div>

        <!-- TRADUCIR -->
        <div class="relative" ref="traducirMenu">
          <button
            @click="toggleMenu('traducir')"
            class="px-4 py-2 hover:bg-blue-800/50 rounded text-sm font-medium transition text-white"
          >
            Traducir
          </button>
          <div
            v-if="openMenu === 'traducir'"
            class="absolute top-full left-0 mt-1 bg-slate-800 border border-blue-600 rounded shadow-2xl min-w-[220px] z-50 fade-in"
          >
            <button
              @click="handleAction('traducir')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Generar Traduccion</span>
              <span class="ml-auto text-xs text-gray-400">F5</span>
            </button>
            <button
              @click="handleAction('verTokens')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Ver Tokens</span>
            </button>
            <button
              @click="handleAction('verErrores')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Ver Errores</span>
            </button>
          </div>
        </div>

        <!-- AYUDA -->
        <div class="relative" ref="ayudaMenu">
          <button
            @click="toggleMenu('ayuda')"
            class="px-4 py-2 hover:bg-blue-800/50 rounded text-sm font-medium transition text-white"
          >
            Ayuda
          </button>
          <div
            v-if="openMenu === 'ayuda'"
            class="absolute top-full left-0 mt-1 bg-slate-800 border border-blue-600 rounded shadow-2xl min-w-[200px] z-50 fade-in"
          >
            <button
              @click="handleAction('acercaDe')"
              class="w-full text-left px-4 py-2 hover:bg-blue-700/30 text-sm flex items-center gap-3 text-white"
            >
              <span>Acerca de</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Boton de Analizar (destacado) -->
      <button
        @click="handleAction('traducir')"
        class="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition shadow-lg flex items-center gap-2 border border-blue-500"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
        <span>Analizar</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuBar',
  emits: [
    'nuevo',
    'abrir',
    'guardar',
    'guardar-python',
    'traducir',
    'ver-tokens',
    'ver-errores',
    'acerca-de',
    'salir'
  ],
  data() {
    return {
      openMenu: null
    }
  },
  methods: {
    toggleMenu(menu) {
      this.openMenu = this.openMenu === menu ? null : menu;
    },
    handleAction(action) {
      this.openMenu = null;
      
      const eventMap = {
        'nuevo': 'nuevo',
        'abrir': 'abrir',
        'guardar': 'guardar',
        'guardarPython': 'guardar-python',
        'traducir': 'traducir',
        'verTokens': 'ver-tokens',
        'verErrores': 'ver-errores',
        'acercaDe': 'acerca-de',
        'salir': 'salir'
      };

      const eventName = eventMap[action];
      if (eventName) {
        this.$emit(eventName);
      }
    },
    closeMenus() {
      this.openMenu = null;
    }
  },
  mounted() {
    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', (e) => {
      const menus = [this.$refs.archivoMenu, this.$refs.traducirMenu, this.$refs.ayudaMenu];
      const clickedOutside = menus.every(menu => menu && !menu.contains(e.target));
      if (clickedOutside) {
        this.closeMenus();
      }
    });
  }
}
</script>
