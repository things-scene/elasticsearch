/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import COMPONENT_IMAGE from './elasticsearch.png';

import { Component, DataSource, RectPath, Shape } from '@hatiolab/things-scene'
import elasticsearch from 'elasticsearch';

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
    type: 'select',
    label: 'role',
    name: 'role',
    property: {
      options: [{
        display: 'Subscriber',
        value: 'subscriber'
      }, {
        display: 'Publisher',
        value: 'publisher'
      }]
    }
  }, {
    type: 'select',
    label: 'data-format',
    name: 'dataFormat',
    property: {
      options: [{
        display: 'Plain Text',
        value: 'text'
      }, {
        display: 'JSON',
        value: 'json'
      }]
    }
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

    try {
      this._client && this._client.end(true, () => { });
    } catch (e) {
      console.error(e)
    }
    delete this._client;

    var {
      host,
      port = 9200,
      log = 'trace',
      query
    } = this.model;

    if (!host) {
      console.warn('host not defined');
      return;
    }

    var client = new elasticsearch.Client({
      host: `${host}:${port}`,
      log
    });

    this._client = client;
  }

  dispose() {
    try {
      this._client && this._client.end(true, () => { });
    } catch (e) {
      console.error(e)
    }
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

  onchangeData(data, before) {
    super.onchangeData(data, before);

    // const {
    //   topic,
    //   role = 'subscriber'
    // } = this.model;

    // if (!this._client || !this._client.connected) {
    //   return;
    // }

    // if (role == 'subscriber') {
    //   return;
    // }

    // this._client.publish(topic, JSON.stringify(data.data), { qos: 0, retain: false })
  }

  get nature() {
    return NATURE;
  }

}

Component.register('elasticsearch', Elasticsearch);
