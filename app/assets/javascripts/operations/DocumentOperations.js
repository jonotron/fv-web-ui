/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import _ from 'underscore';

import StringHelpers from 'common/StringHelpers';
import BaseOperations from 'operations/BaseOperations';

/**
* Initialize Nuxeo client
*/
export default class DocumentOperations extends BaseOperations {

  /**
  * Get a single document of a certain type based on a path and title match
  * This document may or may not contain children 
  */
  static getDocument(pathOrUid = "", type, headers = {}, params = {}) {

    let properties = this.properties;

    return new Promise(
      function(resolve, reject) {
        properties.client
        .repository()
        .fetch(pathOrUid, headers)
        .then((doc) => {
          //resolve(normalize(response.entries[0], getSchemaForType(type))); // Normalize not nessary since return value is a Nuxeo.Document object.
          resolve(doc);
        }).catch((error) => { reject('Could not access server.'); });
    });
  }


  /**
  * Update a document 
  */
  static updateDocument(doc) {

    let properties = this.properties;

    return new Promise(
      function(resolve, reject) {
        doc.save()
          .then((newDoc) => {
            if (newDoc) {
              // resolve(normalize(response.entries[0], getSchemaForType(type)));
              resolve(newDoc);
            } else {
              reject('No ' + type +' found');
            }
        }).catch((error) => { reject('Could not update document.'); } );
    });
  }

  /**
  * Get a single document by ID
  */
  getDocumentByID(id, headers = null, params = null) {
    // Expose fields to promise
    let client = this.client;
    let selectDefault = this.selectDefault;

    id = StringHelpers.clean(id);

    // Initialize an empty document from type
    let documentType = this.documentType;

    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          let defaultParams = {
            query: 
              "SELECT * FROM " + documentType.prototype.entityTypeName + " WHERE (ecm:uuid='" + id + "' AND  " + selectDefault + ")"
          };

          let defaultHeaders = {};

          params = Object.assign(defaultParams, params);
          headers = Object.assign(defaultHeaders, headers);

          client.operation('Document.Query')
            .params(params)
            .execute(headers).then((response) => {      
              if (response.entries.length > 0) {
                resolve(new documentType(response.entries[0]));
              } else {
                reject('No ' + documentType.prototype.entityTypeName +' found');
              }
          }).catch((error) => { throw error });
    });
  }

  /**
  * Get a related media by document
  */
  getMediaByDocument(document, headers = null, params = null) {
    // Expose fields to promise
    let client = this.client;
    let selectDefault = this.selectDefault;

    return new Promise(
        // The resolver function is called with the ability to resolve or
        // reject the promise
        function(resolve, reject) {

          var related_media = document.get("fv:related_audio").concat(document.get("fv:related_pictures"), document.get("fv:related_video"));
          related_media = _.map(_.compact(related_media), function(value){ return "'" + value + "'"; }).join();

          let defaultParams = {
            query: 
              "SELECT * FROM Document WHERE (ecm:uuid IN (" + related_media + ") AND (ecm:primaryType = 'FVAudio' OR ecm:primaryType = 'FVVideo' OR ecm:primaryType = 'FVPicture') AND  " + selectDefault + ")"
          };

          let defaultHeaders = {};

          params = Object.assign(defaultParams, params);
          headers = Object.assign(defaultHeaders, headers);

          client.operation('Document.Query')
            .params(params)
            .execute(headers).then((response) => {           
              if (response.entries.length > 0) {
                resolve(response.entries);
              } else {
                reject('No media found');
              }
          }).catch((error) => { throw error });
    });
  }

  /**
  * TODO: Change to more official method if exists?
  * Get Blob, Or https://github.com/dcodeIO/protobuf.js/wiki/How-to-read-binary-data-in-the-browser-or-under-node.js%3F
  * https://github.com/request/request/issues/1796
  */
  getMediaBlobById(id, mimeType, xpath = 'file:content') {
    // Expose fields to promise
    let client = this.client;

    return new Promise(
      function(resolve, reject) {

        var request = new XMLHttpRequest();

        request.onload = function(e) {
          if (request.readyState == 4) {
              var uInt8Array = new Uint8Array(this.response);
              var i = uInt8Array.length;
              var biStr = new Array(i);
              while (i--) { 
                biStr[i] = String.fromCharCode(uInt8Array[i]);
              }
              var data = biStr.join('');
              var base64 = window.btoa(data);

            var dataUri = 'data:' + mimeType + ';base64,' + base64;
            resolve({dataUri: dataUri, mediaId: id});
          } else {
            reject("Media not found");
          }
        }

        request.open("POST", client._baseURL + "/site/automation/Blob.Get", true);
        request.responseType = "arraybuffer";
        request.setRequestHeader("authorization", "Basic " + window.btoa(unescape(encodeURIComponent(client._auth.username + ":" + client._auth.password))));
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.setRequestHeader("Content-Type", "application/json+nxrequest");
        request.send(JSON.stringify({input: id, params: {xpath: xpath}}));

    });
  }

  getDocumentsByDialect(client, dialect, query = null, headers = null, params = null) {

    // Initialize and empty document list from type
    let documentList = new this.documentTypePlural(null);

    return new Promise(
        function(resolve, reject) {

          let defaultParams = {
            query: 
              "  SELECT * FROM " + documentList.model.prototype.entityTypeName + 
              "  WHERE (fva:dialect = '" + dialect.get('id') + 
              "' AND ecm:currentLifeCycleState <> 'deleted')" + 
                 ((query) ? (" AND " + query) : "" ) + 
              "  ORDER BY dc:title"
          };

          let defaultHeaders = {
            'X-NXenrichers.document': 'parentDoc'
          };

          params = Object.assign(defaultParams, params);
          headers = Object.assign(defaultHeaders, headers);

          client.operation('Document.Query')
            .params(params)
            .execute(headers).then((response) => {
              documentList.add(response.entries);
              resolve(documentList.toJSON());
          }).catch((error) => { throw error });
    });
  }
  
  /**
   * 
   * 
   */
   static getDialectStats(dialect, headers = {}, params = {}) {

     let properties = this.properties;

     return new Promise(
       function(resolve, reject) {
    	   properties.client
    	   .operation('FVGenerateJsonStatistics')
    	   .params({
    	     dialectId: '',
    	   })
    	   .execute(headers)
    	   .then(function(stats) {
    		   resolve(stats);
    	   })
    	   .catch((error) => { reject(error); });
     });
   } 
}