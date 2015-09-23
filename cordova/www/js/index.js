var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.scan();
    },
    scan: function() {
        ble.scan(['ffffffff-ffff-ffff-ffff-fffffffffff0'], 10, function(device) {
            console.log('Connecting to ' + device.id);
            // only expecting 1 service, so just connect
            ble.connect(device.id, app.onConnect, app.onDisconnect);
        }, function() {
            console.log('Scan Failed');
        });
    },
    onConnect: function(device) {
        console.log('onConnect');
        app.device = device;
        var numberNotificationCharacteristics = 20;

        // subscribe for multiple notifications
        for (var i = 0; i < numberNotificationCharacteristics; i++) {

            var paddedHex = ("00" + i.toString(16)).slice(-2);
            var characteristicUUID = "ffffffff-ffff-ffff-ffff-ffffffffff" + paddedHex;
            console.log("Subscribing for notification on " + characteristicUUID);

            var div = document.createElement('div');
            div.setAttribute('id', 'notification' + paddedHex);
            div.innerText = "characteristic " + paddedHex + " - ???";
            mainDiv.appendChild(div);

            ble.startNotification(device.id, 
                'ffffffff-ffff-ffff-ffff-fffffffffff0', // service
                characteristicUUID,
                app.generateOnDataFunction(paddedHex),
                app.generateErrorHandler(characteristicUUID)
            );
        }
    },
    onDisconnect: function() {
        alert('Disconnected');
    },
    generateOnDataFunction: function(number) {
        return function(buffer) { // success
            var data = new Uint32Array(buffer);
            var message = "characteristic " + number + " - " + data[0];
            console.log(message);
            var div = document.querySelector('#notification' + number);
            div.innerText = message;
        };
    },
    generateErrorHandler: function(uuid) {
        return function() {
            console.log('startNotification failed for ' + uuid);
            alert('startNotification failed for ' + uuid);
        };
    }
};

app.initialize();
