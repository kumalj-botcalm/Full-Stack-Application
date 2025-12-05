import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/customUi/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/contexts/AuthContext';
import { MessageSquareIcon } from 'lucide-react';


const allNavigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Users', href: '/users', icon: UsersIcon, allowedRoles: ['seller'] },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name : 'Inquiry', href: '/inquiry', icon: MessageSquareIcon, allowedRoles: ['customer'] }
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  // Filter navigation based on user role
  const navigation = allNavigation.filter(
    (item) =>
      !item.allowedRoles || item.allowedRoles.includes(user?.role || 'customer')
  );

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="bg-background min-h-screen transition-colors">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="bg-opacity-50 dark:bg-opacity-70 fixed inset-0 bg-black dark:bg-black"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="bg-card border-border fixed inset-y-0 left-0 flex w-full max-w-xs flex-col border-r shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-foreground text-xl font-semibold">
              {' '}
              Dashboard
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="text-foreground h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 shrink-0',
                      isActive
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="border-border bg-card flex grow flex-col overflow-y-auto border-r">
          <div className="flex h-16 shrink-0 flex-col items-center justify-center px-6">
            <span className="text-foreground text-center text-xl font-bold pt-5">
              Welcome, {user?.firstName || 'User'}
            </span>
            <span className="text-muted-foreground text-center text-sm capitalize">
              {user?.role} Account
            </span>
          </div>
          <div className="mt-5 mb-10 flex justify-center">
            <UserCircleIcon className="h-25 w-25" />
          </div>

          <nav className="flex flex-1 flex-col space-y-4 px-4 pt-4 pb-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-4 text-lg font-bold transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 shrink-0',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-accent-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="border-border bg-card/80 sticky top-0 z-10 border-b backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Bars3Icon className="text-foreground h-6 w-6" />
              </Button>
              <h1 className="text-foreground ml-4 text-lg font-semibold lg:ml-0">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="relative">
                <BellIcon className="h-10 w-10" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>
                        <UserCircleIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {user ? `${user.firstName} ${user.lastName}` : 'User'}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8">
            <div className="mx-auto w-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
