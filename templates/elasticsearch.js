import icon from './elasticsearch.png';

export default {
  type: 'elasticsearch',
  description: 'elasticsearch',
  group: 'dataSource',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon,
  model: {
    type: 'elasticsearch',
    host: 'localhost',
    port: 9200,
    left: 10,
    top: 10,
    width: 100,
    height: 100
  }
};
