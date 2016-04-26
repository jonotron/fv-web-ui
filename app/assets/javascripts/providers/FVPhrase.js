// Middleware
import thunk from 'redux-thunk';

// Operations
import DirectoryOperations from 'operations/DirectoryOperations';
import DocumentOperations from 'operations/DocumentOperations';

const DISMISS_ERROR = 'DISMISS_ERROR';

/**
* Multiple Phrase Actions
*/
const FV_PHRASES_FETCH_START = "FV_PHRASES_FETCH_START";
const FV_PHRASES_FETCH_SUCCESS = "FV_PHRASES_FETCH_SUCCESS";
const FV_PHRASES_FETCH_ERROR = "FV_PHRASES_FETCH_ERROR";

const FV_PHRASES_UPDATE_START = "FV_PHRASES_UPDATE_START";
const FV_PHRASES_UPDATE_SUCCESS = "FV_PHRASES_UPDATE_SUCCESS";
const FV_PHRASES_UPDATE_ERROR = "FV_PHRASES_UPDATE_ERROR";

const FV_PHRASES_CREATE_START = "FV_PHRASES_CREATE_START";
const FV_PHRASES_CREATE_SUCCESS = "FV_PHRASES_CREATE_SUCCESS";
const FV_PHRASES_CREATE_ERROR = "FV_PHRASES_CREATE_ERROR";

const FV_PHRASES_DELETE_START = "FV_PHRASES_DELETE_START";
const FV_PHRASES_DELETE_SUCCESS = "FV_PHRASES_DELETE_SUCCESS";
const FV_PHRASES_DELETE_ERROR = "FV_PHRASES_DELETE_ERROR";

const FV_PHRASES_SHARED_FETCH_START = "FV_PHRASES_SHARED_FETCH_START";
const FV_PHRASES_SHARED_FETCH_SUCCESS = "FV_PHRASES_SHARED_FETCH_SUCCESS";
const FV_PHRASES_SHARED_FETCH_ERROR = "FV_PHRASES_SHARED_FETCH_ERROR";

/**
* Single Phrase Actions
*/
const FV_PHRASE_FETCH_START = "FV_PHRASE_FETCH_START";
const FV_PHRASE_FETCH_SUCCESS = "FV_PHRASE_FETCH_SUCCESS";
const FV_PHRASE_FETCH_ERROR = "FV_PHRASE_FETCH_ERROR";

const FV_PHRASE_FETCH_ALL_START = "FV_PHRASE_FETCH_ALL_START";
const FV_PHRASE_FETCH_ALL_SUCCESS = "FV_PHRASE_FETCH_ALL_SUCCESS";
const FV_PHRASE_FETCH_ALL_ERROR = "FV_PHRASE_FETCH_ALL_ERROR";

const FV_PHRASE_UPDATE_START = "FV_PHRASE_UPDATE_START";
const FV_PHRASE_UPDATE_SUCCESS = "FV_PHRASE_UPDATE_SUCCESS";
const FV_PHRASE_UPDATE_ERROR = "FV_PHRASE_UPDATE_ERROR";

const FV_PHRASE_CREATE_START = "FV_PHRASE_CREATE_START";
const FV_PHRASE_CREATE_SUCCESS = "FV_PHRASE_CREATE_SUCCESS";
const FV_PHRASE_CREATE_ERROR = "FV_PHRASE_CREATE_ERROR";

const FV_PHRASE_DELETE_START = "FV_PHRASE_DELETE_START";
const FV_PHRASE_DELETE_SUCCESS = "FV_PHRASE_DELETE_SUCCESS";
const FV_PHRASE_DELETE_ERROR = "FV_PHRASE_DELETE_ERROR";

const createPhrase = function createPhrase(parentDoc, docParams) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASE_CREATE_START, document: docParams } );

    return DocumentOperations.createDocument(parentDoc, docParams)
      .then((response) => {
        dispatch( { type: FV_PHRASE_CREATE_SUCCESS, document: response} );
      }).catch((error) => {
          dispatch( { type: FV_PHRASE_CREATE_ERROR, error: error } )
    });
  }
};

const updatePhrase = function updatePhrase(newDoc, field) {
  return function (dispatch) {

    let phrases = {};
    phrases[newDoc.id] = {};

    dispatch( { type: FV_PHRASE_UPDATE_START, phrases: phrases, pathOrId: newDoc.id } );

    return DocumentOperations.updateDocument(newDoc)
      .then((response) => {

        phrases[newDoc.id] = { response: response };

        dispatch( { type: FV_PHRASE_UPDATE_SUCCESS, phrases: phrases, pathOrId: newDoc.id} );
      }).catch((error) => {

          phrases[newDoc.id] = { error: error };

          dispatch( { type: FV_PHRASE_UPDATE_ERROR, phrases: phrases, pathOrId: newDoc.id } )
    });
  }
};

const fetchSharedPhrases = function fetchSharedPhrases(page_provider, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASES_SHARED_FETCH_START } );

    return DirectoryOperations.getDocumentsViaPageProvider(page_provider, 'FVPhrase', headers, params)
    .then((response) => {
      dispatch( { type: FV_PHRASES_SHARED_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASES_SHARED_FETCH_ERROR, error: error } )
    });
  }
};

const fetchPhrasesAll = function fetchPhrasesAll(path, type) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASE_FETCH_ALL_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVPhrase', '', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {
      dispatch( { type: FV_PHRASE_FETCH_ALL_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASE_FETCH_ALL_ERROR, error: error } )
    });
  }
};

const fetchPhrasesInPath = function fetchPhrasesInPath(path, queryAppend, headers = {}, params = {}) {
  return function (dispatch) {

    dispatch( { type: FV_PHRASES_FETCH_START } );

    return DirectoryOperations.getDocumentByPath2(path, 'FVPhrase', queryAppend, headers, params)
    .then((response) => {
      dispatch( { type: FV_PHRASES_FETCH_SUCCESS, documents: response } )
    }).catch((error) => {
        dispatch( { type: FV_PHRASES_FETCH_ERROR, error: error } )
    });
  }
};

const fetchPhrase = function fetchPhrase(pathOrId) {
  return function (dispatch) {

    let phrases = {};
    phrases[pathOrId] = {};

    dispatch( { type: FV_PHRASE_FETCH_START, phrases: phrases, pathOrId: pathOrId } );

    return DocumentOperations.getDocument(pathOrId, 'FVPhrase', { headers: { 'X-NXenrichers.document': 'ancestry' } })
    .then((response) => {

      phrases[pathOrId] = { response: response };

      dispatch( { type: FV_PHRASE_FETCH_SUCCESS, phrases: phrases, pathOrId: pathOrId } )
    }).catch((error) => {

        phrases[pathOrId] = { error: error };

        dispatch( { type: FV_PHRASE_FETCH_ERROR, phrases: phrases, pathOrId: pathOrId } )
    });
  }
};

const actions = { fetchSharedPhrases, fetchPhrasesInPath, fetchPhrase, createPhrase, fetchPhrasesAll, updatePhrase };

const reducers = {
  computeSharedPhrases(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_PHRASES_SHARED_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_SHARED_FETCH_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computePhrasesInPath(state = { isFetching: false, response: { get: function() { return ''; } }, success: false }, action) {
    switch (action.type) {
      case FV_PHRASES_FETCH_START:
        return Object.assign({}, state, { isFetching: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_FETCH_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASES_FETCH_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computePhrase(state = { phrases: {} }, action) {
    switch (action.type) {
      case FV_PHRASE_FETCH_START:
      case FV_PHRASE_UPDATE_START:

        action.phrases[action.pathOrId].isFetching = true;
        action.phrases[action.pathOrId].success = false;

        return Object.assign({}, state, { phrases: Object.assign(state.phrases, action.phrases) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASE_FETCH_SUCCESS:
      case FV_PHRASE_UPDATE_SUCCESS:
        
        action.phrases[action.pathOrId].isFetching = false;
        action.phrases[action.pathOrId].success = true;

        return Object.assign({}, state, { phrases: Object.assign(state.phrases, action.phrases) });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASE_FETCH_ERROR:
      case FV_PHRASE_UPDATE_ERROR:

        action.phrases[action.pathOrId].isFetching = false;
        action.phrases[action.pathOrId].success = false;
        action.phrases[action.pathOrId].isError = true;
        action.phrases[action.pathOrId].error = action.error;

        return Object.assign({}, state, { phrases: Object.assign(state.phrases, action.phrases) });
      break;

      default: 
        return Object.assign({}, state);
      break;
    }
  },  
  computeCreatePhrase(state = { isFetching: false, response: {get: function() { return ''; }}, success: false, pathOrId: null }, action) {
    switch (action.type) {
      case FV_PHRASE_CREATE_START:
        return Object.assign({}, state, { isFetching: true, success: false, pathOrId: action.pathOrId });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASE_CREATE_SUCCESS:
        return Object.assign({}, state, { response: action.document, isFetching: false, success: true, pathOrId: action.pathOrId });
      break;

      // Send modified document to UI without access REST end-point
      case FV_PHRASE_CREATE_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, pathOrId: action.pathOrId });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  },
  computePhrasesAll(state = { isFetching: false, response: {get: function() { return ''; }}, success: false }, action) {
    switch (action.type) {
      case FV_PHRASE_FETCH_ALL_START:
        return Object.assign({}, state, { isFetching: true, success: false });
      break;

      case FV_PHRASE_FETCH_ALL_SUCCESS:
        return Object.assign({}, state, { response: action.documents, isFetching: false, success: true });
      break;

      case FV_PHRASE_FETCH_ALL_ERROR:
      case DISMISS_ERROR:
        return Object.assign({}, state, { isFetching: false, isError: true, error: action.error, errorDismissed: (action.type === DISMISS_ERROR) ? true: false });
      break;

      default: 
        return Object.assign({}, state, { isFetching: false });
      break;
    }
  }
};

const middleware = [thunk];

export default { actions, reducers, middleware };