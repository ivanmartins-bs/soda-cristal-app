import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, MapPin, Route } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  zone: string;
  pendingDeliveries: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface RoutesScreenProps {
  onSelectRoute: (route: Route) => void;
}

export function RoutesScreen({ onSelectRoute }: RoutesScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const routes: Route[] = [
    {
      id: 'route-001',
      name: 'Rota A - Centro (Segunda e Quarta)',
      zone: 'Centro',
      pendingDeliveries: 8,
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'route-002',
      name: 'Rota B - Vila Nova (Terça e Quinta)',
      zone: 'Vila Nova',
      pendingDeliveries: 6,
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 'route-003',
      name: 'Rota C - Jardim (Segunda e Quarta)',
      zone: 'Jardim',
      pendingDeliveries: 12,
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'route-004',
      name: 'Rota D - Industrial (Terça e Quinta)',
      zone: 'Industrial',
      pendingDeliveries: 4,
      priority: 'low',
      status: 'in-progress'
    },
    {
      id: 'route-005',
      name: 'Rota E - Comercial (Segunda e Quarta)',
      zone: 'Comercial',
      pendingDeliveries: 10,
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 'route-006',
      name: 'Rota F - Residencial (Terça e Quinta)',
      zone: 'Residencial',
      pendingDeliveries: 0,
      priority: 'low',
      status: 'completed'
    }
  ];

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm';
      case 'in-progress':
        return 'bg-orange-50 text-orange-700 border-orange-300 shadow-sm';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-300 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300 shadow-sm';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };



  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Rotas Disponíveis</h1>
        <p className="text-sm text-muted-foreground">
          {filteredRoutes.filter(r => r.status === 'pending').length} rotas pendentes • {' '}
          {filteredRoutes.reduce((total, route) => total + route.pendingDeliveries, 0)} entregas totais
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome da rota ou zona..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {filteredRoutes.map((route) => (
          <Card
            key={route.id}
            className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${route.status === 'completed' ? 'opacity-75' : 'hover:scale-[1.01]'
              }`}
            style={{ borderColor: route.status === 'completed' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.15)' }}
            onClick={() => route.status !== 'completed' && onSelectRoute(route)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center">
                    <Route className="w-5 h-5 mr-2" style={{ color: '#008000' }} />
                    {route.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{route.zone}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge variant="outline" className={getStatusColor(route.status)}>
                    {getStatusLabel(route.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Delivery Count */}
              <div className="flex items-center justify-between rounded-lg p-3 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(0, 128, 0, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 text-white rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #008000 0%, #00a000 100%)' }}>
                    <span className="text-sm">{route.pendingDeliveries}</span>
                  </div>
                  <span>
                    {route.pendingDeliveries === 0
                      ? 'Nenhuma entrega pendente'
                      : `${route.pendingDeliveries} ${route.pendingDeliveries === 1 ? 'entrega pendente' : 'entregas pendentes'}`
                    }
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {route.status === 'pending' && (
                <div className="pt-2 border-t">
                  <Button
                    className="w-full shadow-md hover:shadow-lg transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #008000 0%, #00a000 100%)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoute(route);
                    }}
                  >
                    Ver Detalhes da Rota
                  </Button>
                </div>
              )}

              {route.status === 'in-progress' && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full border-2 shadow-sm hover:shadow-md transition-all"
                    style={{ borderColor: '#f59e0b', color: '#92400e' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoute(route);
                    }}
                  >
                    Continuar Rota
                  </Button>
                </div>
              )}

              {route.status === 'completed' && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-center p-2.5 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(0, 128, 0, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
                    <span className="text-sm" style={{ color: '#006600' }}>
                      ✓ Rota Concluída
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="space-y-2">
              <Route className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Nenhuma rota encontrada</h3>
              <p className="text-sm text-muted-foreground">
                Tente ajustar sua busca ou aguarde novas rotas serem disponibilizadas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}