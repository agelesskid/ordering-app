import {menuArray} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const orderArray = []
const paymentModal = document.getElementById('payment-modal')
const alert = document.getElementById('alert')

function addToOrderArray(itemId){
    const orderItem = menuArray.filter(item => item.id == itemId)[0]
    
    orderArray.push({name: orderItem.name, price: orderItem.price, uuid: uuidv4()})
}

function removeFromOrderArray(itemId){
    orderArray.splice(orderArray.findIndex(item => item.uuid === itemId), 1)
}

function getTotalPrice(){
    let totalPrice = 0

    orderArray.forEach(function(item){
        totalPrice += item.price
    })

    return totalPrice
}

function getOrderHtml(){

    let orderHtml = ''

    orderArray.forEach(function(item){
        orderHtml += `
            <li class="order__list__el">
                <p class="order__list__el__item-name">${item.name}</p>
                <button type="button" class="order__list__el__remove-btn" data-item-id="${item.uuid}" data-change="remove">remove</button>
                <p class="order__list__el__item-price">$${item.price}</p>
            </li>
        `
    })

    return orderHtml
}

function renderOrder(){
    
    if(orderArray.length){
        document.getElementById('order-list').innerHTML = getOrderHtml()
        document.getElementById('order').style.display = 'block'
        document.getElementById('order-total-price').innerText = `$${getTotalPrice()}`
        alert.style.display = 'none'
    } else {
        document.getElementById('order').style.display = 'none'
    }
    
}


function handleAdditionClick(itemId){
    addToOrderArray(itemId)
    renderOrder()
}

function handleRemoveClick(itemId){
    removeFromOrderArray(itemId)
    renderOrder()
}

function handleSubmitClick(){
    const form = document.getElementById('payment-modal-form')
    document.getElementById('alert-msg').innerText = `Thanks, ${form.name.value}! Your order is on its way!`
    paymentModal.style.display = 'none'
    alert.style.display = 'block'
    orderArray.length = 0
    form.reset()
    renderOrder()
}

function getMenuHtml(){

    let menuHtml = ''

    menuArray.forEach(function(menuItem){
        menuHtml += `
                <li class="selection__list__el" >
                    <i class="selection__list__el__emoji inter center">${menuItem.emoji}</i>
                    <div class="selection__list__el__wrapper">
                        <p class="selection__list__el__wrapper__item-name">${menuItem.name}</p>
                        <p class="selection__list__el__wrapper__item-ingredients">${menuItem.ingredients.join(', ')}</p>
                        <p class="selection__list__el__wrapper__item-price">$${menuItem.price}</p>
                    </div>

                    <button type="button" class="selection__list__el__button inter" data-item-id="${menuItem.id}" data-change="add">+</button>
                </li>
        `
    })

    return menuHtml

}

function renderMenu(){

    document.getElementById('selection-list').innerHTML = getMenuHtml()

}

document.addEventListener('click', function(e){
    if (e.target.dataset.change == 'add' && e.target.dataset.itemId){
        handleAdditionClick(e.target.dataset.itemId)
    } else if (e.target.dataset.change == 'remove' && e.target.dataset.itemId) {
        handleRemoveClick(e.target.dataset.itemId)
    } else if (e.target.id == 'order-btn'){
        paymentModal.style.display = 'block'
    } else if (!e.target.closest('#payment-modal')) {
        paymentModal.style.display = 'none'
    }
})

document.addEventListener('submit', function(e){
    e.preventDefault()
    handleSubmitClick()
})

renderMenu()