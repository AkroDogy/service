import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastType } from './toast'

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export const useToast = () => useContext(ToastContext)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message })
  }, [])

  const handleClose = () => setToast(null)

  React.useEffect(() => {
    // Detect global error/success in window.history.state
    const handler = () => {
      const state = window.history.state
      if (state && typeof state === 'object') {
        if (state.error) {
          showToast('error', state.error)
          // Remove error after showing
          window.history.replaceState({ ...state, error: undefined }, '')
        }
        if (state.success) {
          showToast('success', state.success)
          window.history.replaceState({ ...state, success: undefined }, '')
        }
      }
    }
    window.addEventListener('popstate', handler)
    handler()
    return () => window.removeEventListener('popstate', handler)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} onClose={handleClose} />}
    </ToastContext.Provider>
  )
}
