from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'price', 'reorder_level', 'formatted_created', 'formatted_updated')

    def formatted_created(self, obj):
        return obj.created_at.strftime("%m/%d/%Y")
    formatted_created.short_description = "Created At"
    
    def formatted_updated(self, obj):
        return obj.updated_at.strftime("%m/%d/%Y")
    formatted_updated.short_description = "Updated At"