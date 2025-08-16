import SvgElement from '../Element.js';

export default class Polyline extends SvgElement {
  constructor(parent, params) {
    params.points = params.points.map((point) => {
      return point.join(',');
    }).join(' ');
    super(parent, params);
  }

  get name() {
    return 'polyline';
  }
}
