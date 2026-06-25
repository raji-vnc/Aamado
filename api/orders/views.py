# pyrefly: ignore [missing-import]
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# pyrefly: ignore [missing-import]
from orders.models import ShippingAddress,Order,Payment
from orders.serializers import ShippingAddressSerializer,OrderSerializer,PaymentSerializer

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


class PaymentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(
            order__user=self.request.user
        )