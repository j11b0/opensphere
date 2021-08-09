goog.module('os.ui.filter.BasicFilterBuilderUI');
goog.module.declareLegacyNamespace();

goog.require('os.ui.filter.BasicFilterTreeUI');

const Delay = goog.require('goog.async.Delay');
const {ROOT} = goog.require('os');
const Module = goog.require('os.ui.Module');
const ExpressionNode = goog.require('os.ui.filter.ui.ExpressionNode');
const SlickGridEvent = goog.require('os.ui.slick.SlickGridEvent');

const GroupNode = goog.requireType('os.ui.filter.ui.GroupNode');


/**
 * The filter builder directive
 *
 * @return {angular.Directive}
 */
const directive = () => ({
  restrict: 'AE',
  replace: true,
  scope: {
    'root': '=',
    'columns': '=',
    'isComplex': '='
  },
  templateUrl: ROOT + 'views/filter/basicfilterbuilder.html',
  controller: Controller,
  controllerAs: 'basicCtrl'
});

/**
 * The element tag for the directive.
 * @type {string}
 */
const directiveTag = 'basicfilterbuilder';

/**
 * Add the directive to the module
 */
Module.directive(directiveTag, [directive]);

/**
 * Controller for the filter builder
 * @unrestricted
 */
class Controller {
  /**
   * Constructor.
   * @param {!angular.Scope} $scope
   * @ngInject
   */
  constructor($scope) {
    /**
     * @type {?angular.Scope}
     * @private
     */
    this.scope_ = $scope;

    /**
     * @type {Delay}
     * @private
     */
    this.scrollDelay_ = new Delay(this.onScrollDelay_, 50, this);

    /**
     * @type {GroupNode}
     * @private
     */
    this.root_ = /** @type {GroupNode} */ ($scope['root']);

    if (!this.root_.getChildren()) {
      this.add();
    }

    $scope.$on('$destroy', this.onDestroy_.bind(this));
  }

  /**
   * Cleanup
   *
   * @private
   */
  onDestroy_() {
    this.scope_ = null;

    var nodes = this.root_.getChildren().slice();
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node instanceof ExpressionNode) {
        var expr = node.getExpression();
        if (!expr.validate(expr['literal'])) {
          var parent = node.getParent();
          parent.removeChild(node);
        }
      }
    }
  }

  /**
   * Adds an expression
   *
   * @param {Node=} opt_node
   * @export
   */
  add(opt_node) {
    var child = ExpressionNode.createExpressionNode(opt_node || null, this.scope_['columns']);
    this.root_.addChild(child);
    this.scrollDelay_.start();
  }

  /**
   * Scrolls to the last node
   *
   * @private
   */
  onScrollDelay_() {
    var children = this.root_.getChildren();

    if (children) {
      var item = children[children.length - 1];
      this.scope_.$broadcast(SlickGridEvent.SCROLL_TO, item);
    }
  }
}

exports = {
  Controller,
  directive,
  directiveTag
};
