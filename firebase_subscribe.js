// firebase_subscribe.js
firebase.initializeApp({
    messagingSenderId: '877843245951'
});
$(document).on('ready', function() {
    $('#subscribe').on('click', function() {
        if(checked) {
            console.log('TYT');
            getToken();
            console.log('TYT2');
        }
    });
});

if (
    window.location.protocol === 'https:' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {
    var messaging = firebase.messaging();
    // already granted
    if (Notification.permission === 'granted') {
        getToken();
    }
    var checked = true;

    // handle catch the notification on current page
    messaging.onMessage(function(payload) {
        console.log('Message received', payload);

        // register fake ServiceWorker for show notification on mobile devices
        navigator.serviceWorker.register('/serviceworker/firebase-messaging-sw.js');
        Notification.requestPermission(function(permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    // Copy data object to get parameters in the click handler
                    payload.data.data = JSON.parse(JSON.stringify(payload.data));

                    registration.showNotification(payload.data.title, payload.data);
                }).catch(function(error) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed' + error);
                });
            }
        });
    });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function() {
        messaging.getToken()
            .then(function(refreshedToken) {
                console.log('Token refreshed');
                // Send Instance ID token to app server.
                sendTokenToServer(refreshedToken);
                updateUIForPushEnabled(refreshedToken);
            })
            .catch(function(error) {
                console.log('Unable to retrieve refreshed token' + error);
            });
    });

} else {
    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);

}






function getToken() {
        messaging.requestPermission()
            .then(function() {
                // Get Instance ID token. Initially this makes a network call, once retrieved
                // subsequent calls to getToken will return from cache.
                messaging.getToken()
                    .then(function(currentToken) {

                        if (currentToken) {
                            sendTokenToServer(currentToken);
                            console.log(currentToken);
                        } else {
                            console.log('No Instance ID token available. Request permission to generate one');
                            setTokenSentToServer(false);
                        }
                    })
                    .catch(function(error) {
                        console.log('An error occurred while retrieving token' + error);
                        setTokenSentToServer(false);
                    });
            })
            .catch(function(error) {
                console.log('Unable to get permission to notify' + error);
            });
    var push_txt = '<div class="push_container"><table><tr><td width="65px"><div class="mark_container"><div id="mark_01"><div class="circle_icon"></div></div></div></td><td><div class="info_txt">Вы подписаны на сообщения о свежих новостях</div></td><td width="45px"><div class="close_push"></div></td></tr></table></div>'
    $('#push').html(push_txt);
}

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to server...');
        // send current token to server
        //$.post(url, {token: currentToken});
        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
    }
}

function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('gkMessagingToken') === currentToken;
}

function setTokenSentToServer(currentToken) {
    if (currentToken) {
        window.localStorage.setItem('gkMessagingToken', currentToken);
    } else {
        window.localStorage.removeItem('gkMessagingToken');
    }
}
