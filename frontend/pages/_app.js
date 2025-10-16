import '../src/app/globals.css'
import { AuthContextProvider } from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}

export default MyApp
