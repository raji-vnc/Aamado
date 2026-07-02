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

    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'phone_number',
            'password'
        ]

    def validate_phone_number(self, value):
        if value and CustomUser.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "Phone number already exists."
            )
        return value

    def create(self, validated_data):
        phone_number = validated_data.get('phone_number')
        if phone_number is not None:
            phone_number = self.validate_phone_number(phone_number)

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=phone_number,
            password=validated_data['password']
        )

        return user