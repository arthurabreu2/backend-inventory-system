import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.urls import reverse
from inventory_manegement.models import Item

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(username='admin', password='admin', email='admin@test.com')

@pytest.fixture
def admin_token(api_client, admin_user):
    url = reverse('token_obtain_pair')
    response = api_client.post(url, {'username': 'admin', 'password': 'admin'}, format='json')
    assert response.status_code == 200
    return response.data['access']

@pytest.fixture
def auth_client(api_client, admin_token):
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    return api_client

@pytest.fixture
def new_item(db):
    return Item.objects.create(
        name='New Item',
        description='New description for the new test item',
        quantity=10,
        price=9.99,
        reorder_level=5
    )
