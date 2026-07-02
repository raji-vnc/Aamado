from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

# pyrefly: ignore [missing-import]
from cart.models import Cart
from .serializers import CartSerializer
# pyrefly: ignore [missing-import]
from cart.models import Wishlist
from .serializers import WishlistSerializer
# pyrefly: ignore [missing-import]
from orders.models import ShippingAddress
from api.orders.serializers import ShippingAddressSerializer

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart = Cart.objects.get(user=request.user)

        serializer = CartSerializer(cart)

        return Response(serializer.data)


# pyrefly: ignore [missing-import]
from cart.models import CartItem
# pyrefly: ignore [missing-import]
from products.models import Product


class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)

        cart = Cart.objects.get(user=request.user)

        product = Product.objects.get(id=product_id)

        CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=quantity
        )

        return Response(
            {"message": "Added to cart"}
        )

class RemoveFromCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart = Cart.objects.get(user=request.user)
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
            return Response({"message": "Item removed from cart"})
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({"error": "Item not found in cart"}, status=404)

class WishlistView(generics.ListAPIView):

    serializer_class = WishlistSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )


class ShippingAddressListView(generics.ListCreateAPIView):

    permission_classes=[IsAuthenticated]
    serializer_class = ShippingAddressSerializer

    def get_queryset(self):
        return ShippingAddress.objects.filter(
            user=self.request.user
        )