import React, { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import Navbar from '@/components/navbar/navbar'
import { Button } from "@/components/ui/button"
import { usePage } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import { type SharedData } from '@/types'

interface ContactProps extends SharedData {
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
    hours: string[]
    services: string[]
  }
}

const MAP_CONFIG = {
  containerStyle: {
    width: '100%',
    height: '500px',
  },
  center: {
    lat: 44.439663,
    lng: 26.096306,
  },
  marker: {
    lat: 44.439673,
    lng: 26.096506,
  },
  zoom: 15,

  //De salvat in env nu aici!!
  apiKey: 'AIzaSyCibWMI8YdYamJ_7d6BSUIsXc0w-wc2ipc',
} as const

function Contact() {
  const { companyInfo } = usePage<ContactProps>().props
  const { data, setData, post, processing, errors, reset } = useForm({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    description: '',
  })

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAP_CONFIG.apiKey,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markerAnimation, setMarkerAnimation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('contact.store'), {
      onSuccess: () => {
        reset()
        alert('Mesajul a fost trimis cu succes!')
      }
    })
  }

  const toggleMarkerAnimation = () => {
    setMarkerAnimation(!markerAnimation)
    if (!markerAnimation) {
      setTimeout(() => {
        setMarkerAnimation(false)
      }, 3000)
    }
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (loadError) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading Google Maps</div>
        </div>
      </>
    )
  }

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading map...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-3xl font-bold">Contact us</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">{companyInfo.name}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">📍 Address:</h3>
                  <p className="text-gray-600">{companyInfo.address}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">📞 Phone:</h3>
                  <p className="text-gray-600">{companyInfo.phone}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">✉️ Email:</h3>
                  <p className="text-gray-600">{companyInfo.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">🕒 Our program:</h3>
                  <ul className="text-gray-600">
                    {companyInfo.hours.map((hour, index) => (
                      <li key={index}>{hour}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">🔧 Services:</h3>
                  <ul className="text-gray-600 list-disc list-inside">
                    {companyInfo.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name *
                    </label>
                    <input
                      type="text"
                      value={data.fname}
                      onChange={(e) => setData('fname', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.fname && <p className="text-red-500 text-sm mt-1">{errors.fname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={data.lname}
                      onChange={(e) => setData('lname', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.lname && <p className="text-red-500 text-sm mt-1">{errors.lname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us more about your request..."
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  {processing ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={toggleMarkerAnimation}
              variant={markerAnimation ? "destructive" : "default"}
              className="ml-4"
            >
              {markerAnimation ? "Stop Animation" : "Animate Marker"}
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <GoogleMap
              mapContainerStyle={MAP_CONFIG.containerStyle}
              center={MAP_CONFIG.center}
              zoom={MAP_CONFIG.zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              <Marker
                position={MAP_CONFIG.marker}
                title="Our Location"
                animation={markerAnimation ? window.google?.maps?.Animation?.BOUNCE : undefined}
              />
            </GoogleMap>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact