<template>
  <div class="h-screen w-screen overflow-hidden bg-[#1B2F4E] relative flex items-center justify-center">

    <!-- Background decoration circles -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-white/3 pointer-events-none"></div>

    <!-- Subtle grid -->
    <svg class="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <!-- Modal Card -->
    <div class="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">

      <div class="px-8 py-8">
        <!-- Logo + Brand -->
        <div class="flex flex-col items-center mb-7">
          <img src="/assets/img/ruas.png" className="w-12 h-12" />
          <h1 class="text-[#1B2F4E] font-bold text-lg uppercase">RUAS ESS</h1>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <input
                v-model="form.email"
                type="email"
                placeholder="name@example.com"
                :class="[
                  'w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50',
                  focused === 'email'
                    ? 'border-[#1B2F4E] ring-2 ring-[#1B2F4E]/10 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                ]"
                @focus="focused = 'email'"
                @blur="focused = null"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <a href="#" class="text-xs text-[#1B2F4E] font-medium hover:underline">Lupa password?</a>
            </div>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :class="[
                  'w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all bg-slate-50',
                  focused === 'password'
                    ? 'border-[#1B2F4E] ring-2 ring-[#1B2F4E]/10 bg-white'
                    : 'border-slate-200 hover:border-slate-300'
                ]"
                @focus="focused = 'password'"
                @blur="focused = null"
              />
              <button
                type="button"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <div class="flex items-center gap-2">
          <button
              type="button"
              :class="[
              'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
              form.remember ? 'bg-[#1B2F4E] border-[#1B2F4E]' : 'border-slate-300 bg-white'
              ]"
              @click="form.remember = !form.remember"
          >
              <svg v-if="form.remember" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
          </button>
          <span class="text-xs text-slate-500">Ingat saya</span>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#1B2F4E] hover:bg-[#243d61] active:bg-[#162540] text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1B2F4E]/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ isLoading ? 'Memproses...' : 'Login' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <p class="text-center text-xs text-gray-400 mt-6">© 2026 PT Rezeki Utami Sejahtera</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const focused = ref(null)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const dummyUsers = [
  { email: 'abhista@ruas.id',  password: 'demo123', name: 'Abhista',      role: 'Web Developer',   avatar: null },
  { email: 'admin@ex.id',    password: 'admin', name: 'Admin',        role: 'Administrator',   avatar: null },
  { email: 'tes@ex.id',  password: '123', name: 'Tes', role: 'Quality Assurance', avatar: null },
]

async function handleLogin() {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value = 'Email dan password tidak boleh kosong.'
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false

  const user = dummyUsers.find(
    u => u.email === form.email && u.password === form.password
  )

  if (!user) {
    errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
    return
  }

  localStorage.setItem('user', JSON.stringify({
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }))

  router.push('/dashboard')
}
</script>