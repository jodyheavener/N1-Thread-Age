import {ComponentRegistry, PreferencesUIStore} from 'nylas-exports';

import ThreadAgeIndicator from './thread-age-indicator';
import ThreadAgePreferences from './thread-age-preferences';

export function activate() {
  this.preferencesTab = new PreferencesUIStore.TabItem({
    tabId: 'ThreadAge',
    displayName: 'Thread Age',
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
