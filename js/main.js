// WY Cleaning v2.0 - Main JavaScript
const products=[
    {id:1,name:"Wash & Shine",category:"exterior",price:24.99,description:"Kant-en-klare auto reiniger. Spray, wacht 2 minuten, afspuiten.",emoji:"🚗",badge:"Bestseller"},
    {id:2,name:"Pre-Wash Degreaser",category:"exterior",price:19.99,description:"Krachtige ontvetter voor hardnekkig vuil en vliegjes.",emoji:"⚡",badge:null},
    {id:3,name:"Wheel Cleaner",category:"exterior",price:14.99,description:"Alkalische velgenreiniger. Geen borstel nodig!",emoji:"🛞",badge:"Populair"},
    {id:4,name:"Interior Cleaner",category:"interior",price:17.99,description:"Alles-in-één interieur reiniger voor dashboard en stoelen.",emoji:"🪑",badge:"Nieuw"},
    {id:5,name:"Glass Cleaner",category:"interior",price:12.99,description:"Streepvrije ruitenreiniger. Professionele helderheid.",emoji:"✨",badge:null},
    {id:6,name:"Protection Spray",category:"protection",price:29.99,description:"Langdurige beschermlaag voor lak. Beschermt 3 maanden!",emoji:"🛡️",badge:"Premium"}
];

let cart=JSON.parse(localStorage.getItem('wy_cart_v2'))||[];

document.addEventListener('DOMContentLoaded',()=>{
    initNav();
    initMobileMenu();
    initCart();
    renderProducts();
    updateCartUI();
    initScrollReveal();
});

function initNav(){
    const nav=document.getElementById('navbar');
    window.addEventListener('scroll',()=>{
        if(window.scrollY>50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

function initMobileMenu(){
    const toggle=document.getElementById('menuToggle');
    const menu=document.getElementById('mobileMenu');
    const close=document.getElementById('menuClose');
    const backdrop=document.getElementById('mobileBackdrop');
    
    if(toggle) toggle.addEventListener('click',()=>{
        menu.classList.add('active');
        toggle.classList.add('active');
        document.body.style.overflow='hidden';
    });
    
    [close,backdrop].forEach(el=>{
        if(el) el.addEventListener('click',()=>{
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow='';
        });
    });
}

function initCart(){
    const cartToggle=document.getElementById('cartToggle');
    const cartClose=document.getElementById('cartClose');
    const cartOverlay=document.getElementById('cartOverlay');
    const continueShopping=document.getElementById('continueShopping');
    
    if(cartToggle) cartToggle.addEventListener('click',openCart);
    if(cartClose) cartClose.addEventListener('click',closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click',closeCart);
    if(continueShopping) continueShopping.addEventListener('click',closeCart);
    
    document.addEventListener('keydown',e=>{
        if(e.key==='Escape') closeCart();
    });
}

function openCart(){
    document.getElementById('cartSidebar')?.classList.add('active');
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow='hidden';
}

function closeCart(){
    document.getElementById('cartSidebar')?.classList.remove('active');
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.body.style.overflow='';
}

function addToCart(productId,quantity=1){
    const product=products.find(p=>p.id===productId);
    if(!product) return;
    
    const existing=cart.find(item=>item.id===productId);
    if(existing) existing.quantity+=quantity;
    else cart.push({id:product.id,name:product.name,price:product.price,emoji:product.emoji,quantity});
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} toegevoegd!`);
}

function removeFromCart(productId){
    cart=cart.filter(item=>item.id!==productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId,newQty){
    const item=cart.find(item=>item.id===productId);
    if(item){
        if(newQty<=0) removeFromCart(productId);
        else{
            item.quantity=newQty;
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart(){
    localStorage.setItem('wy_cart_v2',JSON.stringify(cart));
}

function updateCartUI(){
    const badge=document.getElementById('cartBadge');
    const items=document.getElementById('cartItems');
    const total=document.getElementById('cartTotal');
    
    const totalItems=cart.reduce((sum,item)=>sum+item.quantity,0);
    const totalPrice=cart.reduce((sum,item)=>sum+(item.price*item.quantity),0);
    
    if(badge){
        badge.textContent=totalItems;
        badge.style.display=totalItems>0?'flex':'none';
    }
    if(total) total.textContent=`€${totalPrice.toFixed(2).replace('.',',')}`;
    
    if(items){
        if(cart.length===0){
            items.innerHTML=`<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2L6 7H3L5.5 20H18.5L21 7H18L15 2H9Z"/><path d="M9 11V17M15 11V17"/></svg><p>Je winkelwagen is leeg</p><button class="btn btn-primary" style="margin-top:1rem" onclick="closeCart();window.location.href='shop.html'">Bekijk producten</button></div>`;
        }else{
            items.innerHTML=cart.map(item=>`<div class="cart-item"><div class="cart-item-image">${item.emoji}</div><div class="cart-item-details"><div class="cart-item-name">${item.name}</div><div class="cart-item-price">€${item.price.toFixed(2).replace('.',',')}</div><div class="cart-item-actions"><button class="quantity-btn" onclick="updateQuantity(${item.id},${item.quantity-1})">−</button><span class="cart-item-qty">${item.quantity}</span><button class="quantity-btn" onclick="updateQuantity(${item.id},${item.quantity+1})">+</button><button class="cart-item-remove" onclick="removeFromCart(${item.id})">Verwijder</button></div></div></div>`).join('');
        }
    }
}

function renderProducts(){
    const grid=document.getElementById('productsGrid');
    if(!grid) return;
    
    grid.innerHTML=products.map(p=>`<div class="product-card"><div class="product-image">${p.emoji}${p.badge?`<span class="product-badge">${p.badge}</span>`:''}</div><div class="product-info"><div class="product-category">${p.category}</div><h3 class="product-title">${p.name}</h3><p class="product-desc">${p.description}</p><div class="product-footer"><span class="product-price">€${p.price.toFixed(2).replace('.',',')}</span><button class="btn-add" onclick="addToCart(${p.id})" aria-label="Toevoegen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5V19M5 12H19"/></svg></button></div></div></div>`).join('');
}

function initScrollReveal(){
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting) entry.target.classList.add('visible');
        });
    },{threshold:0.1});
    
    document.querySelectorAll('.scroll-reveal').forEach(el=>observer.observe(el));
}

function showToast(message,type='success'){
    let container=document.querySelector('.toast-container');
    if(!container){
        container=document.createElement('div');
        container.className='toast-container';
        document.body.appendChild(container);
    }
    
    const toast=document.createElement('div');
    toast.className='toast';
    toast.innerHTML=`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type==='success'?'#0ea5e9':'#ef4444'}" stroke-width="2"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"/><path d="M22 4L12 14.01L9 11.01"/></svg><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(100%)';setTimeout(()=>toast.remove(),300)},3000);
}

// Contact form
document.getElementById('contactForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    showToast('Bericht verstuurd! We nemen contact op.');
    e.target.reset();
});
