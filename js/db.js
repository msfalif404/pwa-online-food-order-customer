const idbPromised = idb.open("pwa-online-food-order-indexeddb", 1, upgradeDb => {
    if(!upgradeDb.objectStoreNames.contains("products-cart")){
        upgradeDb.createObjectStore("products-cart", {keyPath: "productId"});
    }
    if(!upgradeDb.objectStoreNames.contains("all-products")){
        upgradeDb.createObjectStore("all-products", {autoIncrement: true});
    }
    if(!upgradeDb.objectStoreNames.contains("customer-location")){
        upgradeDb.createObjectStore("customer-location", {keyPath: "id"});
    }
});


// Cart Products

const dbGetAllProducts = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("products-cart", "readonly");
            return transaction.objectStore("products-cart").getAll();
        })
        .then(data => {
            if(data !== undefined){
                resolve(data);
            }
        })
        .catch(error => reject(error));
    })
}

const dbGetProductById = data => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("products-cart", "readonly");
            return transaction.objectStore("products-cart").get(data);
        }).then(data => {
            if(data !== undefined){
                resolve(data);
            }
            else {
                reject(new Error("No Data Found"));
            }
        })
    })
}

const dbInsertProductToCart = data => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("products-cart", "readwrite");
            transaction.objectStore("products-cart").put(data);
            return transaction;
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => reject(error));
    });
}

const dbDeleteProductById = id => {
    return new Promise ((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("products-cart", "readwrite");
            transaction.objectStore("products-cart").delete(id);
            return transaction;
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

const dbDeleteAllProduct = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("products-cart", "readwrite");
            return transaction.objectStore("products-cart").clear();
        })
        .then(transaction => {
            resolve(true);
        })
        .catch(error => {
            reject(error);
        });
    })
}

// All Products

const dbGetAllProductsIndex = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("all-products", "readonly");
            return transaction.objectStore("all-products").getAll();
        })
        .then(data => {
            if(data !== undefined){
                resolve(data);
            }
        })
        .catch(error => reject(error));
    })
}

const dbInsertProductsIndex = data => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("all-products", "readwrite");
            transaction.objectStore("all-products").put(data);
            return transaction;
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => reject(error));
    });
}

const dbDeleteAllProductIndex = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("all-products", "readwrite");
            return transaction.objectStore("all-products").clear();
        })
        .then(transaction => {
            resolve(true);
        })
        .catch(error => {
            reject(error);
        });
    })
}

// Customer Location


const dbGetCustomerLocation = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("customer-location", "readonly");
            return transaction.objectStore("customer-location").get(1);
        }).then(data => {
            if(data !== undefined){
                resolve(data);
            }
            else {
                reject(new Error("No Data Found"));
            }
        })
    })
}

const dbInsertCustomerLocation = data => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("customer-location", "readwrite");
            transaction.objectStore("customer-location").put(data);
            return transaction;
        })
        .then(transaction => {
            if(transaction.complete){
                resolve(true);
            }
        })
        .catch(error => reject(error));
    });
}

