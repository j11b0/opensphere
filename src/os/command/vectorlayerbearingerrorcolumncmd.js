goog.module('os.command.VectorLayerBearingErrorColumn');
goog.module.declareLegacyNamespace();

const AbstractVectorLayerLOB = goog.require('os.command.AbstractVectorLayerLOB');
const metrics = goog.require('os.metrics');


/**
 * Changes the lob bearing error column
 *
 * @extends {AbstractVectorLayerLOB<string>}
 */
class VectorLayerBearingErrorColumn extends AbstractVectorLayerLOB {
  /**
   * Constructor.
   * @param {string} layerId
   * @param {string} value
   * @param {string=} opt_oldValue
   */
  constructor(layerId, value, opt_oldValue) {
    super(layerId, value, opt_oldValue);
    this.title = 'Change bearing error column';
    this.value = value || '';
    this.metricKey = metrics.Layer.VECTOR_LOB_BEARING_ERROR_COLUMN;
  }

  /**
   * @inheritDoc
   */
  getOldValue() {
    var config = os.style.StyleManager.getInstance().getLayerConfig(this.layerId);
    return config && config[os.style.StyleField.LOB_BEARING_ERROR_COLUMN] || '';
  }

  /**
   * @inheritDoc
   */
  applyValue(config, value) {
    config[os.style.StyleField.LOB_BEARING_ERROR_COLUMN] = value;

    super.applyValue(config, value);
  }
}

exports = VectorLayerBearingErrorColumn;
