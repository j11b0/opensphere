goog.declareModuleId('os.ol.events.condition');

import MapBrowserEventType from 'ol/src/MapBrowserEventType';

// const MapBrowserEvent = goog.requireTyped('ol.MapBrowserEvent');


/**
 * If a map browser event is for a right click.
 *
 * @param {MapBrowserEvent} mapBrowserEvent The map browser event
 * @return {boolean} If the event represents a right click
 */
export const rightClick = function(mapBrowserEvent) {
  return !!mapBrowserEvent && (mapBrowserEvent.type === MapBrowserEventType.POINTERUP ||
      mapBrowserEvent.type === MapBrowserEventType.POINTERDOWN) &&
      !!mapBrowserEvent.pointerEvent && mapBrowserEvent.pointerEvent.button === 2;
};
