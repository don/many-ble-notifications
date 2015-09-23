var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

console.log('bleno');

var NotifyCharacteristic = function(number) {
  var paddedHex = ("00" + number.toString(16)).slice(-2);
  var uuid = ("ffffffffffffffffffffffffffffffff" + paddedHex).slice(-32);

  NotifyCharacteristic.super_.call(this, {
    uuid: uuid,
    properties: ['notify']
  });
};

util.inherits(NotifyCharacteristic, BlenoCharacteristic);

NotifyCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log(this.uuid + ' subscribe');

  this.counter = 0;
  this.changeInterval = setInterval(function() {
    var data = new Buffer(4);
    data.writeUInt32LE(this.counter, 0);

    console.log(this.uuid + ' update value: ' + this.counter);
    updateValueCallback(data);
    this.counter++;
  }.bind(this), 5000);
};

NotifyCharacteristic.prototype.onUnsubscribe = function() {
  console.log(this.uuid + ' unsubscribe');

  if (this.changeInterval) {
    clearInterval(this.changeInterval);
    this.changeInterval = null;
  }
};

// NotifyCharacteristic.prototype.onNotify = function() {
//   console.log('NotifyCharacteristic on notify');
// };

var numberNotificationCharacteristics = 20;
var characteristics = [];
for (var i = 0; i < numberNotificationCharacteristics; i++) {
    characteristics.push(new NotifyCharacteristic(i));
}

function SampleService() {
  SampleService.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff0',
    characteristics: characteristics
  });
}

util.inherits(SampleService, BlenoPrimaryService);

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state + ', address = ' + bleno.address);

  if (state === 'poweredOn') {
    bleno.startAdvertising('test', ['fffffffffffffffffffffffffffffff0']);
  } else {
    bleno.stopAdvertising();
  }
});

// Linux only events /////////////////
bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress);

  bleno.updateRssi();
});

bleno.on('disconnect', function(clientAddress) {
  console.log('on -> disconnect, client: ' + clientAddress);
});

bleno.on('rssiUpdate', function(rssi) {
  console.log('on -> rssiUpdate: ' + rssi);
});
//////////////////////////////////////

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu);
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new SampleService()
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'));
});
