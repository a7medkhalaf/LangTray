import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';

let _label;

var LangTray = GObject.registerClass({
}, class LangTray extends GObject.Object {
    constructor() {
        super();
        this._keyboard = Main.panel.statusArea.keyboard;
        this._signalId = 0;
    }

    enable() {
        _label = new St.Label({
                    text: "..",
                    x_expand: true,
                    y_expand: true,
                    y_align: Clutter.ActorAlign.CENTER,
                });
        try {
            Main.panel.statusArea.quickSettings.addExternalIndicator(_label);
        } catch (e) {}
        Main.panel.statusArea.keyboard.container.hide();
        this._signalId = this._keyboard._inputSourceManager.connect('current-source-changed', this._updateLabel.bind(this));
        this._updateLabel();
    }

    disable() {
        if (this._signalId) {
            this._keyboard._inputSourceManager.disconnect(this._signalId);
            this._signalId = 0;
            Main.panel.statusArea.keyboard.container.show();
        }
    }

    _updateLabel() {
        _label.text = this._keyboard._inputSourceManager.currentSource.shortName + '  ';
    }
});

let _indicator;

export default class LangTrayExtension extends Extension {
    enable() {        
        _indicator = new LangTray();
        _indicator.enable();
    }
    
    disable() {
        _indicator.disable();
        _label.destroy();
        _indicator = null;
        _label = null;
    }
}
