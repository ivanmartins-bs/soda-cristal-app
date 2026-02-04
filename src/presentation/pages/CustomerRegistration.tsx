import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card';
import { Input } from '../../shared/ui/input';
import { Label } from '../../shared/ui/label';
import { Textarea } from '../../shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui/select';
import { ArrowLeft, User, MapPin, FileText, ExternalLink, Package } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CustomerRegistration({ onBack, onSuccess }: CustomerRegistrationProps) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    reference: '',
    contractType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Generate contract link (mock)
      // const contractLink = `https://contracts.sodacristal.com/sign/${Math.random().toString(36).substr(2, 9)}`;

      toast.success(
        <div>
          <p><strong>Cliente cadastrado com sucesso!</strong></p>
          <p>Contrato gerado e enviado para assinatura.</p>
        </div>
      );

      // Show contract link modal or navigate to contracts
      onSuccess();
    }, 2000);
  };

  const isFormValid = customerData.name && customerData.phone && customerData.address && customerData.contractType;

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl">Cadastrar Novo Cliente</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Dados Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: João Silva Santos"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="joao@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Endereço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Endereço Completo *</Label>
              <Input
                id="address"
                value={customerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua das Flores, 123, Apt 45"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={customerData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Centro"
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={customerData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reference">Ponto de Referência</Label>
              <Textarea
                id="reference"
                value={customerData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                placeholder="Próximo ao mercado, portão azul..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contract Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Tipo de Contrato</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contractType">Selecione o tipo de contrato *</Label>
              <Select value={customerData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comodato-weekly">Comodato Semanal - Água com Gás</SelectItem>
                  <SelectItem value="comodato-biweekly">Comodato Quinzenal - Água com Gás</SelectItem>
                  <SelectItem value="comodato-monthly">Comodato Mensal - Água com Gás</SelectItem>
                  <SelectItem value="comodato-commercial">Comodato Comercial - Água com Gás</SelectItem>
                  <SelectItem value="sale-direct">Venda Direta - Vasilhame</SelectItem>
                  <SelectItem value="demand">Sob Demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {customerData.contractType.includes('comodato') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Contrato de Comodato - Água com Gás</p>
                    <p className="text-sm text-blue-700">
                      O vasilhame permanece em comodato (empréstimo) com o cliente para fornecimento de água com gás.
                      Inclui recargas periódicas conforme frequência escolhida.
                      Será gerado um termo de responsabilidade para assinatura digital.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {customerData.contractType === 'sale-direct' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Venda Direta de Vasilhame</p>
                    <p className="text-sm text-green-700">
                      Cliente adquire o vasilhame em definitivo com primeira carga de água com gás.
                      Futuras recargas serão vendas avulsas.
                      Contrato de compra e venda será gerado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Cadastrando e Gerando Contrato...' : 'Cadastrar Cliente'}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Contrato Digital - Sistema Aditivo</p>
                <p className="text-sm text-blue-700">
                  Após o cadastro, um contrato digital será gerado automaticamente.
                  Se o cliente já possui contrato, será criado um aditivo sem apagar o anterior.
                  Você poderá enviar o link para o cliente assinar pelo WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}