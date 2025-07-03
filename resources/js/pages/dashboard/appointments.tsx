import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Appointments', href: '/dashboard/appointments' },
];

const statusOptions = ['PENDING', 'PROGRESS', 'REJECTED', 'DONE', 'COMPLETED'];
const statusTransitions: Record<string, string[]> = {
    PENDING: ['PROGRESS', 'REJECTED', 'COMPLETED'],
    PROGRESS: ['DONE', 'PENDING', 'REJECTED'],
    DONE: ['COMPLETED', 'PROGRESS', 'PENDING', 'REJECTED'],
    REJECTED: ['PROGRESS', 'PENDING', 'DONE', 'REJECTED'], // allow rollback from REJECTED
    COMPLETED: [],
};

export default function DashboardAppointments() {
    const { appointments = [], status = 'PENDING', success, error, auth } = usePage().props as any;
    const [filter, setFilter] = useState(status);
    const [attachmentModal, setAttachmentModal] = useState<{ id: number, show: boolean }>({ id: 0, show: false });
    const [attachment, setAttachment] = useState('');
    const [rejectModal, setRejectModal] = useState<{ id: number, show: boolean }>({ id: 0, show: false });
    const [rejectReason, setRejectReason] = useState('');
    const userRole = auth?.user?.role;

    const handleStatus = (id: number, newStatus: string) => {
        if (newStatus === 'COMPLETED') {
            setAttachmentModal({ id, show: true });
            return;
        }
        if (newStatus === 'REJECTED') {
            setRejectModal({ id, show: true });
            return;
        }
        router.post(`/dashboard/appointments/${id}/status`, { status: newStatus });
    };
    const handleComplete = (id: number) => {
        router.post(`/dashboard/appointments/${id}/status`, { status: 'COMPLETED', attachment_path: attachment }, {
            onSuccess: () => {
                setAttachment('');
                setAttachmentModal({ id: 0, show: false });
            },
        });
    };
    const handleReject = (id: number) => {
        router.post(`/dashboard/appointments/${id}/status`, { status: 'REJECTED', rejected_description: rejectReason }, {
            onSuccess: () => {
                setRejectReason('');
                setRejectModal({ id: 0, show: false });
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard/Appointments" />
            <div className="gap-4 rounded-xl p-4 overflow-x-auto justify-between">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Appointments</h1>
                {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
                {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2">{success}</div>}
                <div className="flex gap-2 my-4">
                    {statusOptions.map(opt => (
                        <button
                            key={opt}
                            className={`px-3 py-1 rounded ${filter === opt ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => router.visit(`/dashboard/appointments?status=${opt}`)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Car</th>
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Estimated Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Attachment</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a: any) => (
                            <tr key={a.id}>
                                <td className="border p-2">{a.id}</td>
                                <td className="border p-2">{a.car?.brand} {a.car?.model}</td>
                                <td className="border p-2">{a.description}</td>
                                <td className="border p-2">{a.estimated_date}</td>
                                <td className="border p-2">{a.status}</td>
                                <td className="border p-2">{a.attachment_path || '-'}</td>
                                <td className="border p-2 flex gap-2">
                                    {/* Dropdown for actions based on status and role */}
                                    {((userRole === 'WORKER' || userRole === 'ADMIN') && statusTransitions[a.status]) && (
                                        <select
                                            className="border rounded px-2 py-1"
                                            value=""
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val === 'COMPLETED') handleStatus(a.id, 'COMPLETED');
                                                else if (val) handleStatus(a.id, val);
                                            }}
                                        >
                                            <option value="">Actions...</option>
                                            {statusTransitions[a.status].map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {attachmentModal.show && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                        <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
                            <h2 className="text-lg font-bold mb-2">Complete Appointment</h2>
                            <input
                                type="text"
                                placeholder="Attachment path..."
                                value={attachment}
                                onChange={e => setAttachment(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-4"
                            />
                            <div className="flex gap-2 justify-end">
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setAttachmentModal({ id: 0, show: false })}>Cancel</button>
                                <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleComplete(attachmentModal.id)}>Complete</button>
                            </div>
                        </div>
                    </div>
                )}
                {rejectModal.show && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                        <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
                            <h2 className="text-lg font-bold mb-2">Reject Appointment</h2>
                            <textarea
                                placeholder="Reason for rejection..."
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-4"
                                rows={3}
                            />
                            <div className="flex gap-2 justify-end">
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setRejectModal({ id: 0, show: false })}>Cancel</button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleReject(rejectModal.id)} disabled={!rejectReason.trim()}>Reject</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
