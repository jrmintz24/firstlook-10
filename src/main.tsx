
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root")

if (!container) {
  throw new Error("Root container not found")
}

const root = createRoot(container)

try {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </React.StrictMode>
  )
} catch (error) {
  console.error("Error rendering app:", error)
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p className="text-red-500">Please check the console for more details.</p>
      </div>
    </div>
  )
}
