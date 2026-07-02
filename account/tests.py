from django.test import TestCase
from rest_framework import serializers

from account.models import CustomUser
from api.account.serializers import RegisterSerializer


class RegisterSerializerTests(TestCase):
    def test_duplicate_phone_number_is_reported_as_validation_error(self):
        CustomUser.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            phone_number='1234567890',
            password='testpass123'
        )

        serializer = RegisterSerializer()

        with self.assertRaises(serializers.ValidationError):
            serializer.create({
                'username': 'newuser',
                'email': 'new@example.com',
                'phone_number': '1234567890',
                'password': 'testpass123'
            })
