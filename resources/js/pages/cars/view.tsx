import React, { useState, useEffect } from 'react'
import { usePage, router } from '@inertiajs/react'
import { type Car } from '@/types'
import Navbar from '@/components/navbar/navbar'
import { Button } from '@/components/ui/button'

function ViewCarsPage() {
  const cars = usePage<{ cars: Car[]; success?: string; error?: string }>().props.cars
  const { success, error } = usePage().props as { success?: string; error?: string }
  const [deleteCar, setDeleteCar] = useState<Car | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleDelete = () => {
    if (!deleteCar) return
    setProcessing(true)
    router.delete(`/cars/delete/${deleteCar.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteCar(null)
      },
      onFinish: () => setProcessing(false),
      only: ['cars', 'success', 'error']
    })
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cars</h1>
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
        <Button className="mb-4 bg-blue-500 text-white" onClick={() => router.visit('/cars/create')}>Add a car</Button>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left">Brand</th>
                <th className="border border-gray-300 p-3 text-left">Model</th>
                <th className="border border-gray-300 p-3 text-left">Year</th>
                <th className="border border-gray-300 p-3 text-left">Color</th>
                <th className="border border-gray-300 p-3 text-left">License Plate</th>
                <th className="border border-gray-300 p-3 text-left">VIN</th>
                <th className="border border-gray-300 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <td className="border border-gray-300 p-3">{car.brand}</td>
                  <td className="border border-gray-300 p-3">{car.model}</td>
                  <td className="border border-gray-300 p-3">{car.year}</td>
                  <td className="border border-gray-300 p-3">{car.color}</td>
                  <td className="border border-gray-300 p-3">{car.license_plate}</td>
                  <td className="border border-gray-300 p-3">{car.vin}</td>
                  <td className="border border-gray-300 p-3 flex gap-2">
                    <Button variant="outline" onClick={() => router.visit(`/cars/edit/${car.id}`)}>Edit</Button>
                    <Button variant="destructive" onClick={() => setDeleteCar(car)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteCar && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this car?</h2>
            <p className="mb-4">{deleteCar.brand} {deleteCar.model} ({deleteCar.license_plate})</p>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setDeleteCar(null)} disabled={processing}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                {processing ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ViewCarsPage
