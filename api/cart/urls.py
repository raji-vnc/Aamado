from django.urls import path
from .views import CartView, AddToCartView, RemoveFromCartView, WishlistView, ShippingAddressListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/remove/<int:item_id>/', RemoveFromCartView.as_view(), name='cart-remove'),
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('shipping-addresses/', ShippingAddressListView.as_view(), name='shipping-address-list'),
]