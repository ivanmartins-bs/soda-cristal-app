import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, CheckCircle, MapPin, Droplets, Phone, Calendar, DollarSign, UserX, AlertCircle } from 'lucide-react';

import { Delivery, DeliveryStatusData } from '../domain/deliveries/models';

interface DeliveriesOverviewProps {
  deliveryStatuses: Record<string, DeliveryStatusData>;
  onSelectDelivery: (delivery: Delivery) => void;
}

export function DeliveriesOverview({ deliveryStatuses, onSelectDelivery }: DeliveriesOverviewProps) {
  const [selectedTab, setSelectedTab] = useState('today');

  const getCheckInStatusInfo = (deliveryId: string) => {
    const statusData = deliveryStatuses[deliveryId];
    if (!statusData || !statusData.checkInStatus) return null;

    switch (statusData.checkInStatus) {
      case 'delivered':
        return {
          color: 'bg-green-100 border-green-300',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-600 text-white',
          label: 'Entregue',
          icon: CheckCircle
        };
      case 'no-sale':
        return {
          color: 'bg-gray-100 border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-600 text-white',
          label: 'Não quis consumir',
          icon: UserX
        };
      case 'absent-return':
        return {
          color: 'bg-yellow-100 border-yellow-300',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-600 text-white',
          label: 'Ausente - Retornar',
          icon: AlertCircle
        };
      case 'absent-no-return':
        return {
          color: 'bg-red-100 border-red-300',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-600 text-white',
          label: 'Ausente - Não retornar',
          icon: UserX
        };
      default:
        return null;
    }
  };

  // Mock data das entregas
  const todayDeliveries: Delivery[] = [
    {
      id: 'del-001',
      orderId: 'PED-2024-001',
      orderCode: 'SCT001',
      customerName: 'João Silva',
      customerPhone: '(11) 99999-1234',
      address: 'Rua das Flores, 123 - Centro',
      bottles: { quantity: 3, size: '20L' },
      status: 'pending',
      priority: 'high',
      estimatedTime: '09:00',
      routeName: 'Rota A - Centro',
      notes: 'Portão azul, interfone 23'
    },
    {
      id: 'del-002',
      orderId: 'PED-2024-002',
      orderCode: 'SCT002',
      customerName: 'Maria Santos',
      customerPhone: '(11) 99999-5678',
      address: 'Av. Principal, 456 - Centro',
      bottles: { quantity: 2, size: '20L' },
      status: 'pending',
      priority: 'medium',
      estimatedTime: '09:30',
      routeName: 'Rota A - Centro'
    },
    {
      id: 'del-003',
      orderId: 'PED-2024-003',
      orderCode: 'SCT003',
      customerName: 'Ana Costa',
      customerPhone: '(11) 99999-3456',
      address: 'Rua da Paz, 321 - Centro',
      bottles: { quantity: 4, size: '20L' },
      status: 'pending',
      priority: 'high',
      estimatedTime: '10:30',
      routeName: 'Rota A - Centro',
      notes: 'Entregar apenas pela manhã'
    },
    {
      id: 'del-004',
      orderId: 'PED-2024-004',
      orderCode: 'SCT004',
      customerName: 'Roberto Lima',
      customerPhone: '(11) 99999-7890',
      address: 'Rua do Comércio, 890 - Industrial',
      bottles: { quantity: 6, size: '20L' },
      status: 'pending',
      priority: 'medium',
      estimatedTime: '11:00',
      routeName: 'Rota D - Industrial'
    },
    {
      id: 'del-005',
      orderId: 'PED-2024-005',
      orderCode: 'SCT005',
      customerName: 'Luciana Ferreira',
      customerPhone: '(11) 99999-2468',
      address: 'Rua das Palmeiras, 456 - Jardim',
      bottles: { quantity: 2, size: '10L' },
      status: 'pending',
      priority: 'low',
      estimatedTime: '14:00',
      routeName: 'Rota C - Jardim'
    }
  ];

  const completedDeliveries: Delivery[] = [
    {
      id: 'del-comp-001',
      orderId: 'PED-2024-100',
      orderCode: 'SCT100',
      customerName: 'Carlos Oliveira',
      customerPhone: '(11) 99999-9012',
      address: 'Rua Nova, 789 - Centro',
      bottles: { quantity: 1, size: '10L' },
      status: 'completed',
      priority: 'low',
      estimatedTime: '10:00',
      completedAt: '2024-01-24 10:15:00',
      routeName: 'Rota A - Centro'
    },
    {
      id: 'del-comp-002',
      orderId: 'PED-2024-101',
      orderCode: 'SCT101',
      customerName: 'Sandra Pereira',
      customerPhone: '(11) 99999-1111',
      address: 'Av. Comercial, 555 - Industrial',
      bottles: { quantity: 3, size: '20L' },
      status: 'completed',
      priority: 'medium',
      estimatedTime: '08:30',
      completedAt: '2024-01-24 08:45:00',
      routeName: 'Rota D - Industrial'
    },
    {
      id: 'del-comp-003',
      orderId: 'PED-2024-102',
      orderCode: 'SCT102',
      customerName: 'Paulo Henrique',
      customerPhone: '(11) 99999-2222',
      address: 'Rua Verde, 321 - Jardim',
      bottles: { quantity: 2, size: '20L' },
      status: 'completed',
      priority: 'high',
      estimatedTime: '13:00',
      completedAt: '2024-01-24 13:20:00',
      routeName: 'Rota C - Jardim'
    }
  ];





  const formatCompletedTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderDeliveryCard = (delivery: Delivery, showCompleted = false) => {
    const checkInStatus = getCheckInStatusInfo(delivery.id);
    const statusData = deliveryStatuses[delivery.id];

    return (
      <Card
        key={delivery.id}
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${checkInStatus ? checkInStatus.color : (showCompleted ? 'bg-green-50/50' : 'hover:scale-[1.02]')
          }`}
        style={{ borderColor: checkInStatus ? undefined : (showCompleted ? 'rgba(0, 128, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)') }}
        onClick={() => onSelectDelivery(delivery)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {checkInStatus && (() => {
                  const StatusIcon = checkInStatus.icon;
                  return <StatusIcon className={`w-5 h-5 ${checkInStatus.textColor}`} />;
                })()}
                {!checkInStatus && showCompleted && <CheckCircle className="w-5 h-5" style={{ color: '#008000' }} />}
                {delivery.customerName}
              </CardTitle>
              <div className="flex items-center space-x-2 flex-wrap gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-green-700">{delivery.routeName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Hoje
                </span>
                {checkInStatus && (
                  <>
                    <Badge variant="outline" className={`${checkInStatus.badgeColor} border-0 text-xs ml-1`}>
                      {checkInStatus.label}
                    </Badge>
                    {statusData?.hadSale && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300">
                        <DollarSign className="w-3 h-3 mr-0.5" />
                        Venda
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1 items-end">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {showCompleted && delivery.completedAt
                    ? formatCompletedTime(delivery.completedAt)
                    : delivery.estimatedTime
                  }
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{delivery.address}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{delivery.customerPhone}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4" style={{ color: '#06b6d4' }} />
              <span className="text-sm">
                {delivery.bottles.quantity} garrafas de {delivery.bottles.size}
              </span>
            </div>
          </div>

          {delivery.notes && (
            <div className="border-2 rounded-lg p-2.5" style={{ background: 'rgba(251, 191, 36, 0.08)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
              <p className="text-sm" style={{ color: '#92400e' }}>
                <strong>Observação:</strong> {delivery.notes}
              </p>
            </div>
          )}

          {showCompleted && delivery.completedAt && (
            <div className="pt-2 border-t rounded-lg p-2.5 -mx-2 -mb-2" style={{ background: 'linear-gradient(135deg, rgba(0, 128, 0, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)' }}>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#008000' }} />
                <span className="text-sm" style={{ color: '#006600' }}>
                  Concluída em {formatCompletedTime(delivery.completedAt)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Minha Rota</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe seus clientes programados para hoje
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center border-2 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(0, 128, 0, 0.15)', background: 'linear-gradient(135deg, rgba(0, 128, 0, 0.03) 0%, rgba(255, 255, 255, 1) 100%)' }}>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-2xl" style={{ color: '#008000' }}>{todayDeliveries.length}</p>
              <p className="text-xs text-muted-foreground">Clientes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center border-2 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(16, 185, 129, 0.15)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(255, 255, 255, 1) 100%)' }}>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-2xl" style={{ color: '#10b981' }}>{completedDeliveries.length}</p>
              <p className="text-xs text-muted-foreground">Realizados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center border-2 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(6, 182, 212, 0.15)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.03) 0%, rgba(255, 255, 255, 1) 100%)' }}>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-2xl" style={{ color: '#06b6d4' }}>
                {todayDeliveries.reduce((total, d) => total + d.bottles.quantity, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Garrafas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Rota de Hoje</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Realizados</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3 mt-4">
          {todayDeliveries.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="space-y-2">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Nenhum cliente na rota</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus clientes aparecerão aqui quando a rota for iniciada
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  {todayDeliveries.filter(d => d.priority === 'high').length} urgentes • {' '}
                  {todayDeliveries.filter(d => d.priority === 'medium').length} normais • {' '}
                  {todayDeliveries.filter(d => d.priority === 'low').length} baixa prioridade
                </p>
              </div>
              {todayDeliveries
                .sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map(delivery => renderDeliveryCard(delivery))
              }
            </>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedDeliveries.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="space-y-2">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Nenhum atendimento realizado</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus atendimentos concluídos aparecerão aqui
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  {completedDeliveries.length} atendimentos realizados hoje
                </p>
              </div>
              {completedDeliveries
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .map(delivery => renderDeliveryCard(delivery, true))
              }
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}