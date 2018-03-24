/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import COMPONENT_IMAGE from './elasticsearch.png';

import { Component, DataSource, RectPath, Shape, error } from '@hatiolab/things-scene'
import elasticsearch from 'elasticsearch-browser';

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'string',
    label: 'host',
    name: 'host'
  }, {
    type: 'number',
    label: 'port',
    name: 'port',
    placeholder: '9200'
  }, {
    type: 'string',
    label: 'httpAuth',
    name: 'httpAuth'
  }, {
    type: 'string',
    label: 'index',
    name: 'index'
  }, {
    type: 'string',
    label: 'types',
    name: 'types'
  }, {
    type: 'string',
    label: 'query-string',
    name: 'queryString'
  }, {
    type: 'textarea',
    label: 'query-object',
    name: 'queryObject'
  }, {
    type: 'select',
    label: 'log',
    name: 'log',
    property: {
      options: [{
        display: 'trace',
        value: 'trace'
      }, {
        display: 'error',
        value: 'error'
      }, {
        display: 'warn',
        value: 'warn'
      }]
    }
  }, {
    type: 'number',
    label: 'period',
    name: 'period',
    placeholder: 'seconds'
  }]
}

export default class Elasticsearch extends DataSource(RectPath(Shape)) {

  static get image() {
    if (!Elasticsearch._image) {
      Elasticsearch._image = new Image();
      Elasticsearch._image.src = COMPONENT_IMAGE;
    }

    return Elasticsearch._image;
  }

  ready() {
    super.ready();

    if (!this.app.isViewMode)
      return;

    this._initElasticsearchConnection();
  }

  _initElasticsearchConnection() {

    delete this._client;

    var {
      host,
      port = 9200,
      log = 'trace',
      index,
      types,
      queryString,
      queryObject,
      httpAuth
    } = this.model;

    if (!host) {
      console.warn('host not defined');
      return;
    }

    this._client = new elasticsearch.Client({
      host: `${host}:${port}`,
      httpAuth,
      log
    });

    var query = {};
    if (queryString) {
      query.q = queryString;
    } else if (queryObject) {
      try {
        let obj;
        eval('obj=' + queryObject);
        if (obj && typeof (obj) == 'object') {
          query.body = obj;
        } else {
          error('query object is not an object', obj, queryObject);
          return;
        }
      } catch (e) {
        error(e);
        return;
      }
    } else {
      return;
    }

    if (index) {
      query.index = index;
    }

    if (types) {
      query.types = types;
    }

    this._interval = setInterval(() => {

      this._client.search(query, (e, response, code) => {
        if (e) {
          error(e, response, code);
        } else {
          this.setState('data', response.hits);
        }
      });
    }, this.period);
  }

  dispose() {
    if (this._interval)
      clearInterval(this._interval);

    delete this._client;

    super.dispose()
  }

  _draw(context) {

    /*
     * TODO role이 publisher 인지 subscriber 인지에 따라서 구분할 수 있는 표시를 추가할 것.
     */

    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    context.beginPath();
    context.drawImage(Elasticsearch.image, left, top, width, height);
  }

  get period() {
    return (this.state.period || 10) * 1000;
  }

  get nature() {
    return NATURE;
  }

}

Component.register('elasticsearch', Elasticsearch);
