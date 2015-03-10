import { Service } from 'components/fxos-mvc/dist/mvc';

import /* global DNSSD */ 'components/dns-sd.js/dist/dns-sd';

var singletonGuard = {};
var instance = null;

export default
class LanService extends Service {
  constructor(guard) {
    console.log('LanService#constructor()');

    if (guard !== singletonGuard) {
      console.error('Cannot create singleton class.');
      return;
    }

    super();

    this.discoveryInterval = null;
    this.recordTypes = Object.create(null);

    this.init();
  }

  init() {
    DNSSD.addEventListener('discovered', evt => {
      var records = evt.packet.records;
      var httpRecords = [];
      // Filter out and keep only the `_http._tcp` records.
      var recordKeys = Object.keys(records);
      recordKeys.forEach(recordKey => {
        var record = records[recordKey];
        record = record.filter(
            rec => rec.data && rec.data.contains && rec.data.contains('_http._tcp'));
        httpRecords = httpRecords.concat(record);
      });

      if (httpRecords.length) {
        console.log(evt.address, httpRecords);
      }

      var details = {
        url: ''
      };

      this._dispatchEvent('discovered', details);
    });

    this.advertise();
  }

  static get instance() {
    if (!instance) {
      instance = new this(singletonGuard);
    }
    return instance;
  }

  start() {
    DNSSD.startDiscovery();

    this.discoveryInterval = setInterval(() => {
      DNSSD.startDiscovery();
    }, 10000);
  }

  stop() {
    clearInterval(this.discoveryInterval);
  }

  advertise() {
    DNSSD.registerService('_http._tcp', 80, {
      path: '/xyz.html'
    });
  }
}
