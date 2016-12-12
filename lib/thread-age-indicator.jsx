import {React} from 'nylas-exports';
import ThreadAgeStore from './thread-age-store';

const EmptyAgeIndicator = (
  <span className="thread-age empty" />
);

const timeUnits = {
  second: { short: 's',  singular: 'second', plural: 'seconds', seconds: 1 },
  minute: { short: 'm',  singular: 'minute', plural: 'minutes', seconds: 60 },
  hour:   { short: 'h',  singular: 'hour',   plural: 'hours',   seconds: 3600 },
  day:    { short: 'd',  singular: 'day',    plural: 'days',    seconds: 86400 },
  week:   { short: 'w',  singular: 'week',   plural: 'weeks',   seconds: 604800 },
  month:  { short: 'mo', singular: 'month',  plural: 'months',  seconds: 2592000 }
};

export default class ThreadAgeIndicator extends React.Component {

  static displayName = 'ThreadAgeIndicator';

  static propTypes = {
    thread: React.PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.state = {
      badgeStyle: ThreadAgeStore.badgeStyle(),
      displayRules: ThreadAgeStore.displayRules(),
      thresholds: ThreadAgeStore.thresholds()
    };
  };

  componentDidMount() {
    this.subscription = ThreadAgeStore.listen(this._onSettingsUpdated);
  };

  componentWillUnmount() {
    this.subscription();
  };

  _onSettingsUpdated = () => {
    this.setState({
      badgeStyle: ThreadAgeStore.badgeStyle(),
      displayRules: ThreadAgeStore.displayRules(),
      thresholds: ThreadAgeStore.thresholds()
    });
  };

  _thresholdInSeconds(named) {
    const threshold = this.state.thresholds[named];
    return threshold.amount * timeUnits[threshold.unit].seconds;
  };

  _formattedAge(ageInSeconds) {
    // less than one minute old
    if (ageInSeconds < timeUnits.minute.seconds) {
      return {
        short: `${ageInSeconds}${timeUnits.second.short}`,
        long: `${ageInSeconds}${ageInSeconds == 1 ? timeUnits.second.singular : timeUnits.second.plural}`
      };
    };

    // less than one hour old
    if (ageInSeconds < timeUnits.hour.seconds) {
      let age = (ageInSeconds / timeUnits.minute.seconds).toFixed(0);
      return {
        short: `${age}${timeUnits.minute.short}`,
        long: `${age} ${age == 1 ? timeUnits.minute.singular : timeUnits.minute.plural}`
      };
    };

    // less than one day old
    if (ageInSeconds < timeUnits.day.seconds) {
      let age = (ageInSeconds / timeUnits.hour.seconds).toFixed(0);
      return {
        short: `${age}${timeUnits.hour.short}`,
        long: `${age} ${age == 1 ? timeUnits.hour.singular : timeUnits.hour.plural}`
      };
    };

    // over one day old and less than one week old
    if (ageInSeconds > timeUnits.day.seconds && ageInSeconds < timeUnits.week.seconds) {
      let age = (ageInSeconds / timeUnits.day.seconds).toFixed(0);
      return {
        short: `${age}${timeUnits.day.short}`,
        long: `${age} ${age == 1 ? timeUnits.day.singular : timeUnits.day.plural}`,
      };
    };

    // over one week old
    if (ageInSeconds > timeUnits.week.seconds && ageInSeconds < timeUnits.month.seconds) {
      let age = (ageInSeconds / timeUnits.week.seconds).toFixed(0);
      return {
        short: `${age}${timeUnits.week.short}`,
        long: `${age} ${age == 1 ? timeUnits.week.singular : timeUnits.week.plural}`
      };
    };

    // over one month old
    if (ageInSeconds > timeUnits.month.seconds) {
      let age = (ageInSeconds / timeUnits.month.seconds).toFixed(0);
      return {
        short: `${age}${timeUnits.month.short}`,
        long: `${age} ${age == 1 ? timeUnits.month.singular : timeUnits.month.plural}`
      };
    };
  };

  renderIndicator(type, ageInSeconds) {
    const formattedAge = this._formattedAge(ageInSeconds);
    return (
      <abbr
        className={`thread-age ${this.state.badgeStyle} ${type}`}
        title={`This thread is ${formattedAge.long} old`}
      >
        {this.state.badgeStyle == 'text' ? formattedAge.short : ''}
      </abbr>
    )
  };

  render() {
    const {
      thread: { lastMessageReceivedTimestamp: timestamp },
      thread: { categories: categories },
      thread: { unread: isUnread },
      thread: { starred: isStarred }
    } = this.props;
    const threadTimestampInSeconds = timestamp.getTime() / 1000;
    const currentTimestampInSeconds = (new Date()).getTime() / 1000;
    const threadAgeInSeconds = currentTimestampInSeconds - threadTimestampInSeconds;
    const categoriesMap = categories.map(category => category.name);

    var meetsDisplayRule = () => {
      if (this.state.displayRules.some(category => categoriesMap.includes(category))) return true;
      if (isUnread && this.state.displayRules.includes('unread')) return true;
      if (isStarred && this.state.displayRules.includes('starred')) return true;
      return false;
    };

    if (!meetsDisplayRule()) {
      return EmptyAgeIndicator;
    };

    if (threadAgeInSeconds > this._thresholdInSeconds('high')) {
      return this.renderIndicator('high', threadAgeInSeconds);
    };

    if (threadAgeInSeconds > this._thresholdInSeconds('medium')) {
      return this.renderIndicator('medium', threadAgeInSeconds);
    };

    if (threadAgeInSeconds > this._thresholdInSeconds('low')) {
      return this.renderIndicator('low', threadAgeInSeconds);
    };

    return EmptyAgeIndicator;
  };
}
