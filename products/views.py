from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def shop(request):
    return render(request, 'shop.html')

def product_details(request):
    return render(request, 'product-details.html')

def cart_page(request):
    return render(request, 'cart.html')

def checkout(request):
    return render(request, 'checkout.html')

