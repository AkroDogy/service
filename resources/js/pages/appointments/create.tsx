import React, { useState } from 'react'
import Navbar from '@/components/navbar/navbar'
import { usePage, useForm } from '@inertiajs/react'
import { type SharedData } from '@/types'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react';

interface Car {
  id: number
  brand: string
  model: string
  year: number
  color: string
  license_plate: string
  vin: string
}

interface Location {
  id: number;
  name: string;
}

interface LocationGroup {
  id: number;
  name: string;
  locations: Location[];
}

interface Appointment {
  id: number;
  description: string;
  estimated_date: string | null;
  status: string;
  car: Car;
  location?: Location | null;
  updated_at: Date | null;
  attachment_path?: string | null;
  rejected_description?: string;
}

interface CreateAppointmentProps extends SharedData {
  cars: Car[];
  appointments: Appointment[];
  locations: Location[];
  locationGroups: LocationGroup[];
}

function CreateAppointment() {
  const { cars, appointments, locations, locationGroups } = usePage<CreateAppointmentProps>().props;
  const [showAddCarModal, setShowAddCarModal] = useState(false)
  const [showCreateAppointmentForm, setShowCreateAppointmentForm] = useState(false)
  const [showAppointments, setShowAppointments] = useState(true)
  const [showMoreInfo, setShowMoreInfo] = useState<number | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')

  const handleSeeAppointments = () => {
    setShowAppointments(true)
    setShowCreateAppointmentForm(false)
  }

  const handleCreateAppointment = () => {
    setShowCreateAppointmentForm(true)
    setShowAppointments(false)
  }

  const { data, setData, post, processing, errors, reset } = useForm({
    description: '',
    cars_id: '',
    estimated_date: '',
    location_id: '',
  })

  const { data: carData, setData: setCarData, post: postCar, processing: carProcessing, errors: carErrors, reset: resetCar } = useForm({
    brand: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    vin: '',
  })

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('appointments.store'), {
      onSuccess: () => {
        reset()
        alert('Appointment created successfully!')
      }
    })
  }

  const handleSubmitCar = (e: React.FormEvent) => {
    e.preventDefault()
    postCar(route('cars.store'), {
      onSuccess: () => {
        resetCar()
        setShowAddCarModal(false)
        alert('Car added successfully!')
      }
    })
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex gap-6 mb-8 justify-center items-center">
          <Button
            variant="outline"
            onClick={handleSeeAppointments}
            className={showAppointments ? "bg-blue-100" : ""}
          >
            See your appointments
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateAppointment}
            className={showCreateAppointmentForm ? "bg-blue-100" : ""}
          >
            Create an appointment
          </Button>
        </div>
        </div>
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Appointments Management</h1>

          {showCreateAppointmentForm && (
            <div className="p-6 rounded-lg shadow-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Appointment</h2>
                <Button
                  onClick={() => setShowAddCarModal(true)}
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  + Add New Car
                </Button>
              </div>
              <form onSubmit={handleSubmitAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Car *</label>
                  <select
                    value={data.cars_id}
                    onChange={(e) => setData('cars_id', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Choose a car...</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} ({car.year}) - {car.license_plate} - {car.vin}
                      </option>
                    ))}
                  </select>
                  {errors.cars_id && <p className="text-red-500 text-sm mt-1">{errors.cars_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Town *</label>
                  <select
                    value={selectedGroupId}
                    onChange={e => {
                      setSelectedGroupId(e.target.value);
                      setData('location_id', '');
                    }}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Choose a group...</option>
                    {locationGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                {selectedGroupId && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Location *</label>
                    <select
                      value={data.location_id}
                      onChange={e => setData('location_id', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Choose a location...</option>
                      {locationGroups.find(g => g.id.toString() === selectedGroupId)?.locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                    {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Describe the service needed..."
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Date (Optional)</label>
                  <input
                    type="date"
                    value={data.estimated_date}
                    onChange={(e) => setData('estimated_date', e.target.value)}
                    className="border rounded px-3 py-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.estimated_date && <p className="text-red-500 text-sm mt-1">{errors.estimated_date}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-500 text-white"
                >
                  {processing ? 'Creating...' : 'Create Appointment'}
                </Button>
              </form>
            </div>
          )}

          {showAppointments && (
            <div className="p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Your Appointments</h2>

              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="">
                        <th className="border border-gray-300 p-3 text-left">Car</th>
                        <th className="border border-gray-300 p-3 text-left">Description</th>
                        <th className="border border-gray-300 p-3 text-left">Estimated Date</th>
                        <th className="border border-gray-300 p-3 text-left">Status</th>
                        <th className="border border-gray-300 p-3 text-left">Location</th>
                        <th className="border border-gray-300 p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(appointment => (
                        <tr key={appointment.id} className="">
                          <td className="border border-gray-300 p-3">
                            {appointment.car.brand} -  {appointment.car.model}
                          </td>
                          <td className="border border-gray-300 p-3">{appointment.description}</td>
                          <td className="border border-gray-300 p-3">
                            {appointment.estimated_date
                              ? new Date(appointment.estimated_date).toLocaleDateString()
                              : 'Not set'
                            }
                          </td>
                          <td className="border border-gray-300 p-3">
                            <span className={`px-2 py-1 rounded text-sm ${appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3">
                            {appointment.location ? appointment.location.name : 'N/A'}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <Button
                              variant="outline"
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => setShowMoreInfo(appointment.id)}
                            >
                              More information
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No appointments found. Create your first appointment above!</p>
              )}
            </div>
          )}
          {showMoreInfo !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Appointment Details</h3>
                  <Button
                    onClick={() => setShowMoreInfo(null)}
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {(() => {
                  const appointment = appointments.find(a => a.id === showMoreInfo);
                  if (!appointment) return null;
                  return (
                    <div className="space-y-2">
                      <div><span className="font-semibold">Car:</span> {appointment.car.brand} {appointment.car.model} ({appointment.car.year})</div>
                      <div><span className="font-semibold">VIN:</span> {appointment.car.vin}</div>
                      <div><span className="font-semibold">License Plate:</span> {appointment.car.license_plate}</div>
                      <div><span className="font-semibold">Color:</span> {appointment.car.color}</div>
                      <div><span className="font-semibold">Description:</span> {appointment.description}</div>
                      <div><span className="font-semibold">Finish date:</span> {appointment.updated_at ? new Date(appointment.updated_at).toLocaleDateString() : 'Not set'}</div>
                      <div><span className="font-semibold">Status:</span> {appointment.status}</div>
                      <div><span className="font-semibold">Location:</span> {appointment.location ? appointment.location.name : 'N/A'}</div>
                      {appointment.status === 'REJECTED' && appointment.rejected_description && (
                        <div className="text-red-600"><span className="font-semibold">Rejected reason:</span> {appointment.rejected_description}</div>
                      )}
                      {appointment.status === 'COMPLETED' && appointment.attachment_path && (
                        <div className="text-green-700"><span className="font-semibold">Attachment Path:</span> {appointment.attachment_path}</div>
                      )}
                      <div className="mt-2 text-right">
                        <Button onClick={() => setShowMoreInfo(null)} variant="outline">Close</Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          {showAddCarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Add New Car</h3>
                  <Button
                    onClick={() => setShowAddCarModal(false)}
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmitCar} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand *</label>
                      <input
                        type="text"
                        value={carData.brand}
                        onChange={(e) => setCarData('brand', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      {carErrors.brand && <p className="text-red-500 text-sm">{carErrors.brand}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Model *</label>
                      <input
                        type="text"
                        value={carData.model}
                        onChange={(e) => setCarData('model', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      {carErrors.model && <p className="text-red-500 text-sm">{carErrors.model}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Year *</label>
                      <input
                        type="number"
                        min="1886"
                        value={carData.year}
                        onChange={(e) => setCarData('year', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      {carErrors.year && <p className="text-red-500 text-sm">{carErrors.year}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Color *</label>
                      <input
                        type="text"
                        value={carData.color}
                        onChange={(e) => setCarData('color', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      {carErrors.color && <p className="text-red-500 text-sm">{carErrors.color}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">License Plate *</label>
                    <input
                      type="text"
                      value={carData.license_plate}
                      onChange={(e) => setCarData('license_plate', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    {carErrors.license_plate && <p className="text-red-500 text-sm">{carErrors.license_plate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">VIN *</label>
                    <input
                      type="text"
                      value={carData.vin}
                      onChange={(e) => setCarData('vin', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                    {carErrors.vin && <p className="text-red-500 text-sm">{carErrors.vin}</p>}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={carProcessing}
                      className="flex-1 bg-blue-500 text-white"
                    >
                      {carProcessing ? 'Adding...' : 'Add Car'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowAddCarModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </>
      )
}

export default CreateAppointment
