import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LocateIcon, UsersIcon, Route, MessageSquareIcon, Star, Shield } from 'lucide-react';
import AppLogo from './app-logo';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointments',
        href: '/dashboard/appointments',
        icon: BookOpen,
    },
    {
        title: 'Reviews',
        href: '/dashboard/reviews',
        icon: Star,
    },
    {
        title: 'Messages',
        href: '/dashboard/contact-messages',
        icon: MessageSquareIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Locations',
        href: '/dashboard/locations',
        icon: LocateIcon,
    },
    {
        title: 'Location Groups',
        href: '/dashboard/location-groups', 
        icon: LocateIcon,
    },
    {
        title: 'Stations',
        href: '/dashboard/stations',
        icon: Route,
    },
    {
        title: 'Users',
        href: '/dashboard/users',
        icon: UsersIcon,
    },
    {
        title: 'Logs',
        href: '/dashboard/logs',
        icon: Folder,
    },
    {
        title: 'Roles & Permissions',
        href: '/dashboard/roles',
        icon: Shield,
    },
    
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const userPermissions: string[] = auth?.user?.permissions || [];
    const userRoles: string[] = (auth?.user?.roles || []).map((r: string) => r.toLowerCase());
    const isSuperAdmin = userRoles.includes('admin') || userPermissions.includes('dashboard.administrator');
    const hasPermission = (perm: string) => isSuperAdmin || userPermissions.includes(perm);
    const navItems = [
        ...mainNavItems.filter(item => {
            if (item.href === '/dashboard/appointments') return hasPermission('dashboard.appointments');
            if (item.href === '/dashboard/reviews') return hasPermission('dashboard.reviews');
            if (item.href === '/dashboard/contact-messages') return hasPermission('dashboard.messages');
            if (item.href === '/dashboard') return hasPermission('dashboard');
            return true;
        })
    ];
    const filteredFooterNavItems =
        footerNavItems.filter(item => {
        if (item.href === '/dashboard/users') return hasPermission('dashboard.users');
        if (item.href === '/dashboard/logs') return hasPermission('dashboard.logs');
        if (item.href === '/dashboard/locations') return hasPermission('dashboard.locations');
        if (item.href === '/dashboard/location-groups') return hasPermission('dashboard.location-groups');
        if (item.href === '/dashboard/stations') return hasPermission('dashboard.stations');
        if (item.href === '/dashboard/roles') return hasPermission('dashboard.roles');
        if (item.href === '/dashboard')
        return true;
        });
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
