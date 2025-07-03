import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Messages',
        href: '/dashboard/contact-messages',
    },
];

export interface Messages {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    description: string;
    created_at: string;
    status: boolean;
    updated_at: string;
}

export default function DashboardMessages() {
    const messages = usePage<SharedData>().props.messages;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard/Messages" />
            <div className="gap-4 rounded-xl p-4 overflow-x-auto justify-between">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h1>
            </div>
            <div className="px-10 py-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                                        {message.fname} {message.lname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {message.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {message.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {message.phone}

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {message.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {message.created_at}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
