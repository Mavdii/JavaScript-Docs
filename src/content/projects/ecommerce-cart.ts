import type { ProjectContent } from '@/types/content';

export const ecommerceCartProject: ProjectContent = {
  id: 'project-ecommerce-cart',
  title: 'E-Commerce Cart',
  description: 'Build a complete e-commerce shopping cart with product browsing, cart management, promo codes, and checkout flow.',
  slug: 'projects/ecommerce-cart',
  pillar: 'projects',
  category: 'applications',
  tags: ['ecommerce', 'shopping cart', 'state management', 'stripe', 'checkout'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Create a full e-commerce experience with product listing, shopping cart with quantity controls, promo code validation, order summary, and checkout integration.',
  relatedTopics: ['integration-stripe', 'recipe-global-state'],
  order: 9,
  updatedAt: '2025-06-01',
  readingTime: 30,
  featured: true,
  keywords: ['ecommerce', 'shopping cart', 'checkout', 'promo codes', 'payments'],
  techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Stripe'],
  learningGoals: [
    'Implement product catalog UI',
    'Build cart state management',
    'Handle quantity and pricing calculations',
    'Validate and apply promo codes',
    'Create checkout flow',
    'Integrate payment processing',
  ],
  features: [
    'Product listing with filters',
    'Add/remove items from cart',
    'Quantity controls with validation',
    'Promo code system',
    'Real-time price updates',
    'Persistent cart (localStorage)',
    'Multi-step checkout',
    'Order confirmation',
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Product & Cart Data Models',
      id: 'data-models',
    },
    {
      type: 'paragraph',
      text: 'Define clear TypeScript interfaces for products and cart items. Keep products immutable and use cart items as the mutable representation.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartWithProducts extends CartItem {
  product: Product;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive: boolean;
}

// Sample products
export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'High-quality noise-cancelling headphones',
    price: 9999, // $99.99
    image: '/headphones.jpg',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 230,
  },
  {
    id: 'prod-2',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand',
    price: 2999, // $29.99
    image: '/stand.jpg',
    category: 'Accessories',
    stock: 120,
    rating: 4.8,
    reviews: 145,
  },
  // ... more products
];

// Promo codes
export const PROMO_CODES: PromoCode[] = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
  },
  {
    code: 'WELCOME20',
    discountType: 'fixed',
    discountValue: 2000, // $20.00
    minPurchase: 5000, // $50 minimum
    isActive: true,
  },
];`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Cart State Management with Zustand',
      id: 'cart-store',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  appliedPromo: string | null;

  // Cart operations
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Promo codes
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  // Selectors
  getCartItems: () => CartItem[];
  getCartTotal: (products: Product[]) => number;
  getDiscount: (products: Product[]) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,

      addToCart: (productId, quantity) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { productId, quantity, addedAt: new Date() },
            ],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          appliedPromo: null,
        }),

      applyPromo: (code) => {
        const promo = PROMO_CODES.find(
          (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive
        );

        if (!promo) return false;

        set({ appliedPromo: promo.code });
        return true;
      },

      removePromo: () =>
        set({ appliedPromo: null }),

      getCartItems: () => get().items,

      getCartTotal: (products) => {
        const subtotal = get().items.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          return sum + (product?.price || 0) * item.quantity;
        }, 0);

        return subtotal + get().getDiscount(products);
      },

      getDiscount: (products) => {
        const promo = PROMO_CODES.find((p) => p.code === get().appliedPromo);
        if (!promo) return 0;

        const subtotal = get().items.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          return sum + (product?.price || 0) * item.quantity;
        }, 0);

        // Check minimum purchase
        if (promo.minPurchase && subtotal < promo.minPurchase) {
          return 0;
        }

        if (promo.discountType === 'percentage') {
          return Math.floor((subtotal * promo.discountValue) / 100);
        } else {
          return Math.min(promo.discountValue, subtotal);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Product Catalog Component',
      id: 'product-catalog',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [quantity, setQuantity] = useState(1);

  const priceInDollars = (product.price / 100).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1);
    // Show toast notification
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative pb-2/3 bg-gray-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform"
        />
        {product.stock < 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Low Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-900">
            \${priceInDollars}
          </span>
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full mt-3 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function ProductCatalog() {
  const [category, setCategory] = useState('All');

  const filteredProducts = category === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === category);

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={\`px-4 py-2 rounded font-semibold transition-colors \${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }\`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Shopping Cart Component',
      id: 'shopping-cart',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `interface CartSummaryProps {
  onCheckout: () => void;
}

function CartSummary({ onCheckout }: CartSummaryProps) {
  const items = useCartStore((s) => s.getCartItems());
  const appliedPromo = useCartStore((s) => s.appliedPromo);
  const removePromo = useCartStore((s) => s.removePromo);

  const subtotal = items.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const discount = useCartStore((s) => s.getDiscount(PRODUCTS));
  const total = subtotal - discount;

  const priceDisplay = (cents: number) => (cents / 100).toFixed(2);

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4 border-b pb-4">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>\${priceDisplay(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount ({appliedPromo}):</span>
            <span>-\${priceDisplay(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <span>Shipping:</span>
          <span>$9.99</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax:</span>
          <span>\${priceDisplay(Math.floor(total * 0.08))}</span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
        <span>Total:</span>
        <span>\${priceDisplay(total + 999 + Math.floor(total * 0.08))}</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function ShoppingCart() {
  const items = useCartStore((s) => s.getCartItems());
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const appliedPromo = useCartStore((s) => s.appliedPromo);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const removePromo = useCartStore((s) => s.removePromo);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (applyPromo(promoCode)) {
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
        <a href="/shop" className="text-blue-600 hover:underline">
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Shopping Cart ({items.length})
          </h2>

          <div className="space-y-4">
            {items.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b pb-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      \${(product.price / 100).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      \${(
                        (product.price * item.quantity) /
                        100
                      ).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-600 hover:text-red-800 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold text-gray-800 mb-3">Promo Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                disabled={appliedPromo !== null}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
              {appliedPromo ? (
                <button
                  onClick={removePromo}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              )}
            </div>
            {promoError && (
              <p className="text-red-600 text-sm mt-2">{promoError}</p>
            )}
            {appliedPromo && (
              <p className="text-green-600 text-sm mt-2">
                Promo code "{appliedPromo}" applied
              </p>
            )}
          </div>
        </div>
      </div>

      <CartSummary onCheckout={() => console.log('Checkout')} />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Checkout Flow',
      id: 'checkout-flow',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutState {
  step: CheckoutStep;
  shippingInfo: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function CheckoutFlow() {
  const [state, setState] = useState<CheckoutState>({
    step: 'cart',
    shippingInfo: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const handleShippingSubmit = (info: CheckoutState['shippingInfo']) => {
    setState((prev) => ({
      ...prev,
      shippingInfo: info,
      step: 'payment',
    }));
  };

  const handlePaymentSuccess = () => {
    setState((prev) => ({
      ...prev,
      step: 'confirmation',
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between">
          {(['cart', 'shipping', 'payment', 'confirmation'] as const).map(
            (step, idx) => (
              <div
                key={step}
                className={\`flex-1 text-center pb-4 border-b-2 \${
                  idx <= (['cart', 'shipping', 'payment', 'confirmation'] as const).indexOf(state.step)
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-gray-300 text-gray-600'
                }\`}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </div>
            )
          )}
        </div>
      </div>

      {state.step === 'cart' && <ShoppingCart />}
      {state.step === 'shipping' && (
        <ShippingForm onSubmit={handleShippingSubmit} />
      )}
      {state.step === 'payment' && (
        <PaymentForm onSuccess={handlePaymentSuccess} />
      )}
      {state.step === 'confirmation' && <OrderConfirmation />}
    </div>
  );
}`,
    },
  ],
};
