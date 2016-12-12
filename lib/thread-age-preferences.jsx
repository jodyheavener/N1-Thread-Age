import {React} from 'nylas-exports';
import serialize from 'form-serialize';
import Actions from './thread-age-actions';
import ThreadAgeStore from './thread-age-store';

export default class ThreadAgePreferences extends React.Component {

  constructor() {
    super()

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

  _onSettingsChanged = (event) => {
    const settings = serialize(this.refs.threadAgeSettingsForm, { hash: true });
    if (settings.displayRules == null) settings.displayRules = [];
    Actions.updateSettings(settings);
  };

  _onSettingsUpdated = () => {
    this.setState({
      badgeStyle: ThreadAgeStore.badgeStyle(),
      displayRules: ThreadAgeStore.displayRules(),
      thresholds: ThreadAgeStore.thresholds()
    });
  };

  render() {
    return (
      <div>
        <section className="container-threadage">
          <p className="threadage-intro">Thread Age helps you stay on top of how long that email has been hanging around. Customize when, where, and how a thread age badge is displayed below.</p>

          <form ref="threadAgeSettingsForm">
            <div className="threadage-section-title">Appearance</div>

            <table className="threadage-section-settings">
              <tbody>
                <tr className="threadage-section-setting-badgeStyle">
                  <td>
                    <label htmlFor="select-badge-style">Badge Style</label>
                  </td>
                  <td>
                    <label>
                      <input onChange={this._onSettingsChanged} id="select-badge-style" type="radio" value="icon" name="badgeStyle" checked={this.state.badgeStyle == "icon" ? true : null} />
                      Icon
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="radio" value="text" name="badgeStyle" checked={this.state.badgeStyle == "text" ? true : null} />
                      Text
                    </label>
                  </td>
                </tr>
                <tr className="threadage-section-setting-displayRules">
                  <td>
                    <label htmlFor="select-display-rules">Display on...</label>
                  </td>
                  <td>
                    <label>
                      <input onChange={this._onSettingsChanged} id="select-display-rules" type="checkbox" value="inbox" name="displayRules[]" checked={this.state.displayRules.includes("inbox") ? true : null} />
                      Any thread with a message in Inbox
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="checkbox" value="important" name="displayRules[]" checked={this.state.displayRules.includes("important") ? true : null} />
                      Threads marked Important (Gmail only)
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="checkbox" value="unread" name="displayRules[]" checked={this.state.displayRules.includes("unread") ? true : null} />
                      Unread Threads
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="checkbox" value="starred" name="displayRules[]" checked={this.state.displayRules.includes("starred") ? true : null} />
                      Starred Threads
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="checkbox" value="trash" name="displayRules[]" checked={this.state.displayRules.includes("trash") ? true : null} />
                      Any thread with a message in Trash
                    </label>
                    <label>
                      <input onChange={this._onSettingsChanged} type="checkbox" value="all" name="displayRules[]" checked={this.state.displayRules.includes("all") ? true : null} />
                      All Mail (excludes Trash)
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="threadage-section-title">Thresholds</div>

            <table className="threadage-section-settings thresholds">
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="select-low-amount">Low</label>
                  </td>
                  <td>
                    <input onChange={this._onSettingsChanged} id="select-low-amount" type="number" value={this.state.thresholds.low.amount} name="thresholds[low][amount]" />
                    <select onChange={this._onSettingsChanged} name="thresholds[low][unit]" defaultValue={this.state.thresholds.low.unit}>
                      <option value="minute">minutes</option>
                      <option value="hour">hours</option>
                      <option value="day">days</option>
                      <option value="week">weeks</option>
                      <option value="month">months</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="select-medium-amount">Medium</label>
                  </td>
                  <td>
                    <input onChange={this._onSettingsChanged} id="select-medium-amount" type="number" value={this.state.thresholds.medium.amount} name="thresholds[medium][amount]" />
                    <select onChange={this._onSettingsChanged} name="thresholds[medium][unit]" defaultValue={this.state.thresholds.medium.unit}>
                      <option value="minute">minutes</option>
                      <option value="hour">hours</option>
                      <option value="day">days</option>
                      <option value="week">weeks</option>
                      <option value="month">months</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="select-high-amount">High</label>
                  </td>
                  <td>
                    <input onChange={this._onSettingsChanged} id="select-high-amount" type="number" value={this.state.thresholds.high.amount} name="thresholds[high][amount]" />
                    <select onChange={this._onSettingsChanged} name="thresholds[high][unit]" defaultValue={this.state.thresholds.high.unit}>
                      <option value="minute">minutes</option>
                      <option value="hour">hours</option>
                      <option value="day">days</option>
                      <option value="week">weeks</option>
                      <option value="month">months</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </section>
      </div>
    );
  }
}
