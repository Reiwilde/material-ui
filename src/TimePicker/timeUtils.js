export function addHours(d, hours) {
  const newDate = clone(d);
  newDate.setHours(d.getHours() + hours);
  return newDate;
}

export function addMinutes(d, minutes) {
  const newDate = clone(d);
  newDate.setMinutes(d.getMinutes() + minutes);
  return newDate;
}

export function addSeconds(d, seconds) {
  const newDate = clone(d);
  newDate.setSeconds(d.getMinutes() + seconds);
  return newDate;
}

function clone(d) {
  return new Date(d.getTime());
}

/**
 * @param date [Date] A Date object.
 * @param timezone [String] A Canonical timezone.
 * @param format [String] One of 'ampm', '24hr', defaults to 'ampm'.
 * @param pedantic [Boolean] Check time-picker/time-picker.jsx file.
 *
 * @return String A string representing the formatted time.
 */
export function formatTime(date, timeZone, format = 'ampm', pedantic = false) {
  if (!date) return '';
  const dateParts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
    timeZone,
  }).formatToParts(date);

  let hours = Number.parseInt(dateParts[0].value, 10);
  let mins = dateParts[2].value;

  if (format === 'ampm') {
    const isAM = hours < 12;
    hours = hours % 12;
    const additional = isAM ? ' am' : ' pm';
    hours = (hours || 12).toString();

    if (mins.length < 2 ) mins = `0${mins}`;

    if (pedantic) {
      // Treat midday/midnight specially http://www.nist.gov/pml/div688/times.cfm
      if (hours === '12' && mins === '00') {
        return additional === ' pm' ? '12 noon' : '12 midnight';
      }
    }

    return hours + (mins === '00' ? '' : `:${mins}`) + additional;
  }

  hours = hours.toString();

  if (hours.length < 2) hours = `0${hours}`;
  if (mins.length < 2) mins = `0${mins}`;

  return `${hours}:${mins}`;
}

export function rad2deg(rad) {
  return rad * 57.29577951308232;
}

export function getTouchEventOffsetValues(event) {
  const el = event.target;
  const boundingRect = el.getBoundingClientRect();

  return {
    offsetX: event.clientX - boundingRect.left,
    offsetY: event.clientY - boundingRect.top,
  };
}

export function isInner(props) {
  if (props.type !== 'hour' ) {
    return false;
  }
  return props.value < 1 || props.value > 12 ;
}
