
import { Link } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { type SharedData } from '@/types'

export default function Footer() {
  const { auth } = usePage<SharedData>().props;

  return (
    <footer className="mt-32 border-t border-gray-200 dark:border-gray-800 pt-10 pb-6 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} AutoService Manager. All rights reserved.</p>
          <div className="flex gap-4">
            {auth?.user ? (
              <>
                {auth?.user.role === 'ADMIN' || auth?.user.role === 'WORKER' ? (
                  <Link href={route('dashboard')} className="hover:underline">Dashboard</Link>
                ) : null}
                <Link href={route('appointments.create')} className="hover:underline">Appointments</Link>
                <Link href={route('cars.view')} className="hover:underline">Cars</Link>
              </>
            ) : (
              <>
                <Link href={route('login')} className="hover:underline">Login</Link>
                  <Link href={route('register')} className="hover:underline">Register</Link>
              </>
            )}
            <Link href={route('home')} className="hover:underline">Home</Link>
            <Link href={route('contact')} className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
