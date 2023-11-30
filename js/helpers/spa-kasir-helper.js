import {getAllProductEmployee} from "../services/api/employee/crud-employee.js";
import {logoutATAPI} from "../services/api/logout-token.js";
import {showAllPendingProducts, showAllProcessedProducts, showAllOndeliveryProducts, showAllAcceptedProducts, showAllCanceledProducts} from "./crud-kasir-helper.js";
import {refreshTokenAPI} from "../services/api/refresh-token.js";
import {isTokenExpired} from "./token-expired-helper.js";
import {isTokenNull} from "./token-null-helper.js";

const EMPLOYEE_TOKEN = JSON.parse(localStorage.getItem("EMPLOYEE_TOKEN")) ?? null;
isTokenNull(EMPLOYEE_TOKEN, '../index.html');
if(EMPLOYEE_TOKEN != null){
    const {access_token} = EMPLOYEE_TOKEN;

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

    async function loadSidebarContent(){
        try {
            fetchContent("sidebar.html")
                .then(response => {
                    document.getElementById("sidebar-container").innerHTML = response;
                    if(page == "pending-products"){
                        document.getElementById("pending-products").classList.replace("text-secondary", "text-primary");
                     }
                    else if(page == "processed-products"){
                        document.getElementById("processed-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "ondelivery-products"){
                        document.getElementById("ondelivery-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "accepted-products"){
                        document.getElementById("accepted-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "canceled-products"){
                        document.getElementById("canceled-products").classList.replace("text-secondary", "text-primary");
                    }
                    document.querySelectorAll(".sidebar a").forEach(element => {
                        element.addEventListener("click", function(event){
                            let elementAttributes = event.target.getAttribute("href").substr(1);
                            if(elementAttributes == "pending-products"){
                                document.getElementById("processed-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("pending-products").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "processed-products"){
                                document.getElementById("pending-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("processed-products").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "ondelivery-products"){
                                document.getElementById("pending-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("processed-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "accepted-products"){
                                document.getElementById("pending-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("processed-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("accepted-products").classList.replace("text-secondary", "text-primary");
                            }
                            else if(elementAttributes == "canceled-products"){
                                document.getElementById("pending-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("processed-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary", "text-secondary");
                                document.getElementById("canceled-products").classList.replace("text-secondary", "text-primary");
                            }
                            page = event.target.getAttribute("href").substr(1);
                            loadPageContent(page);
                        });
                    });
                    const logoutButton = document.getElementById("logout-button");
                    logoutButton.addEventListener("click", function(){
                        logoutButton.innerHTML += "...";
                        logoutATAPI(access_token).then(response => {
                            if(response.msg == "Successfully logged out"){
                                localStorage.removeItem("EMPLOYEE_TOKEN");
                                location.href = "../index.html";
                            }
                        });
                    });
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
                    if(page == "pending-products"){
                        document.getElementById("pending-products").classList.replace("text-secondary", "text-primary");
                     }
                    else if(page == "processed-products"){
                        document.getElementById("processed-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "ondelivery-products"){
                        document.getElementById("ondelivery-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "accepted-products"){
                        document.getElementById("accepted-products").classList.replace("text-secondary", "text-primary");
                    }
                    else if(page == "canceled-products"){
                        document.getElementById("canceled-products").classList.replace("text-secondary", "text-primary");
                    }
                    document.querySelectorAll(".bottom-navbar a").forEach(element => {
                        element.addEventListener("click", function(event){
                            let elementAttributes = event.target.getAttribute("href").substr(1);
                            if(elementAttributes == "pending-products"){
                                document.getElementById("processed-products").classList.replace("text-primary","secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary","secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary","secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary","secondary");
                                document.getElementById("pending").classList.replace("text-secondary","text-primary");
                            }
                            else if(elementAttributes == "processed-products"){
                                document.getElementById("pending-products").classList.replace("text-primary","secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary","secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary","secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary","secondary");
                                document.getElementById("processed-products").classList.replace("text-secondary","text-primary");
                            }
                            else if(elementAttributes == "ondelivery-products"){
                                document.getElementById("processed-products").classList.replace("text-primary","secondary");
                                document.getElementById("pending-products").classList.replace("text-primary","secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary","secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary","secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-secondary","text-primary");
                            }
                            else if(elementAttributes == "accepted-products"){
                                document.getElementById("processed-products").classList.replace("text-primary","secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary","secondary");
                                document.getElementById("pending-products").classList.replace("text-primary","secondary");
                                document.getElementById("canceled-products").classList.replace("text-primary","secondary");
                                document.getElementById("accepted-products").classList.replace("text-secondary","text-primary");
                            }
                            else if(elementAttributes == "canceled-products"){
                                document.getElementById("processed-products").classList.replace("text-primary","secondary");
                                document.getElementById("ondelivery-products").classList.replace("text-primary","secondary");
                                document.getElementById("accepted-products").classList.replace("text-primary","secondary");
                                document.getElementById("pending-products").classList.replace("text-primary","secondary");
                                document.getElementById("canceled-products").classList.replace("text-secondary","text-primary");
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
    
    async function loadPageContent(page){
        try {
            fetchContent(`pages/${page}-page.html`)
                .then(response => {
                    if(page == "pending-products"){
                        document.getElementById("product-pages-container").innerHTML = response;
                        getAllProductEmployee(access_token)
                            .then(response => {
                                if(response.msg =="token expired"){
                                    refreshTokenAPI(access_token)
                                        .then(response => isTokenExpired(response, "EMPLOYEE_TOKEN", "../index.html"));
                                }
                                if(response.msg == "Token has been revoked"){
                                    localStorage.removeItem("EMPLOYEE_TOKEN");
                                    location.href = "../index.html";
                                }
                                if(sessionStorage.getItem("message")){
                                    const alertContainer = document.getElementById("alert-container");
                                    alertContainer.classList.add("alert","alert-success","alert-dismissible","fade","show");
                                    alertContainer.innerHTML = `${sessionStorage.getItem("message")} <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                                    sessionStorage.removeItem("message");
                                }
                                showAllPendingProducts(response);
                            });
                            const logoutButton = document.getElementById("logout-button");
                            logoutButton.addEventListener("click", function(){
                                logoutButton.innerHTML += "...";
                                logoutATAPI(access_token).then(response => {
                                    if(response.msg == "Successfully logged out"){
                                        localStorage.removeItem("EMPLOYEE_TOKEN");
                                        location.href = "../index.html";
                                    }
                                });
                            });
                    }
                    else if(page == "processed-products"){
                        document.getElementById("product-pages-container").innerHTML = response;
                        getAllProductEmployee(access_token)
                            .then(response => {
                                if(response.msg =="token expired"){
                                    refreshTokenAPI(access_token)
                                        .then(response => isTokenExpired(response, "EMPLOYEE_TOKEN", "../index.html"));
                                }
                                if(response.msg == "Token has been revoked"){
                                    localStorage.removeItem("EMPLOYEE_TOKEN");
                                    location.href = "../index.html";
                                }
                                if(sessionStorage.getItem("message")){
                                    const alertContainer = document.getElementById("alert-container");
                                    alertContainer.classList.add("alert");
                                    alertContainer.classList.add("alert-success");
                                    alertContainer.classList.add("alert-dismissible");
                                    alertContainer.classList.add("fade");
                                    alertContainer.classList.add("show");
                                    alertContainer.innerHTML = `${sessionStorage.getItem("message")} <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                                    sessionStorage.removeItem("message");
                                }
                                showAllProcessedProducts(response);
                            });
                            const logoutButton = document.getElementById("logout-button");
                            logoutButton.addEventListener("click", function(){
                                logoutButton.innerHTML += "...";
                                logoutATAPI(access_token).then(response => {
                                    if(response.msg == "Successfully logged out"){
                                        localStorage.removeItem("EMPLOYEE_TOKEN");
                                        location.href = "../index.html";
                                    }
                                });
                            });
                    }
                    else if(page == "ondelivery-products"){
                        document.getElementById("product-pages-container").innerHTML = response;
                        getAllProductEmployee(access_token)
                            .then(response => {
                                if(response.msg =="token expired"){
                                    refreshTokenAPI(access_token)
                                        .then(response => isTokenExpired(response, "EMPLOYEE_TOKEN", "../index.html"));
                                }
                                if(response.msg == "Token has been revoked"){
                                    localStorage.removeItem("EMPLOYEE_TOKEN");
                                    location.href = "../index.html";
                                }
                                if(sessionStorage.getItem("message")){
                                    const alertContainer = document.getElementById("alert-container");
                                    alertContainer.classList.add("alert");
                                    alertContainer.classList.add("alert-success");
                                    alertContainer.classList.add("alert-dismissible");
                                    alertContainer.classList.add("fade");
                                    alertContainer.classList.add("show");
                                    alertContainer.innerHTML = `${sessionStorage.getItem("message")} <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                                    sessionStorage.removeItem("message");
                                }
                                showAllOndeliveryProducts(response);
                            });
                            const logoutButton = document.getElementById("logout-button");
                            logoutButton.addEventListener("click", function(){
                                logoutButton.innerHTML += "...";
                                logoutATAPI(access_token).then(response => {
                                    if(response.msg == "Successfully logged out"){
                                        localStorage.removeItem("EMPLOYEE_TOKEN");
                                        location.href = "../index.html";
                                    }
                                });
                            });
                    }
                    else if(page == "accepted-products"){
                        document.getElementById("product-pages-container").innerHTML = response;
                        getAllProductEmployee(access_token)
                            .then(response => {
                                if(response.msg =="token expired"){
                                    refreshTokenAPI(access_token)
                                        .then(response => isTokenExpired(response, "EMPLOYEE_TOKEN", "../index.html"));
                                }
                                if(response.msg == "Token has been revoked"){
                                    localStorage.removeItem("EMPLOYEE_TOKEN");
                                    location.href = "../index.html";
                                }
                                if(sessionStorage.getItem("message")){
                                    const alertContainer = document.getElementById("alert-container");
                                    alertContainer.classList.add("alert");
                                    alertContainer.classList.add("alert-success");
                                    alertContainer.classList.add("alert-dismissible");
                                    alertContainer.classList.add("fade");
                                    alertContainer.classList.add("show");
                                    alertContainer.innerHTML = `${sessionStorage.getItem("message")} <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                                    sessionStorage.removeItem("message");
                                }
                                showAllAcceptedProducts(response);
                            });
                            const logoutButton = document.getElementById("logout-button");
                            logoutButton.addEventListener("click", function(){
                                logoutButton.innerHTML += "...";
                                logoutATAPI(access_token).then(response => {
                                    if(response.msg == "Successfully logged out"){
                                        localStorage.removeItem("EMPLOYEE_TOKEN");
                                        location.href = "../index.html";
                                    }
                                });
                            });
                    }
                    else if(page == "canceled-products"){
                        document.getElementById("product-pages-container").innerHTML = response;
                        getAllProductEmployee(access_token)
                            .then(response => {
                                if(response.msg =="token expired"){
                                    refreshTokenAPI(access_token)
                                        .then(response => isTokenExpired(response, "EMPLOYEE_TOKEN", "../index.html"));
                                }
                                if(response.msg == "Token has been revoked"){
                                    localStorage.removeItem("EMPLOYEE_TOKEN");
                                    location.href = "../index.html";
                                }
                                if(sessionStorage.getItem("message")){
                                    const alertContainer = document.getElementById("alert-container");
                                    alertContainer.classList.add("alert");
                                    alertContainer.classList.add("alert-success");
                                    alertContainer.classList.add("alert-dismissible");
                                    alertContainer.classList.add("fade");
                                    alertContainer.classList.add("show");
                                    alertContainer.innerHTML = `${sessionStorage.getItem("message")} <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`;
                                    sessionStorage.removeItem("message");
                                }
                                showAllCanceledProducts(response);
                            });
                            const logoutButton = document.getElementById("logout-button");
                            logoutButton.addEventListener("click", function(){
                                logoutButton.innerHTML += "...";
                                logoutATAPI(access_token).then(response => {
                                    if(response.msg == "Successfully logged out"){
                                        localStorage.removeItem("EMPLOYEE_TOKEN");
                                        location.href = "../index.html";
                                    }
                                });
                            });
                    }
                });
        }
        catch(error){
            console.log(error);
        }
    }

    let page = window.location.hash.substr(1);
    page === "" ? page = "pending-products" : page = page;
    loadPageContent(page);
    loadSidebarContent();
    loadBottomNavbarContent();
}