goog.module('plugin.ogc.ui.GeoserverImportForm');
goog.module.declareLegacyNamespace();

const Module = goog.require('os.ui.Module');
const geoserverDirective = goog.require('plugin.ogc.ui.geoserverDirective');
const {ROOT} = goog.require('os');


/**
 * A dialog with information about custom date/time formats, as implemented by Moment.js.
 *
 * @return {angular.Directive}
 */
const directive = () => {
  const original = geoserverDirective();
  original.templateUrl = ROOT + 'views/forms/singleurlform.html';
  return original;
};


/**
 * The element tag for the directive.
 * @type {string}
 */
const directiveTag = 'geoserverform';


/**
 * Add the directive to the os module
 */
Module.directive(directiveTag, [directive]);


exports = {
  directive,
  directiveTag
};
