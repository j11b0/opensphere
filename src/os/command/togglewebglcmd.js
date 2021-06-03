goog.module('os.command.ToggleWebGL');
goog.module.declareLegacyNamespace();

const AbstractAsyncCommand = goog.require('os.command.AbstractAsyncCommand');
const State = goog.require('os.command.State');
const DataManager = goog.require('os.data.DataManager');


/**
 * Command to switch between 2D/3D map modes.
 */
class ToggleWebGL extends AbstractAsyncCommand {
  /**
   * Constructor.
   * @param {boolean} toggle If WebGL should be enabled.
   * @param {boolean=} opt_silent If errors should be ignored.
   */
  constructor(toggle, opt_silent) {
    super();
    this.details = null;
    this.isAsync = true;
    this.state = State.READY;
    this.title = 'Switch to ' + (toggle ? '3D' : '2D') + ' Mode';

    /**
     * If WebGL should be enabled.
     * @type {boolean}
     * @protected
     */
    this.webGLEnabled = toggle;

    /**
     * If errors should be ignored.
     * @type {boolean}
     * @protected
     */
    this.silent = opt_silent != null ? opt_silent : false;
  }

  /**
   * If the application allows switching the map mode.
   *
   * @param {boolean} webGLEnabled If WebGL is being used
   * @return {boolean}
   * @protected
   */
  canSwitch(webGLEnabled) {
    if (!webGLEnabled && !this.silent) {
      // make sure switching to 2D won't destroy the browser
      var totalCount = DataManager.getInstance().getTotalFeatureCount();
      var maxCount = os.ogc.getMaxFeatures(os.MapMode.VIEW_2D);

      if (totalCount > maxCount) {
        return false;
      }
    }

    return true;
  }

  /**
   * @inheritDoc
   */
  execute() {
    this.state = State.EXECUTING;

    var webGLEnabled = this.webGLEnabled;

    if (this.canSwitch(webGLEnabled)) {
      os.MapContainer.getInstance().setWebGLEnabled(webGLEnabled, this.silent);
      return this.finish();
    } else {
      os.MapContainer.launch2DPerformanceDialog().then(() => {
        os.MapContainer.getInstance().setWebGLEnabled(webGLEnabled, this.silent);
        this.finish();
      }, () => {
        this.handleError(this.title + ' cancelled by user.');
      });
    }

    return true;
  }

  /**
   * @inheritDoc
   */
  revert() {
    this.state = State.REVERTING;

    var webGLEnabled = !this.webGLEnabled;

    if (this.canSwitch(webGLEnabled)) {
      os.MapContainer.getInstance().setWebGLEnabled(webGLEnabled, this.silent);
      return super.revert();
    } else {
      os.MapContainer.launch2DPerformanceDialog().then(() => {
        os.MapContainer.getInstance().setWebGLEnabled(webGLEnabled, this.silent);

        this.state = State.READY;
        this.details = null;
        this.dispatchEvent(os.command.EventType.REVERTED);
      }, () => {
        this.handleError(this.title + ' cancelled by user.');
      });
    }

    return true;
  }
}

exports = ToggleWebGL;
