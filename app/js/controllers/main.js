import { Controller } from 'components/fxos-mvc/dist/mvc';

//import HomeController from 'js/controllers/home';

import LanService from 'js/services/lan';

export default
class MainController extends Controller {
  constructor() {
    console.log('MainController#constructor()');

    /*this.controllers = {
      home: new HomeController({settings: this.settings})
    };*/

    this.init();
  }

  init() {
    console.log('MainController#init()');

    //LanService.instance.addEventListener('discovered', discovered);
  }

  main() {
    console.log('MainController#main()');

    LanService.instance.start();
  }
}
