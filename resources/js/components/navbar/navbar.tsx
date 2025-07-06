import React from 'react'
import { Menu, ShieldPlus, UserRound, LogOut, Shield } from "lucide-react";
import { Link, usePage, router } from '@inertiajs/react';
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';


import { type SharedData } from '@/types';

function Navbar() {
  const user = usePage<SharedData>().props.auth.user;

  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.post(route('logout'));
    router.flushAll();
  };

  return (
    <section className="sticky top-0 z-50 bg-background shadow py-4">
      <div className="px-4 mx-auto container-none sm:px-6">
        <nav className="justify-between hidden lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/">
              Service LOGO
            </Link>
            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({ variant: "ghost" })
              )}
              href={route('contact')}
              onClick={cleanup}
            >
              Contact
            </Link>
            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({ variant: "ghost" })
              )}
              href={route('appointments.create')}
              onClick={cleanup}
            >
              Appointment
            </Link>
            <Link
              className={cn(
                "text-muted-foreground",
                navigationMenuTriggerStyle,
                buttonVariants({ variant: "ghost" })
              )}
              href={route('cars.view')}
              onClick={cleanup}
            >
              Cars
            </Link>
          </div>

          {/* RIGHT - Butoane */}
          <div className="flex gap-3 items-center">
            {user?.id && (user?.role === 'admin' || user?.role === 'worker') && (
              <Link href={route('dashboard')}>
                <Button variant="outline" className="w-full">
                  <ShieldPlus />
                  Dashboard
                </Button>
              </Link>
            )}

            {user?.id ? (
              <>
                <Link href={route('profile.edit')} prefetch onClick={cleanup}>
                  <Button variant="outline" className="w-full">
                    <UserRound />
                    My account
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  <LogOut />
                  Logout
                </Button>

              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <UserRound />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* MOBILE - Sheet */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/">
              Service LOGO
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto h-[45%] p-4 rounded-b-lg" side="top">

                <div className="flex flex-col gap-4 mt-8 mb-8">
                  <Link href={route('contact')} onClick={cleanup} className="font-semibold text-center">
                    Contact
                  </Link>
                  <Link href={route('appointments.create')} onClick={cleanup} className="font-semibold text-center">
                    Appointment
                  </Link>
                  <Link href={route('cars.view')} onClick={cleanup} className="font-semibold text-center">
                    Cars
                  </Link>

                  {user?.id && (user?.role === 'admin' || user?.role === 'worker') && (
                    <Link href={route('dashboard')}>
                      <Button variant="outline" className="w-full">
                        <ShieldPlus />
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  {user?.id ? (
                    <>
                      <Link href={route('profile.edit')} prefetch onClick={cleanup}>
                        <Button variant="outline" className="w-full">
                          <UserRound />
                          My account
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} variant="outline" className="w-full">
                        <LogOut />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        <UserRound />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
