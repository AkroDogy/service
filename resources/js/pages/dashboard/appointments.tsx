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
    PENDING: ['PROGRESS', 'REJECTED'],
    PROGRESS: ['DONE', 'REJECTED'],
    DONE: ['PROGRESS', 'COMPLETED'],
    REJECTED: ['PROGRESS', 'DONE'],
    COMPLETED: [],
};

export default function DashboardAppointments() {
    const { appointments = [], status = 'PENDING', success, error, auth } = usePage().props as any;
    const userPermissions: string[] = auth?.user?.permissions || [];
    const hasSetStatus = userPermissions.includes('dashboard.appointments.setstatus');
    const hasSetStatusAdmin = userPermissions.includes('dashboard.appointments.setstatus.admin');
    const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
    const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
    const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);
    const [attachmentModal, setAttachmentModal] = useState<{ id: number; show: boolean } | null>(null);
    const [attachment, setAttachment] = useState<string>('');
    const [completeConfirm, setCompleteConfirm] = useState<{ id: number; show: boolean } | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: number; show: boolean } | null>(null);
    const [rejectReason, setRejectReason] = useState<string>('');
    const handleStatus = (id: number, status: string) => {
        if (status === 'REJECTED') {
            setRejectModal({ id, show: true });
            setRejectReason('');
            return;
        }
        if (status === 'COMPLETED') {
            setAttachmentModal({ id, show: true });
            setAttachment('');
            return;
        }
        router.post(`/dashboard/appointments/${id}/status`, { status }, { preserveScroll: true });
    };
    const handleReject = (id: number) => {
        if (!rejectReason.trim()) return;
        router.post(`/dashboard/appointments/${id}/status`, { status: 'REJECTED', rejected_description: rejectReason }, {
            onSuccess: () => setRejectModal(null),
            preserveScroll: true,
        });
    };
    const handleComplete = (id: number) => {
        if (!attachment.trim()) return;
        setAttachmentModal(null);
        setCompleteConfirm({ id, show: true });
    };
    const handleCompleteConfirm = (id: number) => {
        router.post(`/dashboard/appointments/${id}/status`, { status: 'COMPLETED', attachment_path: attachment }, {
            onSuccess: () => setCompleteConfirm(null),
            preserveScroll: true,
        });
    };

    if (!hasPermission('dashboard.appointments')) {
        return <div className="p-8 text-center text-red-500">You do not have permission to view this page.</div>;
    }
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
                            className={`px-3 py-1 rounded ${status === opt ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
                            <th className="border p-2">Location</th>
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
                                <td className="border p-2">{a.location ? a.location.name : '-'}</td>
                                <td className="border p-2 flex gap-2">
                                    {(hasSetStatusAdmin || hasSetStatus) && (
                                        <select
                                            className="border rounded px-2 py-1"
                                            value=""
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (!val) return;
                                                if (val === 'REJECTED') {
                                                    setRejectModal({ id: a.id, show: true });
                                                    setRejectReason('');
                                                    return;
                                                }
                                                if (val === 'COMPLETED') {
                                                    setAttachmentModal({ id: a.id, show: true });
                                                    setAttachment('');
                                                    return;
                                                }
                                                router.post(`/dashboard/appointments/${a.id}/status`, { status: val }, { preserveScroll: true });
                                            }}
                                        >
                                            <option value="">Change Status</option>
                                            {(hasSetStatusAdmin
                                                ? statusOptions // poate orice status
                                                : statusTransitions[a.status] // doar flux normal
                                            ).map((s: string) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    )}
                                    {hasPermission('dashboard.appointments.view.attachment') && a.attachment_path && (
                                        <button
                                            onClick={() => {
                                                setAttachmentModal({ id: a.id, show: true });
                                                setAttachment(a.attachment_path);
                                            }}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Attachment
                                        </button>
                                    )}
                                    {hasPermission('dashboard.appointments.reject') && a.status !== 'REJECTED' && (
                                        <button
                                            onClick={() => {
                                                setRejectModal({ id: a.id, show: true });
                                                setRejectReason('');
                                            }}
                                            className="text-red-500 hover:underline"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {rejectModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-2">Reject Appointment</h2>
                        <textarea
                            className="border rounded w-full p-2 mb-4"
                            placeholder="Enter reason for rejection"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setRejectModal(null)}>Cancel</button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                disabled={!rejectReason.trim()}
                                onClick={() => handleReject(rejectModal.id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {attachmentModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-2">Complete Appointment</h2>
                        <input
                            className="border rounded w-full p-2 mb-4"
                            placeholder="Enter attachment path"
                            value={attachment}
                            onChange={e => setAttachment(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setAttachmentModal(null)}>Cancel</button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded"
                                disabled={!attachment.trim()}
                                onClick={() => handleComplete(attachmentModal.id)}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {completeConfirm && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
                        <p className="mb-4">This action is <b>irreversible</b>. Once completed, you cannot roll back this appointment.</p>
                        <div className="flex gap-2 justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setCompleteConfirm(null)}>Cancel</button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={() => handleCompleteConfirm(completeConfirm.id)}
                            >
                                Confirm Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
