import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// TODO: ganti dengan API call asli saat backend tersedia
const dummyUsers = [
  { email: 'abhista@ruas.id', password: 'demo123', name: 'Abhista', role: 'Web Developer', avatar: null },
  { email: 'admin@ex.id', password: 'admin', name: 'Admin', role: 'Administrator', avatar: null },
  { email: 'tes@ex.id', password: '123', name: 'Tes', role: 'Quality Assurance', avatar: null },
]

export function useLogin() {
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

  async function handleLogin() {
    errorMessage.value = ''

    if (!form.email || !form.password) {
      errorMessage.value = 'Email dan password tidak boleh kosong.'
      return
    }

    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isLoading.value = false

    const user = dummyUsers.find(
      (u) => u.email === form.email && u.password === form.password
    )

    if (!user) {
      errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
      return
    }

    localStorage.setItem(
      'user',
      JSON.stringify({
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      })
    )

    router.push('/dashboard')
  }

  return {
    focused,
    showPassword,
    isLoading,
    errorMessage,
    form,
    handleLogin,
  }
}