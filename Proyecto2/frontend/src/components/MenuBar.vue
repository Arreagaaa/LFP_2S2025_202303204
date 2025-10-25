<template>
  <div class="bg-[#1e293b] border-b border-slate-700/50 shadow-xl">
    <div class="flex items-center px-6 py-3">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-2 py-1 font-bold text-lg">
        <div
          class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <span class="text-white font-semibold">JavaBridge</span>
      </div>

      <!-- Menus -->
      <div class="flex-1 flex items-center gap-2 ml-4">
        <!-- ARCHIVO -->
        <div class="relative" ref="archivoMenu">
          <button
            @click="toggleMenu('archivo')"
            class="px-4 py-2 hover:bg-slate-700/50 rounded-lg text-sm font-medium transition text-slate-200"
          >
            Archivo
          </button>
          <div
            v-if="openMenu === 'archivo'"
            class="absolute top-full left-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl min-w-[220px] z-50 fade-in overflow-hidden"
          >
            <button
              @click="handleAction('nuevo')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Nuevo</span>
              <span class="ml-auto text-xs text-slate-500">Ctrl+N</span>
            </button>
            <button
              @click="handleAction('abrir')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Abrir</span>
              <span class="ml-auto text-xs text-slate-500">Ctrl+O</span>
            </button>
            <div class="border-t border-slate-800"></div>
            <button
              @click="handleAction('guardar')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Guardar</span>
              <span class="ml-auto text-xs text-slate-500">Ctrl+S</span>
            </button>
            <button
              @click="handleAction('guardarPython')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Guardar Python como...</span>
            </button>
            <div class="border-t border-slate-800"></div>
            <button
              @click="handleAction('salir')"
              class="w-full text-left px-4 py-3 hover:bg-red-950 text-sm flex items-center gap-3 text-red-400 transition"
            >
              <span>Salir</span>
            </button>
          </div>
        </div>

        <!-- TRADUCIR -->
        <div class="relative" ref="traducirMenu">
          <button
            @click="toggleMenu('traducir')"
            class="px-4 py-2 hover:bg-slate-700/50 rounded-lg text-sm font-medium transition text-slate-200"
          >
            Traducir
          </button>
          <div
            v-if="openMenu === 'traducir'"
            class="absolute top-full left-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl min-w-[220px] z-50 fade-in overflow-hidden"
          >
            <button
              @click="handleAction('traducir')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Generar Traduccion</span>
            </button>
            <button
              @click="handleAction('verTokens')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Ver Tokens</span>
            </button>
            <button
              @click="handleAction('verErrores')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Ver Errores Léxicos</span>
            </button>
            <button
              @click="handleAction('verErroresSintacticos')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Ver Errores Sintácticos</span>
            </button>
          </div>
        </div>

        <!-- AYUDA -->
        <div class="relative" ref="ayudaMenu">
          <button
            @click="toggleMenu('ayuda')"
            class="px-4 py-2 hover:bg-slate-700/50 rounded-lg text-sm font-medium transition text-slate-200"
          >
            Ayuda
          </button>
          <div
            v-if="openMenu === 'ayuda'"
            class="absolute top-full left-0 mt-2 bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl min-w-[200px] z-50 fade-in overflow-hidden"
          >
            <button
              @click="handleAction('acercaDe')"
              class="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm flex items-center gap-3 text-slate-200 transition"
            >
              <span>Acerca de</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Boton de Analizar (destacado) -->
      <button
        @click="handleAction('traducir')"
        class="ml-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Analizar</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuBar",
  emits: [
    "nuevo",
    "abrir",
    "guardar",
    "guardar-python",
    "traducir",
    "ver-tokens",
    "ver-errores",
    "ver-errores-sintacticos",
    "acerca-de",
    "salir",
  ],
  data() {
    return {
      openMenu: null,
    };
  },
  methods: {
    toggleMenu(menu) {
      this.openMenu = this.openMenu === menu ? null : menu;
    },
    handleAction(action) {
      this.openMenu = null;

      const eventMap = {
        nuevo: "nuevo",
        abrir: "abrir",
        guardar: "guardar",
        guardarPython: "guardar-python",
        traducir: "traducir",
        verTokens: "ver-tokens",
        verErrores: "ver-errores",
        verErroresSintacticos: "ver-errores-sintacticos",
        acercaDe: "acerca-de",
        salir: "salir",
      };

      const eventName = eventMap[action];
      if (eventName) {
        this.$emit(eventName);
      }
    },
    closeMenus() {
      this.openMenu = null;
    },
  },
  mounted() {
    // Cerrar menús al hacer clic fuera
    document.addEventListener("click", (e) => {
      const menus = [
        this.$refs.archivoMenu,
        this.$refs.traducirMenu,
        this.$refs.ayudaMenu,
      ];
      const clickedOutside = menus.every(
        (menu) => menu && !menu.contains(e.target)
      );
      if (clickedOutside) {
        this.closeMenus();
      }
    });
  },
};
</script>
