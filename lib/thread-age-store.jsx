import NylasStore from 'nylas-store';
import Actions from './thread-age-actions';

class ThreadAgeStore extends NylasStore {

  constructor() {
    super();

    this._badgeStyle = 'text';
    this._displayRules = [ 'inbox' ];
    this._thresholds = {
      low:    { amount: 3, unit: 'hour' },
      medium: { amount: 2, unit: 'day' },
      high:   { amount: 1, unit: 'week' }
    };

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

    this.trigger();
  };

}

export default new ThreadAgeStore();
