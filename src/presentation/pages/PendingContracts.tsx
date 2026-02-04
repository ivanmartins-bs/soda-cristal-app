import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { ArrowLeft, FileText, Clock, CheckCircle, Copy, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingContractsProps {
  onBack: () => void;
}

export function PendingContracts({ onBack }: PendingContractsProps) {
  const [contracts] = useState([
    {
      id: 1,
      customerName: 'Maria Silva',
      customerPhone: '(11) 99999-1234',
      contractType: 'Comodato Semanal - Água com Gás 20L',
      createdDate: '2024-01-15',
      status: 'pending',
      link: 'https://contracts.sodacristal.com/sign/abc123',
      isAddendum: false
    },
    {
      id: 2,
      customerName: 'João Santos',
      customerPhone: '(11) 99999-5678',
      contractType: 'Comodato Quinzenal - Água com Gás 50L',
      createdDate: '2024-01-14',
      status: 'pending',
      link: 'https://contracts.sodacristal.com/sign/def456',
      isAddendum: false
    },
    {
      id: 3,
      customerName: 'Ana Costa',
      customerPhone: '(11) 99999-9012',
      contractType: 'Aditivo - Adição Vasilhame 10L Água com Gás',
      createdDate: '2024-01-13',
      status: 'signed',
      link: 'https://contracts.sodacristal.com/sign/ghi789',
      isAddendum: true
    },
    {
      id: 4,
      customerName: 'Carlos Oliveira',
      customerPhone: '(11) 99999-3456',
      contractType: 'Venda Direta - Vasilhame 20L + Água com Gás',
      createdDate: '2024-01-16',
      status: 'pending',
      link: 'https://contracts.sodacristal.com/sign/jkl012',
      isAddendum: false
    },
    {
      id: 5,
      customerName: 'Roberto Lima',
      customerPhone: '(11) 99999-7890',
      contractType: 'Aditivo - Alteração Frequência Entrega',
      createdDate: '2024-01-17',
      status: 'pending',
      link: 'https://contracts.sodacristal.com/sign/mno345',
      isAddendum: true
    }
  ]);

  const pendingContracts = contracts.filter(c => c.status === 'pending');
  const signedContracts = contracts.filter(c => c.status === 'signed');

  const copyToClipboard = (link: string, customerName: string) => {
    navigator.clipboard.writeText(link);
    toast.success(`Link copiado! Envie para ${customerName}`);
  };

  const sendWhatsApp = (phone: string, customerName: string, link: string) => {
    const message = `Olá ${customerName}! Seu contrato da Soda Cristal Tech está pronto para assinatura. Acesse o link: ${link}`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success(`WhatsApp aberto para ${customerName}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysAgo = (dateString: string) => {
    const today = new Date();
    const contractDate = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - contractDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl">Contratos</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl">{pendingContracts.length}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl">{signedContracts.length}</p>
                <p className="text-sm text-muted-foreground">Assinados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Contracts */}
      {pendingContracts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg">Aguardando Assinatura</h2>

          {pendingContracts.map((contract) => (
            <Card key={contract.id} className={`${contract.isAddendum ? 'border-blue-200 bg-blue-50' : 'border-orange-200'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{contract.customerName}</CardTitle>
                    {contract.isAddendum && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                        Aditivo
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {getDaysAgo(contract.createdDate)} dias
                  </Badge>
                </div>
                <CardDescription>
                  {contract.contractType} • Criado em {formatDate(contract.createdDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{contract.customerPhone}</span>
                </div>

                {contract.isAddendum && (
                  <div className="bg-blue-100 border border-blue-200 rounded p-2">
                    <p className="text-xs text-blue-700">
                      Este é um aditivo ao contrato existente. O contrato original será mantido no histórico.
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyToClipboard(contract.link, contract.customerName)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Link
                  </Button>

                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => sendWhatsApp(contract.customerPhone, contract.customerName, contract.link)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Signed Contracts */}
      {signedContracts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg text-muted-foreground">Contratos Assinados</h2>

          {signedContracts.map((contract) => (
            <Card key={contract.id} className="opacity-75 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base">{contract.customerName}</CardTitle>
                    {contract.isAddendum && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                        Aditivo
                      </Badge>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Assinado
                  </Badge>
                </div>
                <CardDescription>
                  {contract.contractType} • Assinado em {formatDate(contract.createdDate)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {pendingContracts.length === 0 && signedContracts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">Nenhum contrato encontrado</h3>
            <p className="text-muted-foreground">
              Cadastre novos clientes para gerar contratos automaticamente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}