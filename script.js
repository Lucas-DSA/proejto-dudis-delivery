const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInpuit = document.getElementById("address")
const adressWarn = document.getElementById("address-warn")
const observacaoInput = document.getElementById("observacao")


let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;

    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-bold mt-2 ">R$ ${item.price.toFixed(2)}</p>
                <hr><hr>
            </div>
                <hr><hr>
                
                <button class="remove-btn" data-name="${item.name}">
                    Remover
                </button>
        
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();

    }
}

addressInpuit.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInpuit.classList.remove("borde-red-500")
        adressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function () {

    const isOpen = checkHorarioDeFuncionamento();
    if (!isOpen) {

        Toastify({
            text: "Restaurante Fechado!!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#FF0000",
            },
            onClick: function () { } // Callback after click
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInpuit.value === "") {
        adressWarn.classList.remove("hidden")
        addressInpuit.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price.toFixed(2)} | 

`
        )
    }).join("\n")

// calcular total do carrinho
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// montar mensagem
const message = encodeURIComponent(
    `🛒 Pedido:\n${cartItems}\n\n💰 Total: R$ ${total.toFixed(2)}\n📍 Endereço: ${addressInpuit.value}`
);
    const phone = "+5511958306342"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInpuit.value}`, "_blank")

    cart = [];
    updateCartModal();
})

function checkHorarioDeFuncionamento() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 22;
}


const spanItem = document.getElementById("date-span")
const isOpen = checkHorarioDeFuncionamento();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-gree-600")
} else {
    spanItem.classList.remove("bg-gree-600")
    spanItem.classList.add("bg-red-500")
}






