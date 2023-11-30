import Swiper from "../swiper.js";
import {getAllProductIndex} from "../services/api/product-index.js";
import {productOrderAPI, getProductOrderAPI} from "../services/api/customer/product-order.js";
import {cancelOrderAPI} from "../services/api/cancel-order.js";
import {productReviewAPI} from "../services/api/customer/product-review.js";
import {getProfileCustomerAPI, changeProfileCustomerAPI, changePasswordCustomerAPI} from "../services/api/customer/profile-customer.js";
import {refreshTokenAPI} from "../services/api/refresh-token.js";
import {logoutATAPI} from "../services/api/logout-token.js";
import {checkLocation} from "../services/api/check-location.js";

const CUSTOMER_TOKEN = JSON.parse(localStorage.getItem("CUSTOMER_TOKEN")) ?? null;
let access_token = "";
let name = "";
let id = "";
if(CUSTOMER_TOKEN != null){
   access_token = CUSTOMER_TOKEN.data.access_token;
   name = CUSTOMER_TOKEN.data.customer.name;
   id = CUSTOMER_TOKEN.data.customer.id;
}
    
    const fetchContent = async (url) => {
        try {
            const response = await fetch(url);
            const result = await response.text();
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async function loadNavBarContent(){
        try {
            fetchContent("navbar.html").then(response => {
                document.getElementById("navbar").innerHTML = response;
                if(CUSTOMER_TOKEN != null){
                    const navbar = document.getElementById("navbar");
                    navbar.classList.remove("py-3");
                    const customerAuthNavLink = document.querySelectorAll("#customer-auth-nav a");
                    customerAuthNavLink.forEach(element => {
                        element.style.display = "none";
                    });
                    const customerAuthNavContainer = document.getElementById("customer-auth-nav");
                    customerAuthNavContainer.innerHTML = `<a class="btn btn-primary mr-4" data-toggle="modal" id="beli-menu">Beli Menu</a>
                                                            <a class="text-dark" href="#account-detail" id="account-menu"><i class='bx bx-user bx-sm hovered-icon'></i></a>`;
                }
                const beliMenuContainer = document.getElementById("beli-menu") ?? null;
                if(beliMenuContainer != null){
                    const beliMenuContainer = document.getElementById("beli-menu");
                    if(page == "cart"){
                        beliMenuContainer.classList.add("d-none");
                    }
                    beliMenuContainer.addEventListener("click", function(){
                        dbGetCustomerLocation().then(data => {
                            if(data != null){
                                $('#changeLocationModal').modal('show');
                            }
                        })
                        .catch(error => {
                            if(error){
                                $('#exampleModalCenter').modal('show');
                            }
                        }); 
                    });
                }

                const accountMenu = document.getElementById("account-menu") ?? null;
                if(accountMenu != null){
                    accountMenu.addEventListener("click", function(){
                        page = "account-detail";
                        loadNavBarContent();
                        loadPageContent(page);
                    });
                }

                const menuSearch = document.querySelectorAll(".menu-search");
                dbGetAllProductsIndex().then(data => {
                    if(data){
                        menuSearch.forEach(element => {
                            element.addEventListener("keyup", function(event){
                                let menuInputValue = event.target.value.toLowerCase();
                                if(menuInputValue != ""){   
                                    let filteredMenuObject = data[0].filter(element => {
                                        return element.name.toLowerCase().includes(menuInputValue.toLocaleLowerCase()); 
                                    });
                                    filteredMenuObject.slice(1,2);
                                    if(filteredMenuObject.length == 0){
                                        document.querySelectorAll(".search-suggest").forEach(element => {
                                            element.innerHTML = `<li class="list-group-item">Tidak ditemukan...</li>`;
                                        });
                                    }
                                    else {
                                        let dataMenuSuggestRaw = "";
                                        filteredMenuObject.forEach(element => {
                                            const {id, name, path} = element;
                                            dataMenuSuggestRaw += `<a href="product-details.html?id=${id}" class="border-none"><li class="list-group-item d-flex flex-column"><p class="text-dark">${name}</p><div><img src="https://rest-orderapp.herokuapp.com/${path}" class="img-fluid rounded" style="width:20%;" /></div></li></a>`;
                                        });
                                        document.querySelectorAll(".search-suggest").forEach(element => {
                                            element.innerHTML = dataMenuSuggestRaw;
                                        });
                                    }
                                }
                                else {
                                    document.querySelectorAll(".search-suggest").forEach(element => {
                                            element.innerHTML = `<li class="list-group-item">Silahkan cari menu...</li>`;
                                    });
                                }
                            });
                        });
                    }
                });
                
                
            });
        }
        catch(error){
            console.log(error);
        }
    }

    async function loadFooterContent(){
        try {
            fetchContent("footer.html").then(response => {
                document.getElementById("footer").innerHTML = response;
            });
        }
        catch(error){
            console.log(error);
        }
    }
    async function loadBottomNavbarContent(){
        try {
            fetchContent("bottom-navbar.html")
                .then(response => {
                    document.getElementById("bottom-navbar-container").innerHTML = response;
                    if(page == "all-products"){
                        document.getElementById("all-products").classList.replace("text-secondary", "text-primary");
                     }
                    else if(page == "cart"){
                        document.getElementById("cart").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "account-detail"){
                        document.getElementById("account-detail").classList.replace("text-secondary", "text-primary");
                    }
                    document.querySelectorAll("#bottom-navbar-container a").forEach(element => {
                        element.addEventListener("click", function(event){
                            let elementAttributes = event.target.getAttribute("href").substr(1);
                            if(elementAttributes == "all-products"){
                                document.getElementById("cart").classList.replace("text-primary", "text-secondary");
                                document.getElementById("account-detail").classList.replace("text-primary", "text-secondary");
                                document.getElementById("all-products").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "cart"){
                                document.getElementById("all-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("account-detail").classList.replace("text-primary", "text-secondary");
                                document.getElementById("cart").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "account-detail"){
                                document.getElementById("cart").classList.replace("text-primary", "text-secondary");
                                document.getElementById("all-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("account-detail").classList.replace("text-secondary", "text-primary");
                            }
                            page = elementAttributes;
                            loadPageContent(page);
                        });
                    });
                });
        }
        catch(error){
            console.log(error);
        }
    }
    
    async function loadPageContent(page, status, id){
        try {
            fetchContent(`pages/${page}-page.html`)
                .then(response => {
                    if(page == "all-products"){
                        document.getElementById("product-recommendation").innerHTML = response;
                        const productRecommendationApi = document.getElementById("product-recommendation-api");
                        productRecommendationApi.innerHTML = `<div class="d-flex justify-content-center"><div class="spinner-border text-primary"></div></div>`;
                        getAllProductIndex(access_token).then(response => {
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.reload();
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "success"){
                                 const {data} = response;
                                 dbGetAllProductsIndex().then(dataDB => {
                                     if(dataDB.length == 0){
                                         dbInsertProductsIndex(data).then(() => {});
                                     }
                                     else if(data.length != dataDB[0].length){
                                         dbDeleteAllProductIndex().then(() => {
                                             dbInsertProductsIndex(data).then(() => {});
                                         });
                                     }
                                 });
                                
                                 const filteredPizzaData = data.filter(element => {return element.categoryid == 1});
                                 const filteredBurgerData = data.filter(element => {return element.categoryid == 2});
                                 const filteredPastaData = data.filter(element => {return element.categoryid == 3});
                                 const filteredSaladData = data.filter(element => {return element.categoryid == 4});

                                 let dataPizzaRaw = "";
                                 filteredPizzaData.forEach(element => {
                                    const {id, name, description, path, price, categoryid} = element;
                                    dataPizzaRaw += `<div class="swiper-slide">
                                                        <a href="product-details.html?id=${id}" class="text-dark text-decoration-none">
                                                            <div class="card card-index-mobile">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-end">
                                                                    <h6>${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                    <a href="./product-details.html?id=${id}" class="btn btn-primary">Lihat Produk</a>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>`;
                                 });
                                 productRecommendationApi.innerHTML = dataPizzaRaw;

                                 let dataBurgerRaw = "";
                                 filteredBurgerData.forEach(element => {
                                    const {id, name, description, path, price, categoryid} = element;
                                    dataBurgerRaw += `<div class="swiper-slide">
                                                        <a href="product-details.html?id=${id}" class="text-dark text-decoration-none">
                                                            <div class="card card-index-mobile">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-end">
                                                                    <h6>${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                    <a href="./product-details.html?id=${id}" class="btn btn-primary">Lihat Produk</a>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>`;
                                 })
                                 document.getElementById("burger-recommendation-api").innerHTML = dataBurgerRaw;
                                 
                                 let dataPastaRaw = "";
                                 filteredPastaData.forEach(element => {
                                    const {id, name, description, path, price, categoryid} = element;
                                    dataPastaRaw += `<div class="swiper-slide">
                                                        <a href="product-details.html?id=${id}" class="text-dark text-decoration-none">
                                                            <div class="card card-index-mobile">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-end">
                                                                    <h6>${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                    <a href="./product-details.html?id=${id}" class="btn btn-primary">Lihat Produk</a>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>`;
                                 })
                                 document.getElementById("pasta-recommendation-api").innerHTML = dataPastaRaw;

                                 let dataSaladRaw = "";
                                 filteredSaladData.forEach(element => {
                                    const {id, name, description, path, price, categoryid} = element;
                                    dataSaladRaw += `<div class="swiper-slide">
                                                        <a href="product-details.html?id=${id}" class="text-dark text-decoration-none">
                                                            <div class="card card-index-mobile">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-end">
                                                                    <h6>${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                    <a href="./product-details.html?id=${id}" class="btn btn-primary">Lihat Produk</a>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>`;
                                 })
                                 document.getElementById("salad-recommendation-api").innerHTML = dataSaladRaw;
                                     
                                const mySwiper = new Swiper('.swiper-container', {
                                        direction: 'horizontal',
                                        loop: false,
                                        spaceBetween: 10,
                                        slidesPerView: 2,
                                        breakpoints: {
                                            320: {
                                                slidesPerView: 2
                                            },
                                            576: {
                                                slidesPerView: 2
                                            },
                                            768: {
                                                slidesPerView: 3
                                            },
                                            992: {
                                                slidesPerView: 3
                                            },
                                            1200: {
                                                slidesPerView: 4
                                            }
                                        },
                                        pagination: {
                                            el: '.swiper-pagination',
                                        }
                                });
                             }
                         });
                        mapboxgl.accessToken = 'pk.eyJ1IjoibXNmYWxpZjQwNCIsImEiOiJja2l2cHB5bTkwZXQ1MnhwMjM4b2g3d3VxIn0.FD3kHp-lu3fs01m4ATAycw';
                        var map = new mapboxgl.Map({
                            container: 'map',
                            style: 'mapbox://styles/mapbox/streets-v11',
                            center: [106.8542, -6.4817],
                            zoom: 13
                        });
                        
                        var geocoder =  new MapboxGeocoder({
                            accessToken: mapboxgl.accessToken,
                            mapboxgl: mapboxgl,
                            placeholder: "Cari Alamat"
                        });
                        map.addControl(geocoder);

                        let latitude = null;
                        let longitude = null;

                        geocoder.on("result", function(event){
                            latitude = event.result.geometry.coordinates[1];
                            longitude = event.result.geometry.coordinates[0];
                        });
                        
                        const jalanInput = document.getElementById("jalan");
                        const locationAlertContainer = document.getElementById("location-alert-container");
                        const productProcessButton = document.getElementById("product-process-button");

                        const checkLocationButton = document.getElementById("check-location");
                        checkLocationButton.addEventListener("click", function(event){
                            event.stopImmediatePropagation();
                            checkLocationButton.innerHTML = "Cek Lokasi...";
                            if((latitude && longitude !== null) && (jalanInput.value !== "")){
                                checkLocation(latitude, longitude).then(response => {
                                    checkLocationButton.innerHTML = "Cek Lokasi";
                                    if(response.msg == "Success"){
                                        productProcessButton.innerHTML = `<button type="submit" class="btn btn-success btn-block mt-3" id="product-process-button">Beli Menu</button>`;
                                    }
                                    else {
                                        productProcessButton.innerHTML = `<button type="submit" class="btn btn-danger btn-block mt-3" id="product-process-button" disabled>Jarak Terlalu Jauh, Menu Tidak Bisa Dibeli</button>`
                                    }
                                });
                            }
                            else {
                                productProcessButton.innerHTML = null;
                                locationAlertContainer.innerHTML  = `<div class="alert alert-danger">Silahkan masukan alamat dan nama jalan !</div>`
                            }
                        });

                        productProcessButton.addEventListener("click", function(event){
                            const data = {
                                id: 1,
                                latitude: latitude,
                                longitude: longitude,
                                address: jalanInput.value
                            };
                            dbInsertCustomerLocation(data).then(() => {
                                location.href = "./index.html#cart";
                                location.reload();
                            });
                        });

                        const changeCurrentLocationButton = document.getElementById("yes-change-current");
                        changeCurrentLocationButton.addEventListener("click", function(event){
                            $('#changeLocationModal').modal('hide')
                            $('#exampleModalCenter').modal('show');
                        });
                        const useCurrentLocationButton = document.getElementById("no-use-current");
                        useCurrentLocationButton.addEventListener("click", function(event){
                            location.href = "./index.html#cart";
                            location.reload();
                        });

                        if(sessionStorage.getItem("message")){
                            document.getElementById("alert-index-container").innerHTML = sessionStorage.getItem("message");
                            document.getElementById("alert-index-container").innerHTML += `<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                            document.getElementById("alert-index-container").classList.add("alert");
                            document.getElementById("alert-index-container").classList.add("alert-danger");
                            document.getElementById("alert-index-container").classList.add("alert-dismissible");
                            document.getElementById("alert-index-container").classList.add("fade");
                            document.getElementById("alert-index-container").classList.add("show");
                            sessionStorage.removeItem("message");
                        }
                    }
                    else if(page == "cart"){
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./customer/login.html";
                        }
                        else if(access_token == ""){
                            location.href = "./customer/login.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        let latitudeList = "";
                        let longitudeList = "";
                        let addressList = "";
                        dbGetAllProductsIndex().then(response => {
                            if(response != null){
                                let dataPizzaFiltered = "";
                                let dataBurgerFiltered = "";
                                let dataPastaFiltered = "";
                                let dataSaladFiltered = "";
                                dataPizzaFiltered = response[0].filter(element => {return element.categoryid == 1});
                                dataBurgerFiltered = response[0].filter(element => {return element.categoryid == 2});
                                dataPastaFiltered = response[0].filter(element => {return element.categoryid == 3});
                                dataSaladFiltered = response[0].filter(element => {return element.categoryid == 4});
                
                                let dataPizzaRaw = "";
                                dataPizzaFiltered.forEach(element => {
                                    const {id, path, name, description, price} = element;
                                    dataPizzaRaw += `<div class="col-6 col-lg-4">
                                                            <div class="card mt-2" style="height: 60vh">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-start">
                                                                    <h6 data-id="${id}">${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                </div>
                                                                <div class="card-footer bg-white d-flex flex-column">
                                                                    <a href="#" class="btn btn-primary btn-block add-to-cart">Add To Cart</a>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                });
                                document.getElementById("pizza-row").innerHTML = dataPizzaRaw;
                
                                let dataBurgerRaw = "";
                                dataBurgerFiltered.forEach(element => {
                                    const {id, path, name, description, price} = element;
                                    dataBurgerRaw += `<div class="col-6 col-lg-4">
                                                            <div class="card mt-2" style="height: 60vh">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-start">
                                                                    <h6 data-id="${id}">${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                </div>
                                                                <div class="card-footer bg-white d-flex flex-column">
                                                                    <a href="#" class="btn btn-primary btn-block add-to-cart">Add To Cart</a>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                });
                                document.getElementById("burger-row").innerHTML = dataBurgerRaw;
                
                                let dataPastaRaw = "";
                                dataPastaFiltered.forEach(element => {
                                    const {id, path, name, description, price} = element;
                                    dataPastaRaw += `<div class="col-6 col-lg-4">
                                                            <div class="card mt-2" style="height: 60vh">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-start">
                                                                    <h6 data-id="${id}">${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                </div>
                                                                <div class="card-footer bg-white d-flex flex-column">
                                                                    <a href="#" class="btn btn-primary btn-block add-to-cart">Add To Cart</a>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                });
                                document.getElementById("pasta-row").innerHTML = dataPastaRaw;
                
                                let dataSaladRaw = "";
                                dataSaladFiltered.forEach(element => {
                                    const {id, path, name, description, price} = element;
                                    dataSaladRaw += `<div class="col-6 col-lg-4">
                                                            <div class="card mt-2" style="height: 60vh">
                                                                <img src="./images/pizza_about_page.jpg" class="card-img-top-resize">
                                                                <div class="card-body d-flex flex-column justify-content-start">
                                                                    <h6 data-id="${id}">${name}</h6>
                                                                    <p class="small text-muted d-none d-lg-block">${description}</p>
                                                                    <p class="text-muted">Rp. ${price.toLocaleString("ID-id")}</p>
                                                                </div>
                                                                <div class="card-footer bg-white d-flex flex-column">
                                                                    <a href="#" class="btn btn-primary btn-block add-to-cart">Add To Cart</a>
                                                                </div>
                                                            </div>
                                                        </div>`;
                                });
                                document.getElementById("salad-row").innerHTML = dataSaladRaw;
                                
                                const addToCartButton = document.querySelectorAll("a.add-to-cart");
                                addToCartButton.forEach(element => {
                                    element.addEventListener("click", function(event){
                                        const data = {
                                            productId: event.target.parentElement.previousElementSibling.childNodes[1].dataset.id,
                                            path: event.target.parentElement.previousElementSibling.previousElementSibling.src,
                                            productName: event.target.parentElement.previousElementSibling.childNodes[1].innerHTML,
                                            productPrice: event.target.parentElement.previousElementSibling.childNodes[5].innerHTML,
                                        };
                                        dbInsertProductToCart(data).then(response => getAllProductsIDB());
                                    });
                                });
                            }
                        });
                        dbGetCustomerLocation().then(data => {
                            if(data){
                                latitudeList = data.latitude;
                                longitudeList = data.longitude;
                                addressList = data.address;
                                document.getElementById("location-container").innerHTML += data.address;
                            }
                        }).catch(error => {
                            if(error){
                                sessionStorage.setItem("message", "Silahkan Masukan Lokasi Anda Terlebih Dahalu !");
                                page = "all-products";
                                document.getElementById("beli-menu").classList.remove("d-none");
                                loadPageContent(page);
                                $('#exampleModalCenter').modal('show')
                            }
                        });
                        function getAllProductsIDB(){
                            const orderCardBodySummary = document.getElementById("order-card-summary");
                            const orderCardFooterSummary = document.getElementById("order-card-footer-summary");
                            dbGetAllProducts().then(data => {
                                if(data.length == 0){
                                    orderCardBodySummary.innerHTML = `<p>Keranjang Anda Kosong, silahkan pilih beberapa menu</p>`;
                                }
                                else {
                                    let orderList = [];
                                    let orderSummary = [];
                
                                    data.forEach(element => {
                                        const {productId, productName, productPrice} = element;
                                        let hargaAsli = productPrice.slice(4).replace(".","");
                                        orderList.push({menuID: productId, jumlah: 1, subtotal: hargaAsli, price: hargaAsli, name: productName});
                                        orderSummary.push({menuID: productId, menu: productName, jumlah: 1, subtotal: hargaAsli});
                                    });
                
                                    let total = 10000;
                                    let orderSummaryRaw = "";
                                    orderSummary.forEach(element => {
                                        const {menuID, menu, jumlah, subtotal} = element;
                                        total += parseInt(subtotal);
                                        orderSummaryRaw += `<div class="d-flex justify-content-center align-items-center">
                                                                <p class="text-muted">Subtotal ${menu}</p>
                                                                <input type="number" class="form-control form-control-sm mr-2 quantity" name="quantity" id="quantity" placeholder="Jumlah" min="1" value="${jumlah}">
                                                                <p class="mr-2">Rp. ${subtotal.toLocaleString("ID-id")}</p>
                                                                <i class='bx bx-x bx-sm hovered delete-product' data-product-id=${menuID}></i>
                                                            </div>`;
                                    });
                                    orderCardBodySummary.innerHTML = orderSummaryRaw;
                                    orderCardFooterSummary.innerHTML = `<textarea class="form-control mb-2" name="product-note" id="product-note" cols="30" rows="10" placeholder="Masukan catatan kepada penjual..."></textarea>`;
                                    orderCardFooterSummary.innerHTML += `<div class="d-flex">
                                                                            <p class="font-weight-bold">Fee</p>
                                                                            <p class="ml-auto" id="fee">Rp. 10.000</p>
                                                                        </div>`;
                                    orderCardFooterSummary.innerHTML += `<div class="d-flex">
                                                                            <p class="font-weight-bold">Total Harga</p>
                                                                            <p class="ml-auto" id="product-final-price">Rp. ${total.toLocaleString("ID-id")}</p>
                                                                        </div>
                                                                        <button class="btn btn-primary btn-block" id="product-process-buy">Beli</button>`;
                
                                    const quantity = document.querySelectorAll(".quantity");
                                    quantity.forEach(element => {
                                        let subtotal = parseInt(element.nextElementSibling.innerHTML.slice(4).replace(".",""));
                                        element.addEventListener("change", function(event){
                                            orderSummary.forEach(element => {
                                                if(element.menu == event.target.previousElementSibling.innerHTML.slice(9)){
                                                    element.jumlah = parseInt(event.target.value);
                                                    element.subtotal = subtotal * element.jumlah;
                                                }
                                            });
                                            orderList.forEach(element => {
                                                if(element.name == event.target.previousElementSibling.innerHTML.slice(9)){
                                                    element.jumlah = parseInt(event.target.value);
                                                    element.subtotal = subtotal * element.jumlah;
                                                }
                                            });
                                            let total = 10000;
                                            let orderSummaryRaw = "";
                                            orderSummary.forEach(element => {
                                                total += parseInt(element.subtotal);
                                            });
                                            document.getElementById("product-final-price").innerHTML = `Rp. ${total.toLocaleString("ID-id")}`;
                                        });
                                    });
                
                                    const productProcessBuyButton = document.getElementById("product-process-buy");
                                    productProcessBuyButton.addEventListener("click", function(event){
                                        $('#confirmModal').modal('show')
                                        const confirmProcessButtonModal = document.getElementById("confirmProcessButtonModal");
                                        confirmProcessButtonModal.addEventListener("click", function(event){
                                            event.preventDefault();
                                            confirmProcessButtonModal.innerHTML = "Diproses...";
                                            const productNote = document.getElementById("product-note").value ?? null;
                                            const productFee = document.getElementById("fee").innerHTML.slice(4).replace(".","");
                                            const productFinalPirce = document.getElementById("product-final-price").innerHTML.slice(4).replace(".","");
                    
                                            productOrderAPI(latitudeList, longitudeList, addressList, productNote, productFee, productFinalPirce, orderList, access_token)
                                            .then(response => {
                                                $('#confirmModal').modal('hide')
                                                if(response.msg == "Token has been revoked"){
                                                    localStorage.removeItem("CUSTOMER_TOKEN");
                                                    access_token = "";
                                                    name = "";
                                                    id = "";
                                                    sessionStorage.setItem("message", "Harap login terlebih dahulu");
                                                    location.href = "./customer/login.html";
                                                }
                                                else if(response.msg =="token expired"){
                                                        refreshTokenAPI(access_token)
                                                            .then(response => {
                                                                if(response.msg == "token expired"){
                                                                    localStorage.removeItem("CUSTOMER_TOKEN");
                                                                    access_token = "";
                                                                    name = "";
                                                                    id = "";
                                                                    sessionStorage.setItem("message", "Waktu anda telah habis, harap masuk kembali");
                                                                    location.href = "./customer/login.html";
                                                                }
                                                                else {
                                                                    localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                                                    location.reload();
                                                                }
                                                            });
                                                }
                                                else if(response.msg == "Jarak Terlalu Jauh"){
                                                    sessionStorage.setItem("message", "Silahkan Masukan Lokasi Anda Terlebih Dahalu Melalui Tombol Beli Menu di Bagian Atas !");
                                                    location.href = "./index.html";
                                                }
                                                else if(response.msg == "Success"){
                                                    dbDeleteAllProduct().then(() => {
                                                        sessionStorage.setItem("message", "Produk berhasil dibeli, silahkan tunggu hingga produk dikirimkan dan konfirmasikan kode pesanan kepada kurir (kode pesanan bisa didapat apabila produk sedang dikirim dan bisa diketahui lewat menu Dikirim yang terletak di bawah ini)");
                                                        page = "account-detail";
                                                        loadNavBarContent();
                                                        loadPageContent(page);
                                                    });
                                                }
                                            });
                                        });
                                    });
                
                
                                    const deleteProductButton = document.querySelectorAll(".delete-product");
                                    deleteProductButton.forEach(element => {
                                        element.addEventListener("click", function(event){
                                           dbDeleteProductById(event.target.dataset.productId).then(() => {
                                            getAllProductsIDB();
                                            let total = 10000;
                                            orderCardFooterSummary.innerHTML = `<textarea class="form-control mb-2" name="product-note" id="product-note" cols="30" rows="10" placeholder="Masukan catatan kepada penjual..."></textarea>`;
                                            orderCardFooterSummary.innerHTML += ` <div class="d-flex">
                                                                    <p class="text-muted">Fee</p>
                                                                    <p class="ml-auto" id="product-fee">Rp. 10.000</p>
                                                                </div>`;
                                                               orderCardFooterSummary.innerHTML += `<div class="d-flex">
                                                    <p class="font-weight-bold">Total Harga</p>
                                                    <p class="ml-auto" id="product-final-price">Rp. ${total.toLocaleString("ID-id")}</p>
                                                </div>
                                                <button class="btn btn-primary btn-block" id="product-process-buy">Beli</button>`;
                                           });
                                        });
                                    });
                                }
                            });
                        }
                        getAllProductsIDB();

                        const changeAddressCardButton = document.getElementById("change-address-card");
                        changeAddressCardButton.addEventListener("click", function(event){
                            page = "all-products";
                            loadNavBarContent();
                            loadPageContent(page);
                            $('#changeLocationModal').modal('show');
                        });
                    }
                    else if(page == "account-detail"){
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./customer/login.html";
                        }
                        else if(access_token == ""){
                            location.href = "./customer/login.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        const customerNameContainer = document.getElementById("customer-name");
                        customerNameContainer.innerHTML += name;

                        const alertContainer = document.getElementById("alert-container");
                        if(sessionStorage.getItem("message")){
                            alertContainer.innerHTML = sessionStorage.getItem("message");
                            alertContainer.classList.add("alert","alert-success","alert-dismissible","fade","show");
                            sessionStorage.removeItem("message");
                        }
                        if(access_token == null || "" || undefined){
                            location.href = "./index.html";
                        }
                        getProductOrderAPI(access_token).then(response => {
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.href = "./index.html";
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "Success"){
                                const {data} = response;
                                const transactionContainer = document.getElementById("transaction-container");
                                const pendingData = data.filter(element => {return element.status == "pending"});
                                const onProcessData = data.filter(element => {return element.status == "diproses"});
                                const onDeliveryData = data.filter(element => {return element.status == "dikirim"});
                                const acceptedData = data.filter(element => {return element.status == "diterima"});
                                const canceledData = data.filter(element => {return element.status == "dibatalkan"});
                                
                                transactionContainer.innerHTML = `<div class="col-6 col-lg-2" data-status="pending">
                                            <a href="#order-details" class="text-dark hovered order-details-link" id="pending-link" data-status="pending">
                                                <i class='bx bxs-box bx-md' data-status="pending"></i>
                                                <span class="badge badge-primary cart-counter" id="pending-counter" data-status="pending">0</span>
                                                <p data-status="pending">Pending</p>
                                            </a>
                                        </div>
                                        <div class="col-6 col-lg-2" data-status="diproses">
                                            <a href="#order-details" class="text-dark hovered order-details-link" id="processed-link" data-status="diproses">
                                                <i class='bx bxs-truck bx-md' data-status="diproses"></i>
                                                <span class="badge badge-primary cart-counter" id="processed-counter" data-status="diproses">0</span>
                                                <p data-status="diproses">Diproses</p>
                                            </a>
                                        </div>
                                        <div class="col-6 col-lg-2" data-status="dikirim">
                                            <a href="#order-details" class="text-dark hovered order-details-link" id="ondelivery-link" data-status="dikirim">
                                                <i class='bx bxs-car-garage bx-md' data-status="dikirim"></i>
                                                <span class="badge badge-primary cart-counter" id="ondelivery-counter" data-status="dikirim">0</span>
                                                <p data-status="dikirim">Dikirim</p>
                                            </a>
                                        </div>
                                        <div class="col-6 col-lg-2" data-status="diterima">
                                            <a href="#order-details" class="text-dark hovered order-details-link" id="accepted-link" data-status="diterima">
                                                <i class='bx bxs-check-circle bx-md' data-status="diterima"></i>
                                                <span class="badge badge-primary cart-counter" id="accepted-counter" data-status="diterima">0</span>
                                                <p data-status="diterima">Diterima</p>
                                            </a>
                                        </div>
                                        <div class="col-12 col-lg-2" data-status="dibatalkan">
                                            <a href="#order-details" class="text-dark hovered order-details-link id="canceled-link" data-status="dibatalkan">
                                                <i class='bx bxs-x-circle bx-md' data-status="dibatalkan"></i>
                                                <span class="badge badge-primary cart-counter" id="canceled-counter" data-status="dibatalkan">0</span>
                                                <p data-status="dibatalkan">Dibatalkan</p>   
                                            </a>
                                        </div>`;
            
                                document.getElementById("pending-counter").innerHTML = pendingData.length;
                                document.getElementById("processed-counter").innerHTML = onProcessData.length;
                                document.getElementById("ondelivery-counter").innerHTML = onDeliveryData.length;
                                document.getElementById("accepted-counter").innerHTML = acceptedData.length;
                                document.getElementById("canceled-counter").innerHTML = canceledData.length;

                                const orderDetailsLinks = document.querySelectorAll(".order-details-link");
                                orderDetailsLinks.forEach(element => {
                                    element.addEventListener("click", function(event){
                                        event.preventDefault();
                                        page = "order-details";
                                        loadPageContent(page, event.target.dataset.status);
                                    });
                                });
                            }
                        });

                        const editProfileButton = document.getElementById("edit-profile");
                        editProfileButton.addEventListener("click", function(){
                            page = "edit-profile";
                            loadPageContent(page);
                        });

                        const logoutButton = document.getElementById("logout-button");
                        logoutButton.addEventListener("click", function(event){
                            event.preventDefault();
                            logoutATAPI(access_token).then(response => {
                                logoutButton.innerHTML = "Logout...";
                                if(response.msg == "Successfully logged out"){
                                    localStorage.removeItem("CUSTOMER_TOKEN");
                                    access_token = "";
                                    name = "";
                                    id = "";
                                    location.href = "./index.html";
                                }
                            });
                        });
                    }
                    else if(page == "order-details"){
                        if(status == undefined){
                            page = "account-detail";
                            loadPageContent(page);
                        }
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./index.html";
                        }
                        else if(access_token == ""){
                            location.href = "./index.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        const customerNameContainer = document.getElementById("customer-name");
                        customerNameContainer.innerHTML += name;

                        if(access_token == "" || null || undefined){
                            location.href = "./index.html";
                        }
                        getProductOrderAPI(access_token).then(response => { 
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.href = "./index.html";
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "Success"){
                                const {data} = response;
                                const statusData = data.filter(element => {return element.status == status});
                                let dataStatusRaw = "";
                                if(statusData.length == 0){
                                    dataStatusRaw += `<p>Tidak ada produk dengan status ${status}</p>`;
                                    const orderContainer = document.getElementById("order-container");
                                    orderContainer.innerHTML = dataStatusRaw;
                                }
                                else {
                                    statusData.forEach(element => {
                                        const {codeOrder, dateOrder, status, finalPrice, kurir: {name}, confirmation, details} = element;
                                        let date = new Date(dateOrder);
                                        let UTCTime = date.toLocaleTimeString("id-ID");
                                        let UTCDate = date.toLocaleDateString('id-ID', {timeZone: "UTC"});
                                        let fullUTC = `${UTCDate} - ${UTCTime.replaceAll(".",":")}`;
                                        dataStatusRaw += `<div class="col-lg-8">
                                        <div class="card-body bg-white">
                                            <div class="card">
                                                <div class="card-header">Data Pesanan</div>
                                                <div class="card-body d-flex flex-column">
                                                    <div class="d-flex mb-3">
                                                        <div class="d-flex flex-column mb-3">
                                                        <p class="text-secondary ml-2">Kode Pemesanan: <span class="text-dark">${codeOrder}</span></p>
                                                        <p class="text-secondary ml-2">Kode Konfirmasi: <span class="text-dark">${confirmation == null ? "Belum didapatkan" : confirmation}</span></p>
                                                        <p class="text-secondary ml-2">Tanggal Pemesanan: <span class="text-dark">${fullUTC}</span></p>
                                                        <p class="text-secondary ml-2">Status Pemesanan: <span class="text-dark">${status}</span></p>
                                                        <p class="text-secondary ml-2">Total Harga: Rp. <span class="text-dark">${finalPrice.toLocaleString("ID-id")}</span></p>
                                                        </div>
                                                    </div>
                                                    <a href="#order-details-code-order" class="btn btn-primary btn-block order-details-code-order-button" data-code=${codeOrder}>Detail Pemesanan</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                                    });
                                    const orderContainer = document.getElementById("order-container");
                                    orderContainer.innerHTML = dataStatusRaw;

                                    const orderDetailsCodeOrderButton = document.querySelectorAll(".order-details-code-order-button");
                                    orderDetailsCodeOrderButton.forEach(element => {
                                        element.addEventListener("click", function(event){
                                            page = "order-details-code-order";
                                            loadPageContent(page, event.target.getAttribute("data-code"));
                                        });
                                    });
                                }

                                const orderDetailsBack = document.getElementById("order-details-back");
                                orderDetailsBack.addEventListener("click", function(event){
                                    event.preventDefault();
                                    page = "account-detail";
                                    loadPageContent(page);
                                });
                            }
                        });
                    }
                    else if(page == "order-details-code-order"){
                        if(status == undefined){
                            page = "account-detail";
                            loadPageContent(page);
                        }
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./index.html";
                        }
                        else if(access_token == ""){
                            location.href = "./index.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        const customerNameContainer = document.getElementById("customer-name");
                        customerNameContainer.innerHTML += name;

                        if(access_token == "" || null || undefined){
                            location.href = "./index.html";
                        }

                        getProductOrderAPI(access_token).then(response => {
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.href = "./index.html";
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "Success"){
                                const {data} = response;
                                const dataFilteredCodeOrder = data.filter(element => {return element.codeOrder == status});
                                let dataTableRaw = "";
                                let dataStatusRaw = "";
                                    dataFilteredCodeOrder.forEach(element => {
                                        const {address, codeOrder, dateOrder, status, fee, finalPrice, kasir: {name: cashierName}, kurir: {name: courrierName}, confirmation, details, distance} = element;
                                        let date = new Date(dateOrder);
                                        let UTCTime = date.toLocaleTimeString("id-ID");
                                        let UTCDate = date.toLocaleDateString('id-ID', {timeZone: "UTC"});
                                        let fullUTC = `${UTCDate} - ${UTCTime.replaceAll(".",":")}`;
                                        if(status == "pending"){
                                            document.getElementById("cancel-reason-container").classList.remove("d-none");
                                            const cancelReasonButton = document.getElementById("cancel-reason");
                                            cancelReasonButton.addEventListener("click", function(event){
                                                event.preventDefault();
                                                $('#cancelModal').modal('show');
                                                const reasonAlertContainer = document.getElementById("reason-alert-container");
                                                const cancelReasonInput = document.getElementById("cancel-reason-input");
                                                const cancelButtonOrderApi = document.getElementById("cancel-order-button-api");
                                                cancelButtonOrderApi.addEventListener("click", function(event){
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    cancelButtonOrderApi.innerHTML = "Diproses...";
                                                    if(cancelReasonInput.value == ""){
                                                        cancelButtonOrderApi.innerHTML = "Batalkan Pesanan";
                                                        reasonAlertContainer.innerHTML = "Silahkan Masukan Alasan Pembatalan Pesanan";
                                                        reasonAlertContainer.classList.add("alert","alert-danger","alert-dismissible","fade","show");
                                                    }
                                                    else {
                                                        cancelButtonOrderApi.innerHTML = "Diproses...";
                                                        cancelOrderAPI(codeOrder, cancelReasonInput.value, access_token).then(response => {
                                                            if(response.msg == "success"){
                                                                $('#cancelModal').modal('hide');
                                                                sessionStorage.setItem("message", `Pesanan dengan kode ${codeOrder} berhasil dibatalkan`);
                                                                page = "account-detail";
                                                                loadPageContent(page);
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                        dataStatusRaw += `
                                        <div class="d-flex flex-column mt-2">
                                            <p class="text-secondary ml-2">Kode Pemesanan: <span class="text-dark">${codeOrder}</span></p>
                                            <p class="text-secondary ml-2">Kode Konfirmasi: <span class="text-dark">${confirmation == null ? "Belum didapatkan" : confirmation}</span></p>
                                            <p class="text-secondary ml-2">Tanggal Pemesanan: <span class="text-dark">${fullUTC}</span></p>
                                            <p class="text-secondary ml-2">Status Pemesanan: <span class="text-dark">${status}</span></p>
                                            <p class="text-secondary ml-2">Alamat Pemsanan: <span class="text-dark">${address}</span></p>
                                            <p class="text-secondary ml-2">Jarak Pemesanan: <span class="text-dark">${distance} km.</span></p>
                                            <p class="text-secondary ml-2">Nama Kasir: <span class="text-dark">${cashierName == null ? "Belum didapatkan" : cashierName}</span></p>
                                            <p class="text-secondary ml-2">Nama Kurir: <span class="text-dark">${courrierName == null ? "Belum didapatkan" : courrierName}</span></p>
                                            <p class="text-secondary ml-2">Pajak: Rp. <span class="text-dark">${fee}</span></p>
                                            <p class="text-secondary ml-2">Total Harga: Rp. <span class="text-dark">${finalPrice.toLocaleString("ID-id")}</span></p>
                                        </div>`;
                                            details.forEach(element => {
                                                const {ID, Amount, Name, SubTotal} = element;
                                                dataTableRaw += `<tr>
                                                                    <td>${Name}</td>
                                                                    <td>${Amount}</td>
                                                                    <td>${SubTotal}</td>
                                                                    <td><a href="#" class="btn btn-primary order-details-data-button" data-details=${ID} data-coder=${codeOrder}>Review Pesanan</a></td>
                                                                </tr>`;
                                            });
                                    });
                                    const orderDetailsCodeOrderContainer = document.getElementById("order-details-code-order-container");
                                    orderDetailsCodeOrderContainer.innerHTML = dataStatusRaw;

                                    const productContainer = document.getElementById("product-container");
                                    productContainer.innerHTML = dataTableRaw;

                                    const orderDetailsDataButton = document.querySelectorAll(".order-details-data-button");
                                    orderDetailsDataButton.forEach(element => {
                                        element.addEventListener("click", function(event){
                                            page = "order-details-data-order";
                                            loadPageContent(page, event.target.getAttribute("data-coder"), event.target.getAttribute("data-details"));
                                        });
                                    });

                                    const orderDetailsBack = document.getElementById("order-details-back");
                                    orderDetailsBack.addEventListener("click", function(event){
                                        event.preventDefault();
                                        page = "account-detail";
                                        loadPageContent(page);
                                    })
                            }
                        });
                    }
                    else if(page == "order-details-data-order"){
                        if(status == undefined){
                            page = "account-detail";
                            loadPageContent(page);
                        }
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./index.html";
                        }
                        else if(access_token == ""){
                            location.href = "./index.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        const customerNameContainer = document.getElementById("customer-name");
                        customerNameContainer.innerHTML += name;

                        if(access_token == "" || null || undefined){
                            location.href = "./index.html";
                        }

                        getProductOrderAPI(access_token).then(response => {
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.href = "./index.html";
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "Success"){
                                const {data} = response;
                                const dataFilteredCodeOrder = data.filter(element => {return element.codeOrder == status});
                                let menuData = "";
                                let customerId = "";
                                let dateOrderData = "";
                                let statusOrderData = "";
                                let finalPriceData = "";
                                let dataDetailsArray = [];
                                dataFilteredCodeOrder.forEach(element => {
                                        const {codeOrder, CustomerID, dateOrder, status, finalPrice, details} = element;
                                        let date = new Date(dateOrder);
                                        let UTCTime = date.toLocaleTimeString("id-ID");
                                        let UTCDate = date.toLocaleDateString('id-ID', {timeZone: "UTC"});
                                        let fullUTC = `${UTCDate} - ${UTCTime.replaceAll(".",":")}`;
                                            customerId = CustomerID;
                                            dateOrderData = fullUTC;
                                            statusOrderData = status;
                                            finalPriceData = finalPrice;
                                            dataDetailsArray = details.filter(element => {return element.ID == id});
                                });
                                let dataStatusRaw = "";
                                if(statusOrderData == "diterima"){
                                    dataDetailsArray.forEach(element => {
                                            const {Amount, CodeOrder, ID, Name, Path, SubTotal} = element;
                                            menuData = ID;
                                            dataStatusRaw += `<div class="col-lg-8">
                                            <div class="card-body bg-white">
                                                <div class="card">
                                                    <div class="card-header">Data Pesanan</div>
                                                    <div class="card-body d-flex flex-column">
                                                        <div class="mb-3"><h5>${Name}</h5></div>
                                                        <div class="d-flex mb-3">
                                                            <img src="./images/pizza_about_page.jpg" style="width:200px;" />
                                                            <div class="d-flex flex-column mb-3">
                                                            <p class="text-secondary ml-2">Kode Pemesanan: <span class="text-dark">${CodeOrder}</span></p>
                                                            <p class="text-secondary ml-2">Tanggal Pemesanan: <span class="text-dark">${dateOrderData}</span></p>
                                                            <p class="text-secondary ml-2">Status Pemesanan: <span class="text-dark">${statusOrderData}</span></p>
                                                            <p class="text-secondary ml-2">Jumlah Pemesanan: <span class="text-dark">${Amount}</span></p>
                                                            <p class="text-secondary ml-2">Subtotal: Rp. <span class="text-dark">${SubTotal.toLocaleString("ID-id")}</span></p>
                                                            <p class="text-secondary ml-2">Total Harga: Rp. <span class="text-dark">${finalPriceData.toLocaleString("ID-id")}</span></p>
                                                            </div>
                                                        </div>
                                                        <ul class="rating">
                                                        <li class="rating-item" data-rate="1"></li>
                                                        <li class="rating-item active" data-rate="2"></li>
                                                        <li class="rating-item" data-rate="3"></li>
                                                        <li class="rating-item" data-rate="4"></li>
                                                        <li class="rating-item" data-rate="5"></li>
                                                        </ul>
                                                        <div class="form-group"><textarea class="form-control mb-2" id="review" rows="3" placeholder="Masukan anda terhadap menu ini..."></textarea></div>
                                                        <div class="form-group"><a href="#" id="review-button" class="btn btn-primary">Review</a></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                    });
                                }
                                else {
                                    dataDetailsArray.forEach(element => {
                                        const {Amount, CodeOrder, ID, Name, Path, SubTotal} = element;
                                        dataStatusRaw += `<div class="col-lg-8">
                                        <div class="card-body bg-white">
                                            <div class="card">
                                                <div class="card-header">Data Pesanan</div>
                                                <div class="card-body d-flex flex-column">
                                                    <div class="mb-3"><h5>${Name}</h5></div>
                                                    <div class="d-flex mb-3">
                                                        <img src="./images/pizza_about_page.jpg" style="width:200px;" />
                                                        <div class="d-flex flex-column mb-3">
                                                        <p class="text-secondary ml-2">Kode Pemesanan: <span class="text-dark">${CodeOrder}</span></p>
                                                        <p class="text-secondary ml-2">Tanggal Pemesanan: <span class="text-dark">${dateOrderData}</span></p>
                                                        <p class="text-secondary ml-2">Status Pemesanan: <span class="text-dark">${statusOrderData}</span></p>
                                                        <p class="text-secondary ml-2">Jumlah Pemesanan: <span class="text-dark">${Amount}</span></p>
                                                        <p class="text-secondary ml-2">Subtotal: Rp. <span class="text-dark">${SubTotal.toLocaleString("ID-id")}</span></p>
                                                        <p class="text-secondary ml-2">Total Harga: Rp. <span class="text-dark">${finalPriceData.toLocaleString("ID-id")}</span></p>
                                                        </div>
                                                    </div>
                                                    <p>Produk belum bisa direview...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                });
                                }

                                const orderDetailsDataOrderContainer = document.getElementById("order-details-data-order-container");
                                orderDetailsDataOrderContainer.innerHTML = dataStatusRaw;
                                if(statusOrderData == "diterima"){
                                    const starsContainer = document.querySelector('.rating');
                                    const starsItems = starsContainer.querySelectorAll('.rating-item');
                                    let starsCount = 2;
                                    starsContainer.addEventListener("click", function(event){
                                        if (!event.target.classList.contains('active')) {
                                            starsItems.forEach(element => element.classList.remove('active'));
                                            starsCount = event.target.getAttribute("data-rate");
                                            event.target.classList.add('active');
                                        }
                                    });

                                    const alertContainer = document.getElementById("alert-index-container");
                                    const reviewInput = document.getElementById("review");
                                    const reviewButton = document.getElementById("review-button");
                                    reviewButton.addEventListener("click", function(event){
                                        event.preventDefault();
                                        productReviewAPI(status, menuData, customerId, starsCount, reviewInput.value, access_token).then(response => {
                                            if(response.msg == "Sudah pernah mereview dengan code order yang sama"){
                                                alertContainer.innerHTML = "Anda sudah pernah mereview produk ini";
                                                alertContainer.classList.add("alert","alert-danger","alert-dismissible","fade","show");
                                            }
                                            else if(response.msg == "success"){
                                                alertContainer.innerHTML = "Produk berhasil direview";
                                                alertContainer.classList.add("alert","alert-success","alert-dismissible","fade","show");
                                            }
                                        });
                                    });
                                }
                            }

                            const orderDetailsBack = document.getElementById("order-details-back");
                                    orderDetailsBack.addEventListener("click", function(event){
                                        event.preventDefault();
                                        page = "account-detail";
                                        loadPageContent(page);
                                    })
                        });
                    }
                    else if(page == "edit-profile"){
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./index.html";
                        }
                        else if(access_token == ""){
                            location.href = "./index.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        if(access_token == null || "" || undefined){
                            location.href = "./index.html";
                        }
                        getProfileCustomerAPI(access_token).then(response => {
                            if(response.msg == "Token has been revoked"){
                                localStorage.removeItem("CUSTOMER_TOKEN");
                                access_token = "";
                                name = "";
                                id = "";
                                location.href = "./index.html";
                            }
                            else if(response.msg == "token expired"){
                                refreshTokenAPI(access_token)
                                    .then(response => {
                                        if(response.msg == "token expired"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            location.reload();
                                        }
                                        else {
                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                            location.reload();
                                        }
                                    });
                            }
                            else if(response.msg == "success"){
                                document.getElementById("edit-container").innerHTML = `<div class="col-12">
                                <nav>
                                    <ol class="breadcrumb bg-white">
                                        <li class="breadcrumb-item"><a href="./index.html">Home</a></li>
                                        <li class="breadcrumb-item active">Edit Profile</li>
                                    </ol>
                                </nav>
                            </div>
                            <div class="col-lg-12 mb-4 mb-lg-4 d-flex">
                               <h3 id="customer-name">Halo, selamat datang </h3> 
                               <div class="ml-auto">
                                   <a href="#edit-password" class="btn btn-secondary" id="edit-password-button">Edit Password</a>
                               </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="" id="alert-container" data-dismiss="alert"></div>
                            </div>
                            <div class="col-lg-12 mb-4 mb-lg-0 py-4">
                                <form id="edit-profile">
                                    <div class="form-group">
                                        <label for="nama">Nama</label>
                                        <input type="text" name="nama" id="nama" class="form-control" placeholder="Nama Lengkap" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Nomor Handphone</label>
                                        <input type="text" name="phone" id="phone" class="form-control" placeholder="Nomor Handphone" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" name="email" id="email" class="form-control" placeholder="Email" readonly="readonly">
                                    </div>
                                    <div class="form-group">
                                        <label>Jenis Kelamin</label>
                                        <div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input class="custom-control-input" type="radio" name="gender" id="male" value="L" required>
                                                <label class="custom-control-label" for="male">Laki-laki</label>
                                              </div>
                                              <div class="custom-control custom-radio custom-control-inline">
                                                <input class="custom-control-input" type="radio" name="gender" id="female" value="P">
                                                <label class="custom-control-label" for="female">Perempuan</label>
                                              </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Tanggal Lahir</label>
                                        <div class="form-row">
                                            <div class="form-group col-4">
                                                <input type="text" name="days" id="days" class="form-control" placeholder="dd" required minlength="1" maxlength="2">
                                            </div>
                                            <div class="form-group col-4">
                                                <select name="months" id="months" class="form-control" required>
                                                    <option selected disabled hidden>mm</option>
                                                    <option value="01">Januari</option>
                                                    <option value="02">Februari</option>
                                                    <option value="03">Maret</option>
                                                    <option value="04">April</option>
                                                    <option value="05">Mei</option>
                                                    <option value="06">Juni</option>
                                                    <option value="07">Juli</option>
                                                    <option value="08">Agustus</option>
                                                    <option value="09">September</option>
                                                    <option value="10">Oktober</option>
                                                    <option value="11">November</option>
                                                    <option value="12">Desember</option>
                                                </select>
                                            </div>
                                            <div class="form-group col-4">
                                                <input type="text" name="years" id="years" class="form-control" placeholder="yyyy" required minlength="4" maxlength="4">
                                            </div>
                                        </div>
                                    </div>
                                    <input type="submit" value="Update Profile" class="btn btn-primary btn-block" id="update-profile">
                                </form>
                                </div>`;

                                const customerNameContainer = document.getElementById("customer-name");
                                const alertContainer = document.getElementById("alert-container");
                                if(sessionStorage.getItem("message")){
                                    alertContainer.innerHTML = sessionStorage.getItem("message");
                                    alertContainer.classList.add("alert","alert-success","alert-dismissible","fade","show");
                                    sessionStorage.removeItem("message");
                                }
                                const nameInput = document.getElementById("nama");
                                const phoneInput = document.getElementById("phone");
                                const emailInput = document.getElementById("email");
                                const daysInput = document.getElementById("days");
                                const monthsInput = document.getElementById("months");
                                const yearsInput = document.getElementById("years");

                                const {name, phone, email, gender, birthday} = response.data[0];
                                const convertedDate = new Date(birthday);
                                customerNameContainer.innerHTML = `Halo, selamat data ${name}`;
                                nameInput.value = name;
                                phoneInput.value = phone;
                                emailInput.value = email;
                                daysInput.value = convertedDate.getDate();
                                monthsInput.value = convertedDate.getMonth() + 1;
                                yearsInput.value = convertedDate.getFullYear();
                                gender == "L" ?  document.getElementById("male").setAttribute("checked","checked") : document.getElementById("female").setAttribute("checked","checked");
                                const editProfileForm = document.getElementById("edit-profile");
                                editProfileForm.addEventListener("submit", function(event){
                                    event.preventDefault();
                                    editProfileForm[8].value = "Diproses...";
                                    const genderInput = document.getElementById("male").checked ? document.getElementById("male").value : document.getElementById("female").checked ? document.getElementById("female").value : null;
                                    const birthdayInput = `${yearsInput.value}-${monthsInput.value}-${daysInput.value}`;
                                    changeProfileCustomerAPI(CUSTOMER_TOKEN.data.customer.id, nameInput.value, genderInput, birthdayInput, access_token).then(response => {
                                        if(response.msg == "Token has been revoked"){
                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                            access_token = "";
                                            name = "";
                                            id = "";
                                            sessionStorage.setItem("message", "Harap login terlebih dahulu");
                                            location.href = "./customer/login.html";
                                        }
                                        else if(response.msg =="token expired"){
                                                refreshTokenAPI(access_token)
                                                    .then(response => {
                                                        if(response.msg == "token expired"){
                                                            localStorage.removeItem("CUSTOMER_TOKEN");
                                                            access_token = "";
                                                            name = "";
                                                            id = "";
                                                            sessionStorage.setItem("message", "Waktu anda telah habis, harap masuk kembali");
                                                            location.href = "./customer/login.html";
                                                        }
                                                        else {
                                                            localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                                            location.reload();
                                                        }
                                                    });
                                        }
                                        else if(response.msg == "success"){
                                            page = "edit-profile";
                                            sessionStorage.setItem("message", "Update profile berhasil !");
                                            loadPageContent(page);
                                        }
                                    });
                                });
                                const editPasswordButton = document.getElementById("edit-password-button");
                                editPasswordButton.addEventListener("click", function(event){
                                    event.preventDefault();
                                    page = event.target.getAttribute("href").substr(1);
                                    loadPageContent(page);
                                });
                            }
                        });
                    }
                    else if(page == "edit-password"){
                        if(CUSTOMER_TOKEN == null){
                            location.href = "./index.html";
                        }
                        else if(access_token == ""){
                            location.href = "./index.html";
                        }
                        document.getElementById("product-recommendation").innerHTML = response;
                        const customerNameContainer = document.getElementById("customer-name");
                        customerNameContainer.innerHTML += name;

                        const alertContainer = document.getElementById("alert-container");
                        const oldPassword = document.getElementById("old-password");
                        const newPassword = document.getElementById("new-password");
                        const confirmPassword = document.getElementById("confirm-password");

                        const editPasswordForm = document.getElementById("edit-password");
                        editPasswordForm.addEventListener("submit", function(event){
                            event.preventDefault();
                            editPasswordForm[3].value = "Diproses...";
                            if(newPassword.value != confirmPassword.value){
                                editPasswordForm[3].value = "Update Password";
                                alertContainer.innerHTML = "Konfirmasi Password Salah";
                                alertContainer.classList.add("alert","alert-danger","alert-dismissible","fade","show");
                            }
                            else {
                                changePasswordCustomerAPI(id, oldPassword.value, newPassword.value, confirmPassword.value, access_token).then(response => {
                                    if(response.msg == "Token has been revoked"){
                                        localStorage.removeItem("CUSTOMER_TOKEN");
                                        access_token = "";
                                        name = "";
                                        id = "";
                                        location.reload();
                                    }
                                    else if(response.msg == "token expired"){
                                        refreshTokenAPI(access_token)
                                            .then(response => {
                                                if(response.msg == "token expired"){
                                                    localStorage.removeItem("CUSTOMER_TOKEN");
                                                    access_token = "";
                                                    name = "";
                                                    id = "";
                                                    location.reload();
                                                }
                                                else {
                                                    localStorage.setItem("CUSTOMER_TOKEN", JSON.stringify(response));
                                                    location.reload();
                                                }
                                            });
                                    }
                                    else if(response.msg == "Customer not found"){
                                        editPasswordForm[3].value = "Update Password";
                                        alertContainer.innerHTML = "Password Lama Salah";
                                        alertContainer.classList.add("alert","alert-danger","alert-dismissible","fade","show");
                                    }
                                    else if(response.msg == "success"){
                                        editPasswordForm[3].value = "Update Password";
                                        alertContainer.innerHTML = "Password Berhasil Dirubah";
                                        alertContainer.classList.add("alert","alert-success","alert-dismissible","fade","show");
                                    }
                                });
                            }
                        });

                        const backButton = document.getElementById("back-password");
                        backButton.addEventListener("click", function(event){
                            event.preventDefault();
                            page = "edit-profile";
                            loadPageContent(page);
                        });
                    }
                });
        }
        catch(error){
            console.log(error);
        }
    }

    loadNavBarContent();
    let page = window.location.hash.substr(1);
    page === "" ? page = "all-products" : page = page;
    loadPageContent(page);
    loadFooterContent();
    loadBottomNavbarContent();
// }