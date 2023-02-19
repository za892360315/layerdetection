// middleware/auth.js
import { getToken } from '@/modules/auth'
export default function({ redirect }: any) {
  if (process.client) {
    const token = getToken()
    if (!token) {
      redirect('/')
    }
  }
}
