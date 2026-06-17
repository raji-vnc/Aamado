from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from cart.models import Cart
from cart.serializers import CartSerializer
from cart.models import Wishlist
from cart.serializers import WishlistSerializer
from orders.models import ShippingAddress
from orders.serializers import ShippingAddressSerializer
class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart = Cart.objects.get(user=request.user)

        serializer = CartSerializer(cart)

        return Response(serializer.data)



from cart.models import CartItem
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

class WishlistView(generics.ListAPIView):

    serializer_class = WishlistSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )


class ShippingAddressListView(generics.ListCreateAPIView):

    serializer_class = ShippingAddressSerializer

    def get_queryset(self):
        return ShippingAddress.objects.filter(
            user=self.request.user
        )