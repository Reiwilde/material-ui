import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import TimeDisplay from './TimeDisplay';
import ClockHours from './ClockHours';
import ClockMinutes from './ClockMinutes';

class Clock extends Component {
  static propTypes = {
    format: PropTypes.oneOf(['ampm', '24hr']),
    initialTime: PropTypes.object,
    minutesStep: PropTypes.number,
    onChangeHours: PropTypes.func,
    onChangeMinutes: PropTypes.func,
    timeZone: PropTypes.string,
  };

  static defaultProps = {
    initialTime: new Date(),
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    selectedTime: null,
    mode: 'hour',
  };

  componentWillMount() {
    const selectedTime = this.props.initialTime || new Date();
    const minutes = selectedTime.getMinutes();
    selectedTime.setMinutes(minutes - (minutes % this.props.minutesStep));

    this.setState({
      selectedTime,
    });
  }

  setMode = (mode) => {
    setTimeout(() => {
      this.setState({
        mode: mode,
      });
    }, 100);
  };

  handleSelectAffix = (affix) => {
    if (affix === this.getAffix()) return;

    const hours = this.state.selectedTime.getHours();

    if (affix === 'am') {
      this.handleChangeHours(hours - 12, affix);
      return;
    }

    this.handleChangeHours(hours + 12, affix);
  };

  getAffix() {
    if (this.props.format !== 'ampm') return '';

    const hours = this.state.selectedTime.getHours();
    if (hours < 12) {
      return 'am';
    }

    return 'pm';
  }

  handleChangeHours = (hours, finished) => {
    const time = new Date(this.state.selectedTime);
    const tzOffset = moment.tz(time, this.props.timeZone).utcOffset() / 60 * -1;

    let affix;

    if ( typeof finished === 'string' ) {
      affix = finished;
      finished = undefined;
    }
    if (!affix) {
      affix = this.getAffix();
    }
    if (affix === 'pm' && hours < 12) {
      hours += 12;
    }

    time.setUTCHours(hours + tzOffset);
    this.setState({
      selectedTime: time,
    });

    if (finished) {
      setTimeout(() => {
        this.setState({
          mode: 'minute',
        });

        const {onChangeHours} = this.props;
        if (onChangeHours) {
          onChangeHours(time);
        }
      }, 100);
    }
  };

  handleChangeMinutes = (minutes, finished) => {
    const time = new Date(this.state.selectedTime);
    time.setUTCMinutes(minutes);
    this.setState({
      selectedTime: time,
    });

    const {onChangeMinutes} = this.props;
    if (onChangeMinutes && finished) {
      setTimeout(() => {
        onChangeMinutes(time);
      }, 0);
    }
  };

  getSelectedTime() {
    return this.state.selectedTime;
  }

  render() {
    let clock = null;

    const {
      prepareStyles,
      timePicker,
    } = this.context.muiTheme;

    const styles = {
      root: {
        userSelect: 'none',
      },
      container: {
        height: 280,
        padding: 10,
        position: 'relative',
        boxSizing: 'content-box',
      },
      circle: {
        position: 'absolute',
        top: 20,
        width: 260,
        height: 260,
        borderRadius: '100%',
        backgroundColor: timePicker.clockCircleColor,
      },
    };

    const dateParts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      minute: 'numeric',
      timeZone: this.props.timeZone,
    }).formatToParts(this.state.selectedTime);

    if (this.state.mode === 'hour') {
      clock = (
        <ClockHours
          key="hours"
          format={this.props.format}
          onChange={this.handleChangeHours}
          initialHours={Number.parseInt(dateParts[0].value, 10)}
        />
      );
    } else {
      clock = (
        <ClockMinutes
          key="minutes"
          onChange={this.handleChangeMinutes}
          initialMinutes={Number.parseInt(dateParts[2].value, 10)}
          step={this.props.minutesStep}
        />
      );
    }

    return (
      <div style={prepareStyles(styles.root)}>
        <TimeDisplay
          selectedTime={this.state.selectedTime}
          mode={this.state.mode}
          format={this.props.format}
          affix={this.getAffix()}
          onSelectAffix={this.handleSelectAffix}
          onSelectHour={this.setMode.bind(this, 'hour')}
          onSelectMin={this.setMode.bind(this, 'minute')}
          timeZone={this.props.timeZone}
        />
        <div style={prepareStyles(styles.container)} >
          <div style={prepareStyles(styles.circle)} />
          {clock}
        </div>
      </div>
    );
  }
}

export default Clock;
