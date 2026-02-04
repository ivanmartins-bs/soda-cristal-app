import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Badge } from '../../shared/ui/badge';
import { Input } from '../../shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui/select';
import { Search, ShoppingCart, Plus, Minus, User, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

interface PDVStandaloneProps {
  delivery?: any;
  customerName?: string;
  onBack?: () => void;
}

export function PDVStandalone({ delivery, customerName: propCustomerName, onBack }: PDVStandaloneProps = {}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState(propCustomerName || delivery?.customerName || '');
  const [paymentMethod, setPaymentMethod] = useState('');

  const products: Product[] = [
    // Xaropes Populares
    { id: '1', name: 'Xarope Guaraná 500ml', price: 8.50, category: 'Xaropes' },
    { id: '2', name: 'Xarope Cola 500ml', price: 8.50, category: 'Xaropes' },
    { id: '3', name: 'Xarope Laranja 500ml', price: 8.50, category: 'Xaropes' },
    { id: '4', name: 'Xarope Limão 500ml', price: 8.50, category: 'Xaropes' },
    { id: '5', name: 'Xarope Tutti-Frutti 500ml', price: 8.50, category: 'Xaropes' },
    { id: '6', name: 'Xarope Groselha 500ml', price: 8.50, category: 'Xaropes' },

    // Xaropes Premium
    { id: '7', name: 'Xarope Guaraná 1L', price: 15.00, category: 'Xaropes Premium' },
    { id: '8', name: 'Xarope Cola 1L', price: 15.00, category: 'Xaropes Premium' },
    { id: '9', name: 'Xarope Limão 1L', price: 15.00, category: 'Xaropes Premium' },
    { id: '10', name: 'Xarope Mix Frutas 1L', price: 16.00, category: 'Xaropes Premium' },

    // Xaropes Diet
    { id: '11', name: 'Xarope Diet Guaraná 500ml', price: 9.50, category: 'Xaropes Diet' },
    { id: '12', name: 'Xarope Diet Cola 500ml', price: 9.50, category: 'Xaropes Diet' },
    { id: '13', name: 'Xarope Diet Limão 500ml', price: 9.50, category: 'Xaropes Diet' },

    // Acessórios
    { id: '14', name: 'Dosador para Xarope', price: 12.00, category: 'Acessórios' },
    { id: '15', name: 'Funil Pequeno', price: 5.00, category: 'Acessórios' },
    { id: '16', name: 'Copo Medidor 100ml', price: 8.00, category: 'Acessórios' },

    // Combos
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

    if (!customerName.trim()) {
      toast.error('Informe o nome do cliente');
      return;
    }

    if (!paymentMethod) {
      toast.error('Selecione a forma de pagamento');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        <div>
          <p><strong>Venda realizada com sucesso!</strong></p>
          <p>Cliente: {customerName}</p>
          <p>Total: R$ {getTotal().toFixed(2)}</p>
        </div>
      );

      // Reset form
      setCart([]);
      setCustomerName('');
      setPaymentMethod('');
    }, 2000);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">
              {delivery ? `PDV: ${delivery.customerName}` : 'PDV - Xaropes'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {delivery
                ? `${delivery.address} • ${delivery.orderCode}`
                : 'Ponto de venda independente'
              }
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {cart.length} {cart.length === 1 ? 'item' : 'itens'}
        </Badge>
      </div>

      {/* Info sobre produtos */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700">
              💡 Xaropes para misturar com água com gás
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <User className="w-4 h-4 mr-2" />
            Dados do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Nome do cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredProducts.map((product) => {
          const quantityInCart = getCartItemQuantity(product.id);

          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {quantityInCart > 0 ? (
                      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <Input
                          type="number"
                          min="0"
                          value={quantityInCart}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                        />

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addToCart(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary - Fixed Bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border p-4 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  {cart.reduce((total, item) => total + item.quantity, 0)} itens
                </span>
              </div>
              <span className="text-lg font-bold text-green-600">
                R$ {getTotal().toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleFinalizeSale}
              disabled={isProcessing || cart.length === 0 || !customerName.trim() || !paymentMethod}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processando...' : 'Finalizar Venda'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}