import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
class TestItemAPI:

    def test_list_items_unauthenticated(self, api_client):
        """Try to get the list of items."""
        url = reverse('item-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_create_item_unauthenticated(self, api_client):
        """Try to create a new item withoud user authentication. (Failed expect)"""
        url = reverse('item-list')
        payload = {
            "name": "New Item",
            "description": "A new description",
            "quantity": 20,
            "price": 9.99,
            "reorder_level": 5
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_item_authenticated(self, auth_client):
        """Create a new item if user authenticated."""
        url = reverse('item-list')
        payload = {
            "name": "Authenticated Item",
            "description": "Created by admin",
            "quantity": 30,
            "price": 19.99,
            "reorder_level": 10
        }
        response = auth_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == "Authenticated Item"

    def test_update_item(self, auth_client, new_item):
        """Update data using PUT operation."""
        url = reverse('item-detail', args=[new_item.id])
        payload = {
            "name": "Updated Item",
            "description": "Updated description",
            "quantity": 40,
            "price": 29.99,
            "reorder_level": 15
        }
        response = auth_client.put(url, payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['quantity'] == 40

    def test_delete_item(self, auth_client, new_item):
        """Delete some item from inventory if authenticated."""
        url = reverse('item-detail', args=[new_item.id])
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
