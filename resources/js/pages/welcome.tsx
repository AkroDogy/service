import { Head, Link, usePage } from '@inertiajs/react';
import Navbar from '@/components/navbar/navbar';
import { type SharedData } from '@/types';
import Footer from '@/components/navbar/footer';

export default function Welcome() {
  const { auth, locationGroups = [] } = usePage<SharedData>().props;
  console.log('Welcome page loaded', { auth, locationGroups });

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
            <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule your car service online in just a few clicks.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">All Car Services</h3>
            <p className="text-gray-600 dark:text-gray-400">
              From oil changes to complex repairs – all in one place.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Live Service Updates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get notified when your car is ready – no need to call.
            </p>
          </div>
        </section>
        <section className="mt-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Premium Auto Service?</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li>✅ Fast and easy online booking – no phone calls needed</li>
            <li>✅ Transparent pricing and no hidden fees</li>
            <li>✅ Professional technicians and modern equipment</li>
            <li>✅ Live updates on your service status</li>
            <li>✅ Trusted by hundreds of satisfied customers</li>
          </ul>
        </section>
        <section className="mt-12 text-center">
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <section className="mt-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Our locations</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                We are located in multiple cities to serve you better:
              </p>
              {locationGroups.length > 0 ? (
                <ul className="space-y-6 max-w-2xl mx-auto">
                  {locationGroups.map((group: any) => (
                    <li key={group.id}>
                      <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                        {group.locations.map((loc: any) => (
                          <li key={loc.id}>
                            <span className="font-medium">{loc.name}</span>
                            {loc.stations && loc.stations.length > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Stations: {loc.stations.map((s: any) => s.name).join(', ')})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No locations available yet.</p>
              )}
            </section>
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
