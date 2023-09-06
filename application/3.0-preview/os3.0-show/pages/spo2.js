import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { BloodOxygen } from "@zos/sensor";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } =
  getDeviceInfo();

const BUTTON_X = 50;
const BUTTON_Y = 80;
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
const BUTTON_H = 50;
const BUTTON_MARGIN_TOP = 20;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

const START_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};

const STOP_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y + BUTTON_H * 2,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};

let text_info = null;
let show_text = "";

const logger = log.getLogger('spo2.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 4,
      w: BUTTON_W,
      h: BUTTON_H * 3,
      text_size: 18,
      text: "Wear your watch and prepare to measure",
      color: 0x34e073,
    });

    let spo2Sr = new BloodOxygen();
    const callback = () => {
      const result = spo2Sr.getCurrent()
      if (result.retCode === 2) {
        let d = new Date(result.time * 1000);
        show_text =
          "time: " + d.toLocaleString() + ", value:" + result.value + "\n";
        text_info.setProperty(hmUI.prop.TEXT, show_text);
      }
    }

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON,
      text: "START SPO2",
      click_func: () => {
        spo2Sr.onChange(callback)
        spo2Sr.stop()
        spo2Sr.start()
        text_info.setProperty(hmUI.prop.TEXT, 'measuring...');
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STOP_BUTTON,
      text: "STOP SPO2",
      click_func: () => {
        logger.log("click to stop spo2");
        spo2Sr.stop();
        spo2Sr.offChange(callback)
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
