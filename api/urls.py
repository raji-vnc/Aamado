from django.urls import path, include\


urlpatterns = [
    
    path('account/', include('api.account.urls')),
    path('cart/', include('api.cart.urls')),
    path('orders/', include('api.orders.urls')),
    path('products/', include('api.products.urls')),
]