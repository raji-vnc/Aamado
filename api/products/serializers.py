from rest_framework import serializers
# pyrefly: ignore [missing-import]
from products.models import Category, Brand,Product,ProductImage,Review

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)

    brand = BrandSerializer(read_only=True)

    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    reviews = ReviewSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product
        fields = '__all__'