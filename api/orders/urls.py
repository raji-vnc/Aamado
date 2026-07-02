from django.urls import path
from .views import ShippingAddressListView, OrderListView, OrderDetailView, OrderCreateView, PaymentListView

urlpatterns = [
    path('shipping-addresses/', ShippingAddressListView.as_view(), name='shipping-address-list'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('', OrderListView.as_view(), name='order-list'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
]