import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("inventory_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("inventory_updates", self.channel_name)

    async def inventory_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "inventory_update",
            "item": event["item"]
        }))
