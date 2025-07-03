import React, { useEffect } from 'react'
import { useForm, router, usePage } from '@inertiajs/react'
import Navbar from '@/components/navbar/navbar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-provider'

function CreateCarPage() {
  const { data, setData, post, processing, errors, reset } = useForm({
    brand: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    vin: '',
  })
  // Use new toast system: read success/error directly from page.props (not flash)
  const { success, error } = usePage().props as { success?: string; error?: string }
  const { showToast } = useToast()

  useEffect(() => {
    if (success) showToast('success', success)
    if (error) { showToast('error', error)}
  }, [success, error, showToast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('cars.store'), {
      onSuccess: () => {
        reset()
        router.visit('/cars/view')
      }
    })
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add a new car</h1>
        {/* Show error or success message if present */}
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand *</label>
            <input
              type="text"
              value={data.brand}
              onChange={e => setData('brand', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Model *</label>
            <input
              type="text"
              value={data.model}
              onChange={e => setData('model', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year *</label>
            <input
              type="number"
              min="1886"
              value={data.year}
              onChange={e => setData('year', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Color *</label>
            <input
              type="text"
              value={data.color}
              onChange={e => setData('color', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">License Plate *</label>
            <input
              type="text"
              value={data.license_plate}
              onChange={e => setData('license_plate', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.license_plate && <p className="text-red-500 text-sm mt-1">{errors.license_plate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">VIN *</label>
            <input
              type="text"
              value={data.vin}
              onChange={e => setData('vin', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
          </div>
          <Button type="submit" disabled={processing} className="bg-blue-500 text-white w-full">
            {processing ? 'Adding...' : 'Add a new car'}
          </Button>
        </form>
      </div>
    </>
  )
}

export default CreateCarPage


