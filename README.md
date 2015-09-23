Test project for [cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central) looking at the max number of notifications. See [Issue #100](https://github.com/don/cordova-plugin-ble-central/issues/100).

## Bluetooth service

    $ cd bleno
    $ npm install
    $ node index.js

## Cordova app

    $ cd cordova
    $ cordova plugin add cordova-plugin-ble-central
    $ cordova plugin add cordova-plugin-console

### Android

    $ cordova platform add android
    $ cordova run android --device

### iOS

    $ cordova platform add ios
    $ open platforms/ios/Many.xcodeproj
