import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar/navbar';
import { type SharedData } from '@/types';
import Footer from '@/components/navbar/footer';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Navbar />
      <Head title="Auto Service Manager - Simplify Your Appointments" />
      <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] px-6 py-12">
        <section className="text-center max-w-3xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Simplify create an appointment for your car 
          </h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            AutoService Manager is your all-in-one solution for managing client appointments, vehicle details, and service status updates.
          </p>
          <div className="flex justify-center gap-4">
            {auth.user ? (
              <Link
                href={route('appointments.create')}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Go to Appointments
              </Link>
            ) : (
              <>
                <Link
                  href={route('register')}
                  className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
                <Link
                  href={route('login')}
                  className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </section>
        <section className="mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Appointment Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book, view, and manage all client appointments effortlessly.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Vehicle Management</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Store customer vehicle details, history, and VINs in one place.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Status Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Keep clients informed with real-time service progress updates.
            </p>
          </div>
        </section>
        <section className="mt-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Premium Auto Service SRL</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li>✅ Save time and eliminate paperwork</li>
            <li>✅ Improve communication with customers</li>
            <li>✅ Increase operational efficiency</li>
            <li>✅ Fully mobile-friendly and responsive</li>
          </ul>
        </section>
        <section className="mt-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our locations</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We are located in multiple cities to serve you better:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>Bucharest</li>
              <li>Cluj-Napoca</li>
              <li>Timisoara</li>
              <li>Iasi</li>
            </ul>
        </section>
        <section className="mt-24 text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to repair your car?</h3>
          <Link
            href={auth.user ? route('appointments.create') : route('register')}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {auth.user ? 'Go to Appointments' : 'Create an Account'}
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
