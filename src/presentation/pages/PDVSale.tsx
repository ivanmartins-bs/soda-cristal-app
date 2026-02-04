import { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card';
import { Badge } from '../../shared/ui/badge';
import { Input } from '../../shared/ui/input';
import { ArrowLeft, Plus, Minus, ShoppingCart, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PDVSaleProps {
  delivery: any;
  onBack: () => void;
  onComplete: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function PDVSale({ delivery, onBack, onComplete }: PDVSaleProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const products: Product[] = [
    // Xaropes Populares - Para Água com Gás
    { id: '1', name: 'Xarope Guaraná 500ml', price: 8.50, category: 'Xaropes' },
    { id: '2', name: 'Xarope Cola 500ml', price: 8.50, category: 'Xaropes' },
    { id: '3', name: 'Xarope Laranja 500ml', price: 8.50, category: 'Xaropes' },
    { id: '4', name: 'Xarope Limão 500ml', price: 8.50, category: 'Xaropes' },
    { id: '5', name: 'Xarope Tutti-Frutti 500ml', price: 8.50, category: 'Xaropes' },
    { id: '6', name: 'Xarope Groselha 500ml', price: 8.50, category: 'Xaropes' },

    // Xaropes Premium
    { id: '7', name: 'Xarope Guaraná 1L', price: 15.00, category: 'Xaropes' },
    { id: '8', name: 'Xarope Cola 1L', price: 15.00, category: 'Xaropes' },
    { id: '9', name: 'Xarope Limão 1L', price: 15.00, category: 'Xaropes' },
    { id: '10', name: 'Xarope Mix Frutas 1L', price: 16.00, category: 'Xaropes' },

    // Xaropes Especiais
    { id: '11', name: 'Xarope Diet Guaraná 500ml', price: 9.50, category: 'Xaropes Diet' },
    { id: '12', name: 'Xarope Diet Cola 500ml', price: 9.50, category: 'Xaropes Diet' },
    { id: '13', name: 'Xarope Diet Limão 500ml', price: 9.50, category: 'Xaropes Diet' },

    // Acessórios para Preparo
    { id: '14', name: 'Dosador para Xarope', price: 12.00, category: 'Acessórios' },
    { id: '15', name: 'Funil Pequeno', price: 5.00, category: 'Acessórios' },
    { id: '16', name: 'Copo Medidor 100ml', price: 8.00, category: 'Acessórios' },

    // Combo Promocional
    { id: '17', name: 'Kit 3 Xaropes 500ml', price: 24.00, category: 'Combos' },
    { id: '18', name: 'Kit Família (5 xaropes + dosador)', price: 40.00, category: 'Combos' }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }

    setCart(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      toast.error('Adicione pelo menos um item ao carrinho');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        <div>
          <p><strong>Venda realizada com sucesso!</strong></p>
          <p>Total: R$ {getTotal().toFixed(2)}</p>
        </div>
      );
      onComplete();
    }, 2000);
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl">PDV - Venda de Xaropes</h1>
      </div>

      {/* Info sobre uso com água com gás */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700">
              💡 Xaropes para misturar com a água com gás do vasilhame
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{delivery?.customer}</p>
              <p className="text-sm text-muted-foreground">{delivery?.address}</p>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Entrega Concluída
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-lg mb-3">{category}</h2>
          <div className="grid gap-3">
            {products
              .filter(product => product.category === category)
              .map(product => {
                const quantity = getCartItemQuantity(product.id);
                return (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-lg text-green-600">R$ {product.price.toFixed(2)}</p>
                        </div>

                        {quantity === 0 ? (
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min="0"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart(product)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Resumo da Venda</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity}x R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-green-600">
                  R$ {getTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleFinalizeSale}
          className="w-full"
          disabled={cart.length === 0 || isProcessing}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processando Venda...' : `Finalizar Venda - R$ ${getTotal().toFixed(2)}`}
        </Button>

        <Button
          onClick={onComplete}
          variant="outline"
          className="w-full"
        >
          Pular Venda Extra
        </Button>
      </div>
    </div>
  );
}