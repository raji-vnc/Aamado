from rest_framework import serializers

from cart.models import (Wishlist,Cart,CartItem)

from api.products.serializers import ProductSerializer


class WishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wishlist
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):

    product = ProductSerializer(
        read_only=True
    )

    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cart
        fields = '__all__'

