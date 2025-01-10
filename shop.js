if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    var addToCartButtons = document.getElementsByClassName('button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

    loadCart()
}

function purchaseClicked() {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var hasItems = Array.from(cartItems.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);
    
    if (hasItems) {
        var purchaseModal = new bootstrap.Modal(document.getElementById('purchaseModal'));
        purchaseModal.show();
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal();
    } else {
        var emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
        emptyCartModal.show();
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc, 1)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, quantity) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${quantity}">
            <button class="btn btn-danger" type="button" style="padding: 5px">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    updateCartTotal()
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

function saveCart() {
    var cartItems = document.getElementsByClassName('cart-items')[0].getElementsByClassName('cart-row')
    var cartData = []

    for (var i = 0; i < cartItems.length; i++) {
        var cartRow = cartItems[i]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = cartRow.getElementsByClassName('cart-price')[0].innerText
        var quantity = cartRow.getElementsByClassName('cart-quantity-input')[0].value
        var imageSrc = cartRow.getElementsByClassName('cart-item-image')[0].src
        cartData.push({ title, price, quantity, imageSrc })
    }

    localStorage.setItem('cart', JSON.stringify(cartData))
}

function loadCart() {
    var cartData = JSON.parse(localStorage.getItem('cart'))
    if (cartData) {
        for (var i = 0; i < cartData.length; i++) {
            var item = cartData[i]
            addItemToCart(item.title, item.price, item.imageSrc, item.quantity)
        }
    }
}

window.addEventListener('beforeunload', saveCart)
