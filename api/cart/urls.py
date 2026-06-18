from django.urls import path
from .views import CartView, AddToCartView, WishlistView, ShippingAddressListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('shipping-addresses/', ShippingAddressListView.as_view(), name='shipping-address-list'),
]