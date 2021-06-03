goog.module('os.command.NonQueryClear');
goog.module.declareLegacyNamespace();

const State = goog.require('os.command.State');
const areaManager = goog.require('os.query.AreaManager');

const ICommand = goog.requireType('os.command.ICommand');


/**
 * Command for clearing spatial queries on the map.
 *
 * @implements {ICommand}
 */
class NonQueryClear {
  /**
   * Constructor.
   */
  constructor() {
    /**
     * @inheritDoc
     */
    this.isAsync = false;

    /**
     * @inheritDoc
     */
    this.title = 'Clear Non-query Features';

    /**
     * @inheritDoc
     */
    this.details = null;

    /**
     * @inheritDoc
     */
    this.state = State.READY;

    /**
     * @type {!Array<!ol.Feature>}
     * @private
     */
    this.features_ = [];
  }

  /**
   * @inheritDoc
   */
  execute() {
    this.state = State.EXECUTING;

    var features = os.MapContainer.getInstance().getFeatures();
    var featuresToRemove = [];
    var am = areaManager.getInstance();

    if (features.length > 0) {
      for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        if (!am.get(feature)) {
          featuresToRemove.push(feature);
        }
      }
    }

    os.MapContainer.getInstance().removeFeatures(featuresToRemove);
    this.features_ = featuresToRemove;

    this.state = State.SUCCESS;
    return true;
  }

  /**
   * @inheritDoc
   */
  revert() {
    this.state = State.REVERTING;
    os.MapContainer.getInstance().addFeatures(this.features_);
    this.features_.length = 0;
    this.state = State.READY;
    return true;
  }
}

exports = NonQueryClear;
