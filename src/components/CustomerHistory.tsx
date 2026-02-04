import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Package, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CustomerHistoryProps {
  customer: any;
  onBack: () => void;
}

export function CustomerHistory({ customer, onBack }: CustomerHistoryProps) {
  const [history] = useState([
    {
      id: 1,
      date: '2024-01-24',
      time: '14:30',
      items: [
        { name: 'Água Mineral 20L', quantity: 2, price: 12.00 },
        { name: 'Água com Gás 510ml (Fardo)', quantity: 1, price: 18.00 }
      ],
      total: 42.00,
      status: 'delivered',
      paymentMethod: 'Pix'
    },
    {
      id: 2,
      date: '2024-01-17',
      time: '10:15',
      items: [
        { name: 'Água Mineral 20L', quantity: 2, price: 12.00 }
      ],
      total: 24.00,
      status: 'delivered',
      paymentMethod: 'Dinheiro'
    },
    {
      id: 3,
      date: '2024-01-10',
      time: '16:45',
      items: [],
      total: 0,
      status: 'absent',
      paymentMethod: '-'
    },
    {
      id: 4,
      date: '2024-01-03',
      time: '09:20',
      items: [
        { name: 'Água Mineral 20L', quantity: 3, price: 12.00 }
      ],
      total: 36.00,
      status: 'delivered',
      paymentMethod: 'Cartão'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Entregue
          </Badge>
        );
      case 'absent':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Ausente
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Histórico de Pedidos</h1>
            <p className="text-sm text-muted-foreground">{customer?.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((record) => (
          <Card key={record.id} className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.date).toLocaleDateString('pt-BR')} às {record.time}</span>
                </div>
                {getStatusBadge(record.status)}
              </div>
            </CardHeader>
            <CardContent>
              {record.status === 'delivered' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    {record.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 text-gray-400" />
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Pagamento: <span className="font-medium text-gray-700">{record.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-lg text-green-700">
                      <DollarSign className="w-5 h-5" />
                      {record.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic py-2">
                  Nenhuma venda realizada neste atendimento.
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="text-center text-xs text-muted-foreground pt-4 pb-8">
          Exibindo últimos {history.length} atendimentos
        </div>
      </div>
    </div>
  );
}