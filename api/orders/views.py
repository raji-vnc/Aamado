# pyrefly: ignore [missing-import]
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import uuid

# pyrefly: ignore [missing-import]
from orders.models import ShippingAddress,Order,Payment,OrderItem
from api.orders.serializers import ShippingAddressSerializer,OrderSerializer,PaymentSerializer

# pyrefly: ignore [missing-import]
from cart.models import Cart, CartItem

class ShippingAddressListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShippingAddressSerializer

    def get_queryset(self):
        return ShippingAddress.objects.filter(
            user=self.request.user
        )


class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )

class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipping_address_id = request.data.get('shipping_address_id')
        
        try:
            shipping_address = ShippingAddress.objects.get(id=shipping_address_id, user=request.user)
        except ShippingAddress.DoesNotExist:
            return Response({"error": "Invalid shipping address"}, status=400)
            
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=400)
            
        cart_items = CartItem.objects.filter(cart=cart)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)
            
        # Calculate total
        total_amount = sum([item.product.price * item.quantity for item in cart_items])
        
        # Create Order
        order = Order.objects.create(
            user=request.user,
            shipping_address=shipping_address,
            order_id="ORD-" + str(uuid.uuid4()).replace('-', '')[:10].upper(),
            total_amount=total_amount
        )
        
        # Create Order Items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            
        # Clear Cart
        cart_items.delete()
        
        return Response({"message": "Order created successfully", "order_id": order.order_id}, status=201)

class PaymentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(
            order__user=self.request.user
        )