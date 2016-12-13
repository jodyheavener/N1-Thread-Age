import path from 'path';
import fs from 'fs';
import {ComponentRegistry, PreferencesUIStore} from 'nylas-exports';
import ThreadAgeIndicator from './thread-age-indicator';
import ThreadAgePreferences from './thread-age-preferences';

const DISPLAY_NAME = 'Thread Age';

function addPreferencesTabIcon() {
  var cachedImageDataJSON = JSON.parse(NylasEnv.fileListCache().imageData);
  const resourcePath = NylasEnv.getLoadSettings().resourcePath;
  const pluginPath = path.dirname(fs.realpathSync(__filename));

  [1, 2].forEach(function(iconSize) {
    const iconName = `icon-preferences-${DISPLAY_NAME.toLowerCase().replace(' ', '-')}@${iconSize}x.png`;
    cachedImageDataJSON[resourcePath][iconName] = path.join(pluginPath, `../${iconName}`);
  });

  NylasEnv.fileListCache().imageData = JSON.stringify(cachedImageDataJSON);
};

export function activate() {
  addPreferencesTabIcon();

  this.preferencesTab = new PreferencesUIStore.TabItem({
    tabId: 'ThreadAge',
    displayName: DISPLAY_NAME,
    component: ThreadAgePreferences,
  });

  PreferencesUIStore.registerPreferencesTab(this.preferencesTab);
  ComponentRegistry.register(ThreadAgeIndicator, { role: 'Thread:MailLabel' });
}

export function serialize() { }

export function deactivate() {
  PreferencesUIStore.unregisterPreferencesTab(this.preferencesTab);
  ComponentRegistry.unregister(ThreadAgeIndicator);
}
