importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  {url: './index.html', revision: 1},
  {url: './navbar.html', revision: 1},
  {url: './bottom-navbar.html', revision: 1},
  {url: './footer.html', revision: 1},
  {url: './product-details.html', revision: 1},
  {url: './landing-mobile.html', revision: 1},

  {url: './pages/account-detail-page.html', revision: 1},
  {url: './pages/all-products-page.html', revision: 1},
  {url: './pages/cart-page.html', revision: 1},
  {url: './pages/edit-password-page.html', revision: 1},
  {url: './pages/edit-profile-page.html', revision: 1},
  {url: './pages/order-details-code-order-page.html', revision: 1},
  {url: './pages/order-details-data-order-page.html', revision: 1},
  {url: './pages/order-details-page.html', revision: 1},

  {url: './customer/account-detail.html', revision: 1},
  {url: './customer/login.html', revision: 1},
  {url: './customer/order-details.html', revision: 1},
  {url: './customer/register.html', revision: 1},

  {url: './css/bootstrap.min.css', revision: 1},
  {url: './css/boxicons.min.css', revision: 1},
  {url: './css/foundation-icons.css', revision: 1},
  {url: './css/mapbox-gl-geocoder.css', revision: 1},
  {url: './css/mapbox-gl.css', revision: 1},
  {url: './css/style.css', revision: 1},
  {url: './css/swiper-bundle.min.css', revision: 1},

  {url: './js/helpers/api-helper.js', revision: 1},
  {url: './js/helpers/error-helper.js', revision: 1},
  {url: './js/helpers/pagination-helper.js', revision: 1},
  {url: './js/helpers/spa-customer-helper.js', revision: 1},
  {url: './js/helpers/token-expired-helper.js', revision: 1},
  {url: './js/helpers/token-null-helper.js', revision: 1},

  {url: './js/services/api/customer/auth-customer.js', revision: 1},
  {url: './js/services/api/customer/product-order.js', revision: 1},
  {url: './js/services/api/customer/product-review.js', revision: 1},
  {url: './js/services/api/customer/profile-customer.js', revision: 1},

  {url: './js/services/api/check-location.js', revision: 1},
  {url: './js/services/api/logout-token.js', revision: 1},
  {url: './js/services/api/product-detail.js', revision: 1},
  {url: './js/services/api/product-index.js', revision: 1},
  {url: './js/services/api/refresh-token.js', revision: 1},

  {url: './js/bootstrap.min.js', revision: 1},
  {url: './js/db.js', revision: 1},
  {url: './js/idb.js', revision: 1},
  {url: './js/jquery-3.5.1.slim.min.js', revision: 1},
  {url: './js/mapbox-gl-geocoder.min.js', revision: 1},
  {url: './js/mapbox-gl.js', revision: 1},
  {url: './js/popper.min.js', revision: 1},
  {url: './js/swiper.js', revision: 1},
  
  {url: './images/food.svg', revision: 1},
  {url: './images/motor.svg', revision: 1},
  {url: './images/waiting.svg', revision: 1},
  {url: './images/chicken.svg', revision: 1},
  {url: './images/icon-192x192.png', revision: 1},
  {url: './images/icon-512x512.png', revision: 1},

  {url: './svg/regular/bx-star.svg', revision: 1},
  
  {url: './fonts/boxicons.eot', revision: 1},
  {url: './fonts/boxicons.svg', revision: 1},
  {url: './fonts/boxicons.ttf', revision: 1},
  {url: './fonts/boxicons.woff', revision: 1},
  {url: './fonts/boxicons.woff2', revision: 1},

  {url: './manifest.json', revision: 1},

  {url: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2', revision: 1},
], {
  ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp("https://rest-orderapp.herokuapp.com/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({statuses: [0, 200]}),
      new workbox.expiration.ExpirationPlugin({maxAgeSeconds: 7 * 24 * 60 * 60, maxEntries: 30})
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "pages-cache",
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({statuses: [0, 200]}),
      new workbox.expiration.ExpirationPlugin({maxAgeSeconds: 7 * 24 * 60 * 60, maxEntries: 30})
    ]
  })
);

workbox.setConfig({
  debug: false
});