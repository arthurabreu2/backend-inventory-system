from rest_framework import viewsets, permissions
from .models import Item
from .serializers import ItemSerializer

# Web Socket for real-time update
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('id')
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


def notify_inventory_update(item_data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "inventory_updates", 
        {
            "type": "inventory_update",
            "item": item_data  
        }
    )
