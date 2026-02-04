import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../shared/ui/radio-group';
import { Label } from '../../shared/ui/label';
import { Textarea } from '../../shared/ui/textarea';
import { Input } from '../../shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui/select';
import { ArrowLeft, MapPin, Clock, Package, ShoppingCart, CheckCircle, Droplets } from 'lucide-react';

interface DeliveryCheckInProps {
  delivery: any;
  onBack: () => void;
  onPDV: () => void;
}

export function DeliveryCheckIn({ delivery, onBack, onPDV }: DeliveryCheckInProps) {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bottleQuantity, setBottleQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bottleCondition, setBottleCondition] = useState('ok');

  const handleSubmit = async () => {
    if (!status) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (status === 'delivered') {
        // Se entregue, pode ir para PDV ou voltar
        // Por agora, volta automaticamente
        onBack();
      } else {
        onBack();
      }
    }, 1000);
  };

  if (!delivery) {
    return (
      <div className="p-4">
        <Button onClick={onBack} variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <p className="mt-4">Nenhuma entrega selecionada</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl">Check-in da Entrega</h1>
      </div>

      {/* Delivery Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{delivery.customer}</CardTitle>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {delivery.time}
            </Badge>
          </div>
          <CardDescription className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {delivery.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Distância: {delivery.distance}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Tipo de Contrato:</p>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {delivery.contractType}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Água com Gás - {delivery.bottleType}</p>
                  <p className="text-xs text-muted-foreground">{delivery.items.join(', ')}</p>
                </div>
              </div>

              {delivery.lastDelivery && (
                <div className="text-xs text-muted-foreground">
                  Última entrega: {new Date(delivery.lastDelivery).toLocaleDateString('pt-BR')}
                </div>
              )}

              {delivery.deliveryType === 'novo' && (
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <p className="text-sm text-green-800 font-medium">🆕 Primeiro vasilhame em comodato</p>
                  <p className="text-xs text-green-700">Cliente receberá vasilhame + água com gás</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Location */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm">Sua localização atual será registrada no check-in</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Entrega</CardTitle>
          <CardDescription>Selecione o status atual da entrega</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={status} onValueChange={setStatus}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg border-green-200 bg-green-50">
              <RadioGroupItem value="delivered" id="delivered" />
              <Label htmlFor="delivered" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Entrega Realizada</p>
                    <p className="text-sm text-green-700">Cliente estava em casa e recebeu a entrega</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg border-red-200 bg-red-50">
              <RadioGroupItem value="product-refused" id="product-refused" />
              <Label htmlFor="product-refused" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Produto Recusado</p>
                    <p className="text-sm text-red-700">Cliente recusou o produto, definir se retorna</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg border-orange-200 bg-orange-50">
              <RadioGroupItem value="not-home-return" id="not-home-return" />
              <Label htmlFor="not-home-return" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Cliente Ausente - Retornar</p>
                    <p className="text-sm text-orange-700">Cliente não estava, agendar nova tentativa</p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="not-home-cancel" id="not-home-cancel" />
              <Label htmlFor="not-home-cancel" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Cliente Ausente - Não Retornar</p>
                    <p className="text-sm text-muted-foreground">Cliente não estava, cancelar entrega desta semana</p>
                  </div>
                </div>
              </Label>
            </div>

            {(status === 'product-refused' || status === 'not-home-return') && (
              <Card className="mt-4 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p className="font-medium text-blue-800">Definir Próxima Ação:</p>
                    <RadioGroup defaultValue="return-next-week">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return-next-week" id="return-next-week" />
                        <Label htmlFor="return-next-week" className="text-sm text-blue-700">
                          Retornar na próxima semana
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return-tomorrow" id="return-tomorrow" />
                        <Label htmlFor="return-tomorrow" className="text-sm text-blue-700">
                          Retornar amanhã
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no-return" id="no-return" />
                        <Label htmlFor="no-return" className="text-sm text-blue-700">
                          Não retornar (suspender temporariamente)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {status === 'delivered' && (
              <Card className="mt-4 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-base text-green-800">Detalhes da Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bottle-quantity">Quantidade de Garrafas</Label>
                      <Input
                        id="bottle-quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={bottleQuantity}
                        onChange={(e) => setBottleQuantity(e.target.value)}
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bottle-condition">Estado do Vasilhame</Label>
                      <Select value={bottleCondition} onValueChange={setBottleCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ok">OK - Bom estado</SelectItem>
                          <SelectItem value="dirty">Sujo - Precisa limpeza</SelectItem>
                          <SelectItem value="damaged">Danificado</SelectItem>
                          <SelectItem value="missing">Vasilhame não devolvido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment-method">Forma de Pagamento</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="card">Cartão</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="monthly">Cobrança Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(bottleCondition === 'damaged' || bottleCondition === 'missing') && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-3">
                      <p className="text-sm text-orange-800 font-medium">
                        ⚠️ {bottleCondition === 'damaged' ? 'Vasilhame danificado' : 'Vasilhame não devolvido'}
                      </p>
                      <p className="text-xs text-orange-700">
                        {bottleCondition === 'damaged'
                          ? 'Será necessário trocar o vasilhame na próxima entrega'
                          : 'Cliente deve devolver vasilhame anterior ou será cobrado'
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
          <CardDescription>Adicione observações sobre a entrega (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ex: Portão azul, casa com jardim..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        {status === 'delivered' && (
          <Button onClick={onPDV} variant="outline" className="w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar Venda Extra (PDV)
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!status || isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Confirmar Check-in'}
        </Button>
      </div>
    </div>
  );
}