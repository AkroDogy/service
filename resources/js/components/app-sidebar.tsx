import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LocateIcon, UsersIcon, Route, MessageSquareIcon, Star } from 'lucide-react';
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
    
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>


            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
