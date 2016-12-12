import NylasStore from 'nylas-store';
import Actions from './thread-age-actions';

const defaults = {
  badgeStyle: 'text',
  displayRules: [ 'inbox' ],
  thresholds: {
    low:    { amount: 3, unit: 'hour' },
    medium: { amount: 2, unit: 'day' },
    high:   { amount: 1, unit: 'week' }
  }
};

class ThreadAgeStore extends NylasStore {

  constructor() {
    super();

    this._badgeStyle = NylasEnv.config.get('thread-age-badgeStyle') || defaults.badgeStyle;
    this._displayRules = NylasEnv.config.get('thread-age-displayRules') || defaults.displayRules;
    this._thresholds = NylasEnv.config.get('thread-age-thresholds') || defaults.thresholds;

    this.trigger();

    Actions.updateSettings.listen(this._onUpdateSettings);
  };

  badgeStyle() {
    return this._badgeStyle;
  };

  displayRules() {
    return this._displayRules;
  };

  thresholds() {
    return this._thresholds;
  };

  _onUpdateSettings = (settings) => {
    this._badgeStyle = settings.badgeStyle;
    this._displayRules = settings.displayRules;
    this._thresholds = settings.thresholds;

    NylasEnv.config.set('thread-age-badgeStyle', settings.badgeStyle);
    NylasEnv.config.set('thread-age-displayRules', settings.displayRules);
    NylasEnv.config.set('thread-age-thresholds', settings.thresholds);

    this.trigger();
  };

}

export default new ThreadAgeStore();
