import { Button } from './ui/button';
import { Home, FileText, Users, ShoppingCart, Route } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'deliveries',
      label: 'Entregas',
      icon: Home
    },
    {
      id: 'routes',
      label: 'Rotas',
      icon: Route
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: Users
    },
    {
      id: 'pdv',
      label: 'PDV',
      icon: ShoppingCart
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg" style={{ borderColor: 'rgba(0, 128, 0, 0.1)' }}>
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-0.5 h-16 px-2 transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary/70'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 scale-105' 
                  : 'hover:bg-primary/5'
              }`}>
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <span className={`text-[10px] transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}