import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-lg border border-gray-200 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <SunIcon
        className={`h-5 w-5 transition-all duration-300 ${
          theme === 'light'
            ? 'scale-100 rotate-0 text-yellow-500'
            : 'scale-0 rotate-90 text-gray-400'
        }`}
      />
      <MoonIcon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'scale-100 rotate-0 text-blue-400'
            : 'scale-0 -rotate-90 text-gray-400'
        }`}
      />
    </Button>
  );
}
