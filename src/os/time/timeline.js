/**
 * Namespace for timeline utilities.
 */
goog.module('os.time.timeline');
goog.module.declareLegacyNamespace();

const time = goog.require('os.time');
const Duration = goog.require('os.time.Duration');

const TimelineController = goog.requireType('os.time.TimelineController');


/**
 * @type {number}
 */
const MIN = 60 * 1000;

/**
 * @type {number}
 */
const HOUR = 60 * MIN;

/**
 * @type {number}
 */
const DAY = 24 * HOUR;

/**
 * @type {number}
 */
const WEEK = 7 * DAY;

/**
 * @type {number}
 */
const MONTH = 30 * DAY;

/**
 * @type {number}
 */
const YEAR = 12 * MONTH;

/**
 * Automatically configures the timeline controller for animation.
 *
 * @param {TimelineController} controller
 * @param {string=} opt_durationHint
 */
const autoConfigureFromTimeRange = function(controller, opt_durationHint) {
  var durationHint = opt_durationHint !== undefined ? opt_durationHint : 'auto';

  var diff = controller.getSmallestAnimateRangeLength();
  if (durationHint == 'auto') {
    if (diff >= 28 * DAY - 30 * MIN) {
      // offset = week, skip = week, tile duration = week, tile only = true
      setTileAnimation(controller, 7 * DAY, Duration.WEEK);
    } else if (diff >= 5 * DAY - 30 * MIN) {
      // offset = day, skip = day, tile duration = day, tile only = true
      setTileAnimation(controller, DAY, Duration.DAY);
    } else {
      setDefaultOffsetForRange(controller, diff);
      controller.setDuration(Duration.DAY);
    }
  } else if (durationHint == Duration.WEEK || durationHint == Duration.MONTH) {
    setTileAnimation(controller, 7 * DAY, Duration.WEEK);
  } else if (durationHint == Duration.DAY) {
    setTileAnimation(controller, DAY, Duration.DAY);
  }

  controller.setCurrent(controller.getLoopStart() + controller.getOffset());
};

/**
 * Set the default offset/skip to use for a time range.
 *
 * @param {TimelineController} controller
 * @param {number} range The timeline range
 */
const setDefaultOffsetForRange = function(controller, range) {
  if (controller) {
    var offset = (range / 24) - ((range / 24) % 1000);
    if (offset == 0) {
      // set the offset to 1/24 of the range
      offset = range / 24;
    }
    var viewsize = controller.getRange().getLength();
    if (offset < viewsize / 24) {
      offset = Math.min(range / 2, viewsize / 24);
    }
    controller.setOffset(offset);
    controller.setSkip(offset / 2);
  }
};

/**
 * @param {TimelineController} controller
 * @param {number} offset
 * @param {string} duration
 */
const setTileAnimation = function(controller, offset, duration) {
  controller.setOffset(offset);
  controller.setSkip(offset);
  controller.setDuration(duration);
};

/**
 * Creates a date string formatted to represent the current time of the timeline controller, using the provided
 * duration. Defaults to 'day' if no duration is provided.
 *
 * @param {TimelineController} controller
 * @param {string=} opt_durationHint
 * @return {string}
 */
const getDateForFrame = function(controller, opt_durationHint) {
  var duration = opt_durationHint !== undefined ? opt_durationHint : Duration.DAY;
  var frameTime = controller.getCurrent();
  var loopEnd = controller.getLoopEnd();
  if (frameTime >= loopEnd) {
    // loopEnd isn't included in the range, so don't meet or exceed it
    frameTime = loopEnd - 1;
  }

  return time.format(new Date(frameTime), duration);
};

exports = {
  MIN,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
  autoConfigureFromTimeRange,
  setDefaultOffsetForRange,
  setTileAnimation,
  getDateForFrame
};
