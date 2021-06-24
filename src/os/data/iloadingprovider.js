goog.module('os.data.ILoadingProvider');
goog.module.declareLegacyNamespace();

const IDataProvider = goog.requireType('os.data.IDataProvider');


/**
 * Data provider with a loading state.
 *
 * @interface
 * @extends {IDataProvider}
 */
class ILoadingProvider {
  /**
   * If the provider is currently in a loading state.
   * @return {boolean}
   */
  isLoading() {}

  /**
   * Set if the provider is in a loading state.
   * @param {boolean} value
   */
  setLoading(value) {}
}


/**
 * ID for {@see os.implements}
 * @const {string}
 */
ILoadingProvider.ID = 'os.data.ILoadingProvider';


exports = ILoadingProvider;
