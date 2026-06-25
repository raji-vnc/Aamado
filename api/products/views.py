
from rest_framework import generics
# pyrefly: ignore [missing-import]
from products.models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


# pyrefly: ignore [missing-import]
from products.models import Category
from .serializers import CategorySerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# pyrefly: ignore [missing-import]
from products.models import Brand
from .serializers import BrandSerializer


class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer