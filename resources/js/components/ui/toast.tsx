import React, { useEffect } from 'react'

export type ToastType = 'success' | 'error'

export interface ToastProps {
  type: ToastType
  message: string
  onClose?: () => void
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    if (!onClose) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg z-50 text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{message}</div>
  )
}
