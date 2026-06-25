from rest_framework import serializers

# pyrefly: ignore [missing-import]
from account.models import CustomUser


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'profile_image',
            'address'
        ]

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = CustomUser

        fields = [
            'username',
            'email',
            'password'
        ]

    def create(self, validated_data):

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user