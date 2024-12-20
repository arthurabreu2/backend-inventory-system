from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%m/%d/%Y %H:%M", read_only=True)
    updated_at = serializers.DateTimeField(format="%m/%d/%Y %H:%M", read_only=True)
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'quantity', 'price', 'reorder_level', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at')