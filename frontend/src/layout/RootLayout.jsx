import { AuthProvider } from '../contexts/authContext'
import { Outlet } from 'react-router'

function RootLayout() {
  return (
    <AuthProvider>
        <Outlet />
    </AuthProvider>
  )
}

export default RootLayout;