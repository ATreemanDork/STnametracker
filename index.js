/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ 72
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ 83
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Styles for the Name Tracker extension */

.name-tracker-settings {
    padding: 5px;
}

.name-tracker_block {
    margin-bottom: 10px;
}

.name-tracker_block h4 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: bold;
}

/* Status Display */
.name-tracker-status-block {
    background-color: var(--SmartThemeBlurTintColor);
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 5px;
    padding: 10px;
}

.name-tracker-status {
    font-weight: bold;
    color: var(--SmartThemeBodyColor);
    padding: 5px;
    text-align: center;
}

/* Character List */
.name-tracker-character-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 5px;
    padding: 5px;
    margin-top: 5px;
}

.name-tracker-character {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 5px;
    background-color: var(--SmartThemeBlurTintColor);
}

.name-tracker-character:last-child {
    margin-bottom: 0;
}

/* Active/loaded character styling (characters that are loaded in SillyTavern) */
.name-tracker-character.main-character {
    border-left: 3px solid #4CAF50;
    background-color: rgba(76, 175, 80, 0.05);
}

.character-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.character-name {
    font-weight: bold;
    font-size: 1.1em;
    color: var(--SmartThemeBodyColor);
}

.character-name .fa-user {
    color: #4CAF50;
    margin-right: 5px;
}

.character-name.ignored {
    color: var(--SmartThemeQuoteColor);
    text-decoration: line-through;
}

.character-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.75em;
    font-weight: bold;
    margin-left: 5px;
}

.character-badge.main-char {
    background-color: #4CAF50;
    color: #fff;
}

.character-badge.ignored {
    background-color: #666;
    color: #fff;
}

.character-badge.unresolved {
    background-color: #ff9800;
    color: #000;
}

/* Lorebook entry editor modal */
.lorebook-entry-editor h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--SmartThemeBodyColor);
}

.editor-section {
    margin-bottom: 15px;
}

.editor-section label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: var(--SmartThemeBodyColor);
}

.editor-section small {
    display: block;
    margin-top: 3px;
    color: var(--SmartThemeQuoteColor);
    font-size: 0.85em;
}

.editor-section input,
.editor-section textarea {
    width: 100%;
    box-sizing: border-box;
}

.character-aliases {
    font-size: 0.9em;
    color: var(--SmartThemeQuoteColor);
    margin-bottom: 8px;
    font-style: italic;
}

.lorebook-entry-id {
    display: inline-block;
    margin-left: 10px;
    padding: 2px 6px;
    background: var(--SmartThemeBlurTintColor);
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.85em;
    font-style: normal;
    color: var(--SmartThemeQuoteColor);
}

.character-details {
    font-size: 0.85em;
    color: var(--SmartThemeBodyColor);
    margin: 8px 0;
    padding: 8px;
    background: var(--SmartThemeBlurTintColor);
    border-left: 2px solid var(--SmartThemeBorderColor);
    border-radius: 3px;
    line-height: 1.4;
}

.character-actions {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.character-actions .menu_button {
    flex: 1;
    min-width: 100px;
    padding: 5px 10px;
    font-size: 0.9em;
}

/* Character action buttons */
.char-action-btn {
    background: var(--SmartThemeBlurTintColor);
    border: 1px solid var(--SmartThemeBorderColor);
    color: var(--SmartThemeEmColor);
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.char-action-btn:hover {
    background: var(--SmartThemeQuoteColor);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.char-action-btn:active {
    transform: translateY(0);
}

.char-action-btn i {
    pointer-events: none;
}

/* Red highlight for needs review */
.char-action-btn.needs-review {
    border-color: #dc3545;
    color: #dc3545;
}

.char-action-btn.needs-review:hover {
    background: #dc3545;
    color: #fff;
}

.menu_button.compact {
    padding: 5px 10px;
    font-size: 0.9em;
}

.name-tracker-empty {
    color: var(--SmartThemeQuoteColor);
    font-style: italic;
    text-align: center;
    padding: 20px;
}

/* Ollama Settings */
.ollama-settings {
    background-color: var(--SmartThemeBlurTintColor);
    border-left: 3px solid var(--SmartThemeBorderColor);
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
}

/* Merge Dialog */
.merge-dialog {
    padding: 15px;
}

.merge-dialog p {
    margin-bottom: 10px;
}

.merge-dialog strong {
    color: var(--SmartThemeBodyColor);
    font-weight: bold;
}

.merge-warning {
    color: #ff9800;
    font-size: 0.9em;
    margin-top: 10px;
    padding: 10px;
    background-color: rgba(255, 152, 0, 0.1);
    border-left: 3px solid #ff9800;
    border-radius: 3px;
}

/* Button states */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Flex utilities */
.flexGap5 {
    gap: 5px;
}

.flex1 {
    flex: 1;
}

/* Progress indicator */
.name-tracker-progress {
    margin: 10px 0;
    padding: 10px;
    background-color: var(--SmartThemeBlurTintColor);
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 5px;
    text-align: center;
}

.name-tracker-progress .progress-text {
    margin-bottom: 5px;
    font-weight: bold;
}

.name-tracker-progress .progress-bar {
    width: 100%;
    height: 20px;
    background-color: var(--black50a);
    border-radius: 10px;
    overflow: hidden;
}

.name-tracker-progress .progress-fill {
    height: 100%;
    background-color: var(--SmartThemeQuoteColor);
    transition: width 0.3s ease;
}

/* Character details preview (for potential future use) */
.character-details {
    display: none;
    margin-top: 10px;
    padding: 10px;
    background-color: var(--black30a);
    border-radius: 5px;
    font-size: 0.9em;
}

.character-details.expanded {
    display: block;
}

.character-details-section {
    margin-bottom: 8px;
}

.character-details-section:last-child {
    margin-bottom: 0;
}

.character-details-label {
    font-weight: bold;
    color: var(--SmartThemeQuoteColor);
    margin-right: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .character-actions {
        flex-direction: column;
    }
    
    .character-actions .menu_button {
        width: 100%;
    }
}

/* Animation for new characters */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.name-tracker-character.new {
    animation: fadeIn 0.3s ease;
}

/* System Prompt Editor */
.system-prompt-editor h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--SmartThemeBodyColor);
}

.system-prompt-editor p {
    margin-bottom: 10px;
    color: var(--SmartThemeQuoteColor);
    font-size: 0.9em;
}

#system_prompt_editor {
    background-color: var(--SmartThemeBlurTintColor);
    color: var(--SmartThemeBodyColor);
    border: 1px solid var(--SmartThemeBorderColor);
    border-radius: 3px;
    padding: 10px;
    resize: vertical;
}

#system_prompt_editor:focus {
    outline: none;
    border-color: var(--SmartThemeEmColor);
}

.system-prompt-actions button {
    min-width: 100px;
}

#system_prompt_reset {
    margin-right: auto;
}


`, "",{"version":3,"sources":["webpack://./style.css"],"names":[],"mappings":"AAAA,0CAA0C;;AAE1C;IACI,YAAY;AAChB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA,mBAAmB;AACnB;IACI,gDAAgD;IAChD,8CAA8C;IAC9C,kBAAkB;IAClB,aAAa;AACjB;;AAEA;IACI,iBAAiB;IACjB,iCAAiC;IACjC,YAAY;IACZ,kBAAkB;AACtB;;AAEA,mBAAmB;AACnB;IACI,iBAAiB;IACjB,gBAAgB;IAChB,8CAA8C;IAC9C,kBAAkB;IAClB,YAAY;IACZ,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8CAA8C;IAC9C,kBAAkB;IAClB,gDAAgD;AACpD;;AAEA;IACI,gBAAgB;AACpB;;AAEA,gFAAgF;AAChF;IACI,8BAA8B;IAC9B,yCAAyC;AAC7C;;AAEA;IACI,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;IACnB,kBAAkB;AACtB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,iCAAiC;AACrC;;AAEA;IACI,cAAc;IACd,iBAAiB;AACrB;;AAEA;IACI,kCAAkC;IAClC,6BAA6B;AACjC;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,kBAAkB;IAClB,iBAAiB;IACjB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,yBAAyB;IACzB,WAAW;AACf;;AAEA;IACI,sBAAsB;IACtB,WAAW;AACf;;AAEA;IACI,yBAAyB;IACzB,WAAW;AACf;;AAEA,gCAAgC;AAChC;IACI,aAAa;IACb,mBAAmB;IACnB,iCAAiC;AACrC;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,iBAAiB;IACjB,kBAAkB;IAClB,iCAAiC;AACrC;;AAEA;IACI,cAAc;IACd,eAAe;IACf,kCAAkC;IAClC,iBAAiB;AACrB;;AAEA;;IAEI,WAAW;IACX,sBAAsB;AAC1B;;AAEA;IACI,gBAAgB;IAChB,kCAAkC;IAClC,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,qBAAqB;IACrB,iBAAiB;IACjB,gBAAgB;IAChB,0CAA0C;IAC1C,8CAA8C;IAC9C,kBAAkB;IAClB,sBAAsB;IACtB,iBAAiB;IACjB,kBAAkB;IAClB,kCAAkC;AACtC;;AAEA;IACI,iBAAiB;IACjB,iCAAiC;IACjC,aAAa;IACb,YAAY;IACZ,0CAA0C;IAC1C,mDAAmD;IACnD,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,QAAQ;IACR,eAAe;IACf,eAAe;AACnB;;AAEA;IACI,OAAO;IACP,gBAAgB;IAChB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA,6BAA6B;AAC7B;IACI,0CAA0C;IAC1C,8CAA8C;IAC9C,+BAA+B;IAC/B,iBAAiB;IACjB,kBAAkB;IAClB,eAAe;IACf,yBAAyB;IACzB,eAAe;AACnB;;AAEA;IACI,uCAAuC;IACvC,2BAA2B;IAC3B,wCAAwC;AAC5C;;AAEA;IACI,wBAAwB;AAC5B;;AAEA;IACI,oBAAoB;AACxB;;AAEA,mCAAmC;AACnC;IACI,qBAAqB;IACrB,cAAc;AAClB;;AAEA;IACI,mBAAmB;IACnB,WAAW;AACf;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,kCAAkC;IAClC,kBAAkB;IAClB,kBAAkB;IAClB,aAAa;AACjB;;AAEA,oBAAoB;AACpB;IACI,gDAAgD;IAChD,mDAAmD;IACnD,aAAa;IACb,eAAe;IACf,kBAAkB;AACtB;;AAEA,iBAAiB;AACjB;IACI,aAAa;AACjB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,iCAAiC;IACjC,iBAAiB;AACrB;;AAEA;IACI,cAAc;IACd,gBAAgB;IAChB,gBAAgB;IAChB,aAAa;IACb,wCAAwC;IACxC,8BAA8B;IAC9B,kBAAkB;AACtB;;AAEA,kBAAkB;AAClB;IACI,YAAY;IACZ,mBAAmB;AACvB;;AAEA,mBAAmB;AACnB;IACI,QAAQ;AACZ;;AAEA;IACI,OAAO;AACX;;AAEA,uBAAuB;AACvB;IACI,cAAc;IACd,aAAa;IACb,gDAAgD;IAChD,8CAA8C;IAC9C,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;IAClB,iBAAiB;AACrB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iCAAiC;IACjC,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,6CAA6C;IAC7C,2BAA2B;AAC/B;;AAEA,yDAAyD;AACzD;IACI,aAAa;IACb,gBAAgB;IAChB,aAAa;IACb,iCAAiC;IACjC,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,kCAAkC;IAClC,iBAAiB;AACrB;;AAEA,2BAA2B;AAC3B;IACI;QACI,sBAAsB;IAC1B;;IAEA;QACI,WAAW;IACf;AACJ;;AAEA,iCAAiC;AACjC;IACI;QACI,UAAU;QACV,4BAA4B;IAChC;IACA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI,2BAA2B;AAC/B;;AAEA,yBAAyB;AACzB;IACI,aAAa;IACb,mBAAmB;IACnB,iCAAiC;AACrC;;AAEA;IACI,mBAAmB;IACnB,kCAAkC;IAClC,gBAAgB;AACpB;;AAEA;IACI,gDAAgD;IAChD,iCAAiC;IACjC,8CAA8C;IAC9C,kBAAkB;IAClB,aAAa;IACb,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,sCAAsC;AAC1C;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;AACtB","sourcesContent":["/* Styles for the Name Tracker extension */\r\n\r\n.name-tracker-settings {\r\n    padding: 5px;\r\n}\r\n\r\n.name-tracker_block {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.name-tracker_block h4 {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-weight: bold;\r\n}\r\n\r\n/* Status Display */\r\n.name-tracker-status-block {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    padding: 10px;\r\n}\r\n\r\n.name-tracker-status {\r\n    font-weight: bold;\r\n    color: var(--SmartThemeBodyColor);\r\n    padding: 5px;\r\n    text-align: center;\r\n}\r\n\r\n/* Character List */\r\n.name-tracker-character-list {\r\n    max-height: 400px;\r\n    overflow-y: auto;\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    padding: 5px;\r\n    margin-top: 5px;\r\n}\r\n\r\n.name-tracker-character {\r\n    padding: 10px;\r\n    margin-bottom: 10px;\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n}\r\n\r\n.name-tracker-character:last-child {\r\n    margin-bottom: 0;\r\n}\r\n\r\n/* Active/loaded character styling (characters that are loaded in SillyTavern) */\r\n.name-tracker-character.main-character {\r\n    border-left: 3px solid #4CAF50;\r\n    background-color: rgba(76, 175, 80, 0.05);\r\n}\r\n\r\n.character-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.character-name {\r\n    font-weight: bold;\r\n    font-size: 1.1em;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.character-name .fa-user {\r\n    color: #4CAF50;\r\n    margin-right: 5px;\r\n}\r\n\r\n.character-name.ignored {\r\n    color: var(--SmartThemeQuoteColor);\r\n    text-decoration: line-through;\r\n}\r\n\r\n.character-badge {\r\n    display: inline-block;\r\n    padding: 2px 8px;\r\n    border-radius: 3px;\r\n    font-size: 0.75em;\r\n    font-weight: bold;\r\n    margin-left: 5px;\r\n}\r\n\r\n.character-badge.main-char {\r\n    background-color: #4CAF50;\r\n    color: #fff;\r\n}\r\n\r\n.character-badge.ignored {\r\n    background-color: #666;\r\n    color: #fff;\r\n}\r\n\r\n.character-badge.unresolved {\r\n    background-color: #ff9800;\r\n    color: #000;\r\n}\r\n\r\n/* Lorebook entry editor modal */\r\n.lorebook-entry-editor h3 {\r\n    margin-top: 0;\r\n    margin-bottom: 20px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.editor-section {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.editor-section label {\r\n    display: block;\r\n    font-weight: bold;\r\n    margin-bottom: 5px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.editor-section small {\r\n    display: block;\r\n    margin-top: 3px;\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-size: 0.85em;\r\n}\r\n\r\n.editor-section input,\r\n.editor-section textarea {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.character-aliases {\r\n    font-size: 0.9em;\r\n    color: var(--SmartThemeQuoteColor);\r\n    margin-bottom: 8px;\r\n    font-style: italic;\r\n}\r\n\r\n.lorebook-entry-id {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n    padding: 2px 6px;\r\n    background: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    font-family: monospace;\r\n    font-size: 0.85em;\r\n    font-style: normal;\r\n    color: var(--SmartThemeQuoteColor);\r\n}\r\n\r\n.character-details {\r\n    font-size: 0.85em;\r\n    color: var(--SmartThemeBodyColor);\r\n    margin: 8px 0;\r\n    padding: 8px;\r\n    background: var(--SmartThemeBlurTintColor);\r\n    border-left: 2px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    line-height: 1.4;\r\n}\r\n\r\n.character-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n    flex-wrap: wrap;\r\n    margin-top: 8px;\r\n}\r\n\r\n.character-actions .menu_button {\r\n    flex: 1;\r\n    min-width: 100px;\r\n    padding: 5px 10px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n/* Character action buttons */\r\n.char-action-btn {\r\n    background: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    color: var(--SmartThemeEmColor);\r\n    padding: 6px 10px;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease;\r\n    font-size: 14px;\r\n}\r\n\r\n.char-action-btn:hover {\r\n    background: var(--SmartThemeQuoteColor);\r\n    transform: translateY(-1px);\r\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.char-action-btn:active {\r\n    transform: translateY(0);\r\n}\r\n\r\n.char-action-btn i {\r\n    pointer-events: none;\r\n}\r\n\r\n/* Red highlight for needs review */\r\n.char-action-btn.needs-review {\r\n    border-color: #dc3545;\r\n    color: #dc3545;\r\n}\r\n\r\n.char-action-btn.needs-review:hover {\r\n    background: #dc3545;\r\n    color: #fff;\r\n}\r\n\r\n.menu_button.compact {\r\n    padding: 5px 10px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n.name-tracker-empty {\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-style: italic;\r\n    text-align: center;\r\n    padding: 20px;\r\n}\r\n\r\n/* Ollama Settings */\r\n.ollama-settings {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border-left: 3px solid var(--SmartThemeBorderColor);\r\n    padding: 10px;\r\n    margin-top: 5px;\r\n    border-radius: 5px;\r\n}\r\n\r\n/* Merge Dialog */\r\n.merge-dialog {\r\n    padding: 15px;\r\n}\r\n\r\n.merge-dialog p {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.merge-dialog strong {\r\n    color: var(--SmartThemeBodyColor);\r\n    font-weight: bold;\r\n}\r\n\r\n.merge-warning {\r\n    color: #ff9800;\r\n    font-size: 0.9em;\r\n    margin-top: 10px;\r\n    padding: 10px;\r\n    background-color: rgba(255, 152, 0, 0.1);\r\n    border-left: 3px solid #ff9800;\r\n    border-radius: 3px;\r\n}\r\n\r\n/* Button states */\r\nbutton:disabled {\r\n    opacity: 0.5;\r\n    cursor: not-allowed;\r\n}\r\n\r\n/* Flex utilities */\r\n.flexGap5 {\r\n    gap: 5px;\r\n}\r\n\r\n.flex1 {\r\n    flex: 1;\r\n}\r\n\r\n/* Progress indicator */\r\n.name-tracker-progress {\r\n    margin: 10px 0;\r\n    padding: 10px;\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    text-align: center;\r\n}\r\n\r\n.name-tracker-progress .progress-text {\r\n    margin-bottom: 5px;\r\n    font-weight: bold;\r\n}\r\n\r\n.name-tracker-progress .progress-bar {\r\n    width: 100%;\r\n    height: 20px;\r\n    background-color: var(--black50a);\r\n    border-radius: 10px;\r\n    overflow: hidden;\r\n}\r\n\r\n.name-tracker-progress .progress-fill {\r\n    height: 100%;\r\n    background-color: var(--SmartThemeQuoteColor);\r\n    transition: width 0.3s ease;\r\n}\r\n\r\n/* Character details preview (for potential future use) */\r\n.character-details {\r\n    display: none;\r\n    margin-top: 10px;\r\n    padding: 10px;\r\n    background-color: var(--black30a);\r\n    border-radius: 5px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n.character-details.expanded {\r\n    display: block;\r\n}\r\n\r\n.character-details-section {\r\n    margin-bottom: 8px;\r\n}\r\n\r\n.character-details-section:last-child {\r\n    margin-bottom: 0;\r\n}\r\n\r\n.character-details-label {\r\n    font-weight: bold;\r\n    color: var(--SmartThemeQuoteColor);\r\n    margin-right: 5px;\r\n}\r\n\r\n/* Responsive adjustments */\r\n@media (max-width: 768px) {\r\n    .character-actions {\r\n        flex-direction: column;\r\n    }\r\n    \r\n    .character-actions .menu_button {\r\n        width: 100%;\r\n    }\r\n}\r\n\r\n/* Animation for new characters */\r\n@keyframes fadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-10px);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n.name-tracker-character.new {\r\n    animation: fadeIn 0.3s ease;\r\n}\r\n\r\n/* System Prompt Editor */\r\n.system-prompt-editor h3 {\r\n    margin-top: 0;\r\n    margin-bottom: 10px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.system-prompt-editor p {\r\n    margin-bottom: 10px;\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-size: 0.9em;\r\n}\r\n\r\n#system_prompt_editor {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    color: var(--SmartThemeBodyColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    padding: 10px;\r\n    resize: vertical;\r\n}\r\n\r\n#system_prompt_editor:focus {\r\n    outline: none;\r\n    border-color: var(--SmartThemeEmColor);\r\n}\r\n\r\n.system-prompt-actions button {\r\n    min-width: 100px;\r\n}\r\n\r\n#system_prompt_reset {\r\n    margin-right: auto;\r\n}\r\n\r\n\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 102
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   stContext: () => (/* binding */ sillyTavernContext)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(462);
/**
 * SillyTavern context abstraction layer for Name Tracker extension
 * Provides a thin wrapper around SillyTavern.getContext() with error handling
 */




const logger = _debug_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].createModuleLogger */ .Ay.createModuleLogger('Context');

class SillyTavernContext {
    constructor() {
        this._context = null;
        this._lastUpdate = 0;
        this._updateInterval = 1000; // Cache context for 1 second
    }

    /**
     * Get fresh SillyTavern context
     * @returns {Object} SillyTavern context object
     */
    getContext() {
        const now = Date.now();
        if (!this._context || (now - this._lastUpdate) > this._updateInterval) {
            try {
                this._context = SillyTavern.getContext();
                this._lastUpdate = now;
            } catch (error) {
                logger.error('Failed to get SillyTavern context:', error);
                throw new Error('SillyTavern context not available');
            }
        }
        return this._context;
    }

    /**
     * Get current chat
     * @returns {Array} Current chat messages
     */
    getChat() {
        return this.getContext().chat || [];
    }

    /**
     * Get current chat metadata
     * @returns {Object} Chat metadata object
     */
    getChatMetadata() {
        return this.getContext().chatMetadata || {};
    }

    /**
     * Get current chat ID
     * @returns {string|null} Chat identifier
     */
    getChatId() {
        return this.getContext().chatId || null;
    }

    /**
     * Get current character ID
     * @returns {number|null} Character index
     */
    getCharacterId() {
        return this.getContext().characterId;
    }

    /**
     * Get characters list
     * @returns {Array} Available characters
     */
    getCharacters() {
        return this.getContext().characters || [];
    }

    /**
     * Get user name (name1)
     * @returns {string} User's persona name
     */
    getUserName() {
        return this.getContext().name1 || 'User';
    }

    /**
     * Get extension settings object
     * @returns {Object} Extension settings
     */
    getExtensionSettings() {
        return this.getContext().extensionSettings || {};
    }

    /**
     * Save extension settings
     * @returns {Promise<void>}
     */
    async saveExtensionSettings() {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (context.saveSettingsDebounced) {
                context.saveSettingsDebounced();
            } else {
                logger.warn('saveSettingsDebounced not available');
            }
        }, { silent: true });
    }

    /**
     * Save chat metadata
     * @returns {Promise<void>}
     */
    async saveMetadata() {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            // SillyTavern context provides saveChatMetadata() method
            if (context.saveChatMetadata) {
                await context.saveChatMetadata();
            } else {
                logger.warn('saveChatMetadata not available on SillyTavern context');
            }
        }, { silent: true });
    }

    /**
     * Generate quiet prompt (background LLM call)
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated text
     */
    async generateQuietPrompt(options) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.generateQuietPrompt) {
                throw new Error('generateQuietPrompt not available');
            }
            return await context.generateQuietPrompt(options);
        }, { retries: 1 });
    }

    /**
     * Load world info (lorebook)
     * Direct passthrough to SillyTavern API - no error boundary wrapping
     * to prevent Promise contamination in structuredClone operations
     * @param {string} lorebookName - Name of lorebook
     * @returns {Promise<Object|null>} Lorebook data
     */
    async loadWorldInfo(lorebookName) {
        try {
            const context = this.getContext();
            if (!context.loadWorldInfo) {
                throw new Error('loadWorldInfo not available');
            }
            return await context.loadWorldInfo(lorebookName);
        } catch (error) {
            console.error('[NT-Context] loadWorldInfo error:', error);
            throw error;
        }
    }

    /**
     * Save world info (lorebook)
     * Direct passthrough to SillyTavern API - no error boundary wrapping
     * to prevent Promise contamination in structuredClone operations
     * @param {string} lorebookName - Name of lorebook
     * @param {Object} data - Lorebook data
     * @param {boolean} create - Create if doesn't exist
     * @returns {Promise<void>}
     */
    async saveWorldInfo(lorebookName, data, create = false) {
        try {
            const context = this.getContext();
            if (!context.saveWorldInfo) {
                throw new Error('saveWorldInfo not available');
            }
            return await context.saveWorldInfo(lorebookName, data, create);
        } catch (error) {
            console.error('[NT-Context] saveWorldInfo error:', error);
            throw error;
        }
    }

    /**
     * Save world info entry
     * @param {string} lorebookName - Lorebook name
     * @param {Object} entryData - Entry data
     * @returns {Promise<void>}
     */
    async saveWorldInfoEntry(lorebookName, entryData) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.saveWorldInfoEntry) {
                throw new Error('saveWorldInfoEntry not available');
            }
            return await context.saveWorldInfoEntry(lorebookName, entryData);
        });
    }

    /**
     * Set the chat's selected world info book (makes it active for the chat)
     * @param {string} lorebookName - Name of lorebook to select
     * @returns {Promise<void>}
     */
    async setSelectedWorldInfo(lorebookName) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();

            // First method: Use saveSelectedWorldInfo if available
            if (context.saveSelectedWorldInfo && typeof context.saveSelectedWorldInfo === 'function') {
                await context.saveSelectedWorldInfo(lorebookName);
                return;
            }

            // Second method: Set the world_info directly in chat metadata
            if (!context.chatMetadata) {
                throw new Error('Chat metadata not available');
            }

            context.chatMetadata.world_info = lorebookName;

            // Save the metadata using SillyTavern's saveChatMetadata method
            if (context.saveChatMetadata && typeof context.saveChatMetadata === 'function') {
                await context.saveChatMetadata();
            }

            logger.debug(`Selected world info: ${lorebookName}`);
        }, { silent: true });
    }

    /**
     * Get event source for listening to SillyTavern events
     * @returns {Object} Event source object
     */
    getEventSource() {
        const context = this.getContext();
        return context.eventSource;
    }

    /**
     * Get event types constants
     * @returns {Object} Event types
     */
    getEventTypes() {
        const context = this.getContext();
        return context.event_types;
    }

    /**
     * Call generic popup
     * @param {string} content - HTML content
     * @param {number} type - Popup type
     * @param {string} input - Input placeholder
     * @param {Object} options - Additional options
     * @returns {Promise<any>} Popup result
     */
    async callGenericPopup(content, type, input = '', options = {}) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__/* .errorHandler */ .r_.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.callGenericPopup) {
                throw new Error('callGenericPopup not available');
            }
            return await context.callGenericPopup(content, type, input, options);
        });
    }

    /**
     * Check if SillyTavern context is available
     * @returns {boolean} Context availability
     */
    isContextAvailable() {
        try {
            return !!this.getContext();
        } catch {
            return false;
        }
    }

    /**
     * Clear cached context (force refresh on next access)
     */
    clearCache() {
        this._context = null;
        this._lastUpdate = 0;
        logger.debug('Cleared context cache');
    }

    /**
     * Get context status information for debugging
     * @returns {Object} Context status
     */
    getStatus() {
        return {
            available: this.isContextAvailable(),
            cached: !!this._context,
            lastUpdate: this._lastUpdate,
            chatId: this.getChatId(),
            characterId: this.getCharacterId(),
        };
    }

    /**
     * Dump entire context object to console for debugging
     * Shows all properties and their values in a readable format
     */
    dumpContextToConsole() {
        try {
            const context = this.getContext();

            // Create a formatted dump
            const dump = {
                timestamp: new Date().toISOString(),
                availableProperties: Object.keys(context),
                fullContext: context,
                detailedBreakdown: {},
            };

            // Add detailed breakdown of key properties
            const keyProps = [
                'maxContext', 'maxTokens', 'amount_gen', 'token_limit',
                'extensionSettings', 'settings', 'chat', 'chatMetadata',
                'characters', 'world_info', 'botId', 'characterId', 'chatId',
                'impersonate', 'groups',
            ];

            for (const prop of keyProps) {
                if (prop in context) {
                    dump.detailedBreakdown[prop] = {
                        type: typeof context[prop],
                        value: context[prop],
                        isNull: context[prop] === null,
                        isUndefined: context[prop] === undefined,
                    };
                }
            }

            // Log to console with formatting
            console.group('%c[Name Tracker] COMPLETE CONTEXT DUMP', 'color: #00ff00; font-weight: bold; font-size: 14px;');
            console.log('%cTimestamp:', 'color: #ffaa00; font-weight: bold;', dump.timestamp);
            console.log('%cTotal Properties:', 'color: #ffaa00; font-weight: bold;', dump.availableProperties.length);
            console.log('%cAll Property Names:', 'color: #00aaff; font-weight: bold;', dump.availableProperties.join(', '));
            console.log('%cDetailed Property Breakdown:', 'color: #ff00ff; font-weight: bold;', dump.detailedBreakdown);
            console.log('%cFull Context Object:', 'color: #00ff00; font-weight: bold;', context);
            console.log('%cJSON Dump (for copying):', 'color: #ffff00; font-weight: bold;', JSON.stringify(dump, null, 2));
            console.groupEnd();

            return dump;
        } catch (error) {
            console.error('[Name Tracker] ERROR dumping context:', error);
            throw error;
        }
    }
}

// Create singleton instance
const sillyTavernContext = new SillyTavernContext();


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sillyTavernContext);


/***/ },

/***/ 113
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ 134
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _Z: () => (/* binding */ viewInLorebook),
/* harmony export */   getLorebookStats: () => (/* binding */ getLorebookStats),
/* harmony export */   initializeLorebook: () => (/* binding */ initializeLorebook),
/* harmony export */   updateLorebookEntry: () => (/* binding */ updateLorebookEntry)
/* harmony export */ });
/* unused harmony exports loadCharactersFromLorebook, createLorebookContent, deleteLorebookEntry, purgeLorebookEntries, adoptExistingEntries, getCurrentLorebookName, resetLorebookState */
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(462);
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(548);
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(102);
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(854);
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(695);
/**
 * Lorebook Management Module
 *
 * Handles chat-level lorebook creation, entry formatting, and SillyTavern integration
 * for the Name Tracker extension.
 */

// Early debugging
console.log('[LOREBOOK] Starting module load...');








// Post-import debugging
console.log('[LOREBOOK] Imports completed. Types:');
console.log('[LOREBOOK] createModuleLogger:', typeof _core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* .createModuleLogger */ .Xv);
console.log('[LOREBOOK] withErrorBoundary:', typeof _core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc);
console.log('[LOREBOOK] NameTrackerError:', typeof _core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .NameTrackerError */ .S_);

// Try to create debug logger with explicit error handling
let debug;
try {
    console.log('[LOREBOOK] About to call createModuleLogger...');
    debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* .createModuleLogger */ .Xv)('lorebook');
    console.log('[LOREBOOK] Debug logger created successfully:', debug);
} catch (error) {
    console.error('[LOREBOOK] Failed to create debug logger:', error);
    console.error('[LOREBOOK] Error stack:', error.stack);
    // Create fallback logger
    debug = {
        log: console.log.bind(console, '[LOREBOOK]'),
        error: console.error.bind(console, '[LOREBOOK]'),
        warn: console.warn.bind(console, '[LOREBOOK]'),
        debug: console.debug.bind(console, '[LOREBOOK]'),
    };
}
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__/* .NotificationManager */ .h('Lorebook Management');

// Lorebook state
let lorebookName = null;

/**
 * Initialize or get the lorebook for this chat
 * @returns {Promise<string|null>} Lorebook name if successful, null if no chat
 */
async function initializeLorebook() {
    console.log('[NT-Lorebook] ╔═══════════════════════════════════════════════════════════════════════════');
    console.log('[NT-Lorebook] ║ initializeLorebook() CALLED');
    console.log('[NT-Lorebook] ╚═══════════════════════════════════════════════════════════════════════════');

    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('initializeLorebook', async () => {
        console.log('[NT-Lorebook] ║ Inside withErrorBoundary, getting context...');
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        console.log('[NT-Lorebook] ║ Got context:', !!context);
        console.log('[NT-Lorebook] ║ context.chatId:', context?.chatId);

        if (!context.chatId) {
            console.warn('[NT-Lorebook] ║ ⚠️  NO ACTIVE CHAT - Aborting initialization');
            debug.log('No active chat, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        console.log('[NT-Lorebook] ║ Active chat detected, proceeding...');
        const METADATA_KEY = 'world_info';
        const chatMetadata = context.chatMetadata;
        console.log('[NT-Lorebook] ║ chatMetadata exists?:', !!chatMetadata);

        if (!chatMetadata) {
            console.warn('[NT-Lorebook] ║ ⚠️  NO CHAT METADATA - Aborting initialization');
            debug.log('No chat metadata available, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        console.log('[NT-Lorebook] ║ Checking for existing bound lorebook...');
        console.log('[NT-Lorebook] ║ chatMetadata[world_info]:', chatMetadata[METADATA_KEY]);

        // Check if chat already has a bound lorebook
        if (chatMetadata[METADATA_KEY]) {
            lorebookName = chatMetadata[METADATA_KEY];
            console.log('[NT-Lorebook] ╔═══════════════════════════════════════════════════════════════════════════');
            console.log('[NT-Lorebook] ║ ✅ EXISTING LOREBOOK FOUND');
            console.log('[NT-Lorebook] ╠═══════════════════════════════════════════════════════════════════════════');
            console.log('[NT-Lorebook] ║ Lorebook Name:', lorebookName);
            console.log('[NT-Lorebook] ║ Module Variable Set: YES');
            console.log('[NT-Lorebook] ╚═══════════════════════════════════════════════════════════════════════════');
            debug.log(`Using existing chat lorebook: ${lorebookName}`);

            // Load the lorebook in the editor and make it active (ST API)
            if (typeof context.reloadWorldInfoEditor === 'function') {
                context.reloadWorldInfoEditor(lorebookName, true);
            }
            return lorebookName;
        }

        // Create a new chat-bound lorebook name
        const bookName = `NameTracker_${context.chatId}`
            .replace(/[^a-z0-9 -]/gi, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 64);

        console.log('[NT-Lorebook] ╔═══════════════════════════════════════════════════════════════════════════');
        console.log('[NT-Lorebook] ║ 🆕 CREATING NEW LOREBOOK');
        console.log('[NT-Lorebook] ╠═══════════════════════════════════════════════════════════════════════════');
        console.log('[NT-Lorebook] ║ Generated Name:', bookName);
        console.log('[NT-Lorebook] ║ Chat ID:', context.chatId);
        console.log('[NT-Lorebook] ╚═══════════════════════════════════════════════════════════════════════════');
        debug.log(`Creating new chat lorebook: ${bookName}`);
        lorebookName = bookName;
        console.log('[NT-Lorebook] ║ Module variable lorebookName SET TO:', lorebookName);

        // Bind it to the chat metadata
        chatMetadata[METADATA_KEY] = lorebookName;

        // Save chat metadata using context API
        try {
            await context.saveMetadata();
            console.log(`[NT-Lorebook] ✅ Bound lorebook to chat metadata: ${lorebookName}`);
            debug.log(`Bound lorebook to chat: ${lorebookName}`);

            // CRITICAL: Actually SELECT the lorebook so it's active for the chat
            await context.setSelectedWorldInfo(lorebookName);
            console.log(`[NT-Lorebook] ✅ Selected lorebook as active for this chat: ${lorebookName}`);

            // Ensure the lorebook file exists (create empty if needed)
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (!worldInfo) {
                console.log(`[NT-Lorebook] 📝 Creating empty lorebook file: ${lorebookName}`);
                debug.log();
                await context.saveWorldInfo(lorebookName, { entries: {} }, true);
                console.log('[NT-Lorebook] ✅ Lorebook file created successfully');
            } else {
                console.log(`[NT-Lorebook] ℹ️  Lorebook file already exists with ${Object.keys(worldInfo.entries || {}).length} entries`);
            }

            // Load the new lorebook in the editor and make it active (ST API)
            if (typeof context.reloadWorldInfoEditor === 'function') {
                context.reloadWorldInfoEditor(lorebookName, true);
            }

            // Refresh the lorebook dropdown list so user can see new lorebook immediately
            // This is a global ST function, not on context object
            if (typeof window.updateWorldInfoList === 'function') {
                await window.updateWorldInfoList();
                debug.log(`✅ Lorebook dropdown refreshed - ${lorebookName} now visible`);
            } else if (typeof context.updateWorldInfoList === 'function') {
                await context.updateWorldInfoList();
                debug.log(`✅ Lorebook dropdown refreshed - ${lorebookName} now visible`);
            }

            // Notify user
            notifications.info(`Chat lorebook "${lorebookName}" created and bound to this chat`, { timeOut: 5000 });
            console.log('[NT-Lorebook] 🎉 Chat lorebook initialization complete');
        } catch (error) {
            console.error('Failed to initialize lorebook:', error);
            lorebookName = null;
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .NameTrackerError */ .S_(`Failed to initialize lorebook: ${error.message}`);
        }

        return lorebookName;
    });
}

/**
 * REC-15: Load characters from lorebook entries on chat change
 * Parses automation ID format: NT-AUTO-${uid}|||${JSON}
 * @returns {Promise<Object>} Characters object indexed by preferredName
 */
async function loadCharactersFromLorebook() {
    return withErrorBoundary('loadCharactersFromLorebook', async () => {
        const context = stContext.getContext();
        if (!context) {
            debug.log('⚠️ Context not available - cannot load characters from lorebook');
            return {};
        }

        const currentLorebookName = await initializeLorebook();
        if (!currentLorebookName) {
            debug.log('⚠️ No lorebook available - returning empty characters');
            return {};
        }

        const worldInfo = await context.loadWorldInfo(currentLorebookName);
        if (!worldInfo || !worldInfo.entries) {
            debug.log('⚠️ No lorebook entries found');
            return {};
        }

        const characters = {};
        let loadedCount = 0;
        let failedCount = 0;

        // Filter entries managed by NameTracker extension
        const nameTrackerEntries = Object.values(worldInfo.entries).filter(
            entry => entry.automationId === 'NameTracker',
        );

        debug.log(`📖 Found ${nameTrackerEntries.length} NameTracker entries in lorebook`);

        for (const entry of nameTrackerEntries) {
            try {
                if (!entry.comment || !entry.comment.startsWith('NT-AUTO-')) {
                    debug.log(`⚠️ Skipping entry ${entry.uid} - invalid comment format`);
                    continue;
                }

                // Parse automation ID: NT-AUTO-${uid}|||${JSON}
                const parts = entry.comment.split('|||');
                if (parts.length !== 2) {
                    debug.log(`⚠️ Skipping entry ${entry.uid} - malformed automation ID`);
                    continue;
                }

                const characterData = JSON.parse(parts[1]);
                
                // Validate required fields
                if (!characterData.preferredName || !characterData.uid) {
                    debug.log(`⚠️ Skipping entry ${entry.uid} - missing required fields`);
                    continue;
                }

                // Store indexed by preferredName
                characters[characterData.preferredName] = characterData;
                loadedCount++;

                debug.log(`✅ Loaded character: ${characterData.preferredName} (UID: ${characterData.uid})`);
            } catch (error) {
                debug.error(`❌ Failed to parse entry ${entry.uid}:`, error);
                failedCount++;
            }
        }

        debug.log(`📊 Character load complete: ${loadedCount} loaded, ${failedCount} failed`);
        return characters;
    });
}

/**
 * Update or create lorebook entry for a character
 * @param {Object} character - Character data
 * @param {string} characterName - Character name
 * @returns {Promise<void>}
 */
async function updateLorebookEntry(character, characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('updateLorebookEntry', async () => {
        console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ updateLorebookEntry CALLED
╠════════════════════════════════════════════════════════════════
║ CRITICAL: Checking lorebookName variable
║ lorebookName value: ${lorebookName}
║ lorebookName type: ${typeof lorebookName}
║ lorebookName is null?: ${lorebookName === null}
║ lorebookName is undefined?: ${lorebookName === undefined}
║ lorebookName is falsy?: ${!lorebookName}
╚════════════════════════════════════════════════════════════════`);

        if (!lorebookName) {
            console.error(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ ❌ CRITICAL ERROR: NO LOREBOOK INITIALIZED!
╠════════════════════════════════════════════════════════════════
║ lorebookName is: ${lorebookName}
║ Character: ${characterName}
║ SKIPPING LOREBOOK ENTRY UPDATE
╚════════════════════════════════════════════════════════════════`);
            debug.log('No lorebook initialized, skipping entry update');
            return;
        }

        console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ ✅ Lorebook IS initialized
╠════════════════════════════════════════════════════════════════
║ Character Name: ${characterName}
║ Character Object: ${JSON.stringify(character, null, 2)}
║ Has lorebookEntryId?: ${!!character.lorebookEntryId}
║ Existing Entry ID: ${character.lorebookEntryId || 'NONE'}
╚════════════════════════════════════════════════════════════════`);

        debug.log(`updateLorebookEntry called for: ${characterName}`);
        debug.log('  Character data:', character);

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const lorebookConfig = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getLorebookConfig */ .gf)();

        // Build the entry content in a readable format
        const contentParts = [];

        // Physical Age / Mental Age
        if (character.physicalAge || character.mentalAge) {
            const ageInfo = [];
            if (character.physicalAge) ageInfo.push(`Physical: ${character.physicalAge}`);
            if (character.mentalAge) ageInfo.push(`Mental: ${character.mentalAge}`);
            contentParts.push(`**Age:** ${ageInfo.join(', ')}`);
        }

        // Physical (consolidated body description)
        if (character.physical) {
            contentParts.push(`\n**Physical Description:**\n${character.physical}`);
        }

        // Personality (consolidated traits, likes, dislikes)
        if (character.personality) {
            contentParts.push(`\n**Personality:**\n${character.personality}`);
        }

        // Sexuality
        if (character.sexuality) {
            contentParts.push(`\n**Sexuality:**\n${character.sexuality}`);
        }

        // Race/Ethnicity
        if (character.raceEthnicity) {
            contentParts.push(`**Race/Ethnicity:** ${character.raceEthnicity}`);
        }

        // Role & Skills
        if (character.roleSkills) {
            contentParts.push(`\n**Role & Skills:**\n${character.roleSkills}`);
        }

        // Relationships
        if (character.relationships && character.relationships.length > 0) {
            contentParts.push('\n**Relationships:**');
            character.relationships.forEach(rel => {
                contentParts.push(`- ${rel}`);
            });
        }

        const content = contentParts.join('\n');

        // Build the keys array (name + aliases)
        const keys = [character.preferredName];
        if (character.aliases) {
            keys.push(...character.aliases);
        }

        // Ensure character has a UID (required for REC-15 chat lifecycle)
        if (!character.uid) {
            character.uid = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .generateUID */ .cv)();
            debug.log(`Generated UID for character ${characterName}: ${character.uid}`);
        }

        // Load the world info to check if entry exists
        let worldInfo = await context.loadWorldInfo(lorebookName);

        if (!worldInfo) {
            debug.log();
            // Match SillyTavern's world info structure
            worldInfo = {
                entries: {},
            };
        }

        // Clean up orphaned entries for this character
        // Remove any entries that match this character's name/aliases but aren't the current entry ID
        console.log(`[NT-Lorebook] 🧹 Cleaning up orphaned entries for: ${characterName}`);
        const orphanedUids = [];
        for (const [uid, entry] of Object.entries(worldInfo.entries)) {
            if (!entry.key || !Array.isArray(entry.key)) continue;

            // Check if any of this entry's keys match our character's primary name or aliases
            const hasMatchingKey = entry.key.some(k =>
                k.toLowerCase() === characterName.toLowerCase() ||
                (character.aliases && character.aliases.some(alias =>
                    k.toLowerCase() === alias.toLowerCase(),
                )),
            );

            // If this entry has matching keys but isn't our current entry, mark it for removal
            if (hasMatchingKey && uid !== character.lorebookEntryId) {
                console.log(`[NT-Lorebook]    Removing orphaned entry: ${uid} (keys: ${entry.key.join(', ')})`);
                orphanedUids.push(uid);
            }
        }

        // Remove orphaned entries
        for (const uid of orphanedUids) {
            delete worldInfo.entries[uid];
        }

        if (orphanedUids.length > 0) {
            console.log(`[NT-Lorebook] ✅ Removed ${orphanedUids.length} orphaned entries`);
        }

        // Calculate dynamic cooldown
        const messageFreq = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('messageFrequency', 10);
        const calculatedCooldown = Math.max(1, Math.floor(messageFreq * 0.75));


        let existingUid = null;

        // Check if this character already has a lorebook entry
        if (character.lorebookEntryId && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
            // Update existing entry
            existingUid = character.lorebookEntryId;
            const existingEntry = worldInfo.entries[existingUid];

            console.log(`[NT-Lorebook] 🔄 Updating existing entry for: ${characterName}`);
            console.log(`[NT-Lorebook]    Entry UID: ${existingUid}`);
            console.log(`[NT-Lorebook]    Keys: ${keys.join(', ')}`);
            console.log(`[NT-Lorebook]    Content length: ${content.length} chars`);

            existingEntry.key = keys;
            existingEntry.content = content;
            existingEntry.enabled = lorebookConfig.enabled;
            existingEntry.position = lorebookConfig.position;
            existingEntry.probability = lorebookConfig.probability;
            existingEntry.depth = lorebookConfig.depth;
            existingEntry.scanDepth = lorebookConfig.scanDepth;
            existingEntry.cooldown = calculatedCooldown;
            
            // REC-15: Store full character JSON in comment for chat lifecycle persistence
            existingEntry.automationId = 'NameTracker'; // Constant for filtering extension-managed entries
            existingEntry.comment = `NT-AUTO-${character.uid}|||${JSON.stringify(character)}`;

            debug.log(`✅ Updated automation ID for character ${characterName} (UID: ${character.uid})`);
        } else {
            // Create new entry
            const newUid = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .generateUID */ .cv)();

            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ CREATING NEW ENTRY
╠════════════════════════════════════════════════════════════════
║ Character Name: ${characterName}
║ Generated UID: ${newUid}
║ Keys Array: ${JSON.stringify(keys)}
║ Content Preview: ${content.substring(0, 200)}...
║ Content Length: ${content.length} characters
╚════════════════════════════════════════════════════════════════`);

            const newEntry = {
                uid: newUid,
                key: keys,
                keysecondary: [],
                comment: `NT-AUTO-${character.uid}|||${JSON.stringify(character)}`, // REC-15: Full JSON for chat lifecycle
                content: content,
                constant: false,
                selective: true,
                contextConfig: {
                    prefix: '',
                    suffix: '',
                    tokenBudget: 0,
                    reservedTokens: 0,
                    budgetPriority: 400,
                    trimDirection: 'doNotTrim',
                    insertionOrder: 0,
                    maximumTrimType: 'sentence',
                    insertionPosition: 'before',
                },
                enabled: lorebookConfig.enabled,
                position: lorebookConfig.position,
                excludeRecursion: false,
                preventRecursion: false,
                delayUntilRecursion: false,
                probability: lorebookConfig.probability,
                useProbability: true,
                depth: lorebookConfig.depth,
                selectiveLogic: 0,
                group: '',
                scanDepth: lorebookConfig.scanDepth,
                caseSensitive: null,
                matchWholeWords: null,
                useGroupScoring: null,
                automationId: 'NameTracker', // REC-15: Constant for filtering extension-managed entries
                role: 0,
                vectorized: false,
                sticky: 0,
                cooldown: calculatedCooldown,
                delay: 0,
            };

            // World info entries are stored as an object with UID as key
            worldInfo.entries[newUid] = newEntry;
            character.lorebookEntryId = newUid;

            console.log(`[NT-Lorebook] 🆕 Creating new entry for: ${characterName}`);
            console.log(`[NT-Lorebook]    Entry UID: ${newUid}`);
            console.log(`[NT-Lorebook]    Keys: ${keys.join(', ')}`);
            console.log(`[NT-Lorebook]    Content length: ${content.length} chars`);
            console.log(`[NT-Lorebook]    Enabled: ${lorebookConfig.enabled}`);
            console.log(`[NT-Lorebook]    Position: ${lorebookConfig.position}`);

            // Save the character with the new lorebook entry ID
            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ SAVING CHARACTER WITH ENTRY ID
╠════════════════════════════════════════════════════════════════
║ Character Name: ${characterName}
║ Character Object BEFORE save: ${JSON.stringify(character, null, 2)}
║ Lorebook Entry ID: ${newUid}
╚════════════════════════════════════════════════════════════════`);

            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setCharacter */ .e7)(characterName, character);

            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ CHARACTER SAVE COMPLETE
╠════════════════════════════════════════════════════════════════
║ Character Name: ${characterName}
║ Entry ID Saved: ${character.lorebookEntryId}
╚════════════════════════════════════════════════════════════════`);

            debug.log();
        }

        // Save the lorebook
        try {
            const worldInfoStructure = {
                entryCount: Object.keys(worldInfo.entries).length,
                entryKeys: Object.keys(worldInfo.entries),
                sampleEntry: Object.values(worldInfo.entries)[0] ? {
                    uid: Object.values(worldInfo.entries)[0].uid,
                    key: Object.values(worldInfo.entries)[0].key,
                    contentLength: Object.values(worldInfo.entries)[0].content.length,
                } : 'NONE',
            };
            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ SAVING LOREBOOK TO DISK
╠════════════════════════════════════════════════════════════════
║ Lorebook Name: ${lorebookName}
║ Total Entries: ${Object.keys(worldInfo.entries).length}
║ Entry UIDs: ${Object.keys(worldInfo.entries).join(', ')}
║ WorldInfo Structure: ${JSON.stringify(worldInfoStructure, null, 2)}
╚════════════════════════════════════════════════════════════════`);

            // Sanitize worldInfo to prevent Promise contamination in structuredClone
            const sanitizedWorldInfo = JSON.parse(JSON.stringify(worldInfo));
            await context.saveWorldInfo(lorebookName, sanitizedWorldInfo, true);

            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ LOREBOOK SAVE COMPLETE
╠════════════════════════════════════════════════════════════════
║ Lorebook Name: ${lorebookName}
║ Save Successful: YES
╚════════════════════════════════════════════════════════════════`);

            // Verify the save worked by reloading
            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ VERIFYING LOREBOOK SAVE
╠════════════════════════════════════════════════════════════════
║ Reloading: ${lorebookName}
╚════════════════════════════════════════════════════════════════`);

            const verifyWorldInfo = await context.loadWorldInfo(lorebookName);
            const targetUid = existingUid || character.lorebookEntryId;

            console.log(`[NT-Lorebook] ╔════════════════════════════════════════════════════════════════
║ VERIFICATION RESULTS
╠════════════════════════════════════════════════════════════════
║ Target UID: ${targetUid}
║ Verification Data Loaded?: ${!!verifyWorldInfo}
║ Has Entries Object?: ${!!verifyWorldInfo?.entries}
║ Available Entry UIDs: ${Object.keys(verifyWorldInfo?.entries || {}).join(', ')}
║ Target Entry Found?: ${!!(verifyWorldInfo?.entries?.[targetUid])}`);

            if (verifyWorldInfo && verifyWorldInfo.entries && verifyWorldInfo.entries[targetUid]) {
                const entryData = {
                    uid: verifyWorldInfo.entries[targetUid].uid,
                    key: verifyWorldInfo.entries[targetUid].key,
                    enabled: verifyWorldInfo.entries[targetUid].enabled,
                    contentLength: verifyWorldInfo.entries[targetUid].content.length,
                };
                console.log(`[NT-Lorebook] ║ ✅ VERIFICATION: SUCCESS
║ Entry Data: ${JSON.stringify(entryData, null, 2)}
╚════════════════════════════════════════════════════════════════`);
                debug.log();
            } else {
                console.log(`[NT-Lorebook] ║ ❌ VERIFICATION: FAILED
║ Entry NOT found in reloaded lorebook!
╚════════════════════════════════════════════════════════════════`);
                console.error(`[NT-Lorebook] ❌ WARNING: Lorebook verification failed - entries may not have been saved!
   Target UID: ${targetUid}
   Available entries: ${Object.keys(verifyWorldInfo?.entries || {}).join(', ')}`);
                console.error('[Name Tracker] WARNING: Lorebook verification failed - entries may not have been saved!');
            }

            debug.log();
        } catch (error) {
            console.error('[NT-Lorebook] ❌ Error saving lorebook:', error);
            console.error('[NT-Lorebook]    Lorebook name:', lorebookName);
            console.error('[NT-Lorebook]    Error details:', error.message);
            console.error('[Name Tracker] Error saving lorebook:', error);
            debug.log();
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Create lorebook content from character data (JSON format)
 * @param {Object} character - Character data
 * @returns {string} JSON string representation
 */
function createLorebookContent(character) {
    return withErrorBoundary('createLorebookContent', () => {
        const content = {
            name: character.preferredName,
            aliases: character.aliases,
            physical: character.physical,
            mental: character.mental,
            relationships: character.relationships,
        };

        return JSON.stringify(content, null, 2);
    });
}

/**
 * View character in lorebook editor
 * @param {string} characterName - Name of character to view
 * @returns {Promise<void>}
 */
async function viewInLorebook(characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('viewInLorebook', async () => {
        const character = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacter */ .qN)(characterName);

        if (!character) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .NameTrackerError */ .S_('Character not found');
        }

        if (!lorebookName) {
            notifications.warning('No active chat or lorebook');
            return;
        }

        // Import the world info functions from context
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        // Open the lorebook editor and make this chat's lorebook active
        if (typeof context.reloadWorldInfoEditor === 'function') {
            // Use reloadWorldInfoEditor to ensure the chat lorebook is active in the editor
            context.reloadWorldInfoEditor(lorebookName, true);
            notifications.success(`Opened lorebook for ${characterName}`);
        } else if (typeof context.openWorldInfoEditor === 'function') {
            // Fallback to openWorldInfoEditor
            await context.openWorldInfoEditor(lorebookName);
            notifications.success(`Opened lorebook for ${characterName}`);
        } else {
            // Final fallback: show the world info panel
            $('#WorldInfo').click();
            notifications.info(`Please select "${lorebookName}" from the World Info panel`);
        }
    });
}

/**
 * Delete a character's lorebook entry
 * @param {Object} character - Character data
 * @returns {Promise<boolean>} True if deleted successfully
 */
async function deleteLorebookEntry(character) {
    return withErrorBoundary('deleteLorebookEntry', async () => {
        if (!lorebookName || !character.lorebookEntryId) {
            debug.log();
            return false;
        }

        const context = stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (worldInfo && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
                delete worldInfo.entries[character.lorebookEntryId];
                const sanitizedWorldInfo = JSON.parse(JSON.stringify(worldInfo));
                await context.saveWorldInfo(lorebookName, sanitizedWorldInfo, true);

                debug.log();
                return true;
            }
        } catch (error) {
            console.error('Error deleting lorebook entry:', error);
            return false;
        }

        return false;
    });
}

/**
 * Purge all tracked character entries from lorebook
 * @param {Array} characters - Array of character objects to purge
 * @returns {Promise<number>} Number of entries deleted
 */
async function purgeLorebookEntries(characters) {
    return withErrorBoundary('purgeLorebookEntries', async () => {
        if (!lorebookName) {
            debug.log();
            return 0;
        }

        const context = stContext.getContext();
        let deletedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (worldInfo && worldInfo.entries) {
                // Get all entry IDs from our tracked characters
                const entryIds = characters
                    .map(char => char.lorebookEntryId)
                    .filter(id => id !== undefined && id !== null);

                // Delete each entry
                for (const entryId of entryIds) {
                    if (worldInfo.entries[entryId]) {
                        delete worldInfo.entries[entryId];
                        deletedCount++;
                        debug.log();
                    }
                }

                // Save the lorebook
                const sanitizedWorldInfo = JSON.parse(JSON.stringify(worldInfo));
                await context.saveWorldInfo(lorebookName, sanitizedWorldInfo, true);
            }
        } catch (error) {
            console.error('Error purging lorebook entries:', error);
            throw new NameTrackerError(`Failed to purge lorebook entries: ${error.message}`);
        }

        return deletedCount;
    });
}

/**
 * Adopt existing lorebook entries into character cache
 * This allows manual entries or previous data to be imported
 * @returns {Promise<number>} Number of entries adopted
 */
async function adoptExistingEntries() {
    return withErrorBoundary('adoptExistingEntries', async () => {
        if (!lorebookName) {
            debug.log();
            return 0;
        }

        const context = stContext.getContext();
        let adoptedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (!worldInfo || !worldInfo.entries) {
                debug.log();
                return 0;
            }

            const characters = await getCharacters();

            // Look for entries that might belong to our extension
            for (const [entryId, entry] of Object.entries(worldInfo.entries)) {
                if (!entry.key || !Array.isArray(entry.key) || entry.key.length === 0) {
                    continue;
                }

                const primaryName = entry.key[0];

                // Check if this entry represents a character we should track
                const managedByExtension = entry.comment?.includes('Auto-generated entry for')
                    || entry.comment === primaryName
                    || entry.comment === `Auto-generated entry for ${primaryName}`;

                if (!characters[primaryName] && managedByExtension) {
                    // Try to parse the content to recreate character data
                    const character = {
                        preferredName: primaryName,
                        aliases: entry.key.slice(1),
                        physical: '',
                        personality: '',
                        sexuality: '',
                        raceEthnicity: '',
                        roleSkills: '',
                        relationships: [],
                        ignored: false,
                        confidence: 50,
                        lorebookEntryId: entryId,
                        lastUpdated: Date.now(),
                        isMainChar: false,
                    };

                    // Store the adopted character
                    await setCharacter(primaryName, character);
                    adoptedCount++;

                    debug.log();
                }
            }

            if (adoptedCount > 0) {
                notifications.success(`Adopted ${adoptedCount} existing lorebook entries`);
            }

        } catch (error) {
            console.error('Error adopting existing entries:', error);
            throw new NameTrackerError(`Failed to adopt existing entries: ${error.message}`);
        }

        return adoptedCount;
    });
}

/**
 * Get the current lorebook name
 * @returns {string|null} Current lorebook name
 */
function getCurrentLorebookName() {
    return lorebookName;
}

/**
 * Reset lorebook state (called on chat change)
 */
function resetLorebookState() {
    lorebookName = null;
    debug.log();
}

/**
 * Get lorebook statistics
 * @returns {Promise<Object>} Lorebook statistics
 */
async function getLorebookStats() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('getLorebookStats', async () => {
        if (!lorebookName) {
            return {
                name: null,
                entryCount: 0,
                trackedEntries: 0,
                orphanedEntries: 0,
            };
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();

            if (!worldInfo || !worldInfo.entries) {
                return {
                    name: lorebookName,
                    entryCount: 0,
                    trackedEntries: 0,
                    orphanedEntries: 0,
                };
            }

            const totalEntries = Object.keys(worldInfo.entries).length;
            const trackedIds = Object.values(characters)
                .map(char => char.lorebookEntryId)
                .filter(id => id);
            const trackedEntries = trackedIds.length;
            const orphanedEntries = totalEntries - trackedEntries;

            return {
                name: lorebookName,
                entryCount: totalEntries,
                trackedEntries,
                orphanedEntries,
            };
        } catch (error) {
            console.error('Error getting lorebook stats:', error);
            return {
                name: lorebookName,
                entryCount: 0,
                trackedEntries: 0,
                orphanedEntries: 0,
                error: error.message,
            };
        }
    });
}


/***/ },

/***/ 248
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fR: () => (/* binding */ buildCharacterRoster),
  au: () => (/* binding */ calculateMessageTokens),
  Kr: () => (/* binding */ callLLMAnalysis),
  getMaxPromptLength: () => (/* binding */ getMaxPromptLength),
  Bw: () => (/* binding */ loadOllamaModels)
});

// UNUSED EXPORTS: callOllama, callSillyTavern, clearAnalysisCache, getCacheStats, getOllamaModelContext, getOllamaModels, logSessionTelemetry, parseJSONResponse, resetSessionTelemetry

// EXTERNAL MODULE: ./src/core/debug.js
var debug = __webpack_require__(806);
// EXTERNAL MODULE: ./src/core/errors.js
var errors = __webpack_require__(462);
// EXTERNAL MODULE: ./src/core/settings.js
var core_settings = __webpack_require__(548);
// EXTERNAL MODULE: ./src/core/context.js
var core_context = __webpack_require__(102);
// EXTERNAL MODULE: ./src/utils/helpers.js
var helpers = __webpack_require__(854);
// EXTERNAL MODULE: ./src/utils/notifications.js
var notifications = __webpack_require__(695);
;// ./tests/debug-parser.js
/**
 * JSON Parsing Debug Utilities for Name Tracker Extension
 * 
 * This module provides console-based debugging tools to trace LLM response
 * transformations through the parsing pipeline. All logs use filterable prefixes
 * for easy grep analysis.
 * 
 * Usage in console:
 *   grep "\[NT-DEBUG-RAW\]"     - See full LLM responses
 *   grep "\[NT-DEBUG-PARSE\]"   - See parsing transformation steps
 *   grep "\[NT-DEBUG-FLOW\]"    - See overall flow tracking
 * 
 * @module tests/debug-parser
 */

/**
 * Log raw LLM response before any processing
 * @param {string} response - Raw response from LLM API
 * @param {string} source - Source identifier ('SillyTavern' or 'Ollama')
 */
function logRawResponse(response, source = 'Unknown') {
    console.log('[NT-DEBUG-RAW] ========================================');
    console.log('[NT-DEBUG-RAW] Source:', source);
    console.log('[NT-DEBUG-RAW] Type:', typeof response);
    console.log('[NT-DEBUG-RAW] Length:', response?.length || 0);
    console.log('[NT-DEBUG-RAW] First 500 chars:', response?.substring(0, 500) || 'null/undefined');
    console.log('[NT-DEBUG-RAW] Last 500 chars:', response?.substring(Math.max(0, (response?.length || 0) - 500)) || 'null/undefined');
    console.log('[NT-DEBUG-RAW] Full response:');
    console.log(response);
    console.log('[NT-DEBUG-RAW] ========================================');
}

/**
 * Log parsing attempt with transformation details
 * @param {string} stage - Current parsing stage
 * @param {string} text - Text at current stage
 * @param {Object} metadata - Additional context
 */
function logParseAttempt(stage, text, metadata = {}) {
    console.log(`[NT-DEBUG-PARSE] ======= ${stage} =======`);
    console.log('[NT-DEBUG-PARSE] Length:', text?.length || 0);
    
    if (metadata.previousLength !== undefined) {
        const delta = (text?.length || 0) - metadata.previousLength;
        console.log('[NT-DEBUG-PARSE] Delta:', delta >= 0 ? `+${delta}` : delta);
        
        // Alert on suspicious length changes
        if (Math.abs(delta) > (metadata.previousLength * 0.9)) {
            console.warn('[NT-DEBUG-PARSE] ⚠️ SUSPICIOUS LENGTH CHANGE! Lost', 
                Math.abs(delta), 'characters (', 
                ((Math.abs(delta) / metadata.previousLength) * 100).toFixed(1), '% of original)');
        }
    }
    
    if (text && typeof text === 'string') {
        console.log('[NT-DEBUG-PARSE] First 300 chars:', text.substring(0, 300));
        console.log('[NT-DEBUG-PARSE] Last 200 chars:', text.substring(Math.max(0, text.length - 200)));
        
        // Check for common issues
        const issues = [];
        if (text.includes('```')) issues.push('Contains markdown code blocks');
        if (text.includes('<think>') || text.includes('</think>')) issues.push('Contains XML thinking tags');
        if (!text.trim().startsWith('{')) issues.push('Does not start with {');
        if (!text.trim().endsWith('}')) issues.push('Does not end with }');
        if (text.includes('\\n') || text.includes('\\"')) issues.push('Contains escaped characters');
        
        if (issues.length > 0) {
            console.log('[NT-DEBUG-PARSE] Issues detected:', issues.join(', '));
        }
    } else {
        console.log('[NT-DEBUG-PARSE] Text is not a string or is null/undefined');
    }
    
    if (metadata.action) {
        console.log('[NT-DEBUG-PARSE] Action:', metadata.action);
    }
    
    console.log('[NT-DEBUG-PARSE] =====================================');
}

/**
 * Log transformation pipeline with before/after comparison
 * @param {Array<Object>} transformations - Array of transformation steps
 */
function logTransformations(transformations) {
    console.log('[NT-DEBUG-FLOW] ========== TRANSFORMATION PIPELINE ==========');
    
    transformations.forEach((transform, index) => {
        console.log(`[NT-DEBUG-FLOW] Step ${index + 1}: ${transform.name}`);
        console.log(`[NT-DEBUG-FLOW]   Before: ${transform.before} chars`);
        console.log(`[NT-DEBUG-FLOW]   After:  ${transform.after} chars`);
        console.log(`[NT-DEBUG-FLOW]   Delta:  ${transform.after - transform.before}`);
        
        if (transform.regex) {
            console.log(`[NT-DEBUG-FLOW]   Regex:  ${transform.regex}`);
        }
        
        if (transform.matches !== undefined) {
            console.log(`[NT-DEBUG-FLOW]   Matches: ${transform.matches}`);
        }
    });
    
    const initialLength = transformations[0]?.before || 0;
    const finalLength = transformations[transformations.length - 1]?.after || 0;
    const totalDelta = finalLength - initialLength;
    const percentChange = initialLength > 0 ? ((totalDelta / initialLength) * 100).toFixed(1) : 0;
    
    console.log('[NT-DEBUG-FLOW] ================================================');
    console.log('[NT-DEBUG-FLOW] Initial length:', initialLength);
    console.log('[NT-DEBUG-FLOW] Final length:', finalLength);
    console.log('[NT-DEBUG-FLOW] Total delta:', totalDelta, `(${percentChange}%)`);
    
    if (Math.abs(totalDelta) > (initialLength * 0.5)) {
        console.warn('[NT-DEBUG-FLOW] ⚠️ CRITICAL: Lost more than 50% of content through transformations!');
    }
    
    console.log('[NT-DEBUG-FLOW] ================================================');
}

/**
 * Compare regex extraction results
 * @param {string} original - Original text
 * @param {string} pattern - Regex pattern used
 * @param {string} extracted - Extracted result
 */
function logRegexExtraction(original, pattern, extracted) {
    console.log('[NT-DEBUG-PARSE] ========== REGEX EXTRACTION ==========');
    console.log('[NT-DEBUG-PARSE] Pattern:', pattern);
    console.log('[NT-DEBUG-PARSE] Original length:', original?.length || 0);
    console.log('[NT-DEBUG-PARSE] Extracted length:', extracted?.length || 0);
    
    if ((original?.length || 0) > 0) {
        const percentExtracted = ((extracted?.length || 0) / original.length * 100).toFixed(1);
        console.log('[NT-DEBUG-PARSE] Extraction efficiency:', percentExtracted, '%');
        
        if (percentExtracted < 10) {
            console.error('[NT-DEBUG-PARSE] ❌ EXTRACTION FAILURE: Extracted less than 10% of original content!');
        }
    }
    
    console.log('[NT-DEBUG-PARSE] Original (first 200 chars):', original?.substring(0, 200));
    console.log('[NT-DEBUG-PARSE] Extracted (first 200 chars):', extracted?.substring(0, 200));
    console.log('[NT-DEBUG-PARSE] =======================================');
}

/**
 * Log JSON repair attempt details
 * @param {string} original - Text before repair
 * @param {string} repaired - Text after repair
 * @param {Array<string>} repairsApplied - List of repair operations
 */
function logRepairAttempt(original, repaired, repairsApplied = []) {
    console.log('[NT-DEBUG-PARSE] ========== JSON REPAIR ==========');
    console.log('[NT-DEBUG-PARSE] Original length:', original?.length || 0);
    console.log('[NT-DEBUG-PARSE] Repaired length:', repaired?.length || 0);
    console.log('[NT-DEBUG-PARSE] Repairs applied:', repairsApplied.length);
    
    repairsApplied.forEach((repair, index) => {
        console.log(`[NT-DEBUG-PARSE]   ${index + 1}. ${repair}`);
    });
    
    if (original !== repaired) {
        console.log('[NT-DEBUG-PARSE] Repair changed the text');
        
        // Show diff in critical areas
        if (original.substring(0, 100) !== repaired.substring(0, 100)) {
            console.log('[NT-DEBUG-PARSE] Beginning differs:');
            console.log('[NT-DEBUG-PARSE]   Before:', original.substring(0, 100));
            console.log('[NT-DEBUG-PARSE]   After:', repaired.substring(0, 100));
        }
        
        if (original.substring(original.length - 100) !== repaired.substring(repaired.length - 100)) {
            console.log('[NT-DEBUG-PARSE] Ending differs:');
            console.log('[NT-DEBUG-PARSE]   Before:', original.substring(original.length - 100));
            console.log('[NT-DEBUG-PARSE]   After:', repaired.substring(repaired.length - 100));
        }
    } else {
        console.log('[NT-DEBUG-PARSE] No changes made during repair');
    }
    
    console.log('[NT-DEBUG-PARSE] =================================');
}

/**
 * Log final parse result or error
 * @param {boolean} success - Whether parsing succeeded
 * @param {Object|Error} result - Parsed object or error
 * @param {string} finalText - Final text that was parsed (or failed to parse)
 */
function logParseResult(success, result, finalText) {
    console.log('[NT-DEBUG-FLOW] ========== PARSE RESULT ==========');
    console.log('[NT-DEBUG-FLOW] Success:', success);
    
    if (success) {
        console.log('[NT-DEBUG-FLOW] Result type:', typeof result);
        console.log('[NT-DEBUG-FLOW] Has characters array:', Array.isArray(result?.characters));
        console.log('[NT-DEBUG-FLOW] Character count:', result?.characters?.length || 0);
        
        if (result?.characters && Array.isArray(result.characters)) {
            result.characters.forEach((char, index) => {
                console.log(`[NT-DEBUG-FLOW]   Character ${index + 1}: ${char.name || 'unnamed'}`);
            });
        }
    } else {
        console.error('[NT-DEBUG-FLOW] ❌ Parse failed');
        console.error('[NT-DEBUG-FLOW] Error type:', result?.name || typeof result);
        console.error('[NT-DEBUG-FLOW] Error message:', result?.message || String(result));
        
        if (result?.stack) {
            console.error('[NT-DEBUG-FLOW] Stack trace:', result.stack);
        }
        
        console.error('[NT-DEBUG-FLOW] Final text that failed to parse (first 300 chars):');
        console.error(finalText?.substring(0, 300));
        console.error('[NT-DEBUG-FLOW] Final text that failed to parse (last 200 chars):');
        console.error(finalText?.substring(Math.max(0, (finalText?.length || 0) - 200)));
    }
    
    console.log('[NT-DEBUG-FLOW] ==================================');
}

/**
 * Create a complete parsing session log
 * @returns {Object} Session object with methods to track parsing flow
 */
function createParsingSession() {
    const sessionId = `parse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const transformations = [];
    
    return {
        sessionId,
        
        logStart(source, rawResponse) {
            console.log(`[NT-DEBUG-FLOW] ========== PARSING SESSION START: ${sessionId} ==========`);
            logRawResponse(rawResponse, source);
        },
        
        logTransform(name, before, after, details = {}) {
            const transform = {
                name,
                before: before?.length || 0,
                after: after?.length || 0,
                ...details
            };
            transformations.push(transform);
            
            logParseAttempt(name, after, {
                previousLength: before?.length || 0,
                action: details.action || name
            });
        },
        
        logEnd(success, result, finalText) {
            logTransformations(transformations);
            logParseResult(success, result, finalText);
            console.log(`[NT-DEBUG-FLOW] ========== PARSING SESSION END: ${sessionId} ==========`);
        }
    };
}

;// ./src/modules/llm.js
/**
 * LLM Integration Module
 *
 * Handles LLM API calls to SillyTavern and Ollama for character analysis.
 * Includes conservative parameter settings, token management, context window handling,
 * and JSON parsing for deterministic character extraction.
 */









const llm_debug = (0,debug/* createModuleLogger */.Xv)('llm');
const llm_notifications = new notifications/* NotificationManager */.h('LLM Integration');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = false; // Default off to reduce console noise

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-LLM] ${message}`, data || '');
    }
}

// ============================================================================
// CONFIGURATION CONSTANTS - Conservative parameters for deterministic output
// ============================================================================
// These hardcoded values ensure reliable JSON extraction with minimal hallucination.
// They override user chat settings specifically for character analysis operations.

// Generation Parameters (Anti-hallucination configuration)
const GENERATION_TEMPERATURE = 0.2;     // Very low for deterministic output
const GENERATION_TOP_P = 0.85;          // Slightly reduced nucleus sampling
const GENERATION_TOP_K = 25;            // Standard focused sampling
const GENERATION_REP_PEN = 1.1;         // Slight repetition penalty

// Context Window Management
// Reserved for future dynamic context management
// eslint-disable-next-line no-unused-vars
const RESPONSE_BUFFER_PERCENT = 25;     // Reserve 25% for response generation
// eslint-disable-next-line no-unused-vars
const SAFETY_MARGIN_PERCENT = 10;       // Reserve 10% safety margin
// eslint-disable-next-line no-unused-vars
const MIN_RESPONSE_TOKENS = 1000;       // Minimum tokens allowed for response

// Ollama-Specific Parameters
// eslint-disable-next-line no-unused-vars
const OLLAMA_MIN_PREDICT = 500;         // Minimum tokens to predict
// eslint-disable-next-line no-unused-vars
const OLLAMA_MAX_PREDICT = 4000;        // Maximum tokens to predict

// Cache Configuration
// eslint-disable-next-line no-unused-vars
const CACHE_MAX_ENTRIES = 50;           // Maximum cached analysis results
// eslint-disable-next-line no-unused-vars
const CACHE_INVALIDATION_TIME = 3600000; // 1 hour cache duration

// LLM state management
const analysisCache = new Map(); // Cache for LLM analysis results
let ollamaModels = []; // Available Ollama models

// Session telemetry tracking (reset on chat change)
const sessionTelemetry = {
    budgetingMethod: [], // 'NER' or 'fallback'
    entityCounts: [],
    rosterSizes: [],
    calculatedBudgets: [],
    actualResponseTokens: [],
    totalCalls: 0,
    nerSuccesses: 0,
    nerFailures: 0,
};

/**
 * Reset session telemetry (call on chat change)
 */
function resetSessionTelemetry() {
    sessionTelemetry.budgetingMethod = [];
    sessionTelemetry.entityCounts = [];
    sessionTelemetry.rosterSizes = [];
    sessionTelemetry.calculatedBudgets = [];
    sessionTelemetry.actualResponseTokens = [];
    sessionTelemetry.totalCalls = 0;
    sessionTelemetry.nerSuccesses = 0;
    sessionTelemetry.nerFailures = 0;
    console.log('[NT-Telemetry] Session telemetry reset');
}

/**
 * Log session telemetry summary
 */
function logSessionTelemetry() {
    if (sessionTelemetry.totalCalls === 0) {
        console.log('[NT-Telemetry] No LLM calls this session');
        return;
    }

    console.log('[NT-Telemetry] ========== Session Summary ==========');
    console.log('[NT-Telemetry] Total LLM calls:', sessionTelemetry.totalCalls);
    console.log('[NT-Telemetry] NER successes:', sessionTelemetry.nerSuccesses,
        `(${((sessionTelemetry.nerSuccesses / sessionTelemetry.totalCalls) * 100).toFixed(1)}%)`);
    console.log('[NT-Telemetry] NER failures (fallback used):', sessionTelemetry.nerFailures,
        `(${((sessionTelemetry.nerFailures / sessionTelemetry.totalCalls) * 100).toFixed(1)}%)`);

    if (sessionTelemetry.calculatedBudgets.length > 0) {
        const avgBudget = sessionTelemetry.calculatedBudgets.reduce((a, b) => a + b, 0) / sessionTelemetry.calculatedBudgets.length;
        console.log('[NT-Telemetry] Average calculated budget:', Math.round(avgBudget), 'tokens');
    }

    if (sessionTelemetry.actualResponseTokens.length > 0) {
        const avgActual = sessionTelemetry.actualResponseTokens.reduce((a, b) => a + b, 0) / sessionTelemetry.actualResponseTokens.length;
        console.log('[NT-Telemetry] Average actual response:', Math.round(avgActual), 'tokens');

        // Calculate efficiency
        if (sessionTelemetry.calculatedBudgets.length === sessionTelemetry.actualResponseTokens.length) {
            let totalEfficiency = 0;
            for (let i = 0; i < sessionTelemetry.calculatedBudgets.length; i++) {
                totalEfficiency += (sessionTelemetry.actualResponseTokens[i] / sessionTelemetry.calculatedBudgets[i]) * 100;
            }
            const avgEfficiency = totalEfficiency / sessionTelemetry.calculatedBudgets.length;
            console.log('[NT-Telemetry] Average efficiency:', avgEfficiency.toFixed(1) + '%');
        }
    }

    console.log('[NT-Telemetry] ========================================');
}

/**
 * Calculate response token budget using NER with fallback
 * @param {string} messageText - Messages to analyze for entity count
 * @param {number} rosterSize - Number of existing characters in lorebook
 * @returns {Promise<{budget: number, method: string, entityCount: number}>}
 */
// eslint-disable-next-line no-unused-vars
async function calculateResponseBudget(messageText, rosterSize) {
    const settings = await get_settings();
    const maxResponseTokens = settings.maxResponseTokens || 5000;

    let entityCount = 0;
    let method = 'fallback';

    // Try NER-based entity extraction
    try {
        // Attempt to use SillyTavern transformers for NER
        // This is the proper way to access transformers in ST extensions
        const context = stContext.getContext();
        if (context?.ai?.transformers?.pipeline) {
            const ner = await context.ai.transformers.pipeline('ner');
            const entities = await ner(messageText);

            // Count unique entities (people)
            const uniqueEntities = new Set();
            for (const entity of entities) {
                if (entity.entity_group === 'PER' || entity.entity.startsWith('B-PER') || entity.entity.startsWith('I-PER')) {
                    uniqueEntities.add(entity.word.toLowerCase());
                }
            }

            entityCount = uniqueEntities.size;
            method = 'NER';
            sessionTelemetry.nerSuccesses++;

            console.log('[NT-Budget] NER detected', entityCount, 'entities');
        } else {
            throw new Error('Transformers pipeline not available');
        }
    } catch (error) {
        // Fallback to character count estimation
        console.log('[NT-Budget] NER unavailable, using fallback estimation:', error.message);
        method = 'fallback';
        sessionTelemetry.nerFailures++;

        // Estimate: characterCount × 300 + 1000
        const characterCount = messageText.length;
        entityCount = Math.ceil(characterCount / 1000); // Rough estimate for logging
    }

    // Calculate budget based on method
    let budget;
    if (method === 'NER') {
        // NER-based: entityCount + rosterSize, scaled by 300 tokens per character
        const totalCharacters = entityCount + rosterSize;
        budget = (totalCharacters * 300) + 1000; // Base 1000 + scaling
    } else {
        // Fallback: character count × 300 + 1000
        budget = (messageText.length * 300) + 1000;
    }

    // Apply cap
    budget = Math.min(budget, maxResponseTokens);

    console.log('[NT-Budget] Method:', method);
    console.log('[NT-Budget] Entity count:', entityCount);
    console.log('[NT-Budget] Roster size:', rosterSize);
    console.log('[NT-Budget] Calculated budget:', budget, 'tokens');
    console.log('[NT-Budget] Max cap:', maxResponseTokens, 'tokens');

    // Track telemetry
    sessionTelemetry.totalCalls++;
    sessionTelemetry.budgetingMethod.push(method);
    sessionTelemetry.entityCounts.push(entityCount);
    sessionTelemetry.rosterSizes.push(rosterSize);
    sessionTelemetry.calculatedBudgets.push(budget);

    return { budget, method, entityCount };
}

/**
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `Extract character information from messages and return ONLY a JSON object.

/nothink

[CURRENT LOREBOOK ENTRIES]
The following characters have already been identified. Their information is shown in lorebook format (keys + content).
If a character appears in the new messages with additional/changed information, include them in your response.
If a character is NOT mentioned or has no new information, do NOT include them in your response.

{{CHARACTER_ROSTER}}

⚠️ REQUIRED: Always include the user character ({{user}}) in your response, even if minimal details
For other characters from Current Lorebook Entries: only include if NEW information appears in these messages
Returning only the user character is valid when no other character updates exist

⚠️ CRITICAL INSTRUCTION: Only include characters with NEW information in these specific messages. If a character from the lorebook appears but provides no new details, DO NOT include them in your response.

Example: Alice from lorebook says 'Hi' in message 5 → No new info → Omit Alice from response
Example: {{user}} always appears → Always include {{user}} with any available details

CRITICAL JSON REQUIREMENTS:
⚠️ STRICT JSON FORMATTING - PARSING WILL FAIL IF NOT FOLLOWED ⚠️

🚨 ABSOLUTELY NO XML TAGS: Do not use <think>, </think>, <thinking>, or any XML tags
🚨 PURE JSON ONLY: Your response must be immediately parseable JSON with no wrappers

MANDATORY SYNTAX RULES:
- Your ENTIRE response must be valid JSON starting with { and ending with }
- ALL property names MUST use double quotes: "name", "aliases", etc.
- ALL string values MUST use double quotes and escape internal quotes: "He said \\"hello\\""
- NEVER output unquoted text in any field: "roleSkills": observed symptoms ❌ WRONG
- CORRECT: "roleSkills": "observed symptoms" ✅ or "roleSkills": null ✅
- NO control characters (line breaks, tabs) inside string values
- NO trailing commas before } or ]
- EVERY property must have a colon: "name": "value" (not "name" "value")
- NO markdown, NO explanations, NO text before or after the JSON

⛔ ABSOLUTELY FORBIDDEN PATTERNS THAT BREAK PARSING:
❌ <think>reasoning</think> or </think> or any XML tags
❌ Code blocks: \\\`\\\`\\\`json { "characters": [...] } \\\`\\\`\\\`
❌ "name": "John", "He is tall and strong", "age": 25
   (orphaned description without property name)
❌ "physical" "brown hair and blue eyes"
   (missing colon)
❌ "aliases": ["John", "Scout",]
   (trailing comma)
❌ Here's the analysis: { "characters": [...] }
   (text before JSON)

✅ CORRECT FORMAT ONLY:
{
  "characters": [
    {
      "name": "Full Name",
      "physical": "description here",
      "aliases": ["nick1", "nick2"]
    }
  ]
}

⚠️ VALIDATION CHECK: Before responding, verify:
1. Starts with { immediately (no text before)
2. Every string has opening AND closing quotes
3. Every property has a colon after the name
4. No orphaned text without property names
5. Ends with } immediately (no text after)

ONLY include characters mentioned in these specific messages or with new information
DO NOT repeat unchanged characters from the Current Lorebook Entries

DO NOT include:
- Any text before the JSON
- Any text after the JSON
- Code block markers like \\\`\\\`\\\`json
- Explanations, commentary, or thinking tags
- XML tags like <think> or </think> (these break JSON parsing)

REQUIRED JSON structure (copy this exact format):
{
  "characters": [
    {
      "name": "Full character name (SINGLE NAME ONLY - never include aliases here)",
      "aliases": ["Alternative names for THIS SAME person - nicknames, shortened names, titles"],
      "physicalAge": "Age if mentioned",
      "mentalAge": "Mental age if different",
      "physical": "Physical description",
      "personality": "Personality traits",
      "sexuality": "Sexual orientation if mentioned",
      "raceEthnicity": "Race/ethnicity if mentioned",
      "roleSkills": "Job/role/skills (MUST be quoted string or null, never unquoted text)",
      "relationships": ["currentchar, otherchar, relationship"],
      "confidence": 75
    }
  ]
}

CRITICAL FIELD SPECIFICATIONS:

NAME FIELD RULES:
- Use the MOST COMPLETE proper name mentioned (e.g., "John Blackwood")
- NEVER include commas, slashes, or multiple names in the name field
- NEVER combine name + alias (❌ "John Blackwood, John" ❌ "John/Scout")
- If only a first name is known, use just that ("John")

ALIASES FIELD RULES:
- Include ALL other ways this character is referred to
- Nicknames, shortened names, titles, alternative spellings
- Examples: ["John", "Scout", "JB", "Mr. Blackwood"]

RELATIONSHIPS FIELD - NATURAL LANGUAGE FORMAT:
🚨 CRITICAL: ONLY use this format: "Character A is to Character B: relationship1, relationship2"

⛔ FORBIDDEN FORMATS:
- "Character, Other, relationship" (OLD TRIPLET FORMAT - DO NOT USE)
- "Character A, Character B, relationship" (OLD TRIPLET FORMAT - DO NOT USE)

✅ MANDATORY FORMAT: "Character A is to Character B: relationship1, relationship2"

⚠️ CRITICAL NAMING REQUIREMENTS:
- ALWAYS use the character's CANONICAL/PREFERRED name in relationships
- If "John Blackwood" is the main name, use "John Blackwood" NOT "John"
- Maintain name consistency across ALL relationship entries
- Multiple relationships for same pair: separate with commas

✅ CORRECT examples:
- "Dora is to John Blackwood: lover, submissive"
- "Maya is to Sarah Chen: sister, gymnastics partner"
- "John Blackwood is to Julia Martinez: son"
- "Sarah Chen is to John Blackwood: rival, former colleague"

❌ FORBIDDEN patterns:
- "Dora, John, lover" (OLD FORMAT - NEVER USE)
- "Dora, John Blackwood, lover" (OLD FORMAT - NEVER USE)
- "John, Jasmine, friend" (OLD FORMAT - NEVER USE)
- "Dora is to John: lover" + "Dora is to John Blackwood: lover" (inconsistent naming)
- Narrative text: "Living in luxury penthouse since age 17"
- Actions/events: "Takes charge of organizing rescue mission"

🔄 RELATIONSHIP FORMAT - DIRECTIONALITY IS CRITICAL:
⚠️ MANDATORY FORMAT: "[CurrentCharacter] is to [TargetCharacter]: [role]"

DIRECTIONALITY EXAMPLES (notice the direction matters!):
✅ CORRECT:
- "John Blackwood is to Julia Chen: son" (John is Julia's son)
- "Julia Chen is to John Blackwood: mother" (Julia is John's mother)
- "Emma is to David: wife" (Emma is David's wife)
- "David is to Emma: husband" (David is Emma's husband)

❌ WRONG - These lose directionality:
- "John, Julia, son" ← NO! Ambiguous direction
- "Julia is to John: son" ← NO! Julia is not John's son

ALLOWED CORE RELATIONSHIP TYPES ONLY:
FAMILY: parent, mother, father, child, son, daughter, sibling, brother, sister, spouse, husband, wife
**Standardized Relationships (Directional Dynamics):**

Relationships MUST follow this specific string format: "[CurrentCharacterName] is to [TargetCharacterName]: [Role1], [Role2]"

**Directionality is Critical:** The first name MUST be the character defined in the current JSON entry. The second name is the target.

**Multi-Faceted Roles:** Include all applicable dynamics.
Example: "John is to Jasmine: Friend, Lab Partner, Lover, Rival"

**Depth Requirement:** Capture real social, professional, romantic, or power dynamics.

**ALLOWED (Examples, not exhaustive):** Friend, Lover, Spouse, Rival, Boss, Employee, Captor, Prisoner, Illicit Affair Partner, Sexual Dominant, Submissive, Mentor, Protégé, Parent, Child, Sibling, Cousin, Uncle, Aunt, Neighbor, Landlord, Tenant, Doctor, Patient, Teacher, Student, etc.

**FORBIDDEN:** Do not use situational "concepts" or passive states like "Witness," "Bystander," "Observer," "Listener," or "Interviewer." If no real dynamic exists beyond "witnessing," do not include the relationship.

**Strict Constraint:** Do NOT include actions, events, or history (e.g., "John met Julia at a bar" or "John is angry at Julia"). Only include the core social or familial standing.

**No History/Actions:** Do not include events (e.g., "John is to Jasmine: Person who saved her life"). Focus strictly on the current standing/role.

⚠️ CRITICAL FORMAT RULES:
1. ALWAYS use "[Name] is to [Name]: [role]" format
2. Use CANONICAL character names from lorebook (never aliases)
3. Direction matters: "A is to B: parent" ≠ "B is to A: parent"
4. Multiple roles allowed per relationship: "A is to B: Friend, Colleague, Rival"

Rules:
- One entry per distinct person. NEVER combine two different people into one entry.
- If the same person is referred by variants ("John", "John Blackwell", "Scout"), make ONE entry with name = best full name ("John Blackwell") and put other names in aliases.
- Do NOT create names like "Jade/Jesse" or "Sarah and Maya". Instead, create separate entries: [{"name":"Jade"}, {"name":"Jesse"}].
- Only extract clearly named speaking characters.
- Skip generic references ("the waiter", "a woman").
- Use most recent information for conflicts.
- Empty array if no clear characters: {"characters":[]}
- Confidence: 90+ (explicit), 70-89 (clear), 50-69 (mentioned), <50 (vague).

FIELD EXAMPLES:

NAME EXAMPLES:
✅ "John Blackwood" (not "John Blackwood, John")
✅ "Maria Santos" (not "Maria/Marie")
✅ "Alex" (when full name unknown)

ALIAS EXAMPLES:
✅ ["John", "Scout", "JB"]
✅ ["Marie", "Maria"]
✅ ["Mom", "Mother", "Sarah"]

RELATIONSHIP EXAMPLES:
✅ ["Dora is to John Blackwood: lover, submissive", "Maya is to Sarah Chen: sister, gymnastics partner"]
❌ ["Lives in penthouse", "Writing novels", "Leading group", "Met at bar"]
❌ ["Dora, John, lover", "John, Jasmine, friend"] (OLD TRIPLET FORMAT - NEVER USE)
❌ ["Dora is to John: lover", "Dora is to John Blackwood: submissive"] (split relationships)

🔥 FINAL REMINDER - CRITICAL FOR SUCCESS:
Your response must start with { immediately and end with } immediately.
NO text, explanations, or markers before or after the JSON.
Every description must have a property name: "physical": "tall", not just "tall".
Validate your JSON syntax before responding - missing colons or orphaned strings will cause parsing failure.

Your response must start with { immediately.`;

/**
 * Get the system prompt for analysis
 * @returns {string} System prompt text
 */
async function getSystemPrompt() {
    const settings = await (0,core_settings/* get_settings */.TJ)();
    const prompt = settings?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    // Ensure we return a string, not a Promise or object
    return typeof prompt === 'string' ? prompt : DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load available Ollama models from the configured endpoint and cache them.
 * @returns {Promise<Array>} Array of available models
 */
async function loadOllamaModels() {
    return (0,errors/* withErrorBoundary */.Xc)('loadOllamaModels', async () => {
        const ollamaEndpoint = await (0,core_settings/* get_settings */.TJ)('ollamaEndpoint', 'http://localhost:11434');

        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to load Ollama models: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            ollamaModels = Array.isArray(data?.models) ? data.models : [];
            debugLog(`[OllamaModels] Found ${ollamaModels.length} models: ${ollamaModels.map(m => m.name).join(', ')}`);
            return [...ollamaModels];
        } catch (error) {
            console.error('Error loading Ollama models:', error);
            llm_notifications.error('Failed to load Ollama models. Check endpoint and try again.');
            throw error;
        }
    });
}

/**
 * Get cached Ollama models
 * @returns {Array} Array of available models
 */
function getOllamaModels() {
    return [...ollamaModels];
}

/**
 * Get Ollama model context size
 * @param {string} modelName - Name of the Ollama model
 * @returns {Promise<number>} Context size in tokens, or default 4096
 */
async function getOllamaModelContext(modelName) {
    return (0,errors/* withErrorBoundary */.Xc)('getOllamaModelContext', async () => {
        const ollamaEndpoint = await (0,core_settings/* get_settings */.TJ)('ollamaEndpoint', 'http://localhost:11434');

        if (!modelName) {
            llm_debug.log();
            return 4096;
        }

        try {
            const response = await fetch(`${ollamaEndpoint}/api/show`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: modelName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch model info: ${response.statusText}`);
            }

            const data = await response.json();

            // Look for num_ctx in parameters array
            if (data.parameters && Array.isArray(data.parameters)) {
                for (const param of data.parameters) {
                    const match = param.match(/num_ctx\\s+(\\d+)/);
                    if (match) {
                        const contextSize = parseInt(match[1]);
                        llm_debug.log();
                        return contextSize;
                    }
                }
            }

            // Fallback: check if it's in model details
            if (data.model_info && data.model_info.num_ctx) {
                const contextSize = parseInt(data.model_info.num_ctx);
                llm_debug.log();
                return contextSize;
            }

            llm_debug.log();
            return 4096;
        } catch (error) {
            console.error('Error fetching Ollama model context:', error);
            llm_debug.log();
            return 4096;
        }
    });
}

/**
 * Build a roster of known characters in lorebook format for context
 * Returns keys and formatted content fields to support incremental updates
 * @returns {string} Formatted roster text with lorebook entries
 */
async function buildCharacterRoster() {
    return (0,errors/* withErrorBoundary */.Xc)('buildCharacterRoster', async () => {
        const characters = await (0,core_settings/* getCharacters */.bg)();
        const characterNames = Object.keys(characters);

        if (characterNames.length === 0) {
            return '(None - this is the first analysis)';
        }

        const entries = characterNames.map(name => {
            const char = characters[name];

            // Build keys array (name + aliases)
            const keys = [char.preferredName || name];
            if (char.aliases && char.aliases.length > 0) {
                keys.push(...char.aliases);
            }

            // Build formatted content (same format as lorebook)
            const contentParts = [];

            // Age info
            if (char.physicalAge || char.mentalAge) {
                const ageInfo = [];
                if (char.physicalAge) ageInfo.push(`Physical: ${char.physicalAge}`);
                if (char.mentalAge) ageInfo.push(`Mental: ${char.mentalAge}`);
                contentParts.push(`**Age:** ${ageInfo.join(', ')}`);
            }

            // Physical
            if (char.physical) {
                contentParts.push(`\\n**Physical Description:**\\n${char.physical}`);
            }

            // Personality
            if (char.personality) {
                contentParts.push(`\\n**Personality:**\\n${char.personality}`);
            }

            // Sexuality
            if (char.sexuality) {
                contentParts.push(`\\n**Sexuality:**\\n${char.sexuality}`);
            }

            // Race/Ethnicity
            if (char.raceEthnicity) {
                contentParts.push(`**Race/Ethnicity:** ${char.raceEthnicity}`);
            }

            // Role & Skills
            if (char.roleSkills) {
                contentParts.push(`\\n**Role & Skills:**\\n${char.roleSkills}`);
            }

            // Relationships
            if (char.relationships && char.relationships.length > 0) {
                contentParts.push('\\n**Relationships:**');
                char.relationships.forEach(rel => {
                    contentParts.push(`- ${rel}`);
                });
            }

            const content = contentParts.join('\\n');

            return `
---
KEYS: ${keys.join(', ')}
CONTENT:
${content}
`;
        }).join('\\n');

        return entries;
    });
}

/**
 * Get the maximum safe prompt length based on API context window
 * Uses actual token counts from messages when available
 * @returns {Promise<number>} Maximum prompt length in tokens
 */
async function getMaxPromptLength() {
    return (0,errors/* withErrorBoundary */.Xc)('getMaxPromptLength', async () => {
        const detectionLog = []; // Track detection attempts
        const logEntry = (msg) => {
            detectionLog.push(msg);
            console.log(`[NT-MaxContext] ${msg}`);
        };

        try {
            const llmConfig = await (0,core_settings/* getLLMConfig */.eU)();
            let maxContext = 8192; // Default minimum context
            let detectionMethod = 'fallback';

            logEntry(`Starting context detection for LLM source: ${llmConfig.source}`);

            if (llmConfig.source === 'ollama' && llmConfig.ollamaModel) {
                logEntry(`Using Ollama model: ${llmConfig.ollamaModel}`);
                // Get Ollama model's context size
                maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
                detectionMethod = 'ollama';
            } else {
                logEntry('Using SillyTavern context');
                // Use SillyTavern's context
                let context = null;

                try {
                    context = core_context.stContext.getContext();
                    logEntry('Successfully retrieved SillyTavern context');
                } catch (error) {
                    logEntry(`ERROR: Failed to get context: ${error.message}`);
                    context = null;
                }

                // Debug: Log all context properties
                if (context) {
                    try {
                        const contextKeys = Object.keys(context);
                        const relevantKeys = contextKeys.filter(k =>
                            k.toLowerCase().includes('max') ||
                            k.toLowerCase().includes('context') ||
                            k.toLowerCase().includes('token') ||
                            k.toLowerCase().includes('prompt'),
                        );
                        logEntry(`Available context properties: ${relevantKeys.join(', ')}`);
                    } catch (e) {
                        logEntry(`Error analyzing context keys: ${e.message}`);
                    }
                }

                // Try multiple possible paths for max context
                let detectedMaxContext = null;

                // Method 1: Direct maxContext property (PRIMARY)
                logEntry('Method 1: Checking context.maxContext...');
                if (context && typeof context.maxContext === 'number' && context.maxContext > 0) {
                    detectedMaxContext = context.maxContext;
                    logEntry(`✓ Method 1 SUCCESS: context.maxContext = ${detectedMaxContext}`);
                    detectionMethod = 'context.maxContext';
                } else {
                    const reason = !context ? 'context is null' :
                        typeof context.maxContext !== 'number' ? `type is ${typeof context.maxContext}` :
                            context.maxContext <= 0 ? `value is ${context.maxContext}` : 'unknown';
                    logEntry(`✗ Method 1 FAILED: ${reason}`);
                }

                // Method 2: extensionSettings.common.maxContext path (REMOVED - API doesn't exist)
                // This property path was incorrect and has been removed.
                // Use getMaxContextSize() instead.

                // Method 3: chat.maxContextSize path
                if (!detectedMaxContext) {
                    logEntry('Method 3: Checking context.chat.maxContextSize...');
                    if (context?.chat && typeof context.chat === 'object' && !Array.isArray(context.chat)) {
                        if (typeof context.chat.maxContextSize === 'number' && context.chat.maxContextSize > 0) {
                            detectedMaxContext = context.chat.maxContextSize;
                            logEntry(`✓ Method 3 SUCCESS: chat.maxContextSize = ${detectedMaxContext}`);
                            detectionMethod = 'chat.maxContextSize';
                        } else {
                            logEntry('✗ Method 3 FAILED: chat exists but maxContextSize is invalid');
                        }
                    } else {
                        logEntry('✗ Method 3 FAILED: chat path does not exist or is an array');
                    }
                }

                // Method 4: token_limit
                if (!detectedMaxContext) {
                    logEntry('Method 4: Checking context.token_limit...');
                    if (context && typeof context.token_limit === 'number' && context.token_limit > 0) {
                        detectedMaxContext = context.token_limit;
                        logEntry(`✓ Method 4 SUCCESS: token_limit = ${detectedMaxContext}`);
                        detectionMethod = 'token_limit';
                    } else {
                        logEntry('✗ Method 4 FAILED: token_limit is not valid');
                    }
                }

                // Method 5: amount_gen (maximum generation tokens)
                if (!detectedMaxContext) {
                    logEntry('Method 5: Checking context.amount_gen (fallback)...');
                    if (context && typeof context.amount_gen === 'number' && context.amount_gen > 0) {
                        // amount_gen is typically small (generation limit), not context size
                        // Use as indicator if no other value found
                        detectedMaxContext = context.amount_gen * 4; // Rough estimate
                        logEntry(`✓ Method 5 FALLBACK: amount_gen = ${context.amount_gen}, estimated context = ${detectedMaxContext}`);
                        detectionMethod = 'amount_gen_estimate';
                    } else {
                        logEntry('✗ Method 5 FAILED: amount_gen is not valid');
                    }
                }

                // Method 6: Check settings object directly
                if (!detectedMaxContext) {
                    logEntry('Method 6: Checking context.settings.max_context...');
                    if (context && typeof context.settings === 'object') {
                        if (typeof context.settings.max_context === 'number' && context.settings.max_context > 0) {
                            detectedMaxContext = context.settings.max_context;
                            logEntry(`✓ Method 6 SUCCESS: settings.max_context = ${detectedMaxContext}`);
                            detectionMethod = 'settings.max_context';
                        } else {
                            logEntry('✗ Method 6 FAILED: settings exists but max_context is invalid');
                        }
                    } else {
                        logEntry('✗ Method 6 FAILED: settings path does not exist');
                    }
                }

                // Final check: is detected value reasonable?
                if (detectedMaxContext && (typeof detectedMaxContext !== 'number' || detectedMaxContext < 100)) {
                    logEntry(`WARNING: Detected maxContext is not valid: ${detectedMaxContext}, type: ${typeof detectedMaxContext}`);
                    detectedMaxContext = null;
                }

                // Check if context is fully loaded
                if (!context || !detectedMaxContext) {
                    logEntry('WARNING: Could not detect maxContext from any path, using fallback (8192)');
                    logEntry(`Context exists: ${!!context}, detectedMaxContext: ${detectedMaxContext}`);
                    if (context) {
                        try {
                            const allKeys = Object.keys(context).sort();
                            logEntry(`Full context object keys (first 20): ${allKeys.slice(0, 20).join(', ')}${allKeys.length > 20 ? `... (${allKeys.length - 20} more)` : ''}`);
                        } catch (e) {
                            logEntry(`Could not enumerate context keys: ${e.message}`);
                        }
                    }
                    maxContext = 8192; // Use minimum required context as fallback
                    detectionMethod = 'fallback';
                } else {
                    maxContext = Math.floor(detectedMaxContext);
                    logEntry(`Detected maxContext: ${maxContext} (type: ${typeof maxContext})`);
                    // detectionMethod already set correctly
                }
            }

            // Validate minimum context requirement (8K minimum)
            if (maxContext < 8192) {
                const errorMsg = `Model context too small: ${maxContext} tokens. Minimum required: 8192 tokens. Please use a model with larger context.`;
                logEntry(errorMsg);
                throw new errors/* NameTrackerError */.S_(errorMsg);
            }

            // Use generous context allocation for prompts (60% for prompt, 40% for response)
            // Remove artificial 50K ceiling to use full available context
            const tokensForPrompt = Math.floor(maxContext * 0.6);

            logEntry(`Token allocation: maxContext=${maxContext}, promptAllocation=${tokensForPrompt}, responseAllocation=${maxContext - tokensForPrompt}`);
            logEntry(`Final detection method: ${detectionMethod}`);

            const finalValue = Math.max(1000, tokensForPrompt);
            logEntry(`Returning maxPromptLength: ${finalValue}`);

            // Return object with detection details
            return {
                maxPrompt: finalValue,
                detectionMethod: detectionMethod,
                maxContext: maxContext,
                debugLog: detectionLog.join('\n'),
            };
        } catch (error) {
            const errorMsg = `ERROR in getMaxPromptLength: ${error.message}`;
            logEntry(errorMsg);
            console.error('[NT-MaxContext] Stack:', error.stack);
            // Return conservative fallback on any error with details
            return {
                maxPrompt: 4915, // Based on 8192 minimum context with 60% allocation
                detectionMethod: 'error',
                maxContext: 8192, // Minimum required context
                debugLog: detectionLog.join('\n') + '\nFATAL ERROR: ' + error.message,
            };
        }
    });
}

/**
 * Calculate total token count for a batch of messages
 * Uses pre-calculated token counts from SillyTavern when available
 * @param {Array} messages - Array of chat message objects
 * @returns {Promise<number>} Total token count
 */
async function calculateMessageTokens(messages) {
    return (0,errors/* withErrorBoundary */.Xc)('calculateMessageTokens', async () => {
        const context = core_context.stContext.getContext();
        let totalTokens = 0;

        // Try to use pre-calculated token counts from message objects
        for (const msg of messages) {
            if (msg && typeof msg === 'object' && msg.extra && typeof msg.extra.token_count === 'number') {
                // SillyTavern stores token count in extra.token_count
                totalTokens += msg.extra.token_count;
            } else {
                // Fallback: use getTokenCountAsync for the message text
                const text = msg?.mes || msg?.message || String(msg);
                if (text && context.getTokenCountAsync) {
                    try {
                        const count = await context.getTokenCountAsync(text);
                        totalTokens += count;
                    // eslint-disable-next-line no-unused-vars
                    } catch (_error) {
                        llm_debug.log();
                        // Final fallback: rough estimate (4 chars per token)
                        totalTokens += Math.ceil(text.length / 4);
                    }
                } else {
                    // Character-based estimate
                    totalTokens += Math.ceil(text.length / 4);
                }
            }
        }

        return totalTokens;
    });
}

/**
 * Call SillyTavern's LLM using systemPrompt + prompt structure
 * Works in both Chat Completion and Text Completion modes
 * Retries up to 3 times with 2s delay on parse failures
 * @param {string} systemPrompt - System-level instructions
 * @param {string} prompt - User data/instructions to analyze
 * @param {string} prefill - Optional response prefill (e.g., "{" to force JSON)
 * @returns {Promise<Object>} Parsed JSON response
 */
async function callSillyTavern(systemPrompt, prompt, prefill = '', interactive = false) {
    return (0,errors/* withErrorBoundary */.Xc)('callSillyTavern', async () => {
        llm_debug.log();

        // Use SillyTavern.getContext() as recommended in official docs
        const context = core_context.stContext.getContext();

        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new errors/* NameTrackerError */.S_('No API connection available. Please connect to an API first.');
        }

        if (DEBUG_LOGGING) {
            console.log('[NT-ST-Call] Starting SillyTavern LLM call');
            console.log('[NT-ST-Call] System prompt length:', systemPrompt.length, 'characters');
            console.log('[NT-ST-Call] User prompt length:', prompt.length, 'characters');
            if (prefill) console.log('[NT-ST-Call] Prefill:', prefill);
            console.log('[NT-ST-Call] ========== PROMPT STRUCTURE START ==========');
            console.log('SYSTEM:', systemPrompt);
            console.log('USER:', prompt);
            if (prefill) console.log('PREFILL:', prefill);
            console.log('[NT-ST-Call] ========== PROMPT STRUCTURE END ==========');
        }

        // Calculate token counts separately for better tracking
        const maxContext = context.maxContext || 8192;
        let systemTokens, userTokens, totalPromptTokens;

        try {
            systemTokens = await context.getTokenCountAsync(systemPrompt);
            const userPromptText = prompt + (prefill ? '\n' + prefill : '');
            userTokens = await context.getTokenCountAsync(userPromptText);
            totalPromptTokens = systemTokens + userTokens;
        } catch (_error) {
            if (DEBUG_LOGGING) console.log('[NT-ST-Call] Token count failed, estimating:', _error.message);
            // Fallback to character-based estimation
            systemTokens = Math.ceil(systemPrompt.length / 4);
            const userPromptText = prompt + (prefill ? '\n' + prefill : '');
            userTokens = Math.ceil(userPromptText.length / 4);
            totalPromptTokens = systemTokens + userTokens;
        }

        // Calculate response length with 20% buffer
        const bufferTokens = Math.ceil(maxContext * 0.20); // 20% buffer
        const calculatedResponseLength = Math.max(1024, maxContext - totalPromptTokens - bufferTokens);

        // Log context usage tracking
        console.log('[NT-CONTEXT] ========== Context Usage Tracking ==========');
        console.log('[NT-CONTEXT] maxContext:', maxContext);
        console.log('[NT-CONTEXT] systemTokens:', systemTokens);
        console.log('[NT-CONTEXT] userTokens:', userTokens);
        console.log('[NT-CONTEXT] totalPromptTokens:', totalPromptTokens);
        console.log('[NT-CONTEXT] bufferTokens (20%):', bufferTokens);
        console.log('[NT-CONTEXT] calculatedResponseLength:', calculatedResponseLength);
        console.log('[NT-CONTEXT] contextUtilization:', ((totalPromptTokens / maxContext) * 100).toFixed(1) + '%');

        const maxTokens = calculatedResponseLength;
        llm_debug.log();

        // Retry logic: attempt up to 2 times with a short delay
        const MAX_RETRIES = 2;
        const RETRY_DELAY_MS = 2000;
        let lastError = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (DEBUG_LOGGING) {
                    console.log(`[NT-ST-Call] Attempt ${attempt}/${MAX_RETRIES}`);
                    console.log('[NT-ST-Call] 🔧 DEBUG: Token allocation details:');
                    console.log(`[NT-ST-Call] - maxContext: ${maxContext}`);
                    console.log(`[NT-ST-Call] - systemTokens: ${systemTokens}`);
                    console.log(`[NT-ST-Call] - userTokens: ${userTokens}`);
                    console.log(`[NT-ST-Call] - totalPromptTokens: ${totalPromptTokens}`);
                    console.log(`[NT-ST-Call] - calculated maxTokens: ${maxTokens}`);
                    console.log(`[NT-ST-Call] - buffer used: ${bufferTokens} tokens (20%)`);
                    console.log(`[NT-ST-Call] - actual responseLength param: ${maxTokens}`);
                    console.log('[NT-ST-Call] Calling generateRaw with params:', {
                        temperature: GENERATION_TEMPERATURE,
                        top_p: GENERATION_TOP_P,
                        top_k: GENERATION_TOP_K,
                        rep_pen: GENERATION_REP_PEN,
                        responseLength: maxTokens,
                    });
                }

                // Add /nothink suffix to instruct model to avoid thinking contamination
                // Escalate suffix on retries after contamination detection
                let promptWithSuffix = prompt + '\n\n/nothink';
                if (attempt > 1 && lastError?.code === 'THINKING_CONTAMINATION') {
                    // Use stronger prompt on retry after contamination
                    promptWithSuffix = prompt + '\n\n/nothink\n\nCRITICAL: OUTPUT ONLY VALID JSON - NO THINKING OR COMMENTARY';
                    console.log('[NT-ST-Call] Using escalated anti-thinking prompt on retry', attempt);
                }

                const result = await context.generateRaw({
                    systemPrompt,
                    prompt: promptWithSuffix,
                    prefill,
                    temperature: GENERATION_TEMPERATURE,
                    top_p: GENERATION_TOP_P,
                    top_k: GENERATION_TOP_K,
                    rep_pen: GENERATION_REP_PEN,
                    responseLength: maxTokens, // Use all available tokens for response (no 2048 limit)
                });

                if (DEBUG_LOGGING) {
                    console.log('[NT-ST-Call] ========== RAW API RESPONSE START ==========');
                    console.log('[NT-ST-Call] Response type:', typeof result);
                    console.log(JSON.stringify(result, null, 2));
                    console.log('[NT-ST-Call] ========== RAW API RESPONSE END ==========');

                    console.log('[NT-ST-Call] Raw result type:', typeof result);
                    console.log('[NT-ST-Call] Raw result object:', JSON.stringify(result).substring(0, 500));
                }

                // Extract text from chat completion response
                // Chat format: { choices: [{ message: { content: "..." } }] }
                // Text format: { choices: [{ text: "..." }] }
                let resultText = result;

                if (typeof result === 'object' && result.choices && Array.isArray(result.choices)) {
                    // Try chat completion format first
                    if (result.choices[0]?.message?.content) {
                        if (DEBUG_LOGGING) console.log('[NT-ST-Call] Detected chat completion format, extracting from choices[0].message.content');
                        resultText = result.choices[0].message.content;
                    }
                    // Fall back to text completion format
                    else if (result.choices[0]?.text) {
                        if (DEBUG_LOGGING) console.log('[NT-ST-Call] Detected text completion format, extracting from choices[0].text');
                        resultText = result.choices[0].text;
                    }
                }

                if (DEBUG_LOGGING) {
                    console.log('[NT-ST-Call] Extracted text type:', typeof resultText);
                    console.log('[NT-ST-Call] Extracted text length:', resultText ? resultText.length : 'null');
                    if (resultText && typeof resultText === 'string') {
                        console.log('[NT-ST-Call] Extracted text preview:', resultText.substring(0, 300));
                    }
                    console.log('[NT-ST-Call] ========== EXTRACTED TEXT START ==========');
                    console.log(resultText);
                    console.log('[NT-ST-Call] ========== EXTRACTED TEXT END ==========');
                }

                // Log raw response for debugging if debug mode enabled
                const debugMode = await (0,core_settings/* get_settings */.TJ)('debugMode');
                if (debugMode) {
                    logRawResponse(resultText, 'SillyTavern');
                }

                // Log actual response token usage
                try {
                    const responseTokens = await context.getTokenCountAsync(resultText);
                    console.log('[NT-CONTEXT] actualResponseTokens:', responseTokens);
                    console.log('[NT-CONTEXT] responseEfficiency:', ((responseTokens / calculatedResponseLength) * 100).toFixed(1) + '%');
                    console.log('[NT-CONTEXT] totalTokensUsed:', totalPromptTokens + responseTokens);
                    console.log('[NT-CONTEXT] totalContextUsed:', (((totalPromptTokens + responseTokens) / maxContext) * 100).toFixed(1) + '%');
                } catch (_error) {
                    console.log('[NT-CONTEXT] responseTokenCountError:', _error.message);
                    const estimatedTokens = Math.ceil(resultText.length / 4);
                    console.log('[NT-CONTEXT] estimatedResponseTokens:', estimatedTokens);
                }
                console.log('[NT-CONTEXT] ===============================================');

                llm_debug.log();

                // The result should be a string
                if (!resultText || typeof resultText !== 'string') {
                    throw new errors/* NameTrackerError */.S_('Empty or invalid response from SillyTavern LLM');
                }

                // Check for thinking contamination BEFORE attempting parse
                const isContaminated = detectThinkingContamination(resultText, calculatedResponseLength);
                if (isContaminated) {
                    const error = new errors/* NameTrackerError */.S_('LLM response contains thinking contamination - rejecting and will retry');
                    error.code = 'THINKING_CONTAMINATION';
                    throw error;
                }

                // Pre-validation: Check if response follows JSON format requirements
                console.log('[NT-ST-Call] 🔍 Pre-validation checks...');

                const trimmedResult = resultText.trim();

                // Check for common format violations before parsing
                if (!trimmedResult.startsWith('{')) {
                    console.warn('[NT-ST-Call] ⚠️ Response does not start with { - attempting extraction');
                    // Try to find JSON in the response
                    const jsonMatch = trimmedResult.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        resultText = jsonMatch[0];
                        console.log('[NT-ST-Call] ✅ Extracted JSON from response');
                    } else {
                        console.error('[NT-ST-Call] ❌ No valid JSON found in response');
                        throw new errors/* NameTrackerError */.S_('LLM response does not contain valid JSON format');
                    }
                }

                // Check for orphaned strings (common parsing issue)
                const orphanedStringPattern = /"[^"]+",\s*"[^"]*[a-zA-Z][^"]*",\s*"[a-zA-Z_]/;
                if (orphanedStringPattern.test(resultText)) {
                    console.warn('[NT-ST-Call] ⚠️ Detected potential orphaned strings in response');
                    console.log('[NT-ST-Call] Response will need JSON repair during parsing');
                }

                // If we used a prefill, prepend it to complete the JSON
                if (prefill) {
                    if (DEBUG_LOGGING) console.log('[NT-ST-Call] Prepending prefill to complete JSON:', prefill);
                    resultText = prefill + resultText;

                    // If the prefill opened an object but response doesn't close it, add closing brace
                    // Count braces to see if balanced
                    const openBraces = (resultText.match(/{/g) || []).length;
                    const closeBraces = (resultText.match(/}/g) || []).length;

                    if (openBraces > closeBraces) {
                        const missing = openBraces - closeBraces;
                        if (DEBUG_LOGGING) console.log(`[NT-ST-Call] Adding ${missing} closing brace(s) to complete JSON`);
                        resultText += '}'.repeat(missing);
                    }

                    if (DEBUG_LOGGING) console.log('[NT-ST-Call] Combined text preview:', resultText.substring(0, 300));
                }

                const parsed = await parseJSONResponse(resultText);
                console.log('[NT-ST-Call] parseJSONResponse returned type:', typeof parsed);
                console.log('[NT-ST-Call] parseJSONResponse returned value:', parsed);
                console.log('[NT-ST-Call] parsed.characters exists?:', parsed && 'characters' in parsed);
                console.log('[NT-ST-Call] parsed.characters type:', typeof parsed?.characters);
                console.log('[NT-ST-Call] parsed.characters is Array?:', Array.isArray(parsed?.characters));
                const parsedCount = Array.isArray(parsed?.characters) ? parsed.characters.length : 0;
                console.log('[NT-ST-Call] ✅ Successfully parsed on attempt', attempt, 'characters:', parsedCount);
                console.log('[NT-ST-Call] Parsed result:', JSON.stringify(parsed).substring(0, 300));
                return parsed;

            } catch (error) {
                lastError = error;
                console.error(`[NT-ST-Call] ❌ Attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
                console.error('[NT-ST-Call] Error details:', error);

                if (attempt < MAX_RETRIES) {
                    const waitStart = Date.now();
                    const waitSeconds = Math.round(RETRY_DELAY_MS / 100) / 10; // one decimal place
                    console.log(`[NT-ST-Call] Waiting ${RETRY_DELAY_MS}ms (~${waitSeconds}s) before retry...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    const waited = Date.now() - waitStart;
                    console.log(`[NT-ST-Call] Waited ${waited}ms before next attempt`);
                }
            }
        }

        // All retries failed
        if (interactive) {
            const shouldContinue = confirm(
                `Failed to parse LLM response after ${MAX_RETRIES} attempts.\n\n` +
                `Last error: ${lastError.message}\n\n` +
                'Check console for detailed logs. Continue processing remaining batches?',
            );

            if (!shouldContinue) {
                throw new errors/* NameTrackerError */.S_('User aborted after parse failures');
            }
            // Return empty result if user wants to continue
            return { characters: [] };
        }

        // Non-interactive mode: throw to allow outer logic to retry/split
        const err = new errors/* NameTrackerError */.S_(`Failed to parse LLM response as JSON after ${MAX_RETRIES} attempts (non-interactive mode)`);
        err.code = 'JSON_PARSE_FAILED';
        err.lastError = lastError;
        throw err;
    });
}

/**
 * Call Ollama API with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * @param {string} prompt - The complete prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
async function callOllama(prompt) {
    return (0,errors/* withErrorBoundary */.Xc)('callOllama', async () => {
        const llmConfig = await (0,core_settings/* getLLMConfig */.eU)();

        if (!llmConfig.ollamaModel) {
            throw new errors/* NameTrackerError */.S_('No Ollama model selected');
        }

        llm_debug.log();

        // Calculate response tokens: use generous allocation within available context
        const maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
        const promptTokens = Math.ceil(prompt.length / 4); // Rough estimate
        const maxTokens = Math.max(8192, maxContext - promptTokens - 1000); // Generous response allocation with safety buffer
        llm_debug.log();

        // Add /nothink suffix to instruct model to avoid thinking contamination
        const promptWithSuffix = prompt + '\n\n/nothink';

        const response = await fetch(`${llmConfig.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmConfig.ollamaModel,
                prompt: promptWithSuffix,
                stream: false,
                format: 'json',
                // Ollama-specific generation parameters for structured output
                // Using same conservative settings as SillyTavern for consistency
                options: {
                    temperature: GENERATION_TEMPERATURE,      // Very low for deterministic output
                    top_p: GENERATION_TOP_P,                  // Focused sampling
                    top_k: GENERATION_TOP_K,                  // Standard focused sampling
                    repeat_penalty: GENERATION_REP_PEN,       // Slight repetition penalty
                    num_predict: maxTokens,  // Dynamic: generous allocation using remaining context after prompt
                },
            }),
        });

        if (!response.ok) {
            throw new errors/* NameTrackerError */.S_(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        llm_debug.log();
        llm_debug.log();

        // Check for thinking contamination before parsing
        const responseText = data.response || '';
        const estimatedTokens = Math.ceil(responseText.length / 4);
        const isContaminated = detectThinkingContamination(responseText, estimatedTokens);

        if (isContaminated) {
            console.warn('[NT-Ollama] Response contaminated with thinking - attempting parse anyway (Ollama has no retry)');
            // Note: Ollama doesn't have built-in retry like SillyTavern, so we proceed with repair
        }

        return await parseJSONResponse(data.response);
    });
}

/**
 * Detect thinking contamination in LLM response (binary detection)
 * @param {string} text - LLM response text
 * @param {number} budgetTokens - Expected response budget in tokens
 * @returns {boolean} True if thinking contamination detected
 */
function detectThinkingContamination(text, budgetTokens = 5000) {
    console.log('[NT-Contamination] Checking for thinking contamination...');

    // Check 1: Response length exceeds budget by 2x
    const estimatedTokens = Math.ceil(text.length / 4);
    if (estimatedTokens > budgetTokens * 2.0) {
        console.log('[NT-Contamination] ❌ DETECTED: Response too long');
        console.log('[NT-Contamination] Estimated:', estimatedTokens, 'Budget:', budgetTokens, 'Ratio:', (estimatedTokens / budgetTokens).toFixed(2));
        return true;
    }

    // Check 2: Common thinking phrases
    const thinkingPhrases = [
        /however[,\s]/i,
        /let me (think|consider|analyze|reconsider)/i,
        /upon (reflection|analysis|consideration)/i,
        /it (seems|appears) that/i,
        /looking at (this|these|the)/i,
        /based on (this|these|the) (message|conversation|text)/i,
        /from (this|these|the) (message|conversation|text)/i,
        /these messages (reveal|show|indicate|suggest)/i,
        /this (message|conversation) (reveal|show|indicate|suggest)/i,
        /i (notice|observe|see) that/i,
        /we can (see|infer|deduce|conclude)/i,
        /this (indicates|suggests|shows)/i,
    ];

    for (const pattern of thinkingPhrases) {
        if (pattern.test(text)) {
            console.log('[NT-Contamination] ❌ DETECTED: Thinking phrase found:', pattern.source);
            return true;
        }
    }

    // Check 3: Unquoted prose patterns (text outside JSON structure)
    // Look for sentence-like patterns outside quotes
    const jsonStripped = text.replace(/"([^"]*)"/g, '""'); // Remove all string contents
    const sentencePattern = /[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/; // "Word word word" pattern
    if (sentencePattern.test(jsonStripped)) {
        console.log('[NT-Contamination] ❌ DETECTED: Unquoted prose pattern');
        return true;
    }

    // Check 4: Non-schema fields (common thinking artifacts)
    const nonSchemaFields = [
        /"thinking":/i,
        /"thoughts":/i,
        /"analysis":/i,
        /"reasoning":/i,
        /"notes":/i,
        /"commentary":/i,
        /"observations":/i,
    ];

    for (const pattern of nonSchemaFields) {
        if (pattern.test(text)) {
            console.log('[NT-Contamination] ❌ DETECTED: Non-schema field:', pattern.source);
            return true;
        }
    }

    // Check 5: XML-style thinking tags
    if (/<think>/i.test(text) || /<thinking>/i.test(text) || /<\/think>/i.test(text)) {
        console.log('[NT-Contamination] ❌ DETECTED: XML thinking tags');
        return true;
    }

    console.log('[NT-Contamination] ✅ No contamination detected');
    return false;
}

/**
 * Repair common JSON syntax errors in LLM responses
 * @param {string} text - Potentially malformed JSON text
 * @returns {string} Repaired JSON text
 */
function repairJSON(text) {
    console.log('[NT-Repair] Starting JSON repair...');
    let repaired = text;

    // 0. Remove XML thinking tags completely (critical fix for recent failures)
    repaired = repaired.replace(/<\/think>/gi, '');
    repaired = repaired.replace(/<think[^>]*>/gi, '');
    repaired = repaired.replace(/<thinking[^>]*>[\s\S]*?<\/thinking>/gi, '');
    repaired = repaired.replace(/<think>[\s\S]*?<\/think>/gi, '');
    if (repaired !== text) {
        console.log('[NT-Repair] 🧹 Removed XML thinking tags');
    }

    // 1. Fix major structural issue: orphaned string values without property names
    // This is the most common issue causing parse failures
    // Pattern: "property": "value", "orphaned description text", "nextProperty":
    // Step 1: Find and fix orphaned strings that should be in physical/personality fields
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]*(?:breast|body|hair|skin|face|eyes|tall|short|curvy|slim|muscular|describe|appear|look|physic)[^"]*)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/gi, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned physical description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // Step 2: Fix personality/mental descriptions
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]*(?:personality|character|behavior|emotion|feel|think|mental|psych|mood)[^"]*)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/gi, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned personality description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "personality": "${orphanedDesc}", "${nextProp}":`;
    });

    // Step 3: Generic fallback - assign any remaining orphaned strings to physical field
    repaired = repaired.replace(/"name":\s*"([^"]*)",\s*"([^"]{20,})",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/g, (match, name, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing generic orphaned description for ${name}: ${orphanedDesc.substring(0, 50)}...`);
        return `"name": "${name}", "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // 2. Fix orphaned strings anywhere in character objects (not just after name)
    // Pattern: }: value, "nextProp": (missing property name before value)
    repaired = repaired.replace(/},\s*"([^"]{15,})",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":/g, (match, orphanedDesc, nextProp) => {
        console.log(`[NT-Repair] 🔧 Fixing orphaned string before ${nextProp}: ${orphanedDesc.substring(0, 50)}...`);
        return `}, "physical": "${orphanedDesc}", "${nextProp}":`;
    });

    // 3. Fix missing commas between object properties (line breaks without commas)
    repaired = repaired.replace(/([}\]])\s*\n\s*(")/g, '$1,\n    $2');

    // 4. Fix control characters (newlines, tabs, etc. in strings) - ENHANCED
    repaired = repaired.replace(/"([^"]*[\n\r\t\f\b\v][^"]*)"/g, (match, content) => {
        const cleaned = content
            .replace(/\n/g, ' ')     // newlines -> space
            .replace(/\r/g, '')      // carriage returns -> remove
            .replace(/\t/g, ' ')     // tabs -> space
            .replace(/\f/g, ' ')     // form feeds -> space
            .replace(/\b/g, '')      // backspace -> remove
            .replace(/\v/g, ' ')     // vertical tabs -> space
            .replace(/\s+/g, ' ')    // collapse multiple spaces
            .trim();                 // remove leading/trailing space
        console.log(`[NT-Repair] 🧹 Cleaned control characters: ${content.length} -> ${cleaned.length} chars`);
        return `"${cleaned}"`;
    });

    // 5. Remove error messages that get mixed into JSON
    repaired = repaired.replace(/,\s*"[^"]*I'm sorry for[^"]*"/gi, '');
    repaired = repaired.replace(/,\s*"[^"]*encountered a problem[^"]*"/gi, '');
    repaired = repaired.replace(/,\s*"[^"]*Please try again[^"]*"/gi, '');
    repaired = repaired.replace(/"[^"]*I'm sorry[^"]*"\s*,/gi, '');

    // Remove property names that are error messages (missing opening quote)
    repaired = repaired.replace(/,\s*[A-Za-z]+"\s*:\s*"[^"]*I'm sorry[^"]*/gi, '');

    // 6. Fix missing quotes around property names (critical fix)
    // Pattern: ,Affected": or }Affected": (missing opening quote)
    repaired = repaired.replace(/([,{]\s*)([A-Za-z_][A-Za-z0-9_]*)("):/g, '$1"$2$3:');

    // 7. Fix trailing commas before closing brackets/braces
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    // 6. Fix missing colons after property names
    repaired = repaired.replace(/"([^"]+)"\s+(?=["'{[])/g, '"$1": ');

    // 7. Fix double commas introduced by repairs
    repaired = repaired.replace(/,,+/g, ',');

    // 8. Fix property names with spaces
    repaired = repaired.replace(/"([^"]*\s[^"]*)"\s*:/g, (match, propName) => {
        const cleanProp = propName.replace(/\s+/g, '');
        return `"${cleanProp}":`;
    });

    // 9. Final validation: ensure all character objects have required fields
    repaired = repaired.replace(/"name":\s*"([^"]*)"(?!\s*,\s*"(?:aliases|physical|personality))/g, (match, name) => {
        console.log(`[NT-Repair] 🔧 Adding missing fields for character: ${name}`);
        return `"name": "${name}", "aliases": [], "physical": "", "personality": ""`;
    });

    console.log('[NT-Repair] Applied repairs, length change:', repaired.length - text.length);

    return repaired;
}

/**
 * Parse JSON response from LLM, handling various formats
 * @param {string} text - Raw text response from LLM
 * @returns {Object} Parsed JSON object
 */
function parseJSONResponse(text) {
    return (0,errors/* withErrorBoundary */.Xc)('parseJSONResponse', async () => {
        // Create debug session if debug mode is enabled
        const debugMode = await (0,core_settings/* get_settings */.TJ)('debugMode');
        const session = debugMode ? createParsingSession() : null;

        if (session) {
            session.logStart('parseJSONResponse', text);
        }

        console.log('[NT-Parse] ========== PARSE START ==========');
        console.log('[NT-Parse] Input type:', typeof text);
        console.log('[NT-Parse] Input is null?:', text === null);
        console.log('[NT-Parse] Input is undefined?:', text === undefined);

        if (typeof text === 'object' && text !== null) {
            console.log('[NT-Parse] Input is an OBJECT (not string). Keys:', Object.keys(text));
            console.log('[NT-Parse] Full object:', JSON.stringify(text).substring(0, 500));

            // If it's already an object with characters, return it
            if (text.characters && Array.isArray(text.characters)) {
                console.log('[NT-Parse] Object already has characters array, returning as-is');
                return text;
            }
        }

        console.log('[NT-Parse] Input length:', text ? text.length : 'null');
        if (text && typeof text === 'string') {
            console.log('[NT-Parse] First 300 chars:', text.substring(0, 300));
            console.log('[NT-Parse] Last 100 chars:', text.substring(Math.max(0, text.length - 100)));
        }

        if (!text || typeof text !== 'string') {
            console.error('[NT-Parse] ❌ INVALID: Response is not a string:', typeof text);
            console.error('[NT-Parse] ❌ Response value:', text);
            throw new errors/* NameTrackerError */.S_('LLM returned empty or invalid response');
        }

        // CRITICAL: Unescape JSON-escaped string from SillyTavern
        // The API returns escaped JSON string that needs to be unescaped first
        try {
            // If text looks like a JSON-escaped string, unescape it
            if (text.includes('\\n') || text.includes('\\"')) {
                console.log('[NT-Parse] 🔧 Unescaping JSON-encoded string from SillyTavern');
                text = JSON.parse('"' + text.replace(/"/g, '\\"') + '"');
                console.log('[NT-Parse] ✅ Successfully unescaped response');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (unescapeError) {
            console.log('[NT-Parse] ⚠️ Could not unescape response, proceeding with raw text');
        }

        // Remove any leading/trailing whitespace
        const beforeTrim = text;
        text = text.trim();
        console.log('[NT-Parse] After trim, length:', text.length);

        if (session) {
            session.logTransform('Trim whitespace', beforeTrim, text);
        }

        if (text.length === 0) {
            console.error('[NT-Parse] ❌ Text is empty after trim');
            if (session) session.logEnd(false, new Error('Empty after trim'), text);
            throw new errors/* NameTrackerError */.S_('LLM returned empty response');
        }

        // Extract JSON from markdown code blocks ONLY if response starts with markdown
        // This prevents false positives from backticks embedded in JSON string values
        const startsWithMarkdown = /^```(?:json)?[\s\n]/.test(text);

        if (startsWithMarkdown) {
            console.log('[NT-Parse] 🔍 Response starts with markdown code block, extracting JSON');
            const beforeExtraction = text;

            // Extract content between first ``` and last ```
            const codeBlockMatch = text.match(/^```(?:json)?[\s\n]+([\s\S]*?)```\s*$/);
            if (codeBlockMatch && codeBlockMatch[1]) {
                text = codeBlockMatch[1].trim();
                console.log('[NT-Parse] 📄 After markdown extraction, length:', text.length);

                if (session) {
                    logRegexExtraction(beforeExtraction, '/^```(?:json)?[\\s\\n]+([\\s\\S]*?)```\\s*$/', text);
                    session.logTransform('Extract markdown code block', beforeExtraction, text, {
                        regex: '/^```(?:json)?[\\s\\n]+([\\s\\S]*?)```\\s*$/',
                    });
                }
            } else {
                console.warn('[NT-Parse] ⚠️ Starts with ``` but no matching closing ```, removing markdown markers');
                // Remove opening and closing markers
                text = text.replace(/^```(?:json)?[\s\n]+/, '').replace(/```\s*$/, '');
                console.log('[NT-Parse] 🧹 Removed markdown markers, length:', text.length);

                if (session) {
                    session.logTransform('Remove malformed markdown', beforeExtraction, text);
                }
            }
        } else if (text.includes('```')) {
            // Backticks present but NOT at start - likely embedded in JSON strings
            console.log('[NT-Parse] ℹ️ Found backticks in response but not at start - likely embedded in JSON strings, not extracting');
            console.log('[NT-Parse] First 50 chars:', text.substring(0, 50));
        }

        // Remove any remaining XML/HTML tags that may interfere
        if (text.includes('<') || text.includes('>')) {
            const beforeTagRemoval = text;
            const originalLength = text.length;
            text = text.replace(/<[^>]*>/g, '');
            console.log(`[NT-Parse] 🧹 Removed XML/HTML tags, length change: ${originalLength} -> ${text.length}`);

            if (session) {
                session.logTransform('Remove XML/HTML tags', beforeTagRemoval, text);
            }
        }

        // Check if response contains obvious error messages
        if (text.includes('I\'m sorry') || text.includes('encountered a problem') || text.includes('Please try again')) {
            console.error(`[NT-Parse] 🚨 Response contains error message: "${text.substring(0, 200)}"`);
            if (session) session.logEnd(false, new Error('LLM error message'), text);
            throw new Error('LLM generated an error response instead of JSON. Try adjusting your request.');
        }

        // Check if response is completely non-JSON (like pure XML tags or text)
        if (text.length < 20 || (!text.includes('{') && !text.includes('['))) {
            console.error(`[NT-Parse] 🚨 Response appears to be non-JSON content: "${text}"`);
            if (session) session.logEnd(false, new Error('Non-JSON response'), text);
            throw new Error('LLM generated non-JSON response. Response may be censored or malformed.');
        }

        // Try to find JSON object in the text (look for first { to last })
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        console.log('[NT-Parse] Brace search: first={' + firstBrace + ', last=' + lastBrace + '}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const beforeText = text.substring(0, firstBrace);
            const jsonText = text.substring(firstBrace, lastBrace + 1);
            const afterText = text.substring(lastBrace + 1);

            console.log('[NT-Parse] Text before JSON:', beforeText.substring(0, 100));
            console.log('[NT-Parse] Extracted JSON length:', jsonText.length);
            console.log('[NT-Parse] Text after JSON:', afterText.substring(0, 100));

            text = jsonText;
        }

        // Remove common prefixes that LLMs add
        text = text.replace(/^(?:Here's the analysis:|Here is the JSON:|Result:|Output:)\s*/i, '');

        // Clean up common formatting issues
        text = text.trim();

        // Apply JSON repair for common LLM syntax errors
        text = repairJSON(text);

        console.log('[NT-Parse] Before JSON.parse, length:', text.length);
        console.log('[NT-Parse] First 200 chars:', text.substring(0, 200));
        console.log('[NT-Parse] Last 100 chars:', text.substring(Math.max(0, text.length - 100)));

        try {
            console.log('[NT-Parse] Attempting JSON.parse...');
            const parsed = JSON.parse(text);

            console.log('[NT-Parse] ✅ Successfully parsed JSON');
            console.log('[NT-Parse] Parsed type:', typeof parsed);
            console.log('[NT-Parse] Parsed keys:', Object.keys(parsed));
            console.log('[NT-Parse] Full parsed object:', JSON.stringify(parsed).substring(0, 500));

            // Validate structure
            if (!parsed.characters) {
                console.warn('[NT-Parse] ⚠️  parsed.characters is undefined or null');
                console.warn('[NT-Parse] Available keys in object:', Object.keys(parsed));
            } else if (!Array.isArray(parsed.characters)) {
                console.warn('[NT-Parse] ⚠️  parsed.characters exists but is NOT an array. Type:', typeof parsed.characters);
                console.warn('[NT-Parse] Value:', parsed.characters);
            }

            if (!parsed.characters || !Array.isArray(parsed.characters)) {
                console.warn('[NT-Parse] ❌ Response missing characters array, returning empty');
                console.warn('[NT-Parse] Full parsed object:', parsed);
                return { characters: [] };
            }

            console.log('[NT-Parse] ✅ Valid response with', parsed.characters.length, 'characters');
            console.log('[NT-Parse] ========== PARSE END (SUCCESS) ==========');

            if (session) {
                session.logEnd(true, parsed, text);
            }

            return parsed;
        } catch (error) {
            console.error('[NT-Parse] ❌ JSON.parse failed:', error.message);
            console.error('[NT-Parse] ❌ Error at position:', error.name);
            console.log('[NT-Parse] Text being parsed (first 500 chars):', text.substring(0, 500));
            console.log('[NT-Parse] Text being parsed (last 200 chars):', text.substring(Math.max(0, text.length - 200)));

            // Additional targeted repairs for specific common errors
            if (error.message.includes('Expected \':\'') || error.message.includes('after property name')) {
                console.log('[NT-Parse] Attempting targeted repair for missing property names...');

                let targetedRepair = text;

                // Specific fix for pattern: "name": "value", "orphaned description", "nextProp":
                // This is the exact pattern causing most failures
                targetedRepair = targetedRepair.replace(
                    /"name":\s*"([^"]*)",\s*"([^"]+)",\s*"([a-zA-Z_][a-zA-Z0-9_]*)":\s*/g,
                    (match, name, orphanedText, nextProp) => {
                        console.log(`[NT-Parse] 🎯 Targeted repair: assigning "${orphanedText.substring(0, 30)}..." to physical for ${name}`);
                        return `"name": "${name}", "physical": "${orphanedText}", "${nextProp}": `;
                    },
                );

                // Try parsing again with targeted repair
                try {
                    const repairedParsed = JSON.parse(targetedRepair);
                    console.log('[NT-Parse] ✅ Targeted repair successful!');
                    console.log('[NT-Parse] ========== PARSE END (TARGETED REPAIR) ==========');
                    return repairedParsed;
                } catch (repairError) {
                    console.error('[NT-Parse] ❌ Targeted repair also failed:', repairError.message);
                }
            }

            // Check if response was truncated (common issue with long responses)
            if (text.includes('"characters"') && !text.trim().endsWith('}')) {
                console.log('[NT-Parse] Detected truncated response, attempting recovery...');

                // Try to salvage partial data by attempting to close the JSON
                let salvaged = text;

                // Count open vs closed braces to determine how many we need
                const openBraces = (text.match(/\{/g) || []).length;
                const closeBraces = (text.match(/\}/g) || []).length;
                const openBrackets = (text.match(/\[/g) || []).length;
                const closeBrackets = (text.match(/\]/g) || []).length;

                console.log('[NT-Parse] Recovery attempt - braces: open=' + openBraces + ' close=' + closeBraces + ', brackets: open=' + openBrackets + ' close=' + closeBrackets);

                // Try to close incomplete strings and objects
                if (salvaged.match(/"[^"]*$/)) {
                    // Has unclosed quote
                    console.log('[NT-Parse] Adding closing quote');
                    salvaged += '"';
                }

                // Close missing brackets/braces
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    salvaged += ']';
                }
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    salvaged += '}';
                }

                console.log('[NT-Parse] Salvaged text length:', salvaged.length);
                console.log('[NT-Parse] Attempting to parse salvaged content...');

                try {
                    const recovered = JSON.parse(salvaged);
                    console.log('[NT-Parse] ✅ Successfully recovered JSON with', recovered.characters?.length || 0, 'characters');
                    console.log('[NT-Parse] ========== PARSE END (RECOVERED) ==========');
                    return recovered;
                } catch (e) {
                    console.error('[NT-Parse] ❌ Recovery failed:', e.message);
                    console.error('[NT-Parse] Salvaged text (first 500):', salvaged.substring(0, 500));
                }
            }

            console.log('[NT-Parse] ========== PARSE END (FAILED) ==========');

            if (session) {
                session.logEnd(false, error, text);
            }

            // Provide specific feedback about the JSON error
            let errorHelp = 'Failed to parse LLM response as JSON.';
            if (error.message.includes('Expected \':\'') || error.message.includes('after property name')) {
                errorHelp = 'JSON parsing failed: Missing colon after property name or orphaned string without property. The LLM likely generated a description without specifying which field it belongs to.';
            } else if (error.message.includes('Unexpected token')) {
                errorHelp = 'JSON parsing failed: Unexpected character found. Check for missing quotes, commas, or control characters.';
            } else if (error.message.includes('Unexpected end')) {
                errorHelp = 'JSON parsing failed: Response appears truncated. Try analyzing fewer messages at once.';
            }

            throw new errors/* NameTrackerError */.S_(errorHelp);
        }
    });
}

/**
 * Call LLM for character analysis with automatic batch splitting if prompt is too long
 * and adaptive splitting when parse/output failures occur.
 * @param {Array} messageObjs - Array of message objects (with .mes property) or strings
 * @param {string} knownCharacters - Roster of previously identified characters
 * @param {number} depth - Recursion depth (for logging)
 * @param {number} retryCount - Number of retries attempted (simple backoff)
 * @param {number} splitAttempts - Number of times this failing batch has been split
 * @returns {Promise<Object>} Analysis result with merged characters
 */
async function callLLMAnalysis(messageObjs, knownCharacters = '', depth = 0, retryCount = 0, splitAttempts = 0) {
    return (0,errors/* withErrorBoundary */.Xc)('callLLMAnalysis', async () => {
        const llmConfig = await (0,core_settings/* getLLMConfig */.eU)();
        const maxPromptResult = await getMaxPromptLength(); // Dynamic based on API context window
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const MAX_SIMPLE_RETRIES = 1;   // retry count after first failure (total 2 attempts)
        const MAX_SPLIT_ATTEMPTS = 2;   // how many times we can split on failure (up to 4 chunks)

        llm_debug.log();

        // Extract message text
        const messages = messageObjs.map(msg => {
            if (typeof msg === 'string') return msg;
            if (msg.mes) return msg.mes;
            if (msg.message) return msg.message;
            return JSON.stringify(msg);
        });

        // Create cache key
        const cacheKey = (0,helpers/* simpleHash */.tx)(messages.join('\\n') + llmConfig.source + llmConfig.ollamaModel);

        // Check cache
        if (analysisCache.has(cacheKey)) {
            llm_debug.log();
            return analysisCache.get(cacheKey);
        }

        // Build the prompt
        const messagesText = messages.map((msg, idx) => `Message ${idx + 1}:\\n${msg}`).join('\\n\\n');

        // Get system prompt
        let systemPrompt = await getSystemPrompt();
        console.log('[NT-Prompt] getSystemPrompt() returned type:', typeof systemPrompt);

        // Handle if it's still not a string
        if (typeof systemPrompt !== 'string') {
            console.warn('[NT-Prompt] systemPrompt is not a string, using default. Type:', typeof systemPrompt, 'Value:', systemPrompt);
            systemPrompt = DEFAULT_SYSTEM_PROMPT;
        }

        // Get character roster and ensure it's a string
        let rosterStr = knownCharacters || '';
        console.log('[NT-Prompt] knownCharacters type:', typeof rosterStr);

        // Handle if it's a Promise
        if (rosterStr && typeof rosterStr === 'object' && typeof rosterStr.then === 'function') {
            console.warn('[NT-Prompt] knownCharacters is Promise, awaiting...');
            rosterStr = await rosterStr;
            console.log('[NT-Prompt] After await, type:', typeof rosterStr);
        }

        // Ensure it's a string
        rosterStr = String(rosterStr || '');

        console.log('[NT-Prompt] Final systemPrompt length:', systemPrompt.length);
        console.log('[NT-Prompt] Final rosterStr length:', rosterStr.length);
        console.log('[NT-Prompt] systemPrompt preview:', systemPrompt.substring(0, 100));

        // Inject character roster into system prompt using template placeholder
        const systemMessage = systemPrompt.replace('{{CHARACTER_ROSTER}}', rosterStr);

        // Build user prompt with data
        const userPrompt = '[DATA TO ANALYZE]\n' + messagesText;

        // No prefill - let model generate complete JSON from system prompt guidance
        const prefill = '';

        // Calculate actual token count for the combined messages
        let promptTokens;
        const combinedText = systemMessage + '\n\n' + userPrompt;
        try {
            promptTokens = await calculateMessageTokens([{ mes: combinedText }]);
            llm_debug.log();
        } catch {
            llm_debug.log();
            // Fallback to character-based estimate
            promptTokens = Math.ceil(combinedText.length / 4);
        }

        // If prompt is too long, split into sub-batches
        if (promptTokens > maxPromptTokens && messageObjs.length > 1) {
            llm_debug.log();

            // Split roughly in half
            const midpoint = Math.floor(messageObjs.length / 2);
            const firstHalf = messageObjs.slice(0, midpoint);
            const secondHalf = messageObjs.slice(midpoint);

            llm_debug.log();

            // Analyze both halves in parallel
            const [result1, result2] = await Promise.all([
                callLLMAnalysis(firstHalf, knownCharacters, depth + 1, 0, splitAttempts),
                callLLMAnalysis(secondHalf, knownCharacters, depth + 1, 0, splitAttempts),
            ]);

            // Merge the results
            const mergedResult = {
                characters: [
                    ...(result1.characters || []),
                    ...(result2.characters || []),
                ],
            };

            llm_debug.log();
            return mergedResult;
        }

        // Prompt is acceptable length, proceed with analysis
        llm_debug.log(`Calling LLM with prompt (${promptTokens} tokens)...`);
        console.log(`[NT-Prompt] Composition: SYSTEM(${systemMessage.length} chars) + USER(${userPrompt.length} chars) + PREFILL`);

        let result;

        try {
            if (llmConfig.source === 'ollama') {
                // Ollama still uses flat prompt for now
                const flatPrompt = systemMessage + '\n\n' + userPrompt + '\n' + prefill;
                result = await callOllama(flatPrompt);
            } else {
                // Use non-interactive mode so outer logic can handle retries/splitting
                result = await callSillyTavern(systemMessage, userPrompt, prefill, false);
            }
        } catch (error) {
            const isRetryable = error.message.includes('JSON')
                || error.message.includes('empty')
                || error.message.includes('truncated');

            // First retry: try the same batch once with backoff
            if (isRetryable && retryCount < MAX_SIMPLE_RETRIES) {
                llm_debug.log();

                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
                await new Promise(resolve => setTimeout(resolve, delay));

                return await callLLMAnalysis(messageObjs, knownCharacters, depth, retryCount + 1, splitAttempts);
            }

            // Subsequent retries: split the current failing batch into halves (up to 4 chunks total)
            if (isRetryable && messageObjs.length > 1 && splitAttempts < MAX_SPLIT_ATTEMPTS) {
                const midpoint = Math.floor(messageObjs.length / 2);
                const firstHalf = messageObjs.slice(0, midpoint);
                const secondHalf = messageObjs.slice(midpoint);

                const [result1, result2] = await Promise.all([
                    callLLMAnalysis(firstHalf, knownCharacters, depth + 1, 0, splitAttempts + 1),
                    callLLMAnalysis(secondHalf, knownCharacters, depth + 1, 0, splitAttempts + 1),
                ]);

                return {
                    characters: [
                        ...(result1.characters || []),
                        ...(result2.characters || []),
                    ],
                };
            }

            // Max retries/splits exceeded or non-retryable error
            throw error;
        }

        // Check for empty response and retry once with stronger emphasis
        if (result && Array.isArray(result.characters) && result.characters.length === 0 && retryCount === 0) {
            console.warn('[NT-LLM] Empty response detected, retrying with stronger user character emphasis...');

            // Add stronger user character requirement to the user prompt
            const retryUserPrompt = userPrompt + '\n\nCRITICAL ERROR: Previous response was empty. You MUST return at minimum the user character ({{user}}) with any available details from these messages. An empty character list is INVALID.';

            try {
                let retryResult;
                if (llmConfig.source === 'ollama') {
                    const retryFlatPrompt = systemMessage + '\n\n' + retryUserPrompt + '\n' + prefill;
                    retryResult = await callOllama(retryFlatPrompt);
                } else {
                    retryResult = await callSillyTavern(systemMessage, retryUserPrompt, prefill, false);
                }

                if (retryResult && Array.isArray(retryResult.characters) && retryResult.characters.length > 0) {
                    console.log('[NT-LLM] Retry successful, got', retryResult.characters.length, 'characters');
                    result = retryResult;
                } else {
                    console.error('[NT-LLM] Retry also returned empty, proceeding with empty result');
                }
            } catch (retryError) {
                console.error('[NT-LLM] Retry failed:', retryError.message, 'proceeding with original empty result');
            }
        }

        // Cache the result only if we have characters
        if (result && Array.isArray(result.characters) && result.characters.length > 0) {
            if (analysisCache.size > 50) {
                // Clear oldest entries if cache is getting too large
                const firstKey = analysisCache.keys().next().value;
                analysisCache.delete(firstKey);
            }
            analysisCache.set(cacheKey, result);
        } else {
            console.warn('[NT-Cache] Skipping cache because result is empty or has no characters');
        }

        llm_debug.log();
        return result;
    });
}

/**
 * Clear the analysis cache
 */
function clearAnalysisCache() {
    analysisCache.clear();
    llm_debug.log();
}

/**
 * Get analysis cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
    return {
        size: analysisCache.size,
        entries: [...analysisCache.keys()].map(key => ({
            key: key.substring(0, 8) + '...',
            timestamp: Date.now(),
        })),
    };
}

// End of module


/***/ },

/***/ 314
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ 354
(module) {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ },

/***/ 462
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S_: () => (/* binding */ NameTrackerError),
/* harmony export */   Xc: () => (/* binding */ withErrorBoundary),
/* harmony export */   r_: () => (/* binding */ errorHandler)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/**
 * Error handling and recovery system for Name Tracker extension
 * Provides error boundaries, graceful degradation, and transaction rollback
 */



const logger = _debug_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].createModuleLogger */ .Ay.createModuleLogger('ErrorHandler');

class NameTrackerError extends Error {
    constructor(message, code, module, recoverable = true) {
        super(message);
        this.name = 'NameTrackerError';
        this.code = code;
        this.module = module;
        this.recoverable = recoverable;
        this.timestamp = Date.now();
    }
}

class ErrorHandler {
    constructor() {
        this.errorHistory = [];
        this.transactionStack = [];
        this.recoveryStrategies = new Map();
        this.criticalErrorCallbacks = [];
    }

    /**
     * Create error boundary for a module operation
     * @param {string} moduleName - Module name
     * @param {Function} operation - Operation to execute
     * @param {Object} options - Error handling options
     * @returns {Promise<any>} Operation result or error recovery result
     */
    async withErrorBoundary(moduleName, operation, options = {}) {
        const {
            fallback = null,
            retries = 0,
            silent = false,
            operationId = null,
        } = options;

        let lastError = null;
        const startTime = Date.now();

        if (operationId) {
            logger.trace(operationId, `Starting operation in ${moduleName}`);
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await operation();

                if (operationId) {
                    logger.trace(operationId, `Operation completed successfully in ${moduleName}`);
                }

                return result;
            } catch (error) {
                console.log(`[NT-Errors] Error caught in ${moduleName}:`, error);
                lastError = error;

                if (attempt < retries) {
                    console.log(`[NT-Errors] Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    logger.warn(`Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    await this.delay(Math.pow(2, attempt) * 100); // Exponential backoff
                    continue;
                }
            }
        }

        // All retries failed
        console.log(`[NT-Errors] All retries failed in ${moduleName}, tracking error:`, lastError);
        const trackedError = this.trackError(lastError, moduleName, {
            operation: operation.name || 'anonymous',
            duration: Date.now() - startTime,
            retries: retries,
            operationId: operationId,
        });

        if (!silent) {
            console.log(`[NT-Errors] Notifying user of error in ${moduleName}`);
            this.notifyUser(trackedError);
        }

        // Try recovery strategy
        if (fallback) {
            try {
                logger.debug(`Attempting fallback for ${moduleName}:`, trackedError.code);
                return await fallback(trackedError);
            } catch (fallbackError) {
                logger.error(`Fallback failed for ${moduleName}:`, fallbackError);
            }
        }

        // Check if we have a recovery strategy
        const recovery = this.recoveryStrategies.get(trackedError.code);
        if (recovery) {
            try {
                return await recovery(trackedError);
            } catch (recoveryError) {
                logger.error(`Recovery strategy failed for ${trackedError.code}:`, recoveryError);
            }
        }

        throw trackedError;
    }

    /**
     * Track and categorize errors
     * @param {Error} error - Original error
     * @param {string} moduleName - Module where error occurred
     * @param {Object} context - Additional context
     * @returns {NameTrackerError} Tracked error
     */
    trackError(error, moduleName, context = {}) {
        let trackedError;

        if (error instanceof NameTrackerError) {
            trackedError = error;
        } else {
            // Categorize common error types
            const code = this.categorizeError(error, moduleName);
            trackedError = new NameTrackerError(
                error.message,
                code,
                moduleName,
                this.isRecoverable(error, code),
            );
        }

        trackedError.context = context;
        this.errorHistory.push(trackedError);

        // Keep only last 100 errors
        if (this.errorHistory.length > 100) {
            this.errorHistory.shift();
        }

        logger.error(`Error in ${moduleName}:`, {
            code: trackedError.code,
            message: trackedError.message,
            context: context,
        });

        return trackedError;
    }

    /**
     * Categorize error types for better handling
     * @param {Error} error - Original error
     * @param {string} moduleName - Module name
     * @returns {string} Error code
     */
    categorizeError(error, moduleName) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
            return 'NETWORK_ERROR';
        }

        if (error.message.includes('JSON') || error.message.includes('parse')) {
            return 'DATA_FORMAT_ERROR';
        }

        if (error.message.includes('context') || error.message.includes('SillyTavern')) {
            return 'CONTEXT_ERROR';
        }

        if (error.name === 'TypeError') {
            return 'TYPE_ERROR';
        }

        if (moduleName === 'LLM' && (error.message.includes('quota') || error.message.includes('rate'))) {
            return 'API_LIMIT_ERROR';
        }

        return 'UNKNOWN_ERROR';
    }

    /**
     * Determine if an error is recoverable
     * @param {Error} error - Original error
     * @param {string} code - Error code
     * @returns {boolean} Whether error is recoverable
     */
    isRecoverable(error, code) {
        const nonRecoverableErrors = [
            'CONTEXT_ERROR',
            'TYPE_ERROR',
        ];

        return !nonRecoverableErrors.includes(code);
    }

    /**
     * Start a transaction for rollback capability
     * @param {string} transactionId - Unique transaction identifier
     * @param {Object} initialState - State to potentially rollback to
     */
    startTransaction(transactionId, initialState) {
        this.transactionStack.push({
            id: transactionId,
            state: JSON.stringify(initialState),
            timestamp: Date.now(),
        });

        logger.debug(`Started transaction: ${transactionId}`);
    }

    /**
     * Commit a transaction (remove from rollback stack)
     * @param {string} transactionId - Transaction identifier
     */
    commitTransaction(transactionId) {
        const index = this.transactionStack.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            this.transactionStack.splice(index, 1);
            logger.debug(`Committed transaction: ${transactionId}`);
        }
    }

    /**
     * Rollback a transaction
     * @param {string} transactionId - Transaction identifier
     * @returns {Object|null} Previous state or null if not found
     */
    rollbackTransaction(transactionId) {
        const index = this.transactionStack.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            const transaction = this.transactionStack.splice(index, 1)[0];
            logger.debug(`Rolled back transaction: ${transactionId}`);
            return JSON.parse(transaction.state);
        }
        return null;
    }

    /**
     * Register a recovery strategy for specific error codes
     * @param {string} errorCode - Error code to handle
     * @param {Function} strategy - Recovery function
     */
    registerRecoveryStrategy(errorCode, strategy) {
        this.recoveryStrategies.set(errorCode, strategy);
        logger.debug(`Registered recovery strategy for: ${errorCode}`);
    }

    /**
     * Register callback for critical errors
     * @param {Function} callback - Function to call on critical errors
     */
    onCriticalError(callback) {
        this.criticalErrorCallbacks.push(callback);
    }

    /**
     * Notify user of errors via toastr
     * @param {NameTrackerError} error - Error to display
     */
    notifyUser(error) {
        const message = `Name Tracker: ${error.message}`;

        if (error.recoverable) {
            toastr.warning(message, 'Warning', { timeOut: 5000 });
        } else {
            toastr.error(message, 'Error', { timeOut: 8000 });

            // Notify critical error callbacks
            this.criticalErrorCallbacks.forEach(callback => {
                try {
                    callback(error);
                } catch (callbackError) {
                    logger.error('Critical error callback failed:', callbackError);
                }
            });
        }
    }

    /**
     * Get recent error history
     * @param {number} count - Number of recent errors to return
     * @returns {Array} Recent errors
     */
    getRecentErrors(count = 10) {
        return this.errorHistory.slice(-count);
    }

    /**
     * Clear error history
     */
    clearHistory() {
        this.errorHistory = [];
        logger.debug('Cleared error history');
    }

    /**
     * Utility delay function for retries
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Delay promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const errorHandler = new ErrorHandler();


const withErrorBoundary = errorHandler.withErrorBoundary.bind(errorHandler);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (errorHandler)));


/***/ },

/***/ 540
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ 548
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PL: () => (/* binding */ getSetting),
/* harmony export */   TJ: () => (/* binding */ get_settings),
/* harmony export */   ZC: () => (/* binding */ setSetting),
/* harmony export */   bg: () => (/* binding */ getCharacters),
/* harmony export */   e7: () => (/* binding */ setCharacter),
/* harmony export */   eU: () => (/* binding */ getLLMConfig),
/* harmony export */   gf: () => (/* binding */ getLorebookConfig),
/* harmony export */   nF: () => (/* binding */ setChatData),
/* harmony export */   nT: () => (/* binding */ set_settings),
/* harmony export */   qN: () => (/* binding */ getCharacter),
/* harmony export */   sr: () => (/* binding */ removeCharacter),
/* harmony export */   yb: () => (/* binding */ set_chat_metadata),
/* harmony export */   zB: () => (/* binding */ getChatData)
/* harmony export */ });
/* unused harmony exports MODULE_NAME, DEFAULT_SETTINGS, DEFAULT_CHAT_DATA, setCharacters, addCharacter, getSettings, get_chat_metadata */
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(462);
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(806);
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(102);
/**
 * Simplified settings management for Name Tracker extension
 * Uses SillyTavern standard patterns with preserved error handling
 */





const MODULE_NAME = 'STnametracker';
const debug = (0,_debug_js__WEBPACK_IMPORTED_MODULE_1__/* .createModuleLogger */ .Xv)('Settings');

// Cache for context availability to avoid repeated null checks
let contextAvailable = false;
let lastContextCheck = 0;
const CONTEXT_CHECK_INTERVAL = 100; // Check every 100ms max
let hasLoggedUnavailable = false; // Only log warning once

function getContextSettings() {
    // CORRECTED: Use direct global access pattern (MessageSummarize/Codex/Nicknames pattern)
    // All reference extensions use window.extension_settings[MODULE_NAME] directly,
    // NOT through context.extension_settings (which doesn't exist)
    
    // Check if window.extension_settings is available
    if (!window.extension_settings) {
        return {
            extSettings: null,
            saveSettings: null,
        };
    }

    // Get context for saveSettingsDebounced
    const context = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getContext();
    
    return {
        extSettings: window.extension_settings,  // Direct global access
        saveSettings: context?.saveSettingsDebounced || null,
    };
}

// Default settings structure
const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    autoAnalyze: true,
    messageFrequency: 10,
    llmSource: 'sillytavern', // 'sillytavern' or 'ollama'
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: '',
    confidenceThreshold: 70,
    lorebookPosition: 0, // after character defs
    lorebookDepth: 1,
    lorebookCooldown: 10,
    lorebookScanDepth: 1,
    lorebookProbability: 100,
    lorebookEnabled: true,
    debugMode: false,
    systemPrompt: null, // null means use default
    maxResponseTokens: 5000, // Maximum tokens for LLM response (budget cap)
    lastScannedMessageId: -1,
    totalCharactersDetected: 0,
    lastAnalysisTime: null,
    analysisCache: new Map(),
});

// Default chat-level data structure
const DEFAULT_CHAT_DATA = Object.freeze({
    characters: {},
    lastScannedMessageId: -1,
    analysisHistory: [],
    lorebookEntries: {},
    processingStats: {
        totalProcessed: 0,
        charactersFound: 0,
        lastProcessedTime: null,
    },
});

/**
 * Get current settings with defaults
 * @returns {Object} Current settings
 */
function get_settings() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', () => {
        const { extSettings } = getContextSettings();
        if (!extSettings) {
            // Only log once to avoid console spam
            if (!hasLoggedUnavailable) {
                console.warn('[STnametracker] extension_settings not yet available, using defaults');
                hasLoggedUnavailable = true;
            }
            return { ...DEFAULT_SETTINGS };
        }

        // Context now available, reset warning flag for next session
        hasLoggedUnavailable = false;

        // Initialize if not exists
        let needsSave = false;
        if (!extSettings[MODULE_NAME]) {
            console.log('[STnametracker] First-time initialization: creating default settings');
            extSettings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
            needsSave = true;
        }

        // Merge with defaults to ensure all properties exist
        const settings = { ...DEFAULT_SETTINGS, ...extSettings[MODULE_NAME] };
        
        // Persist defaults if this was first initialization
        if (needsSave && saveSettings && typeof saveSettings === 'function') {
            console.log('[STnametracker] Saving default settings to persist them');
            saveSettings();
        }
        
        return settings;
    }, { ...DEFAULT_SETTINGS });
}

/**
 * Update settings and save
 * @param {Object} newSettings - Settings to update
 */
function set_settings(newSettings) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', () => {
        const { extSettings, saveSettings } = getContextSettings();
        if (!extSettings) {
            console.warn('[STnametracker] extension_settings not available for saving');
            return;
        }

        // Initialize if not exists
        if (!extSettings[MODULE_NAME]) {
            extSettings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Update settings
        Object.assign(extSettings[MODULE_NAME], newSettings);

        // Save to SillyTavern
        if (typeof saveSettings === 'function') {
            saveSettings();
        }
    });
}

/**
 * Get current chat characters
 * @returns {Object} Chat characters data
 */
function getCharacters() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME].characters || {};
        } catch (error) {
            debug.warn('Failed to get characters:', error.message);
            return {};
        }
    }, {});
}

/**
 * Update chat characters and save
 * @param {Object} characters - Characters data to save
 */
async function setCharacters(characters) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', async () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update characters
            metadata[MODULE_NAME].characters = characters;

            // CRITICAL: AWAIT the save to complete before returning
            await _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveMetadata();
        } catch (error) {
            debug.warn('Failed to set characters:', error.message);
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Get chat-level data
 * @returns {Object} Chat metadata
 */
function getChatData() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME];
        } catch (error) {
            debug.warn('Failed to get chat data:', error.message);
            return { ...DEFAULT_CHAT_DATA };
        }
    }, { ...DEFAULT_CHAT_DATA });
}

/**
 * Update chat-level data
 * @param {Object} data - Data to update
 */
async function setChatData(data) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', async () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update data
            Object.assign(metadata[MODULE_NAME], data);

            // CRITICAL: AWAIT the save to complete before returning
            await _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveMetadata();
        } catch (error) {
            debug.warn('Failed to set chat data:', error.message);
            throw error; // Re-throw so caller knows it failed
        }
    });
}

/**
 * Add a character to the current chat
 * @param {string} name - Character name
 * @param {Object} characterData - Character data
 */
async function addCharacter(name, characterData) {
    return errorHandler.withErrorBoundary('Settings', async () => {
        const characters = await getCharacters();
        characters[name] = characterData;
        await setCharacters(characters); // AWAIT the async save
    });
}

/**
 * Remove a character from the current chat
 * @param {string} name - Character name to remove
 */
async function removeCharacter(name) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', async () => {
        const characters = await getCharacters();
        delete characters[name];
        await setCharacters(characters); // AWAIT the async save
    });
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
async function getSetting(key, defaultValue) {
    const settings = await get_settings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
}

/**
 * Set a specific setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 */
async function setSetting(key, value) {
    const update = {};
    update[key] = value;
    await set_settings(update);
}

/**
 * Get a single character by name
 * @param {string} name - Character name
 * @returns {Object|null} Character data or null if not found
 */
async function getCharacter(name) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', async () => {
        if (!name || typeof name !== 'string') {
            console.warn('[STnametracker] Invalid character name:', name);
            return null;
        }
        const chars = await getCharacters();
        return chars[name] || null;
    });
}

/**
 * Set a character by name
 * @param {string} name - Character name
 * @param {Object} character - Character data
 */
async function setCharacter(name, character) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', async () => {
        if (!name || typeof name !== 'string') {
            throw new Error('Character name must be a non-empty string');
        }
        if (!character || typeof character !== 'object') {
            throw new Error('Character data must be an object');
        }
        console.log('[NT-Settings] 🟩 setCharacter() called for:', name);
        const chars = { ...await getCharacters() };
        chars[name] = character;
        await setCharacters(chars); // AWAIT the async setCharacters
        debug.log(`Set character: ${name}`);
        console.log('[NT-Settings] 🟩 setCharacter() completed for:', name);
    });
}

/**
 * Get LLM configuration (Fixed: No Promise contamination)
 * @returns {Object} LLM configuration object with resolved values
 */
async function getLLMConfig() {
    try {
        const llmSource = await getSetting('llmSource');
        const ollamaEndpoint = await getSetting('ollamaEndpoint');
        const ollamaModel = await getSetting('ollamaModel');
        const systemPrompt = await getSetting('systemPrompt');

        const { extSettings } = getContextSettings();
        const moduleSettings = extSettings ? extSettings[MODULE_NAME] : null;
        debug.log('[NT-LLMConfig] llmSource setting:', llmSource);
        debug.log('[NT-LLMConfig] extension_settings keys for module:', moduleSettings ? Object.keys(moduleSettings) : 'none');

        // Ensure no Promise objects are returned
        return {
            source: (typeof llmSource === 'string') ? llmSource : 'sillytavern',
            ollamaEndpoint: (typeof ollamaEndpoint === 'string') ? ollamaEndpoint : 'http://localhost:11434',
            ollamaModel: (typeof ollamaModel === 'string') ? ollamaModel : '',
            systemPrompt: (typeof systemPrompt === 'string') ? systemPrompt : null,
        };
    } catch (error) {
        console.warn('[STnametracker] Error getting LLM config, using defaults:', error);
        return { source: 'sillytavern', ollamaEndpoint: 'http://localhost:11434', ollamaModel: '', systemPrompt: null };
    }
}

/**
 * Get lorebook configuration (Fixed: No Promise contamination)
 * @returns {Object} Lorebook configuration object with resolved values
 */
async function getLorebookConfig() {
    try {
        const position = await getSetting('lorebookPosition');
        const depth = await getSetting('lorebookDepth');
        const cooldown = await getSetting('lorebookCooldown');
        const scanDepth = await getSetting('lorebookScanDepth');
        const probability = await getSetting('lorebookProbability');
        const enabled = await getSetting('lorebookEnabled');

        // Ensure no Promise objects are returned
        return {
            position: (typeof position === 'number') ? position : 0,
            depth: (typeof depth === 'number') ? depth : 1,
            cooldown: (typeof cooldown === 'number') ? cooldown : 5,
            scanDepth: (typeof scanDepth === 'number') ? scanDepth : 1,
            probability: (typeof probability === 'number') ? probability : 100,
            enabled: (typeof enabled === 'boolean') ? enabled : true,
        };
    } catch (error) {
        console.warn('[STnametracker] Error getting lorebook config, using defaults:', error);
        return { position: 0, depth: 1, cooldown: 5, scanDepth: 1, probability: 100, enabled: true };
    }
}

/**
 * Alias for get_settings for compatibility
 * @returns {Object} Current settings
 */
async function getSettings() {
    return await get_settings();
}

/**
 * Get chat metadata value
 * @param {string} key - Metadata key
 * @returns {any} Metadata value
 */
function get_chat_metadata(key) {
    return errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = stContext.getChatMetadata();

            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            return metadata[MODULE_NAME][key];
        } catch (error) {
            debug.warn('Failed to get chat metadata:', error.message);
            return DEFAULT_CHAT_DATA[key];
        }
    }, DEFAULT_CHAT_DATA[key]);
}

/**
 * Set chat metadata value
 * @param {string} key - Metadata key
 * @param {any} value - New value
 */
function set_chat_metadata(key, value) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__/* .errorHandler */ .r_.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            metadata[MODULE_NAME][key] = value;
            debug.log(`Updated chat data ${key}`);

            _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set chat metadata:', error.message);
        }
    });
}




/***/ },

/***/ 551
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OW: () => (/* binding */ createCharacter),
/* harmony export */   _$: () => (/* binding */ findExistingCharacter),
/* harmony export */   eY: () => (/* binding */ isIgnoredCharacter),
/* harmony export */   el: () => (/* binding */ toggleIgnoreCharacter),
/* harmony export */   g9: () => (/* binding */ createNewCharacter),
/* harmony export */   lF: () => (/* binding */ mergeCharacters),
/* harmony export */   pp: () => (/* binding */ hasUnresolvedRelationships),
/* harmony export */   rL: () => (/* binding */ findPotentialMatch),
/* harmony export */   t9: () => (/* binding */ updateCharacter),
/* harmony export */   undoLastMerge: () => (/* binding */ undoLastMerge),
/* harmony export */   vu: () => (/* binding */ purgeAllCharacters)
/* harmony export */ });
/* unused harmony exports validateCharacterLorebookSync, repairCharacterLorebookSync, findCharacterByUid, calculateNameSimilarity, cleanAliases, detectMergeOpportunities, getUndoHistory, clearUndoHistory, exportCharacters, importCharacters */
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(134);
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(806);
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(462);
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(548);
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(695);
/**
 * Character Management Module
 *
 * Handles character CRUD operations, merging, alias detection, relationship management,
 * and per-character processing state tracking for the Name Tracker extension.
 */







const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_1__/* .createModuleLogger */ .Xv)('characters');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__/* .NotificationManager */ .h('Character Management');

/**
 * Validate and clean character data from LLM analysis
 * @param {Object} analyzedChar - Raw character data from LLM
 * @param {Array} allCharacters - Existing characters for validation
 * @returns {Object} Cleaned and validated character data
 */
function validateCharacterData(analyzedChar, allCharacters = []) {
    // Ensure required fields exist
    const name = (analyzedChar.name || '').trim();
    if (!name) {
        throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .NameTrackerError */ .S_('Character name is required');
    }

    // Validate confidence score
    const confidence = typeof analyzedChar.confidence === 'number' && analyzedChar.confidence >= 0 && analyzedChar.confidence <= 100
        ? analyzedChar.confidence
        : 75;

    // Clean and validate arrays
    const aliases = Array.isArray(analyzedChar.aliases) ? analyzedChar.aliases.filter(a => typeof a === 'string' && a.trim()) : [];
    const relationships = Array.isArray(analyzedChar.relationships) ? analyzedChar.relationships.filter(r => typeof r === 'string' && r.trim()) : [];

    // Clean text fields
    const cleanTextField = (field) => {
        return typeof field === 'string' ? field.trim() : '';
    };

    // Clean name using helper if available (fallback to basic sanitization)
    const sanitizedName = name.replace(/[<>&"']/g, '').trim();

    return {
        name: sanitizedName,
        aliases,
        physicalAge: cleanTextField(analyzedChar.physicalAge),
        mentalAge: cleanTextField(analyzedChar.mentalAge),
        physical: cleanTextField(analyzedChar.physical),
        personality: cleanTextField(analyzedChar.personality),
        sexuality: cleanTextField(analyzedChar.sexuality),
        raceEthnicity: cleanTextField(analyzedChar.raceEthnicity),
        roleSkills: cleanTextField(analyzedChar.roleSkills),
        relationships,
        confidence,
    };
}

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = true; // Set to false in production after testing

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-Characters] ${message}`, data || '');
    }
}

// ============================================================================
// CHARACTER-LOREBOOK SYNCHRONIZATION
// ============================================================================

/**
 * Validate character-lorebook synchronization
 * Ensures 1:1 relationship between characters and lorebook entries
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 */
async function validateCharacterLorebookSync() {
    return withErrorBoundary('validateCharacterLorebookSync', async () => {
        const characters = await getCharacters();
        const issues = [];

        debugLog('🔍 Validating character-lorebook synchronization...');

        // Check each character has a valid lorebook entry ID
        for (const [name, character] of Object.entries(characters)) {
            if (!character.lorebookEntryId) {
                issues.push(`Character '${name}' missing lorebookEntryId`);
            }
        }

        // Get lorebook stats to compare counts
        try {
            const { getLorebookStats } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 134));
            const stats = await getLorebookStats();
            const characterCount = Object.keys(characters).length;

            if (stats.totalEntries !== characterCount) {
                issues.push(`Count mismatch: ${characterCount} characters vs ${stats.totalEntries} lorebook entries`);
            }

            debugLog(`📊 Sync validation: ${characterCount} characters, ${stats.totalEntries} entries`);

        } catch (error) {
            issues.push(`Could not validate lorebook entries: ${error.message}`);
        }

        const valid = issues.length === 0;

        if (!valid) {
            console.warn('[NT-Characters] ⚠️ Character-Lorebook sync issues:', issues);
        } else {
            debugLog('✅ Character-lorebook synchronization validated');
        }

        return { valid, issues };
    });
}

/**
 * Repair character-lorebook synchronization issues
 * @returns {Promise<{repaired: number, errors: string[]}>} Repair results
 */
async function repairCharacterLorebookSync() {
    return withErrorBoundary('repairCharacterLorebookSync', async () => {
        const characters = await getCharacters();
        const { updateLorebookEntry } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 134));
        let repaired = 0;
        const errors = [];

        debugLog('🔧 Repairing character-lorebook synchronization...');

        for (const [name, character] of Object.entries(characters)) {
            try {
                if (!character.lorebookEntryId) {
                    debugLog(`🔧 Creating missing lorebook entry for: ${name}`);
                    await updateLorebookEntry(character, name);
                    repaired++;
                }
            } catch (error) {
                const errorMsg = `Failed to repair ${name}: ${error.message}`;
                errors.push(errorMsg);
                console.error(`[NT-Characters] ${errorMsg}`);
            }
        }

        debugLog(`🔧 Repair complete: ${repaired} entries repaired, ${errors.length} errors`);
        return { repaired, errors };
    });
}

// Merge Confidence Tiers (as percentages: 0-100)
const MERGE_CONFIDENCE_HIGH = 0.9;      // 90%+ - Automatic merge (e.g., exact substring: "Jazz"/"Jasmine")
const MERGE_CONFIDENCE_MEDIUM = 0.7;    // 70%+ - User prompt required (e.g., phonetic similarity)
// eslint-disable-next-line no-unused-vars
const MERGE_CONFIDENCE_LOW = 0.5;       // 50%+ - No automatic action (may indicate false positives)

// ============================================================================
// CHARACTER DATA VALIDATION AND CLEANUP
// ============================================================================

/**
 * Parse and normalize relationship strings from the new natural language format
 * Handles: "Character A is to Character B: relationship1, relationship2"
 * @param {Array<string>} relationships - Raw relationship strings from LLM
 * @param {string} currentCharName - Name of the current character
 * @param {Object} allCharacters - All known characters for name resolution
 * @returns {Array<string>} Normalized relationship triplets
 */
function parseNewRelationshipFormat(relationships, currentCharName, allCharacters) {
    if (!relationships || !Array.isArray(relationships)) {
        return [];
    }

    debugLog(`🔄 Parsing ${relationships.length} new-format relationships for ${currentCharName}`);
    const parsedTriplets = [];

    for (const rel of relationships) {
        if (!rel || typeof rel !== 'string') continue;

        // Parse format: "Character A is to Character B: relationship1, relationship2"
        const match = rel.match(/^(.+?)\s+is\s+to\s+(.+?):\s*(.+)$/i);
        if (!match) {
            debugLog(`❌ Failed to parse relationship format: "${rel}"`);
            continue;
        }

        const [, char1, char2, relationshipsPart] = match;
        const char1Trimmed = char1.trim();
        const char2Trimmed = char2.trim();

        // Normalize character names to preferred names
        const normalizedChar1 = findPreferredName(char1Trimmed, allCharacters);
        const normalizedChar2 = findPreferredName(char2Trimmed, allCharacters);

        if (!normalizedChar1 || !normalizedChar2) {
            debugLog(`❌ Could not normalize names: "${char1Trimmed}" -> "${normalizedChar1}", "${char2Trimmed}" -> "${normalizedChar2}"`);
            continue;
        }

        // Split multiple relationships and create individual triplets
        const relationshipTypes = relationshipsPart.split(',').map(r => r.trim());

        for (const relType of relationshipTypes) {
            if (relType) {
                const triplet = `${normalizedChar1}, ${normalizedChar2}, ${relType.toLowerCase()}`;
                parsedTriplets.push(triplet);
                debugLog(`✅ Parsed: "${rel}" -> "${triplet}"`);
            }
        }
    }

    debugLog(`📝 Converted ${relationships.length} relationships to ${parsedTriplets.length} triplets`);
    return parsedTriplets;
}
/**
 * Normalize and deduplicate relationships while preserving "is to" format
 * @param {Array<string>} relationships - Raw relationship strings from LLM
 * @param {string} currentCharName - Name of the current character
 * @param {Object} allCharacters - All known characters for name resolution
 * @returns {Array<string>} Cleaned "is to" format relationships
 */
function rationalizeRelationships(relationships, currentCharName, allCharacters) {
    if (!relationships || !Array.isArray(relationships)) {
        return [];
    }

    debugLog(`🔧 Rationalizing ${relationships.length} relationships for ${currentCharName}`);

    // Check if we have "is to" format
    const hasIsToFormat = relationships.some(rel => typeof rel === 'string' && /\s+is\s+to\s+.+:/.test(rel));

    if (!hasIsToFormat) {
        debugLog('⚠️ WARNING: No "is to" format detected. Expected format: "[Name] is to [Name]: [role]"');
        return [];
    }

    // Parse and normalize to "is to" format with canonical names
    const normalized = parseNewRelationshipFormat(relationships, currentCharName, allCharacters);

    if (normalized.length === 0) {
        debugLog('❌ No valid relationships found after parsing');
        return [];
    }

    // Deduplicate exact matches (case-insensitive)
    const uniqueRelationships = [];
    const seen = new Set();

    for (const rel of normalized) {
        const normalized_lower = rel.toLowerCase().trim();
        if (!seen.has(normalized_lower)) {
            seen.add(normalized_lower);
            uniqueRelationships.push(rel);
        } else {
            debugLog(`🗑️ Removed duplicate: "${rel}"`);
        }
    }

    debugLog(`✅ Deduplicated to ${uniqueRelationships.length} unique relationships (from ${normalized.length})`);

    return uniqueRelationships;
}

/**
 * Find the preferred canonical name for a character
 * @param {string} name - Name variant to resolve
 * @param {Object} allCharacters - All known characters
 * @returns {string|null} Preferred name or null if not found
 */
function findPreferredName(name, allCharacters) {
    if (!name || !allCharacters) return name;

    // First, try exact match on preferred names
    for (const [preferredName] of Object.entries(allCharacters)) {
        if (preferredName === name) {
            return preferredName;
        }
    }

    // Then try aliases
    for (const [preferredName, character] of Object.entries(allCharacters)) {
        if (character.aliases && character.aliases.includes(name)) {
            return preferredName;
        }
    }

    // Return original if no match found
    return name;
}

/**
 * Rationalize a group of relationships for the same character pair
 * Now maintains multiple compatible relationships instead of choosing just one
 * @param {Array} relationships - Array of relationship objects for same pair
 * @returns {Object|null} Single rationalized relationship or null
 */
function rationalizeRelationshipGroup(relationships) {
    if (!relationships || relationships.length === 0) return null;

    const relTypes = relationships.map(r => r.relationship);
    debugLog(`🎯 Rationalizing group: [${relTypes.join(', ')}]`);

    // Deduplication mapping - convert synonyms to canonical forms
    const equivalents = {
        'sexual partner': 'lover',
        'romantic partner': 'lover',
        'boyfriend': 'lover',
        'girlfriend': 'lover',
        'husband': 'spouse',
        'wife': 'spouse',
        'father': 'parent',
        'mother': 'parent',
        'son': 'child',
        'daughter': 'child',
        'brother': 'sibling',
        'sister': 'sibling',
        'manager': 'boss',
        'supervisor': 'boss',
    };

    // Normalize to canonical forms and remove duplicates
    const normalizedRels = [...new Set(relTypes.map(rel => equivalents[rel] || rel))];

    // Remove contradictory relationships (keep the first one found)
    const contradictions = [
        ['dominant', 'submissive'],
        ['leader', 'follower'],
        ['boss', 'employee'],
        ['parent', 'child'],
    ];

    let filteredRels = [...normalizedRels];
    for (const [rel1, rel2] of contradictions) {
        const hasRel1 = filteredRels.includes(rel1);
        const hasRel2 = filteredRels.includes(rel2);

        if (hasRel1 && hasRel2) {
            // Keep the first one, remove the second
            const index1 = filteredRels.indexOf(rel1);
            const index2 = filteredRels.indexOf(rel2);

            if (index1 < index2) {
                filteredRels = filteredRels.filter(r => r !== rel2);
                debugLog(`🚫 Removed contradictory '${rel2}', kept '${rel1}'`);
            } else {
                filteredRels = filteredRels.filter(r => r !== rel1);
                debugLog(`🚫 Removed contradictory '${rel1}', kept '${rel2}'`);
            }
        }
    }

    if (filteredRels.length === 0) {
        debugLog('❌ No relationships left after filtering contradictions');
        return null;
    }

    // Combine multiple relationships with commas (new approach)
    const combinedRelationship = filteredRels.join(', ');

    debugLog(`🎯 Combined relationships: "${combinedRelationship}" from [${relTypes.join(', ')}]`);

    const baseRel = relationships[0];
    return {
        char1: baseRel.char1,
        char2: baseRel.char2,
        relationship: combinedRelationship,
    };
}

// Substring Matching Thresholds
const MIN_SUBSTRING_LENGTH = 3;         // Minimum length for substring detection
const SUBSTRING_MATCH_BONUS = 0.95;     // High confidence for substring matches

// Character management state
let undoHistory = []; // Store last 3 merge operations

/**
 * Character data structure
 * @typedef {Object} CharacterData
 * @property {string} preferredName - The preferred/canonical name
 * @property {string[]} aliases - List of alternative names
 * @property {string} physicalAge - Physical age description
 * @property {string} mentalAge - Mental age description
 * @property {string} physical - Physical description
 * @property {string} personality - Personality traits
 * @property {string} sexuality - Sexual orientation/preferences
 * @property {string} raceEthnicity - Race/ethnicity information
 * @property {string} roleSkills - Role and skills description
 * @property {string[]} relationships - Relationships with other characters
 * @property {boolean} ignored - Whether character is ignored
 * @property {number} confidence - Confidence score (0-100)
 * @property {string|null} lorebookEntryId - Associated lorebook entry ID
 * @property {number} lastUpdated - Timestamp of last update
 * @property {boolean} isMainChar - Whether this is the main character
 */

/**
 * Check if a character is in the ignored list
 * @param {string} name - Character name to check
 * @returns {boolean} True if character is ignored
 */
async function isIgnoredCharacter(name) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('isIgnoredCharacter', async () => {
        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();
        return Object.values(chars).some(
            char => char.ignored && (char.preferredName === name || char.aliases.includes(name)),
        );
    });
}

/**
 * Find existing character by name or alias
 * @param {string} name - Name to search for
 * @returns {CharacterData|null} Character data if found, null otherwise
 */
async function findExistingCharacter(name) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('findExistingCharacter', async () => {
        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();
        const found = Object.values(chars).find(
            char => char.preferredName === name || char.aliases.includes(name),
        ) || null;
        debugLog(`[FindChar] Searching for '${name}': ${found ? 'FOUND as ' + found.preferredName : 'NOT FOUND'}`);
        return found;
    });
}

/**
 * Find character by unique ID (UID)
 * Required for REC-15 chat lifecycle management and lorebook synchronization
 * @param {string} uid - Character UID to search for
 * @returns {Promise<CharacterData|null>} Character data if found, null otherwise
 */
async function findCharacterByUid(uid) {
    return withErrorBoundary('findCharacterByUid', async () => {
        if (!uid) {
            debugLog('[FindChar] No UID provided');
            return null;
        }

        const chars = await getCharacters();
        const found = Object.values(chars).find(char => char.uid === uid) || null;
        debugLog(`[FindChar] Searching for UID '${uid}': ${found ? 'FOUND as ' + found.preferredName : 'NOT FOUND'}`);
        return found;
    });
}

/**
 * Find potential match for a new character based on confidence threshold
 * @param {Object} analyzedChar - Character data from LLM analysis
 * @returns {Promise<CharacterData|null>} Potential match if found
 */
async function findPotentialMatch(analyzedChar) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('findPotentialMatch', async () => {
        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();
        // Use the user-configured confidence threshold (0-100)
        const threshold = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getSetting */ .PL)('confidenceThreshold', 70);

        debug.log();

        // Simple matching logic - can be enhanced with LLM-based similarity
        for (const existingChar of Object.values(chars)) {
            // Check for name similarity (simple approach)
            const similarity = await calculateNameSimilarity(analyzedChar.name, existingChar.preferredName);

            if (similarity >= threshold) {
                debug.log();
                return existingChar;
            }

            // Check aliases
            for (const alias of existingChar.aliases) {
                const aliasSimilarity = await calculateNameSimilarity(analyzedChar.name, alias);
                if (aliasSimilarity >= threshold) {
                    debug.log();
                    return existingChar;
                }
            }
        }

        return null;
    });
}

/**
 * Calculate simple name similarity (0-100)
 * @param {string} name1 - First name to compare
 * @param {string} name2 - Second name to compare
 * @returns {number} Similarity score 0-100
 */
function calculateNameSimilarity(name1, name2) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('calculateNameSimilarity', () => {
        name1 = name1.toLowerCase();
        name2 = name2.toLowerCase();

        // Exact match
        if (name1 === name2) {
            return 100;
        }

        // One contains the other
        if (name1.includes(name2) || name2.includes(name1)) {
            return 85;
        }

        // Check if they share significant parts
        const words1 = name1.split(/\s+/);
        const words2 = name2.split(/\s+/);

        const commonWords = words1.filter(w => words2.includes(w));
        if (commonWords.length > 0) {
            return 70;
        }

        // No significant similarity
        return 0;
    });
}

/**
 * Filter and clean aliases
 * Removes character's own name, relationship words, and other invalid aliases
 * @param {string[]} aliases - Array of alias strings
 * @param {string} characterName - The character's actual name
 * @returns {string[]} Cleaned array of unique aliases
 */
function cleanAliases(aliases, characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('cleanAliases', () => {
        if (!aliases || !Array.isArray(aliases)) {
            return [];
        }

        // Common relationship/role words that shouldn't be aliases
        const invalidAliases = [
            'son', 'daughter', 'mother', 'father', 'mom', 'dad', 'parent',
            'brother', 'sister', 'sibling', 'cousin', 'uncle', 'aunt',
            'friend', 'boyfriend', 'girlfriend', 'husband', 'wife', 'spouse',
            'boss', 'employee', 'coworker', 'colleague', 'partner',
            'neighbor', 'roommate', 'child', 'kid', 'baby',
            'man', 'woman', 'person', 'guy', 'girl', 'boy',
            'user', '{{user}}', 'char', '{{char}}',
        ];

        const lowerName = characterName.toLowerCase();

        return aliases.filter(alias => {
            if (!alias || typeof alias !== 'string') return false;

            const lowerAlias = alias.trim().toLowerCase();

            // Remove if it's the character's own name
            if (lowerAlias === lowerName) return false;

            // Remove if it's just a relationship word
            if (invalidAliases.includes(lowerAlias)) return false;

            // Remove if it's too short (likely not a real alias)
            if (lowerAlias.length < 2) return false;

            return true;
        })
            .map(alias => alias.trim()) // Trim whitespace
            .filter((alias, index, self) => self.indexOf(alias) === index); // Remove duplicates
    });
}

// ============================================================================
// MERGE DETECTION AND CONFIDENCE SCORING
// ============================================================================

/**
 * Detect potential merge opportunities for a new character
 * Finds existing characters that might be the same person with different names
 * @param {string} newCharacterName - Name of the newly discovered character
 * @returns {Array} Array of potential merge targets with confidence scores
 */
async function detectMergeOpportunities(newCharacterName) {
    return withErrorBoundary('detectMergeOpportunities', async () => {
        debugLog(`[MergeDetect] Checking merge opportunities for: ${newCharacterName}`);

        const potentialMatches = [];
        const existingCharacters = await getCharacters();

        if (!newCharacterName || typeof newCharacterName !== 'string') {
            debugLog('[MergeDetect] Invalid name provided');
            return potentialMatches;
        }

        // eslint-disable-next-line no-unused-vars
        for (const [_existingName, existingChar] of Object.entries(existingCharacters)) {
            const confidence = calculateMergeConfidence(newCharacterName, existingChar);

            if (confidence >= MERGE_CONFIDENCE_MEDIUM) {
                const tier = confidence >= MERGE_CONFIDENCE_HIGH ? 'HIGH' : 'MEDIUM';
                const reason = generateMergeReason(newCharacterName, existingChar, confidence);
                potentialMatches.push({
                    targetName: existingChar.preferredName,
                    confidence: confidence,
                    tier: tier,
                    reason: reason,
                });
                debugLog(`[MergeDetect] ${newCharacterName} -> ${existingChar.preferredName}: ${tier} (${Math.round(confidence * 100)}%) - ${reason}`);
            }
        }

        // Sort by confidence descending
        potentialMatches.sort((a, b) => b.confidence - a.confidence);

        debugLog(`[MergeDetect] Total merge candidates for ${newCharacterName}: ${potentialMatches.length}`);

        return potentialMatches;
    }, []);
}

/**
 * Calculate merge confidence between two character names
 * Returns value 0-1 (0-100%)
 * @private
 */
function calculateMergeConfidence(newName, existingChar) {
    debugLog(`[CalcConfidence] Comparing '${newName}' vs '${existingChar.preferredName}'`);

    const existingName = existingChar.preferredName;
    let confidence = 0;

    // Check for exact substring match (e.g., "Jazz" in "Jasmine")
    if (isSubstringMatch(newName, existingName)) {
        confidence = SUBSTRING_MATCH_BONUS;
        debugLog('[CalcConfidence] Substring match detected');
    }
    // Check if new name matches any existing alias
    else if (existingChar.aliases && existingChar.aliases.some(alias =>
        newName.toLowerCase() === alias.toLowerCase())) {
        confidence = 0.95;
    }
    // Check for phonetic similarity
    else if (isPhoneticSimilar(newName, existingName)) {
        confidence = 0.8;
    }
    // Check for partial similarity
    else if (isPartialMatch(newName, existingName)) {
        confidence = 0.65;
    }

    return confidence;
}

/**
 * Check if newName is a substring of existingName (or vice versa)
 * Used for detecting nickname relationships like "Jazz" for "Jasmine"
 * @private
 */
function isSubstringMatch(newName, existingName) {
    const newLower = newName.toLowerCase();
    const existLower = existingName.toLowerCase();

    // Check if one is a substring of the other, and long enough to be meaningful
    if (newName.length >= MIN_SUBSTRING_LENGTH) {
        return existLower.includes(newLower) || newLower.includes(existLower);
    }

    return false;
}

/**
 * Basic phonetic similarity check using Levenshtein distance
 * @private
 */
function isPhoneticSimilar(str1, str2) {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - (distance / maxLength);

    // Consider similar if >75% match
    return similarity >= 0.75;
}

/**
 * Check for partial name match (e.g., first/last name components)
 * @private
 */
function isPartialMatch(newName, existingName) {
    const newParts = newName.toLowerCase().split(/\s+/);
    const existParts = existingName.toLowerCase().split(/\s+/);

    // Check if any part of new name matches parts of existing
    return newParts.some(newPart => existParts.some(existPart =>
        newPart === existPart && newPart.length > 2,
    ));
}

/**
 * Calculate Levenshtein distance between two strings
 * @private
 */
function levenshteinDistance(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null),
    );

    for (let i = 0; i <= str1.length; i++) {
        track[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
        track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator,
            );
        }
    }

    return track[str2.length][str1.length];
}

/**
 * Generate human-readable reason for merge suggestion
 * @private
 */
function generateMergeReason(newName, existingChar, confidence) {
    if (confidence >= MERGE_CONFIDENCE_HIGH) {
        if (newName.toLowerCase().includes(existingChar.preferredName.toLowerCase())) {
            return `"${newName}" contains "${existingChar.preferredName}" (likely nickname)`;
        }
        return `Exact match confidence: ${(confidence * 100).toFixed(0)}%`;
    }

    return `Phonetic/partial match with confidence: ${(confidence * 100).toFixed(0)}%`;
}

/**
 * Create a new character entry
antml:parameter>

 * @param {Object} analyzedChar - Character data from LLM analysis
 * @param {boolean} isMainChar - Whether this is the main character
 * @returns {Promise<CharacterData>} Created character data
 */
async function createCharacter(analyzedChar, isMainChar = false) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('createCharacter', async () => {
        debug.log();
        console.log('[NT-Characters] 🟦 createCharacter() called for:', analyzedChar.name);

        // Get all characters for relationship normalization
        const allCharacters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();

        // Validate and clean character data from LLM
        const cleanedChar = validateCharacterData(analyzedChar, allCharacters);

        // Clean and filter aliases
        const aliases = await cleanAliases(cleanedChar.aliases || [], cleanedChar.name);

        const character = {
            preferredName: cleanedChar.name,
            aliases: aliases,
            physicalAge: cleanedChar.physicalAge || '',
            mentalAge: cleanedChar.mentalAge || '',
            physical: cleanedChar.physical || '',
            personality: cleanedChar.personality || '',
            sexuality: cleanedChar.sexuality || '',
            raceEthnicity: cleanedChar.raceEthnicity || '',
            roleSkills: cleanedChar.roleSkills || '',
            relationships: (() => {
                const rawRels = cleanedChar.relationships || [];
                console.log(`[NT-Characters] 🔗 Processing relationships for ${cleanedChar.name}:`);
                console.log(`[NT-Characters]    Raw relationships:`, JSON.stringify(rawRels, null, 2));
                
                const normalized = rationalizeRelationships(rawRels, cleanedChar.name, allCharacters);
                
                console.log(`[NT-Characters]    Raw count: ${rawRels.length}`);
                console.log(`[NT-Characters]    Normalized count: ${normalized.length}`);
                console.log(`[NT-Characters]    Normalized relationships:`, JSON.stringify(normalized, null, 2));
                
                if (normalized.length > 0) {
                    console.log(`[NT-Characters]    Sample normalized: ${normalized[0]}`);
                }
                return normalized;
            })(),
            ignored: false,
            confidence: cleanedChar.confidence || 50,
            lorebookEntryId: null,
            lastUpdated: Date.now(),
            isMainChar: isMainChar || false,
            needsReview: true,  // New characters always need review
        };

        debug.log();

        // Store character in settings - CRITICAL: AWAIT to ensure save completes
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(character.preferredName, character);
        console.log('[NT-Characters] 🟦 Created and saved character:', character.preferredName);

        // Create lorebook entry and ensure ID is saved
        await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_0__.updateLorebookEntry)(character, character.preferredName);

        // Verify lorebook entry was created successfully
        if (!character.lorebookEntryId) {
            console.warn(`[NT-Characters] ⚠️ Lorebook entry creation may have failed for: ${character.preferredName}`);
        } else {
            debugLog(`✅ Lorebook entry created with ID: ${character.lorebookEntryId}`);
        }

        debug.log();

        return character;
    });
}

/**
 * Update existing character with new information
 * @param {CharacterData} existingChar - Existing character data
 * @param {Object} analyzedChar - New character data from LLM analysis
 * @param {boolean} addAsAlias - Whether to add the analyzed name as an alias
 * @param {boolean} isMainChar - Whether this is the main character
 * @returns {Promise<CharacterData>} Updated character data
 */
async function updateCharacter(existingChar, analyzedChar, addAsAlias = false, isMainChar = false) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('updateCharacter', async () => {
        debug.log();

        // Get all characters for relationship normalization
        const allCharacters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();

        // Validate and clean new character data from LLM
        const cleanedChar = validateCharacterData(analyzedChar, allCharacters);

        // Mark as main character if detected
        if (isMainChar) {
            existingChar.isMainChar = true;
        }

        // If adding as alias, add the analyzed name to aliases if not already present
        if (addAsAlias && cleanedChar.name !== existingChar.preferredName) {
            if (!existingChar.aliases) existingChar.aliases = [];
            if (!existingChar.aliases.includes(cleanedChar.name) &&
                cleanedChar.name.toLowerCase() !== existingChar.preferredName.toLowerCase()) {
                existingChar.aliases.push(cleanedChar.name);
            }
        }

        // Clean up all aliases using the helper function
        existingChar.aliases = await cleanAliases(existingChar.aliases || [], existingChar.preferredName);

        // Update consolidated fields (new data takes precedence if not empty)
        if (cleanedChar.physicalAge) existingChar.physicalAge = cleanedChar.physicalAge;
        if (cleanedChar.mentalAge) existingChar.mentalAge = cleanedChar.mentalAge;
        if (cleanedChar.physical) existingChar.physical = cleanedChar.physical;
        if (cleanedChar.personality) existingChar.personality = cleanedChar.personality;
        if (cleanedChar.sexuality) existingChar.sexuality = cleanedChar.sexuality;
        if (cleanedChar.raceEthnicity) existingChar.raceEthnicity = cleanedChar.raceEthnicity;
        if (cleanedChar.roleSkills) existingChar.roleSkills = cleanedChar.roleSkills;

        // Merge relationships array - deduplicate and filter to valid triplets
        if (cleanedChar.relationships && Array.isArray(cleanedChar.relationships)) {
            if (!existingChar.relationships) existingChar.relationships = [];
            for (const rel of cleanedChar.relationships) {
                if (!existingChar.relationships.includes(rel)) {
                    existingChar.relationships.push(rel);
                }
            }
        }

        // Update confidence (average of old and new)
        if (cleanedChar.confidence) {
            existingChar.confidence = Math.round((existingChar.confidence + cleanedChar.confidence) / 2);
        }

        existingChar.lastUpdated = Date.now();
        existingChar.needsReview = true;  // Updated characters need review

        // Update character in settings - AWAIT to ensure save completes
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(existingChar.preferredName, existingChar);
        console.log('[NT-Characters] 🟦 Updated and saved character:', existingChar.preferredName);

        debug.log();

        return existingChar;
    });
}

/**
 * Merge two characters
 * @param {string} sourceName - Name of character to merge from
 * @param {string} targetName - Name of character to merge into
 * @returns {Promise<void>}
 */
async function mergeCharacters(sourceName, targetName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('mergeCharacters', async () => {
        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();

        const sourceChar = chars[sourceName];
        const targetChar = chars[targetName];

        if (!sourceChar || !targetChar) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .NameTrackerError */ .S_('One or both characters not found');
        }

        // Store for undo
        const undoData = {
            operation: 'merge',
            timestamp: Date.now(),
            sourceName: sourceName,
            targetName: targetName,
            sourceData: JSON.parse(JSON.stringify(sourceChar)),
            targetDataBefore: JSON.parse(JSON.stringify(targetChar)),
        };

        // Add to undo history
        undoHistory.push(undoData);
        if (undoHistory.length > 3) {
            undoHistory.shift();
        }

        // Merge aliases
        for (const alias of sourceChar.aliases) {
            if (!targetChar.aliases.includes(alias)) {
                targetChar.aliases.push(alias);
            }
        }

        // Add source name as alias if not the same
        if (sourceChar.preferredName !== targetChar.preferredName &&
            !targetChar.aliases.includes(sourceChar.preferredName)) {
            targetChar.aliases.push(sourceChar.preferredName);
        }

        // Merge fields (target takes precedence for conflicts, but add new fields)
        if (sourceChar.physicalAge && !targetChar.physicalAge) targetChar.physicalAge = sourceChar.physicalAge;
        if (sourceChar.mentalAge && !targetChar.mentalAge) targetChar.mentalAge = sourceChar.mentalAge;
        if (sourceChar.physical && !targetChar.physical) targetChar.physical = sourceChar.physical;
        if (sourceChar.personality && !targetChar.personality) targetChar.personality = sourceChar.personality;
        if (sourceChar.sexuality && !targetChar.sexuality) targetChar.sexuality = sourceChar.sexuality;
        if (sourceChar.raceEthnicity && !targetChar.raceEthnicity) targetChar.raceEthnicity = sourceChar.raceEthnicity;
        if (sourceChar.roleSkills && !targetChar.roleSkills) targetChar.roleSkills = sourceChar.roleSkills;

        // Merge relationships
        for (const rel of sourceChar.relationships) {
            if (!targetChar.relationships.includes(rel)) {
                targetChar.relationships.push(rel);
            }
        }

        // Update timestamp
        targetChar.lastUpdated = Date.now();

        // Update target character and delete source - AWAIT both
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(targetChar.preferredName, targetChar);
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .removeCharacter */ .sr)(sourceName);

        // Save chat data
        // Auto-saved by new settings system

        debug.log();
        notifications.success(`Merged ${sourceName} into ${targetName}`);

        return undoData;
    });
}

/**
 * Undo last merge operation
 * @returns {Promise<boolean>} True if undo was successful
 */
async function undoLastMerge() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('undoLastMerge', async () => {
        if (undoHistory.length === 0) {
            notifications.warning('No merge operations to undo');
            return false;
        }

        const lastOp = undoHistory.pop();

        if (lastOp.operation !== 'merge') {
            notifications.error('Last operation was not a merge');
            return false;
        }

        // Restore source character - AWAIT
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(lastOp.sourceName, lastOp.sourceData);

        // Restore target character to pre-merge state - AWAIT
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(lastOp.targetName, lastOp.targetDataBefore);

        debug.log();
        notifications.success('Merge undone successfully');

        return true;
    });
}

/**
 * Toggle ignore status for a character
 * @param {string} characterName - Name of character to toggle
 * @returns {boolean} New ignore status
 */
async function toggleIgnoreCharacter(characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('toggleIgnoreCharacter', async () => {
        const character = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacter */ .qN)(characterName);

        if (!character) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .NameTrackerError */ .S_('Character not found');
        }

        character.ignored = !character.ignored;

        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .setCharacter */ .e7)(characterName, character);

        // Save chat data
        // Auto-saved by new settings system

        const status = character.ignored ? 'ignored' : 'unignored';
        notifications.info(`${characterName} ${status}`);
        debug.log();

        return character.ignored;
    });
}

/**
 * Manually create a new character
 * @param {string} characterName - Name of new character
 * @returns {Promise<CharacterData>} Created character
 */
async function createNewCharacter(characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('createNewCharacter', async () => {
        if (!characterName || !characterName.trim()) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .NameTrackerError */ .S_('Character name is required');
        }

        const trimmedName = characterName.trim();

        // Check if character already exists
        if (await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacter */ .qN)(trimmedName)) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .NameTrackerError */ .S_(`Character "${trimmedName}" already exists`);
        }

        // Create basic character structure
        const newChar = {
            name: trimmedName,
            aliases: [],
            physicalAge: '',
            mentalAge: '',
            physical: '',
            personality: '',
            sexuality: '',
            raceEthnicity: '',
            roleSkills: '',
            relationships: [],
            confidence: 100, // Manually created = 100% confidence
        };

        const character = await createCharacter(newChar, false);

        // Save chat data
        // Auto-saved by new settings system

        debug.log();
        notifications.success(`Created character: ${trimmedName}`);

        return character;
    });
}

/**
 * Purge all character entries
 * @returns {Promise<number>} Number of characters purged
 */
async function purgeAllCharacters() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('purgeAllCharacters', async () => {
        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();
        const characterCount = Object.keys(chars).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return 0;
        }

        // Clear all character data
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .set_chat_metadata */ .yb)('characters', {});

        // Clear undo history
        undoHistory = [];

        debug.log();
        notifications.success(`Purged ${characterCount} characters`);

        return characterCount;
    });
}

/**
 * Check if character has unresolved relationships
 * @param {CharacterData} character - Character to check
 * @returns {boolean} True if character has relationships to unknown characters
 */
async function hasUnresolvedRelationships(character) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .withErrorBoundary */ .Xc)('hasUnresolvedRelationships', async () => {
        if (!character.relationships || character.relationships.length === 0) {
            return false;
        }

        const chars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__/* .getCharacters */ .bg)();
        const knownNames = Object.values(chars).reduce((names, char) => {
            names.add(char.preferredName.toLowerCase());
            char.aliases.forEach(alias => names.add(alias.toLowerCase()));
            return names;
        }, new Set());

        return character.relationships.some(rel => {
            // Simple check - extract character names from relationship strings
            const words = rel.toLowerCase().split(/\s+/);
            return words.some(word => {
                return word.length > 2 && !knownNames.has(word);
            });
        });
    });
}

/**
 * Get undo history
 * @returns {Array} Array of undo operations
 */
function getUndoHistory() {
    return [...undoHistory];
}

/**
 * Clear undo history
 */
function clearUndoHistory() {
    undoHistory = [];
    debug.log();
}

/**
 * Export all characters as JSON
 * @returns {Object} Character data
 */
async function exportCharacters() {
    return withErrorBoundary('exportCharacters', async () => {
        return await getCharacters();
    });
}

/**
 * Import characters from JSON
 * @param {Object} characterData - Character data to import
 * @param {boolean} merge - Whether to merge with existing characters
 * @returns {Promise<number>} Number of characters imported
 */
async function importCharacters(characterData, merge = false) {
    return withErrorBoundary('importCharacters', async () => {
        if (!characterData || typeof characterData !== 'object') {
            throw new NameTrackerError('Invalid character data');
        }

        let importCount = 0;

        for (const [name, character] of Object.entries(characterData)) {
            if (merge || !await getCharacter(name)) {
                await setCharacter(name, character);
                importCount++;
            }
        }

        debug.log();
        notifications.success(`Imported ${importCount} characters`);

        return importCount;
    });
}


/***/ },

/***/ 659
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ 695
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   h: () => (/* binding */ NotificationManager)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/**
 * Notification utilities for Name Tracker extension
 * Centralizes toastr notifications with consistent styling
 */



const logger = _core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].createModuleLogger */ .Ay.createModuleLogger('Notifications');

class NotificationManager {
    constructor() {
        this.defaultOptions = {
            timeOut: 5000,
            extendedTimeOut: 2000,
            closeButton: true,
            progressBar: true,
            preventDuplicates: true,
        };

        this.prefix = 'Name Tracker: ';
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    success(message, title = 'Success', options = {}) {
        const opts = { ...this.defaultOptions, ...options };
        toastr.success(this.prefix + message, title, opts);
        logger.debug('Success notification:', message);
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    info(message, title = 'Info', options = {}) {
        const opts = { ...this.defaultOptions, ...options };
        toastr.info(this.prefix + message, title, opts);
        logger.debug('Info notification:', message);
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    warning(message, title = 'Warning', options = {}) {
        const opts = { ...this.defaultOptions, timeOut: 8000, ...options };
        toastr.warning(this.prefix + message, title, opts);
        logger.debug('Warning notification:', message);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {Object} options - Toastr options
     */
    error(message, title = 'Error', options = {}) {
        const opts = {
            ...this.defaultOptions,
            timeOut: 10000,
            extendedTimeOut: 5000,
            ...options,
        };
        toastr.error(this.prefix + message, title, opts);
        logger.error('Error notification:', message);
    }

    /**
     * Show persistent notification that doesn't auto-close
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {string} type - Notification type (info, success, warning, error)
     */
    persistent(message, title = 'Notice', type = 'info') {
        const opts = {
            ...this.defaultOptions,
            timeOut: 0,
            extendedTimeOut: 0,
        };

        switch (type) {
            case 'success':
                toastr.success(this.prefix + message, title, opts);
                break;
            case 'warning':
                toastr.warning(this.prefix + message, title, opts);
                break;
            case 'error':
                toastr.error(this.prefix + message, title, opts);
                break;
            default:
                toastr.info(this.prefix + message, title, opts);
        }

        logger.debug('Persistent notification:', message);
    }

    /**
     * Show progress notification for long operations
     * @param {string} message - Message to display
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} id - Unique ID for updating the same notification
     * @returns {string} Notification ID for updates
     */
    progress(message, progress = 0, id = null) {
        const notificationId = id || `progress_${Date.now()}`;
        const progressHtml = `
            <div style="margin-bottom: 8px;">${this.prefix}${message}</div>
            <div style="background: #333; border-radius: 3px; overflow: hidden;">
                <div style="background: #007acc; height: 6px; width: ${progress}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="text-align: center; font-size: 11px; margin-top: 4px;">${progress}%</div>
        `;

        const opts = {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: false,
            progressBar: false,
            preventDuplicates: false,
            toastId: notificationId,
        };

        // Remove existing notification with same ID
        toastr.remove();

        toastr.info(progressHtml, '', opts);
        logger.debug('Progress notification:', message, `${progress}%`);

        return notificationId;
    }

    /**
     * Clear all notifications
     */
    clear() {
        toastr.clear();
        logger.debug('Cleared all notifications');
    }

    /**
     * Show a confirmation-style notification with action buttons
     * @param {string} message - Message to display
     * @param {Function} onConfirm - Callback for confirm action
     * @param {Function} onCancel - Callback for cancel action
     * @param {string} title - Optional title
     */
    confirm(message, onConfirm, onCancel = null, title = 'Confirm') {
        const confirmId = `confirm_${Date.now()}`;
        const confirmHtml = `
            <div style="margin-bottom: 12px;">${message}</div>
            <div style="text-align: right;">
                <button class="btn btn-sm btn-secondary me-2" onclick="nameTrackerNotifications.handleConfirmCancel('${confirmId}')">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="nameTrackerNotifications.handleConfirmOk('${confirmId}')">Confirm</button>
            </div>
        `;

        // Store callbacks globally for onclick handlers
        window.nameTrackerNotifications = window.nameTrackerNotifications || {};
        window.nameTrackerNotifications.confirmCallbacks = window.nameTrackerNotifications.confirmCallbacks || {};
        window.nameTrackerNotifications.confirmCallbacks[confirmId] = { onConfirm, onCancel };

        window.nameTrackerNotifications.handleConfirmOk = (id) => {
            const callbacks = window.nameTrackerNotifications.confirmCallbacks[id];
            if (callbacks && callbacks.onConfirm) {
                callbacks.onConfirm();
            }
            delete window.nameTrackerNotifications.confirmCallbacks[id];
            toastr.clear();
        };

        window.nameTrackerNotifications.handleConfirmCancel = (id) => {
            const callbacks = window.nameTrackerNotifications.confirmCallbacks[id];
            if (callbacks && callbacks.onCancel) {
                callbacks.onCancel();
            }
            delete window.nameTrackerNotifications.confirmCallbacks[id];
            toastr.clear();
        };

        const opts = {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: false,
            progressBar: false,
            preventDuplicates: false,
            toastId: confirmId,
        };

        toastr.info(confirmHtml, this.prefix + title, opts);
        logger.debug('Confirmation notification:', message);

        return confirmId;
    }

    /**
     * Get notification status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            defaultOptions: this.defaultOptions,
            prefix: this.prefix,
            activeConfirms: Object.keys(window.nameTrackerNotifications?.confirmCallbacks || {}).length,
        };
    }
}

// Create singleton instance
const notifications = new NotificationManager();

logger.debug('Notifications module loaded');


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (notifications);


/***/ },

/***/ 806
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   Xv: () => (/* binding */ createModuleLogger)
/* harmony export */ });
/* unused harmony exports debugLogger, addTrace, startTimer, endTimer */
/**
 * Debug and logging utilities for Name Tracker extension
 * Provides module-specific logging, performance monitoring, and state inspection
 */

const MODULE_NAME = 'NT';

class DebugLogger {
    constructor() {
        this.modules = new Map();
        this.performanceMarks = new Map();
        this.operationTraces = new Map();
    }

    /**
     * Create a module-specific logger
     * @param {string} moduleName - Name of the module
     * @returns {Object} Logger instance with module-specific methods
     */
    createModuleLogger(moduleName) {
        if (this.modules.has(moduleName)) {
            return this.modules.get(moduleName);
        }

        const logger = {
            log: (...args) => this.log(moduleName, 'log', ...args),
            warn: (...args) => this.log(moduleName, 'warn', ...args),
            error: (...args) => this.log(moduleName, 'error', ...args),
            debug: (...args) => this.log(moduleName, 'debug', ...args),
            trace: (operationId, message) => this.addTrace(moduleName, operationId, message),
            startTimer: (timerName) => this.startTimer(moduleName, timerName),
            endTimer: (timerName) => this.endTimer(moduleName, timerName),
        };

        this.modules.set(moduleName, logger);
        return logger;
    }

    /**
     * Internal logging method
     * @param {string} moduleName - Module name
     * @param {string} level - Log level
     * @param {...any} args - Arguments to log
     */
    log(moduleName, level, ...args) {
        if (!this.isDebugEnabled()) {
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${MODULE_NAME}:${moduleName}] ${timestamp}`;

        switch (level) {
            case 'error':
                console.error(prefix, ...args);
                break;
            case 'warn':
                console.warn(prefix, ...args);
                break;
            case 'debug':
                console.debug(prefix, ...args);
                break;
            default:
                console.log(prefix, ...args);
        }
    }

    /**
     * Add operation trace for debugging workflows
     * @param {string} moduleName - Module name
     * @param {string} operationId - Unique operation identifier
     * @param {string} message - Trace message
     */
    addTrace(moduleName, operationId, message) {
        if (!this.isDebugEnabled()) {
            return;
        }

        if (!this.operationTraces.has(operationId)) {
            this.operationTraces.set(operationId, []);
        }

        this.operationTraces.get(operationId).push({
            module: moduleName,
            timestamp: Date.now(),
            message: message,
        });
    }

    /**
     * Get trace history for an operation
     * @param {string} operationId - Operation identifier
     * @returns {Array} Trace entries
     */
    getTrace(operationId) {
        return this.operationTraces.get(operationId) || [];
    }

    /**
     * Start performance timer
     * @param {string} moduleName - Module name
     * @param {string} timerName - Timer identifier
     */
    startTimer(moduleName, timerName) {
        const key = `${moduleName}:${timerName}`;
        this.performanceMarks.set(key, performance.now());
    }

    /**
     * End performance timer and log duration
     * @param {string} moduleName - Module name
     * @param {string} timerName - Timer identifier
     * @returns {number} Duration in milliseconds
     */
    endTimer(moduleName, timerName) {
        const key = `${moduleName}:${timerName}`;
        const startTime = this.performanceMarks.get(key);

        if (startTime === undefined) {
            this.log(moduleName, 'warn', `Timer '${timerName}' was not started`);
            return 0;
        }

        const duration = performance.now() - startTime;
        this.performanceMarks.delete(key);

        this.log(moduleName, 'debug', `Timer '${timerName}': ${duration.toFixed(2)}ms`);
        return duration;
    }

    /**
     * Check if debug mode is enabled
     * @returns {boolean} Debug mode status
     */
    isDebugEnabled() {
        // This will be overridden by main.js to connect to settings
        return true; // Default during initialization
    }

    /**
     * Clear all traces and performance data
     */
    clear() {
        this.operationTraces.clear();
        this.performanceMarks.clear();
    }

    /**
     * Get performance summary
     * @returns {Object} Performance statistics
     */
    getPerformanceSummary() {
        return {
            activeTimers: this.performanceMarks.size,
            activeTraces: this.operationTraces.size,
            modules: Array.from(this.modules.keys()),
        };
    }
}

// Create singleton instance
const debugLogger = new DebugLogger();

// Export the instance and key methods for easy access


// Export functions instead of bound methods to avoid binding issues
function createModuleLogger(moduleName) {
    return debugLogger.createModuleLogger(moduleName);
}

function addTrace(moduleName, operationId, message) {
    return debugLogger.addTrace(moduleName, operationId, message);
}

function startTimer(operationId) {
    return debugLogger.startTimer(operationId);
}

function endTimer(operationId) {
    return debugLogger.endTimer(operationId);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debugLogger);


/***/ },

/***/ 825
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ 854
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZD: () => (/* binding */ escapeHtml),
/* harmony export */   cv: () => (/* binding */ generateUID),
/* harmony export */   tx: () => (/* binding */ simpleHash)
/* harmony export */ });
/* unused harmony exports deepClone, debounce, throttle, isEmpty, normalizeName, calculateSimilarity, formatTimestamp, truncate */
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/**
 * Utility functions for Name Tracker extension
 * Common helpers and shared functionality
 */



const logger = _core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].createModuleLogger */ .Ay.createModuleLogger('Utils');

/**
 * Simple hash function for generating unique identifiers
 * @param {string} str - String to hash
 * @returns {string} Hash value in base-36 format
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} HTML-safe text
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate unique identifier
 * @returns {string} Unique ID
 */
function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }

    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }

    return obj;
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
function isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Normalize character names (remove extra spaces, normalize case)
 * @param {string} name - Name to normalize
 * @returns {string} Normalized name
 */
function normalizeName(name) {
    if (typeof name !== 'string') {
        return '';
    }

    return name
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Calculate similarity between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    const a = str1.toLowerCase();
    const b = str2.toLowerCase();

    if (a === b) return 1;

    // Simple Levenshtein distance
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1,      // deletion
                );
            }
        }
    }

    const maxLength = Math.max(a.length, b.length);
    return 1 - (matrix[b.length][a.length] / maxLength);
}

/**
 * Format timestamp for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength) {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

logger.debug('Utils module loaded');

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
    simpleHash,
    escapeHtml,
    generateUID,
    deepClone,
    debounce,
    throttle,
    isEmpty,
    normalizeName,
    calculateSimilarity,
    formatTimestamp,
    truncate,
});


/***/ },

/***/ 897
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AG: () => (/* binding */ updateUI),
/* harmony export */   Fo: () => (/* binding */ initializeMenuButtons),
/* harmony export */   L2: () => (/* binding */ updateCharacterList),
/* harmony export */   Ow: () => (/* binding */ initializeUIHandlers),
/* harmony export */   oy: () => (/* binding */ bindSettingsHandlers),
/* harmony export */   updateStatusDisplay: () => (/* binding */ updateStatusDisplay)
/* harmony export */ });
/* unused harmony exports showMergeDialog, showCreateCharacterModal, showPurgeConfirmation, showSystemPromptEditor, showCharacterListModal, addMenuButton, toggleAutoHarvest, openChatLorebook, loadSettingsHTML */
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(462);
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(548);
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(102);
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(854);
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(695);
/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(551);
/* harmony import */ var _llm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(248);
/* harmony import */ var _processing_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(972);
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(134);
/**
 * UI Management Module
 *
 * Handles user interface components, settings panel management, character lists,
 * modal dialogs, and progress indicators for the Name Tracker extension.
 */












const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* .createModuleLogger */ .Xv)('ui');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__/* .NotificationManager */ .h('UI Management');

/**
 * Update character list display in settings
 * @returns {void}
 */
function updateCharacterList() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('updateCharacterList', async () => {
        let $container = $('#name_tracker_character_list');
        if ($container.length === 0) {
            // Fallback: create a minimal container if settings HTML wasn't loaded
            const settingsRoot = document.getElementById('extensions_settings');
            if (settingsRoot) {
                const placeholder = document.createElement('div');
                placeholder.id = 'name_tracker_character_list';
                settingsRoot.appendChild(placeholder);
                $container = $('#name_tracker_character_list');
            } else {
                debug.log();
                return;
            }
        }

        console.log('[NT-UI] 🟡 updateCharacterList() called');
        const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();
        console.log('[NT-UI] 🟡 getCharacters() returned:', Object.keys(characters || {}));
        const characterNames = Object.keys(characters);
        console.log('[NT-UI] 🟡 Character count:', characterNames.length);

        if (characterNames.length === 0) {
            $container.html(`
                <div class="name_tracker_no_characters">
                    <p style="text-align: center; color: var(--SmartThemeQuoteColor);">
                        No characters tracked yet. Start a conversation and character information will be extracted automatically!
                    </p>
                </div>
            `);
            return;
        }

        // Sort characters: Main characters first, then alphabetically
        const sortedCharacters = Object.values(characters).sort((a, b) => {
            if (a.isMainChar && !b.isMainChar) return -1;
            if (!a.isMainChar && b.isMainChar) return 1;
            return a.preferredName.localeCompare(b.preferredName);
        });

        let html = '<div class="name_tracker_character_list">';

        for (const character of sortedCharacters) {
            const charIcon = character.isMainChar ? '<i class="fa-solid fa-user"></i>' : '';
            const ignoreIcon = character.ignored ? '<span class="char-ignored-badge">IGNORED</span>' : '';
            const reviewBadge = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .hasUnresolvedRelationships */ .pp)(character) ? '<span class="char-review-badge">NEEDS REVIEW</span>' : '';

            const aliasText = character.aliases && character.aliases.length > 0
                ? `<div class="char-aliases">Aliases: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.aliases.join(', '))}</div>`
                : '';

            const relationshipText = character.relationships && character.relationships.length > 0
                ? `<div class="char-relationships">Relationships: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.relationships.join('; '))}</div>`
                : '';

            const lastUpdated = character.lastUpdated
                ? new Date(character.lastUpdated).toLocaleString()
                : 'Never';

            html += `
                <div class="name_tracker_character_item" data-character="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}">
                    <div class="char-header">
                        <span class="char-name">
                            ${charIcon}
                            ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}
                            ${ignoreIcon}
                            ${reviewBadge}
                        </span>
                        <div class="char-actions">
                            <button class="char-action-btn char-action-view" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}" title="View in lorebook">
                                <i class="fa-solid fa-book"></i>
                            </button>
                            <button class="char-action-btn char-action-acknowledge ${character.needsReview ? 'needs-review' : ''}" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}" title="Acknowledge review">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="char-action-btn char-action-ignore" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}" title="${character.ignored ? 'Unignore' : 'Ignore'} character">
                                <i class="fa-solid ${character.ignored ? 'fa-eye' : 'fa-eye-slash'}"></i>
                            </button>
                            <button class="char-action-btn char-action-merge" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(character.preferredName)}" title="Merge with another character">
                                <i class="fa-solid fa-code-merge"></i>
                            </button>
                        </div>
                    </div>
                    ${aliasText}
                    ${relationshipText}
                    <div class="char-metadata">
                        <span>Confidence: ${character.confidence}%</span>
                        <span>Updated: ${lastUpdated}</span>
                    </div>
                </div>
            `;
        }

        html += '</div>';
        $container.html(html);
    });
}

/**
 * Update status display in settings
 * @returns {void}
 */
function updateStatusDisplay() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('updateStatusDisplay', async () => {
        const $statusContainer = $('#name_tracker_status_display');
        if ($statusContainer.length === 0) {
            return;
        }

        const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();
        const characterCount = Object.keys(characters).length;

        // Await settings to avoid Promise objects and ensure proper types
        const messageCounter = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('messageCounter') || 0;
        const lastScannedId = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lastScannedMessageId') || -1;
        const messageFreq = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('messageFrequency') || 10;

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const currentMessageId = context?.chat?.length || 0;

        // Ensure numeric values to prevent NaN
        const safeLastScanned = typeof lastScannedId === 'number' ? lastScannedId : -1;
        const safeMessageCounter = typeof messageCounter === 'number' ? messageCounter : 0;
        const safeMessageFreq = typeof messageFreq === 'number' ? messageFreq : 10;
        const safeChatLength = typeof currentMessageId === 'number' ? currentMessageId : 0;

        const pendingMessages = Math.max(0, safeChatLength - safeLastScanned);
        const progressText = safeMessageCounter > 0 ? ` (${safeMessageCounter} analyzed)` : '';
        const messagesToNextScan = Math.max(0, safeMessageFreq - (safeChatLength - safeLastScanned));

        // Debug logging
        console.log(`[NT-Status] Characters: ${characterCount}, Messages: ${safeChatLength}, LastScanned: ${safeLastScanned}, Pending: ${pendingMessages}`);

        const statusHtml = `
            <div class="name_tracker_status">
                <div class="status-item">
                    <strong>Characters tracked:</strong> ${characterCount}${progressText}
                </div>
                <div class="status-item">
                    <strong>Messages in chat:</strong> ${safeChatLength}
                </div>
                <div class="status-item">
                    <strong>Last scanned message:</strong> ${safeLastScanned >= 0 ? safeLastScanned + 1 : 'None'}
                </div>
                <div class="status-item">
                    <strong>Pending messages:</strong> ${pendingMessages}
                </div>
                <div class="status-item">
                    <strong>Messages until next scan:</strong> ${messagesToNextScan}
                </div>
            </div>
        `;

        $statusContainer.html(statusHtml);
    });
}

/**
 * Show character merge dialog
 * @param {string} sourceName - Name of source character
 * @returns {Promise<void>}
 */
async function showMergeDialog(sourceName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showMergeDialog', async () => {
        const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();

        // Create list of other characters
        const otherChars = Object.keys(characters).filter(name => name !== sourceName);

        if (otherChars.length === 0) {
            notifications.warning('No other characters to merge with');
            return;
        }

        // Simple prompt for target character
        const targetName = prompt(`Merge "${sourceName}" into which character? Available: ${otherChars.join(', ')}`);
        if (!targetName) {
            return; // User cancelled
        }

        try {
            if (characters[targetName]) {
                await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .mergeCharacters */ .lF)(sourceName, targetName);
                notifications.success(`Merged ${sourceName} into ${targetName}`);
            } else {
                notifications.error('Invalid target character name');
            }
        } catch (error) {
            notifications.error(`Merge failed: ${error.message}`, 'Merge Error');
        } finally {
            // Always update UI after merge attempt
            await updateCharacterList();
            await updateStatusDisplay();
        }
    });
}

/**
 * Show character creation modal
 * @returns {Promise<void>}
 */
async function showCreateCharacterModal() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showCreateCharacterModal', async () => {
        const characterName = prompt('Enter character name:');

        if (!characterName || !characterName.trim()) {
            return;
        }

        try {
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .createNewCharacter */ .g9)(characterName.trim());
            notifications.success(`Created character: ${characterName.trim()}`);
        } catch (error) {
            notifications.error(`Failed to create character: ${error.message}`, 'Creation Error');
        } finally {
            // Always update UI after character creation attempt
            await updateCharacterList();
            await updateStatusDisplay();
        }
    });
}

/**
 * Show purge confirmation dialog
 * @returns {Promise<void>}
 */
async function showPurgeConfirmation() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showPurgeConfirmation', async () => {
        const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();
        const characterCount = Object.keys(characters).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return;
        }

        const confirmed = confirm(`This will delete all ${characterCount} tracked characters and their lorebook entries.\\n\\nThis action cannot be undone!\\n\\nContinue?`);

        if (!confirmed) {
            return;
        }

        try {
            const deletedCount = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .purgeAllCharacters */ .vu)();
            notifications.success(`Purged ${deletedCount} characters`, 'Purge Complete');
        } catch (error) {
            notifications.error(`Failed to purge characters: ${error.message}`, 'Purge Error');
        } finally {
            // Always update UI after purge attempt
            await updateCharacterList();
            await updateStatusDisplay();
        }
    });
}

/**
 * Show system prompt editor modal
 * @returns {Promise<void>}
 */
async function showSystemPromptEditor() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showSystemPromptEditor', async () => {
        // Get current system prompt
        let currentPrompt = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('systemPrompt');
        currentPrompt = currentPrompt || '';

        // Create modal dialog
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--SmartThemeBlurTintColor);
                border: 1px solid var(--SmartThemeBorderColor);
                border-radius: 10px;
                padding: 20px;
                max-width: 700px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <h3 style="margin-top: 0;">Edit System Prompt</h3>
                <p>Customize the system prompt used for character analysis. Leave blank to use default.</p>
                <textarea id="system_prompt_editor" rows="20" style="width: 100%; margin: 10px 0;"
                          placeholder="Enter custom system prompt or leave blank for default...">${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(currentPrompt)}</textarea>
                <div style="margin-top: 20px; text-align: right;">
                    <button class="menu_button" id="system_prompt_save">Save</button>
                    <button class="menu_button" id="system_prompt_reset">Reset to Default</button>
                    <button class="menu_button" id="system_prompt_cancel">Cancel</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#system_prompt_save').on('click', async () => {
            const newPrompt = modal.find('#system_prompt_editor').val().trim();
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('systemPrompt', newPrompt || null);
            notifications.success('System prompt updated');
            removeModal();
        });

        modal.find('#system_prompt_reset').on('click', async () => {
            modal.find('#system_prompt_editor').val('');
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('systemPrompt', null);
            notifications.success('Reset to default system prompt');
            removeModal();
        });

        modal.find('#system_prompt_cancel').on('click', removeModal);
        overlay.on('click', removeModal);
    });
}

/**
 * Show character list modal
 * @returns {void}
 */
async function showCharacterListModal() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showCharacterListModal', async () => {
        const characters = Object.values(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)() || {});

        // Build character list HTML
        let charactersHtml = '';

        if (characters.length === 0) {
            charactersHtml = '<p style="text-align: center; color: var(--SmartThemeQuoteColor);">No characters tracked yet</p>';
        } else {
            // Sort: Main characters first, then by name
            characters.sort((a, b) => {
                if (a.isMainChar && !b.isMainChar) return -1;
                if (!a.isMainChar && b.isMainChar) return 1;
                return a.preferredName.localeCompare(b.preferredName);
            });

            charactersHtml = '<div style="max-height: 400px; overflow-y: auto;">';
            for (const char of characters) {
                const badges = [];
                if (char.isMainChar) badges.push('<span style="background: var(--SmartThemeBodyColor); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">MAIN</span>');
                if (char.ignored) badges.push('<span style="background: var(--black70a); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">IGNORED</span>');
                if (await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .hasUnresolvedRelationships */ .pp)(char)) badges.push('<span style="background: var(--crimsonDark); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">NEEDS REVIEW</span>');

                const aliasText = char.aliases && char.aliases.length > 0
                    ? `<div style="font-size: 0.9em; color: var(--SmartThemeQuoteColor); margin-top: 3px;">Aliases: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(char.aliases.join(', '))}</div>`
                    : '';

                charactersHtml += `
                    <div style="padding: 10px; margin: 5px 0; background: var(--SmartThemeBlurTintColor); border: 1px solid var(--SmartThemeBorderColor); border-radius: 5px;">
                        <div style="font-weight: bold;">
                            ${char.isMainChar ? '<i class="fa-solid fa-user" style="margin-right: 5px;"></i>' : ''}
                            ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__/* .escapeHtml */ .ZD)(char.preferredName)}
                            ${badges.join('')}
                        </div>
                        ${aliasText}
                    </div>
                `;
            }
            charactersHtml += '</div>';
        }

        // Create and show modal
        const modalHtml = `
            <div class="name-tracker-character-modal">
                <h3 style="margin-top: 0;">Tracked Characters (${characters.length})</h3>
                ${charactersHtml}
                <div style="margin-top: 15px; text-align: center;">
                    <button class="menu_button" onclick="$('#name_tracker_settings').find('.inline-drawer-toggle').click(); $(this).closest('.popup').remove();">
                        <i class="fa-solid fa-gear"></i> Open Settings
                    </button>
                </div>
            </div>
        `;

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        context.callGenericPopup(modalHtml, context.POPUP_TYPE.TEXT, '', { wider: true, okButton: 'Close' });
    });
}

/**
 * Initialize UI event handlers
 * @returns {void}
 */
function initializeUIHandlers() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('initializeUIHandlers', () => {
        // Character action handlers
        $(document).on('click', '.char-action-merge', async function() {
            const sourceName = $(this).data('name');
            await showMergeDialog(sourceName);
        });

        $(document).on('click', '.char-action-ignore', async function() {
            const name = $(this).data('name');
            try {
                await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .toggleIgnoreCharacter */ .el)(name);
            } catch (error) {
                notifications.error(`Failed to toggle ignore: ${error.message}`, 'Toggle Error');
            } finally {
                // Always update UI after ignore toggle attempt
                await updateCharacterList();
                await updateStatusDisplay();
            }
        });

        $(document).on('click', '.char-action-view', async function() {
            const name = $(this).data('name');
            await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_9__/* .viewInLorebook */ ._Z)(name);
        });

        $(document).on('click', '.char-action-acknowledge', async function() {
            const name = $(this).data('name');
            try {
                const character = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacter */ .qN)(name);
                if (character) {
                    character.needsReview = false;
                    await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setCharacter */ .e7)(name, character);
                    await updateCharacterList();
                    notifications.success(`Acknowledged review for ${name}`);
                }
            } catch (error) {
                notifications.error(`Failed to acknowledge: ${error.message}`);
            }
        });

        debug.log();
    });
}

/**
 * Show edit lorebook entry modal
 * @param {string} characterName - Name of character to edit
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
async function showEditLorebookModal(characterName) {
    return withErrorBoundary('showEditLorebookModal', async () => {
        const character = await getCharacter(characterName);

        if (!character) {
            notifications.error('Character not found');
            return;
        }

        // Build edit dialog
        const currentKeys = [characterName, ...(character.aliases || [])].join(', ');

        const dialogHtml = `
            <div class="lorebook-entry-editor">
                <h3>Edit Lorebook Entry: ${escapeHtml(characterName)}</h3>

                <div class="editor-section">
                    <label for="entry-keys">Keys (comma-separated):</label>
                    <input type="text" id="entry-keys" class="text_pole" value="${escapeHtml(currentKeys)}"
                           placeholder="${escapeHtml(characterName)}, aliases, nicknames">
                    <small>These words trigger this entry in the chat context</small>
                </div>

                <div class="editor-section">
                    <label for="entry-content">Entry Content:</label>
                    <textarea id="entry-content" rows="10" class="text_pole"
                              placeholder="Description, personality, background, relationships...">${escapeHtml(character.notes || '')}</textarea>
                    <small>This will be injected into context when keys are mentioned</small>
                </div>

                <div class="editor-section">
                    <label for="entry-relationships">Relationships:</label>
                    <textarea id="entry-relationships" rows="3" class="text_pole"
                              placeholder="Friend of Alice; Enemy of Bob; Works for XYZ Corp">${escapeHtml((character.relationships || []).join('; '))}</textarea>
                    <small>One relationship per line or semicolon-separated</small>
                </div>
            </div>
        `;

        // Create simple modal dialog
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--SmartThemeBlurTintColor);
                border: 1px solid var(--SmartThemeBorderColor);
                border-radius: 10px;
                padding: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                ${dialogHtml}
                <div style="margin-top: 20px; text-align: right;">
                    <button class="menu_button" id="entry-save">Save</button>
                    <button class="menu_button" id="entry-cancel">Cancel</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#entry-save').on('click', async () => {
            const keys = modal.find('#entry-keys').val().split(',').map(k => k.trim()).filter(k => k);
            const content = modal.find('#entry-content').val();
            const relationships = modal.find('#entry-relationships').val()
                .split(/[;\\n]/)
                .map(r => r.trim())
                .filter(r => r);

            // Update character data
            const preferredName = keys[0] || characterName;
            const aliases = keys.slice(1);

            character.preferredName = preferredName;
            character.aliases = aliases;
            character.notes = content;
            character.relationships = relationships;

            // If preferred name changed, need to update the key in settings
            if (preferredName !== characterName) {
                await removeCharacter(characterName);
            }
            await setCharacter(preferredName, character);

            await updateCharacterList();
            await updateStatusDisplay();

            notifications.success(`Updated lorebook entry for ${preferredName}`);
            removeModal();
        });

        modal.find('#entry-cancel').on('click', removeModal);
        overlay.on('click', removeModal);
    });
}

/**
 * Add a menu button to the extensions menu
 * @param {string} text - Button text
 * @param {string} faIcon - Font Awesome icon classes
 * @param {Function} callback - Click handler
 * @param {string} hover - Tooltip text
 * @param {string} className - Optional additional CSS class
 * @returns {void}
 */
function addMenuButton(text, faIcon, callback, hover = null, className = '') {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('addMenuButton', () => {
        const $button = $(`
            <div class="list-group-item flex-container flexGap5 interactable ${className}" title="${hover || text}" tabindex="0">
                <i class="${faIcon}"></i>
                <span>${text}</span>
            </div>
        `);

        const $extensionsMenu = $('#extensionsMenu');
        if (!$extensionsMenu.length) {
            console.error('[Name Tracker] Could not find the extensions menu');
            return;
        }

        $button.appendTo($extensionsMenu);
        $button.on('click', () => callback());
    });
}

/**
 * Toggle auto-harvest on/off
 * @returns {Promise<void>}
 */
async function toggleAutoHarvest() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('toggleAutoHarvest', async () => {
        const currentValue = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('autoAnalyze', true);
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('autoAnalyze', !currentValue);

        // Update the settings UI
        $('#name_tracker_auto_analyze').prop('checked', !currentValue);

        // Update menu button icon to reflect state
        const $menuButton = $('#extensionsMenu .name-tracker-toggle-harvest');
        if (!currentValue) {
            $menuButton.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        } else {
            $menuButton.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        }

        await updateStatusDisplay();

        notifications.success(
            `Auto-harvest ${!currentValue ? 'enabled' : 'disabled'}`,
        );
    });
}

/**
 * Open the chat lorebook in the World Info editor
 * @returns {Promise<void>}
 */
async function openChatLorebook() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('openChatLorebook', async () => {
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const lorebookName = context.chatMetadata?.world_info;

        if (!lorebookName) {
            notifications.warning('No active chat or lorebook');
            return;
        }

        if (typeof context.openWorldInfoEditor === 'function') {
            await context.openWorldInfoEditor(lorebookName);
        } else {
            // Fallback: show the world info panel
            $('#WorldInfo').click();
            notifications.info(`Please select "${lorebookName}" from the World Info panel`);
        }
    });
}

/**
 * Initialize extension menu buttons
 * @returns {void}
 */
function initializeMenuButtons() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('initializeMenuButtons', async () => {
        // Add toggle auto-harvest button with visual state
        const autoAnalyze = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('autoAnalyze', true);
        const toggleIcon = autoAnalyze ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off';
        await addMenuButton(
            'Toggle Auto-Harvest',
            toggleIcon,
            toggleAutoHarvest,
            'Toggle automatic character harvesting on/off',
            'name-tracker-toggle-harvest',
        );

        // Add character list button
        await addMenuButton(
            'View Characters',
            'fa-solid fa-users',
            showCharacterListModal,
            'View all tracked characters',
        );

        // Add open lorebook button
        await addMenuButton(
            'Open Chat Lorebook',
            'fa-solid fa-book',
            openChatLorebook,
            'Open the Name Tracker chat lorebook in the World Info editor',
        );

        debug.log();
    });
}

/**
 * Bind settings UI event handlers
 * @returns {void}
 */
function bindSettingsHandlers() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('bindSettingsHandlers', () => {
        // Main settings handlers
        $('#name_tracker_enabled').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('enabled', event.target.checked);
            await updateStatusDisplay();
        });

        $('#name_tracker_auto_analyze').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('autoAnalyze', event.target.checked);
            await updateStatusDisplay();
        });

        $('#name_tracker_message_frequency').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('messageFrequency', parseInt(event.target.value) || 10);
            await updateStatusDisplay();
        });

        $('#name_tracker_llm_source').on('change', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('llmSource', event.target.value);
        });

        $('#name_tracker_ollama_endpoint').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('ollamaEndpoint', event.target.value);
        });

        $('#name_tracker_ollama_model').on('change', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('ollamaModel', event.target.value);
        });

        $('#name_tracker_load_models').on('click', async () => {
            try {
                await (0,_llm_js__WEBPACK_IMPORTED_MODULE_7__/* .loadOllamaModels */ .Bw)();
                notifications.success('Ollama models loaded');
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                debug.log();
                notifications.error('Failed to load Ollama models');
            }
        });

        $('#name_tracker_confidence_threshold').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('confidenceThreshold', parseInt(event.target.value) || 70);
        });

        // Lorebook settings handlers
        $('#name_tracker_lorebook_position').on('change', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('lorebookPosition', parseInt(event.target.value) || 0);
        });

        $('#name_tracker_lorebook_depth').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('lorebookDepth', parseInt(event.target.value) || 1);
        });

        $('#name_tracker_lorebook_cooldown').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('lorebookCooldown', parseInt(event.target.value) || 5);
        });

        $('#name_tracker_lorebook_probability').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('lorebookProbability', parseInt(event.target.value) || 100);
        });

        $('#name_tracker_lorebook_enabled').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('lorebookEnabled', event.target.checked);
        });

        $('#name_tracker_debug_mode').on('input', async (event) => {
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .setSetting */ .ZC)('debugMode', event.target.checked);
        });

        // Action button handlers
        $('#name_tracker_manual_analyze').on('click', async () => {
            const messageFreq = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('messageFrequency', 10);
            await (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__/* .harvestMessages */ .Ye)(messageFreq, true);
            await updateCharacterList();
            await updateStatusDisplay();
        });

        $('#name_tracker_scan_all').on('click', async () => {
            await (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__/* .scanEntireChat */ .bu)();
            await updateCharacterList();
            await updateStatusDisplay();
        });

        $('#name_tracker_create_character').on('click', async () => {
            await showCreateCharacterModal();
        });

        $('#name_tracker_clear_cache').on('click', () => {
            (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__/* .clearProcessingQueue */ .gH)();
            notifications.info('Cache and processing queue cleared');
        });

        $('#name_tracker_undo_merge').on('click', async () => {
            const { undoLastMerge } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 551));
            const success = await undoLastMerge();
            if (success) {
                await updateCharacterList();
                await updateStatusDisplay();
            }
        });

        $('#name_tracker_purge_entries').on('click', async () => {
            await showPurgeConfirmation();
        });

        $('#name_tracker_edit_prompt').on('click', async () => {
            await showSystemPromptEditor();
        });

        $('#name_tracker_debug_status').on('click', async () => {
            await showDebugStatus();
        });

        $('#name_tracker_dump_context').on('click', async () => {
            await dumpContextToConsole();
        });

        debug.log();
    });
}

/**
 * Show debug status popup with all relevant variables
 * @returns {void}
 */
function showDebugStatus() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('showDebugStatus', async () => {
        const settings = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)();
        const characters = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();

        // Reusable builder: compute debug info + HTML
        const buildDebugContent = async () => {
            // Get LLM context info
            let maxPromptTokens = 4096;
            let contextDetails = {};
            let detectionMethod = 'unknown';

            try {
                const { getMaxPromptLength } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 248));
                const { stContext } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 102));
                const maxPromptResultObj = await getMaxPromptLength();
                maxPromptTokens = maxPromptResultObj.maxPrompt;
                detectionMethod = maxPromptResultObj.detectionMethod;

                // Get raw context info (retry briefly if not yet ready)
                let context = stContext.getContext();
                if (!context || typeof context.maxContext === 'undefined') {
                    for (let i = 0; i < 3; i++) {
                        await new Promise(r => setTimeout(r, 200));
                        context = stContext.getContext();
                        if (context && typeof context.maxContext !== 'undefined') break;
                    }
                }

                if (!context || typeof context.maxContext === 'undefined') {
                    contextDetails = {
                        totalContext: 'Not loaded yet (no chat active)',
                        maxGeneration: 'N/A',
                        maxGenerationNote: 'Context will be available after chat loads',
                        modelName: context?.main_api || 'unknown',
                    };
                } else {
                    const totalContext = context.maxContext;
                    const extensionMaxTokens = Math.min(4096, Math.floor(totalContext * 0.15));

                    contextDetails = {
                        totalContext: totalContext,
                        maxGeneration: extensionMaxTokens,
                        maxGenerationNote: 'Extension-controlled (15% of context, max 4096)',
                        modelName: context.main_api || 'unknown',
                    };
                }
            } catch (_error) {
                console.error('[NT-Debug] Error in buildDebugContent:', _error);
                debug.log('Could not load LLM config:', _error);
                contextDetails = {
                    totalContext: 'Error loading',
                    maxGeneration: 'Error',
                    maxGenerationNote: 'Check console for details',
                    modelName: 'unknown',
                };
                detectionMethod = 'error';
            }

            // Get batch size constants from processing module
            const batchConstants = {
                MIN_MESSAGES_PER_BATCH: 5,
                TARGET_MESSAGES_PER_BATCH: 30,
                MAX_MESSAGES_PER_BATCH: 50,
                CONTEXT_TARGET_PERCENT: 80,
                MIN_CONTEXT_TARGET: 50,
            };

            const systemPromptTokens = 500;
            // Use generous response allocation instead of hardcoded 2048 limit
            const maxGenTokens = typeof contextDetails.maxGeneration === 'number' ? contextDetails.maxGeneration : Math.max(8192, maxPromptTokens - 2000);
            const safetyMargin = 500;
            const reservedTokens = systemPromptTokens + maxGenTokens + safetyMargin;
            const availableTokens = maxPromptTokens;

            // Compile debug info
            const debugInfo = {
                'Extension Status': {
                    'Enabled': settings.enabled !== false,
                    'Debug Mode': settings.debugMode !== false,
                    'LLM Source': settings.llmSource || 'sillytavern',
                    'Model API': contextDetails.modelName,
                    'Tracked Characters': Object.keys(characters).length,
                },
                'SillyTavern Context': {
                    'Total Context Window': contextDetails.totalContext,
                    'Extension Max Tokens': `${contextDetails.maxGeneration} (${contextDetails.maxGenerationNote})`,
                    'System Prompt Reserve': systemPromptTokens,
                    'Safety Margin': safetyMargin,
                    'Total Reserved': reservedTokens,
                },
                'Max Context Detection': {
                    'Detection Method': detectionMethod || 'unknown',
                    'Detected Max Context': contextDetails.totalContext,
                    'Final Max Prompt': maxPromptTokens,
                },
                'Usable Token Budget': {
                    'Max Prompt Tokens': maxPromptTokens,
                    'Context Target %': batchConstants.CONTEXT_TARGET_PERCENT,
                    'Tokens to Use': Math.floor(availableTokens * (batchConstants.CONTEXT_TARGET_PERCENT / 100)),
                },
                'Batch Configuration': {
                    'Min Messages/Batch': batchConstants.MIN_MESSAGES_PER_BATCH,
                    'Target Messages/Batch': batchConstants.TARGET_MESSAGES_PER_BATCH,
                    'Max Messages/Batch': batchConstants.MAX_MESSAGES_PER_BATCH,
                    'Min Context Target': batchConstants.MIN_CONTEXT_TARGET,
                },
                'Analysis Settings': {
                    'Message Frequency': settings.messageFrequency || 10,
                    'Auto-Analyze': settings.autoAnalyze !== false,
                    'Confidence Threshold': settings.confidenceThreshold || 70,
                },
                'Lorebook Settings': {
                    'Position': ['After Char', 'Before Char', 'Top', 'Bottom'][settings.lorebookPosition || 0],
                    'Depth': settings.lorebookDepth || 1,
                    'Cooldown': settings.lorebookCooldown || 5,
                    'Probability %': settings.lorebookProbability || 100,
                    'Enabled': settings.lorebookEnabled !== false,
                },
            };

            // Format for display
            let htmlContent = '<div style="font-family: monospace; font-size: 12px; max-height: 500px; overflow-y: auto;">';
            for (const [section, values] of Object.entries(debugInfo)) {
                htmlContent += '<div style="margin-bottom: 15px; border-bottom: 1px solid #666; padding-bottom: 10px;">';
                htmlContent += `<strong style="color: #90EE90; font-size: 13px;">${section}</strong><br>`;
                for (const [key, value] of Object.entries(values)) {
                    const displayValue = value === true ? '✓' : (value === false ? '✗' : value);
                    htmlContent += `<div style="margin-left: 10px; padding: 2px 0;">
                        <span style="color: #87CEEB;">${key}:</span>
                        <span style="color: #FFFF99;">${displayValue}</span>
                    </div>`;
                }
                htmlContent += '</div>';
            }
            htmlContent += '</div>';

            return { debugInfo, htmlContent };
        };

        // Initial content
        const initial = await buildDebugContent();

        // Show in modal
        const modal = $(`
            <div class="nametracker-modal" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                border: 2px solid #90EE90;
                border-radius: 10px;
                padding: 20px;
                max-width: 550px;
                width: 90%;
                max-height: 75vh;
                overflow-y: auto;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            ">
                <h3 style="margin-top: 0; color: #90EE90; border-bottom: 2px solid #90EE90; padding-bottom: 10px;">
                    <i class="fa-solid fa-bug"></i> Debug Status
                </h3>
                <div id="nt-debug-content">${initial.htmlContent}</div>
                <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid #666; padding-top: 10px;">
                    <button class="menu_button" id="debug-refresh" style="background: #2a2a2a; color: #FFFF99; border: 1px solid #90EE90;">Refresh</button>
                    <button class="menu_button" id="debug-close" style="background: #2a2a2a; color: #90EE90; border: 1px solid #90EE90;">Close</button>
                </div>
            </div>
        `);

        const overlay = $(`
            <div class="nametracker-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9998;
            "></div>
        `);

        $('body').append(overlay).append(modal);

        const removeModal = () => {
            modal.remove();
            overlay.remove();
        };

        modal.find('#debug-close').on('click', removeModal);
        overlay.on('click', removeModal);

        // Log initial to console
        console.log('[NT-Debug]', initial.debugInfo);

        // Refresh handler: recompute and update content in-place
        modal.find('#debug-refresh').on('click', async () => {
            try {
                const refreshed = await buildDebugContent();
                modal.find('#nt-debug-content').html(refreshed.htmlContent);
                console.log('[NT-Debug]', refreshed.debugInfo);
            } catch (e) {
                console.error('[NT-Debug] Refresh failed:', e);
            }
        });
    });
}

/**
 * Load and inject settings HTML
 * @param {string} extensionFolderPath - Path to extension folder
 * @returns {Promise<void>}
 */
async function loadSettingsHTML(extensionFolderPath) {
    return withErrorBoundary('loadSettingsHTML', async () => {
        try {
            // Load the settings HTML
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);

            // Append to the extensions settings panel
            $('#extensions_settings').append(settingsHtml);

            debug.log();
        } catch (error) {
            console.error('Failed to load settings HTML:', error);
            throw new NameTrackerError(`Failed to load settings HTML: ${error.message}`);
        }
    });
}

/**
 * Dump entire SillyTavern context to console for debugging
 * Shows all properties, values, and structure in readable format
 * @returns {void}
 */
async function dumpContextToConsole() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('dumpContextToConsole', async () => {
        try {
            const dump = await _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.dumpContextToConsole();
            notifications.success('Context dumped to console - Press F12 to view', 'Context Dump');

            // Also show a brief summary in a dialog
            const summary = {
                'Total Properties': dump.availableProperties.length,
                'Key Properties Found': Object.keys(dump.detailedBreakdown).filter(k => k in dump.detailedBreakdown).length,
                'Timestamp': dump.timestamp,
            };

            console.log('%c[Name Tracker] QUICK SUMMARY:', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
            console.table(summary);

        } catch (error) {
            debug.log(`Failed to dump context: ${error.message}`);
            notifications.error(`Failed to dump context: ${error.message}`, 'Context Dump');
        }
    });
}

/**
 * Update UI elements based on current settings
 * @returns {Promise<void>}
 */
async function updateUI() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('updateUI', async () => {
        // Update all form elements with current settings
        $('#name_tracker_enabled').prop('checked', await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('enabled', true));
        $('#name_tracker_auto_analyze').prop('checked', await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('autoAnalyze', true));
        $('#name_tracker_message_frequency').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('messageFrequency', 10));
        $('#name_tracker_llm_source').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('llmSource', 'sillytavern'));
        $('#name_tracker_ollama_endpoint').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('ollamaEndpoint', 'http://localhost:11434'));
        $('#name_tracker_ollama_model').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('ollamaModel', ''));
        $('#name_tracker_confidence_threshold').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('confidenceThreshold', 70));
        $('#name_tracker_lorebook_position').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lorebookPosition', 0));
        $('#name_tracker_lorebook_depth').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lorebookDepth', 1));
        $('#name_tracker_lorebook_cooldown').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lorebookCooldown', 5));
        $('#name_tracker_lorebook_probability').val(await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lorebookProbability', 100));
        $('#name_tracker_lorebook_enabled').prop('checked', await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('lorebookEnabled', true));
        $('#name_tracker_debug_mode').prop('checked', await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getSetting */ .PL)('debugMode', false));

        // Update character list
        await updateCharacterList();
        // Note: updateStatusDisplay() is called via CHAT_LOADED event, not here
        // (calling it here would show 0 messages since chat hasn't loaded yet)

        debug.log();
    });
}


/***/ },

/***/ 972
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Wu: () => (/* binding */ onMessageReceived),
/* harmony export */   Ye: () => (/* binding */ harvestMessages),
/* harmony export */   bu: () => (/* binding */ scanEntireChat),
/* harmony export */   gH: () => (/* binding */ clearProcessingQueue)
/* harmony export */ });
/* unused harmony exports processAnalysisResults, scanForNewNames, processPhaseTwoAnalysis, addToQueue, processQueue, onChatChanged, getProcessingStatus, abortCurrentScan */
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(806);
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(462);
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(548);
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(102);
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(695);
/* harmony import */ var _llm_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(248);
/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(551);
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(134);
/* harmony import */ var _ui_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(897);
/**
 * Message Processing Module
 *
 * Handles two-phase character detection (lightweight name scan → focused LLM processing),
 * batch processing with character-specific context windows, and SillyTavern event integration.
 */











const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__/* .createModuleLogger */ .Xv)('processing');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__/* .NotificationManager */ .h('Message Processing');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = false; // Default off to reduce console noise

function debugLog(message, data = null) {
    if (DEBUG_LOGGING) {
        console.log(`[NT-Processing] ${message}`, data || '');
    }
}

// ============================================================================
// CONFIGURATION CONSTANTS - Core processing parameters
// ============================================================================
// These values drive the processing pipeline. Future user-exposed settings
// should reference these constant names for easy discovery and updates.

// Context Management
const CONTEXT_TARGET_PERCENT = 80;      // Target percentage of context window to use
const OVERLAP_SIZE = 3;                 // Messages to overlap between batches for continuity
const MIN_CONTEXT_TARGET = 50;          // Minimum allowed context target (floor for auto-reduction)

// Name Detection
const CAPITALIZED_WORD_REGEX = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;  // Matches capitalized names
const QUOTED_NAME_REGEX = /"([^"]+)"/g;  // Matches quoted names
const POSSESSIVE_REGEX = /(\b[A-Z][a-z]+)'s\b/g;  // Matches possessive forms

// Processing Control
// const BATCH_TIMEOUT_MS = 30000;         // Maximum time for a single batch to process (reserved for future)
const MAX_RETRY_ATTEMPTS = 3;           // Maximum retries before halting processing
const CONTEXT_REDUCTION_STEP = 5;       // Percentage to reduce context target on each failure

// Batch Size Constraints (token-based, but with message-count limits for safety)
// Reduced for incremental update strategy - smaller batches yield better focused character updates
const MIN_MESSAGES_PER_BATCH = 3;       // Never create batches smaller than this (unless last batch)
const MAX_MESSAGES_PER_BATCH = 10;      // Cap batches at this size even if tokens allow more
const TARGET_MESSAGES_PER_BATCH = 7;    // Aim for this size when possible (optimal for focused analysis)
const TARGET_MESSAGE_PERCENT = 35;      // Use 35% of max context for message data (conservative)

// Error Recovery
const ENABLE_AUTO_RECOVERY = true;      // Enable automatic context reduction on failure
// const PRESERVE_PROCESSING_STATE = true; // Always save character state even on errors (reserved for future)

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate available token budget for message data
 * @param {number} maxPromptTokens - Maximum tokens available from context
 * @returns {number} Available tokens for message content
 */
function calculateAvailableTokens(maxPromptTokens) {
    // Use only 35% of max context for messages (conservative to avoid overwhelming the model)
    // This leaves room for: system prompt (~1000 tokens) + response (up to 4000 tokens)
    return Math.floor(maxPromptTokens * (TARGET_MESSAGE_PERCENT / 100));
}

/**
 * Create batches of messages based on token limits
 * @param {Array} messages - Messages to batch
 * @param {number} availableTokens - Token budget per batch
 * @param {boolean} enforceMessageLimit - Whether to enforce MAX_MESSAGES_PER_BATCH
 * @returns {Promise<Array>} Array of message batches
 */
async function createMessageBatches(messages, availableTokens, enforceMessageLimit = true) {
    const batches = [];
    let currentBatch = [];
    let currentTokens = 0;

    for (const msg of messages) {
        const msgTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .calculateMessageTokens */ .au)([msg]);

        // Check if batch would exceed limits
        const wouldExceedTokens = currentTokens + msgTokens > availableTokens;
        const wouldExceedMessageCount = enforceMessageLimit && currentBatch.length >= MAX_MESSAGES_PER_BATCH;

        if ((wouldExceedTokens || wouldExceedMessageCount) && currentBatch.length > 0) {
            // Current batch is full, start new one
            batches.push(currentBatch);
            currentBatch = [msg];
            currentTokens = msgTokens;
        } else {
            // Add to current batch
            currentBatch.push(msg);
            currentTokens += msgTokens;
        }
    }

    // Add final batch
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

// Processing state
let processingQueue = [];
let isProcessing = false;
let abortScan = false;

// Throughput tracking for progress bar metrics
let batchTimestamps = []; // Store last 10 batch completion timestamps
const THROUGHPUT_WINDOW_SIZE = 10;
const currentProcessingState = {
    totalBatches: 0,
    currentBatch: 0,
    failedCharacters: [],
    lastError: null,
    contextTarget: CONTEXT_TARGET_PERCENT,
};

/**
 * Process analysis results from LLM
 * @param {Array} analyzedCharacters - Array of character data from LLM
 * @returns {Promise<void>}
 */
async function processAnalysisResults(analyzedCharacters) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('processAnalysisResults', async () => {
        debugLog('processAnalysisResults', {
            inputType: typeof analyzedCharacters,
            isArray: Array.isArray(analyzedCharacters),
            length: analyzedCharacters?.length,
        });

        if (!analyzedCharacters || !Array.isArray(analyzedCharacters)) {
            console.warn('[NT-Processing] ⚠️  Invalid input - not an array:', analyzedCharacters);
            debug.log();
            return;
        }

        debugLog(`Processing ${analyzedCharacters.length} characters`);

        for (const analyzedChar of analyzedCharacters) {
            try {
                await processCharacterData(analyzedChar);
            } catch (error) {
                console.error(`[NT-Processing] ❌ Error processing character ${analyzedChar.name}:`, error);
                console.error('[NT-Processing] Error stack:', error.stack);
                // Continue with other characters
            }
        }

        debugLog('All characters processed');
        console.log('[NT-Processing] 🟢 About to call updateCharacterList()');
        const listResult = await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__/* .updateCharacterList */ .L2)();
        console.log('[NT-Processing] 🟢 updateCharacterList() returned:', listResult);
        const statusResult = await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__.updateStatusDisplay)();
        console.log('[NT-Processing] 🟢 updateStatusDisplay() returned:', statusResult);
        const currentChars = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getCharacters */ .bg)();
        console.log('[NT-Processing] 🟢 Current characters in storage:', currentChars);
    });
}

/**
 * Process individual character data from LLM analysis
 * @param {Object} analyzedChar - Character data from LLM
 * @returns {Promise<void>}
 */
async function processCharacterData(analyzedChar) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('processCharacterData', async () => {
        console.log('[NT-Processing] 🟠 processCharacterData() for:', analyzedChar?.name);
        debugLog('Processing character data', analyzedChar?.name);

        if (!analyzedChar.name || analyzedChar.name.trim() === '') {
            console.warn('[NT-CharData] ⚠️  Character has no name, skipping');
            debug.log();
            return;
        }

        const characterName = analyzedChar.name.trim();
        debugLog('Character name', characterName);

        // Check if character is ignored
        const isIgnored = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .isIgnoredCharacter */ .eY)(characterName);
        if (isIgnored) {
            debugLog('Character ignored, skipping', characterName);
            debug.log();
            return;
        }

        // Check for main character detection
        const isMainChar = characterName.toLowerCase().includes('{{char}}') ||
                  analyzedChar.isMainCharacter === true ||
                  analyzedChar.role === 'main';
        debugLog('Is main char', isMainChar);

        // Check if character already exists
        const existingChar = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .findExistingCharacter */ ._$)(characterName);
        debugLog('Existing character found', !!existingChar);

        if (existingChar) {
            // Update existing character
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .updateCharacter */ .t9)(existingChar, analyzedChar, false, isMainChar);
            await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(existingChar, existingChar.preferredName);
            debug.log();
        } else {
            // Check for potential matches (similar names)
            const potentialMatch = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .findPotentialMatch */ .rL)(analyzedChar);
            debugLog('Potential match found', !!potentialMatch);

            if (potentialMatch) {
                // Update potential match and add as alias
                await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .updateCharacter */ .t9)(potentialMatch, analyzedChar, true, isMainChar);
                await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(potentialMatch, potentialMatch.preferredName);
                debug.log();
            } else {
                // Create new character
                const newCharacter = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__/* .createCharacter */ .OW)(analyzedChar, isMainChar);
                console.log('[NT-Processing] 🟠 Created character:', newCharacter?.preferredName);
                await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(newCharacter, newCharacter.preferredName);
                debug.log();
            }
        }
    });
}

// ============================================================================
// TWO-PHASE DETECTION SYSTEM
// ============================================================================

/**
 * PHASE 1: Lightweight name extraction from message batch
 * Uses regex patterns to find all potential character names without LLM
 * @param {Array} messages - Messages to scan for names
 * @returns {Array} Array of unique name candidates found
 */
async function scanForNewNames(messages) {
    return withErrorBoundary('scanForNewNames', async () => {
        debugLog(`[PHASE 1] Starting name scan on ${messages.length} messages`);

        if (!Array.isArray(messages) || messages.length === 0) {
            debugLog('[PHASE 1] No messages to scan');
            return [];
        }

        const foundNames = new Set();
        const existingCharacters = await getCharacters();
        const existingNames = new Set();

        debugLog(`[PHASE 1] Existing characters in memory: ${Object.keys(existingCharacters).length}`);

        // Build set of existing character names and aliases
        for (const char of Object.values(existingCharacters)) {
            existingNames.add(char.preferredName.toLowerCase());
            if (char.aliases && Array.isArray(char.aliases)) {
                char.aliases.forEach(alias => existingNames.add(alias.toLowerCase()));
            }
        }

        const capitalizedFound = [];
        const quotedFound = [];
        const possessiveFound = [];

        // Scan messages for potential names
        for (const msg of messages) {
            if (!msg.mes || typeof msg.mes !== 'string') continue;

            const text = msg.mes;

            // Extract capitalized words (names)
            const capitalizedMatches = text.match(CAPITALIZED_WORD_REGEX) || [];
            capitalizedMatches.forEach(match => {
                const normalized = match.toLowerCase();
                if (!existingNames.has(normalized) && match.length > 1) {
                    foundNames.add(match);
                    capitalizedFound.push(match);
                }
            });

            // Extract quoted names
            const quotedMatches = text.match(QUOTED_NAME_REGEX) || [];
            quotedMatches.forEach(match => {
                const name = match.slice(1, -1); // Remove quotes
                const normalized = name.toLowerCase();
                if (!existingNames.has(normalized) && name.length > 1) {
                    foundNames.add(name);
                    quotedFound.push(name);
                }
            });

            // Extract possessive forms
            const possessiveMatches = text.match(POSSESSIVE_REGEX) || [];
            possessiveMatches.forEach(match => {
                const name = match.replace(/'s$/, '');
                const normalized = name.toLowerCase();
                if (!existingNames.has(normalized)) {
                    foundNames.add(name);
                    possessiveFound.push(name);
                }
            });
        }

        debugLog(`[PHASE 1] Capitalized names found: ${capitalizedFound.join(', ')}`);
        debugLog(`[PHASE 1] Quoted names found: ${quotedFound.join(', ')}`);
        debugLog(`[PHASE 1] Possessive forms found: ${possessiveFound.join(', ')}`);
        debugLog(`[PHASE 1] Total unique names to process: ${foundNames.size}`);

        return Array.from(foundNames);
    }, []);
}

/**
 * PHASE 2: Focused LLM analysis for new characters and existing character updates
 * Processes new names individually and updates existing characters that were mentioned
 * @param {Array} newNames - New character names to analyze
 * @param {Array} messages - Message context for character details
 * @param {Array} existingMentions - Names of existing characters mentioned in messages
 * @returns {Promise<Object>} Results of processing with success/error details
 */
async function processPhaseTwoAnalysis(newNames, messages, existingMentions = []) {
    return withErrorBoundary('processPhaseTwoAnalysis', async () => {
        debugLog('[PHASE 2] Starting focused LLM analysis');
        debugLog(`[PHASE 2] New characters: ${newNames.length}, Existing mentions: ${existingMentions.length}`);
        debugLog(`[PHASE 2] Current context target: ${currentProcessingState.contextTarget}%`);

        const results = {
            newCharactersCreated: [],
            existingCharactersUpdated: [],
            failedCharacters: [],
            mergesDetected: [],
        };

        if (!Array.isArray(messages) || messages.length === 0) {
            debugLog('[PHASE 2] No messages provided, returning empty results');
            return results;
        }

        try {
            // Process new characters
            if (newNames && newNames.length > 0) {
                debugLog(`[PHASE 2] Processing ${newNames.length} new characters`);

                for (const newName of newNames) {
                    if (abortScan) {
                        debugLog(`[PHASE 2] Processing aborted by user at character: ${newName}`);
                        break;
                    }

                    try {
                        await processNewCharacter(newName, messages, results);
                    } catch (error) {
                        debugLog(`[PHASE 2] Failed to process new character ${newName}: ${error.message}`);
                        results.failedCharacters.push({ name: newName, error: error.message });
                        currentProcessingState.failedCharacters.push(newName);
                        currentProcessingState.lastError = error;

                        // If ENABLE_AUTO_RECOVERY, attempt to reduce context and retry
                        if (ENABLE_AUTO_RECOVERY && currentProcessingState.contextTarget > MIN_CONTEXT_TARGET) {
                            currentProcessingState.contextTarget -= CONTEXT_REDUCTION_STEP;
                            debugLog(`[PHASE 2] Auto-reducing context target to ${currentProcessingState.contextTarget}%`);
                        } else if (results.failedCharacters.length >= MAX_RETRY_ATTEMPTS) {
                            // Halt processing after max retries
                            throw new NameTrackerError(
                                `Processing halted: Maximum retries exceeded. Last error: ${error.message}`,
                                'PROCESSING_MAX_RETRIES',
                            );
                        }
                    }
                }
            }

            // Update existing characters mentioned in messages
            if (existingMentions && existingMentions.length > 0) {
                debug.log(`Phase 2: Updating ${existingMentions.length} existing characters`);

                for (const charName of existingMentions) {
                    if (abortScan) break;

                    try {
                        const existingChar = await findExistingCharacter(charName);
                        if (existingChar) {
                            await processExistingCharacter(existingChar, messages, results);
                        }
                    } catch (error) {
                        debug.log(`Failed to update character ${charName}: ${error.message}`);
                        results.failedCharacters.push({ name: charName, error: error.message });
                    }
                }
            }

        } catch (error) {
            debug.log(`Phase 2 analysis error: ${error.message}`);
            throw error;
        }

        return results;
    }, { newCharactersCreated: [], existingCharactersUpdated: [], failedCharacters: [], mergesDetected: [] });
}

/**
 * Process a new character: LLM analysis → create entry → check for merges
 * @private
 */
async function processNewCharacter(name, messages, results) {
    debugLog(`[P2-NewChar] Processing: ${name}`);

    // Build context with 3-message overlap for this character
    const characterContext = buildCharacterContext(name, messages, OVERLAP_SIZE);
    debugLog(`[P2-NewChar] Context window size: ${characterContext ? characterContext.length : 0} chars`);

    if (!characterContext || characterContext.length === 0) {
        debugLog(`[P2-NewChar] FAILED: No context for ${name}`);
        throw new NameTrackerError(`No context found for character: ${name}`, 'NO_CONTEXT');
    }

    // Analyze the character with LLM
    debugLog(`[P2-NewChar] Calling LLM for ${name}`);
    const characterData = await callLLMAnalysis([{ mes: characterContext }], [name], currentProcessingState.contextTarget);

    if (!characterData || characterData.length === 0) {
        debugLog(`[P2-NewChar] FAILED: LLM returned no data for ${name}`);
        throw new NameTrackerError(`LLM returned no data for character: ${name}`, 'LLM_EMPTY_RESPONSE');
    }

    debugLog(`[P2-NewChar] LLM returned data: ${JSON.stringify(characterData[0]).substring(0, 200)}...`);

    // Create the character
    const newCharacter = await createCharacter(characterData[0], false);
    await updateLorebookEntry(newCharacter, newCharacter.preferredName);

    results.newCharactersCreated.push(newCharacter.preferredName);
    debugLog(`[P2-NewChar] Successfully created: ${newCharacter.preferredName}`);

    // Re-check merge opportunities now that the character exists in the cache
    const potentialMerges = await detectMergeOpportunities(newCharacter.preferredName);
    if (potentialMerges && potentialMerges.length > 0) {
        debugLog(`[P2-NewChar] Merge opportunities: ${potentialMerges.map(m => `${m.targetName} (${Math.round(m.confidence * 100)}%)`).join(', ')}`);
        results.mergesDetected.push({ source: newCharacter.preferredName, targets: potentialMerges });

        for (const opportunity of potentialMerges) {
            if (opportunity.targetName === newCharacter.preferredName) {
                continue;
            }

            if (opportunity.confidence >= 0.9) {
                await mergeCharacters(newCharacter.preferredName, opportunity.targetName);
                notifications.success(`Auto-merged "${newCharacter.preferredName}" into "${opportunity.targetName}" (${Math.round(opportunity.confidence * 100)}% match)`, 'Character Merged');
                break; // stop after first high-confidence merge
            }

            if (opportunity.confidence >= 0.7) {
                notifications.info(`Possible duplicate: "${newCharacter.preferredName}" ≈ "${opportunity.targetName}" (${Math.round(opportunity.confidence * 100)}%). Review in settings if needed.`, 'Merge Suggested');
            }
        }
    }
}

/**
 * Process existing character: build context from last processed message → update entry
 * @private
 */
async function processExistingCharacter(existingChar, messages, results) {
    debug.log(`Updating existing character: ${existingChar.preferredName}`);

    // Build fresh context for this character from the current message window
    const characterContext = buildCharacterContext(existingChar.preferredName, messages, OVERLAP_SIZE);

    if (!characterContext || characterContext.length === 0) {
        debug.log(`No new context for character ${existingChar.preferredName} since last processing`);
        return;
    }

    // Analyze updated context for this character
    debugLog(`[P2-Existing] Calling LLM for ${existingChar.preferredName}`);
    const characterData = await callLLMAnalysis([{ mes: characterContext }], [existingChar.preferredName], currentProcessingState.contextTarget);

    if (!characterData || characterData.length === 0) {
        debugLog(`[P2-Existing] FAILED: LLM returned no data for ${existingChar.preferredName}`);
        throw new NameTrackerError(`LLM returned no data for character: ${existingChar.preferredName}`, 'LLM_EMPTY_RESPONSE');
    }

    // Update the character with new information
    await updateCharacter(existingChar, characterData[0], true, existingChar.isMainChar);
    await updateLorebookEntry(existingChar, existingChar.preferredName);

    results.existingCharactersUpdated.push(existingChar.preferredName);
    debugLog(`[P2-Existing] Successfully updated: ${existingChar.preferredName}`);
}

/**
 * Build contextual text window for a character from a set of messages.
 * Includes an overlap of messages before and after any detected mentions.
 * @param {string} characterName - Name of the character to search for
 * @param {Array} messages - Array of chat message objects ({ mes: string })
 * @param {number} overlapSize - Number of messages to include before/after mentions
 * @returns {string} Joined context text or empty string if no mentions
 */
function buildCharacterContext(characterName, messages, overlapSize) {
    if (!characterName || !Array.isArray(messages) || messages.length === 0) {
        return '';
    }

    const nameLower = String(characterName).toLowerCase();
    const mentionIndices = [];

    for (let i = 0; i < messages.length; i++) {
        const text = messages[i]?.mes || '';
        if (typeof text === 'string' && text.toLowerCase().includes(nameLower)) {
            mentionIndices.push(i);
        }
    }

    if (mentionIndices.length === 0) {
        return '';
    }

    const minIdx = Math.max(0, Math.min(...mentionIndices) - overlapSize);
    const maxIdx = Math.min(messages.length - 1, Math.max(...mentionIndices) + overlapSize);

    const windowTexts = [];
    for (let i = minIdx; i <= maxIdx; i++) {
        const text = messages[i]?.mes;
        if (text) {
            windowTexts.push(text);
        }
    }

    return windowTexts.join('\n\n');
}

/**
 * Build context starting from a specific message point (for continuing character updates)
 * @private
 */
// Note: Deprecated helper removed; continuing updates now use buildCharacterContext()

/**
 * Harvest and analyze messages
 * @param {number} messageCount - Number of recent messages to analyze
 * @param {boolean} showProgress - Whether to show progress notifications
 * @returns {Promise<void>}
 */
async function harvestMessages(messageCount, showProgress = true) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('harvestMessages', async () => {
        if (!await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('enabled', true)) {
            debug.log();
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getLLMConfig */ .eU)();
        if (llmConfig.source === 'sillytavern') {
            const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        if (!context.chat || context.chat.length === 0) {
            debug.log();
            notifications.info('No messages in chat to analyze');
            return;
        }

        // Get the messages to analyze - count forward and check token limits
        const endIdx = context.chat.length;
        const startIdx = Math.max(0, endIdx - messageCount);
        const messagesToAnalyze = context.chat.slice(startIdx, endIdx);

        debugLog(`[Batching] Message selection: startIdx=${startIdx}, endIdx=${endIdx}, requesting ${messageCount} messages, got ${messagesToAnalyze.length} messages`);

        let processedMessages = 0;

        // Check if messages fit in context window
        const maxPromptResult = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.getMaxPromptLength)();
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const availableTokens = calculateAvailableTokens(maxPromptTokens);

        debugLog(`[Batching] Token budget: maxPromptTokens=${maxPromptTokens}, targetPercent=${TARGET_MESSAGE_PERCENT}%, availableTokens=${availableTokens}`);
        debugLog(`[Batching] Context target: ${currentProcessingState.contextTarget}%`);
        debugLog(`[Batching] Estimated reserves: systemPrompt=~1000tok, response=~4000tok, messages=${availableTokens}tok`);

        // Calculate actual token count for the requested messages
        const messageTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .calculateMessageTokens */ .au)(messagesToAnalyze);

        debugLog(`[Batching] Total tokens for ${messagesToAnalyze.length} messages: ${messageTokens} tokens`);

        // If too large, split into batches
        if (messageTokens > availableTokens) {
            debugLog(`[Batching] Messages exceed token limit (${messageTokens} > ${availableTokens}), creating batches`);

            // Create batches using shared helper
            const batches = await createMessageBatches(messagesToAnalyze, availableTokens, true);

            // Log batch details for debugging
            const batchDetails = await Promise.all(batches.map(async (batch, i) => {
                const tokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .calculateMessageTokens */ .au)(batch);
                return `Batch ${i + 1}: ${batch.length}msg/${tokens}tok`;
            }));

            debugLog(`[Batching] Created ${batches.length} total batches: ${batchDetails.join(' | ')}`);
            debugLog(`[Batching] Constraints applied: MIN=${MIN_MESSAGES_PER_BATCH}, TARGET=${TARGET_MESSAGES_PER_BATCH}, MAX=${MAX_MESSAGES_PER_BATCH}, TokenLimit=${availableTokens}`);

            // Reset abort flag
            abortScan = false;

            // Reset throughput tracking
            batchTimestamps = [];

            // Calculate average batch size for user notification
            const avgBatchSize = Math.round(messagesToAnalyze.length / batches.length);
            const notification = `Analyzing ${messagesToAnalyze.length} messages in ${batches.length} batches (~${avgBatchSize} messages each). This may take a while. Continue?`;

            if (showProgress) {
                // Ask user before proceeding with large analysis
                const shouldProceed = confirm(notification);
                if (!shouldProceed) {
                    debugLog('[Batching] User cancelled batch processing');
                    abortScan = true;
                    return;
                }
            }

            // Show progress bar
            showProgressBar(0, batches.length, 'Starting analysis...');

            let successfulBatches = 0;
            let failedBatches = 0;
            const uniqueCharacters = new Set();

            debugLog(`[Batching] Starting batch processing loop: ${batches.length} batches`);

            // Process each batch
            for (let i = 0; i < batches.length; i++) {
                // Check if user aborted
                if (abortScan) {
                    debugLog(`[BatchProcessing] User aborted at batch ${i + 1}/${batches.length}`);
                    hideProgressBar();
                    notifications.warning('Analysis aborted');
                    return;
                }

                const batch = batches[i];

                // Calculate actual message range for this batch
                const batchStartMsg = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
                const batchStart = startIdx + batchStartMsg;
                const batchEnd = batchStart + batch.length;

                debugLog(`[BatchProcessing] Processing batch ${i + 1}/${batches.length}: messages ${batchStart}-${batchEnd - 1} (${batch.length} messages)`);

                try {
                    showProgressBar(i + 1, batches.length, `Analyzing messages ${batchStart + 1}-${batchEnd}...`);

                    // Build roster of characters found so far
                    const characterRoster = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .buildCharacterRoster */ .fR)();

                    // Call LLM for analysis
                    const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .callLLMAnalysis */ .Kr)(batch, characterRoster);

                    console.log('[NT-Batch] 📊 LLM analysis returned');
                    console.log('[NT-Batch]    Type:', typeof analysis);
                    console.log('[NT-Batch]    Value:', analysis);
                    console.log('[NT-Batch]    Has characters?:', analysis && 'characters' in analysis);
                    console.log('[NT-Batch]    Characters type:', typeof analysis?.characters);
                    console.log('[NT-Batch]    Characters is Array?:', Array.isArray(analysis?.characters));
                    console.log('[NT-Batch]    Characters length:', analysis?.characters?.length);

                    // Process the analysis with enhanced null safety
                    if (!analysis) {
                        console.warn('[NT-Batch] ⚠️ Analysis returned null/undefined, skipping batch');
                        failedBatches++;
                        continue;
                    }

                    if (!analysis.characters) {
                        console.warn('[NT-Batch] ⚠️ Analysis missing characters property, skipping batch');
                        failedBatches++;
                        continue;
                    }

                    if (!Array.isArray(analysis.characters)) {
                        console.warn('[NT-Batch] ⚠️ analysis.characters is not an array:', typeof analysis.characters);
                        failedBatches++;
                        continue;
                    }

                    // Valid analysis - process results
                    console.log('[NT-Batch] ✅ Calling processAnalysisResults with', analysis.characters.length, 'characters');
                    await processAnalysisResults(analysis.characters);
                    analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                    processedMessages += batch.length;

                    successfulBatches++;

                    // Track batch completion time for throughput metrics
                    batchTimestamps.push(Date.now());
                    if (batchTimestamps.length > THROUGHPUT_WINDOW_SIZE) {
                        batchTimestamps.shift(); // Keep only last N timestamps
                    }

                    // Small delay between batches to avoid rate limiting
                    if (i < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                } catch (error) {
                    debugLog(`[BatchProcessing] ERROR in batch ${i + 1}: ${error.message}`);
                    debugLog(`[BatchProcessing] Context: messages ${batchStart}-${batchEnd - 1}, batch size ${batch.length}, token count calc error`);
                    console.error(`Error processing batch ${i + 1}:`, error);
                    failedBatches++;
                    notifications.error(`Batch ${i + 1} failed: ${error.message}`);
                    // Continue to next batch automatically to avoid blocking popups
                }
            }

            // Hide progress bar
            hideProgressBar();

            // Show summary
            const summary = `Analysis complete!

Batches processed: ${successfulBatches}/${batches.length}
Unique characters found: ${uniqueCharacters.size}
Failed batches: ${failedBatches}`;

            debugLog(`[BatchProcessing] Batch analysis complete: ${successfulBatches}/${batches.length} successful, ${failedBatches} failed, ${uniqueCharacters.size} characters found`);

            if (failedBatches > 0) {
                notifications.warning(summary, 'Batch Analysis', { timeOut: 8000 });
            } else {
                notifications.success(summary, 'Batch Analysis', { timeOut: 8000 });
            }

            // Persist scan progress and update UI
            if (processedMessages > 0) {
                const existingCount = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('messageCounter', 0);
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('messageCounter', existingCount + processedMessages);
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', endIdx - 1);
            }

            // Always update UI after batch processing (success or partial failure)
            await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__/* .updateCharacterList */ .L2)();
            await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__.updateStatusDisplay)();

            return;
        }

        // Messages fit in one batch - process normally
        if (showProgress) {
            notifications.info(`Analyzing ${messagesToAnalyze.length} messages for character information...`);
        }

        try {
            // Build roster of characters found so far
            const characterRoster = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .buildCharacterRoster */ .fR)();

            // Call LLM for analysis with character context
            const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .callLLMAnalysis */ .Kr)(messagesToAnalyze, characterRoster);

            debug.log();

            // Process the analysis
            if (analysis.characters && Array.isArray(analysis.characters)) {
                await processAnalysisResults(analysis.characters);
                processedMessages += messagesToAnalyze.length;

                if (showProgress) {
                    notifications.success(`Found ${analysis.characters.length} character(s) in messages`);
                }
            } else {
                debug.log();
            }

        } catch (error) {
            console.error('Error during harvest:', error);
            notifications.error(`Analysis failed: ${error.message}`, 'Name Tracker');
        } finally {
            // Always update UI after LLM processing (success or failure)
            // Persist scan progress
            if (processedMessages > 0) {
                const existingCount = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('messageCounter', 0);
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('messageCounter', existingCount + processedMessages);
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', endIdx - 1);
            }

            await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__/* .updateCharacterList */ .L2)();
            await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__.updateStatusDisplay)();
        }
    });
}

/**
 * Handle new message event
 * @param {number} messageId - ID of the new message
 * @returns {Promise<void>}
 */
async function onMessageReceived(messageId) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('onMessageReceived', async () => {
        if (!await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('enabled', true) || !await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('autoAnalyze', true)) {
            return;
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const chat = context.chat;

        if (!chat || chat.length === 0) {
            return;
        }

        // Get the current message index
        const currentMessageIndex = chat.length - 1;

        // Check if this message was already scanned
        const lastScannedId = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('lastScannedMessageId', -1);
        if (currentMessageIndex <= lastScannedId) {
            debug.log();
            return;
        }

        // Detect if messages were deleted (current index jumped backwards)
        if (lastScannedId >= 0 && currentMessageIndex < lastScannedId) {
            debug.log();

            // Prompt user for rescan decision
            const shouldRescan = await showRescanModal(currentMessageIndex, lastScannedId);

            if (shouldRescan.rescan) {
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', shouldRescan.fromMessage - 1);

                // Queue a full scan from the specified message
                await addToQueue(async () => {
                    await harvestMessages(currentMessageIndex - shouldRescan.fromMessage + 1, true);
                });

                return;
            } else {
                // Reset to current position without scanning
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', currentMessageIndex);
                return;
            }
        }

        // Check if we've reached the next scan milestone
        const messageFreq = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('messageFrequency', 10);
        const messagesSinceLastScan = currentMessageIndex - lastScannedId;

        if (messagesSinceLastScan >= messageFreq) {
            debug.log();

            // Queue harvest
            await addToQueue(async () => {
                await harvestMessages(messageFreq, true);
                // Update last scanned message ID after successful harvest
                await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', currentMessageIndex);
            });
        }
    });
}

/**
 * Show rescan modal when message deletion is detected
 * @param {number} currentMessageIndex - Current message index
 * @param {number} lastScannedId - Last scanned message ID
 * @returns {Promise<Object>} Rescan decision
 */
async function showRescanModal(currentMessageIndex, lastScannedId) {
    return new Promise((resolve) => {
        const modal = $(`
            <div class="name-tracker-rescan-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--SmartThemeBodyColor); border: 2px solid var(--SmartThemeBorderColor); padding: 20px; border-radius: 10px; z-index: 9999; max-width: 500px;">
                <h3>Message History Changed</h3>
                <p>Messages have been deleted or edited. Would you like to rescan the chat?</p>
                <p>Current last scanned message: ${lastScannedId}<br>
                Current message index: ${currentMessageIndex}</p>
                <div style="margin-top: 15px;">
                    <label>Rescan from message: <input type="number" id="rescan-from" value="0" min="0" max="${currentMessageIndex}" style="width: 80px; margin-left: 10px;"></label>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="rescan-yes" class="menu_button">Rescan</button>
                    <button id="rescan-no" class="menu_button">Skip</button>
                </div>
            </div>
        `);

        $('body').append(modal);

        modal.find('#rescan-yes').on('click', () => {
            const fromMessage = parseInt(modal.find('#rescan-from').val()) || 0;
            modal.remove();
            resolve({ rescan: true, fromMessage });
        });

        modal.find('#rescan-no').on('click', () => {
            modal.remove();
            resolve({ rescan: false });
        });
    });
}

/**
 * Show progress bar for batch scanning with throughput metrics
 * @param {number} current - Current batch number (1-indexed)
 * @param {number} total - Total number of batches
 * @param {string} status - Status message
 */
function showProgressBar(current, total, status = '') {
    const progressBarId = 'name_tracker_progress';
    const $existing = $(`.${progressBarId}`);

    // Calculate throughput metrics if we have enough data
    let throughputText = '';
    if (batchTimestamps.length >= 2 && current > 0) {
        // Calculate batches per minute from last N timestamps
        const recentTimestamps = batchTimestamps.slice(-Math.min(THROUGHPUT_WINDOW_SIZE, batchTimestamps.length));
        const timeSpan = recentTimestamps[recentTimestamps.length - 1] - recentTimestamps[0];
        const batchesCompleted = recentTimestamps.length - 1;

        if (timeSpan > 0 && batchesCompleted > 0) {
            const batchesPerMin = (batchesCompleted / (timeSpan / 60000)).toFixed(1);
            const remainingBatches = total - current;
            const estimatedMinutes = Math.ceil(remainingBatches / (batchesCompleted / (timeSpan / 60000)));
            throughputText = ` • ${batchesPerMin} batches/min • ~${estimatedMinutes}min remaining`;
        }
    }

    if ($existing.length > 0) {
        // Update existing progress bar
        if (status) $existing.find('.title').text(status + throughputText);
        $existing.find('.progress').text(current);
        $existing.find('.total').text(total);
        $existing.find('progress').val(current).attr('max', total);
        return;
    }

    // Create new progress bar
    const bar = $(`
        <div class="${progressBarId} name_tracker_progress_bar flex-container justifyspacebetween alignitemscenter" style="
            padding: 10px;
            margin: 5px 0;
            background: var(--SmartThemeBlurTintColor);
            border: 1px solid var(--SmartThemeBorderColor);
            border-radius: 5px;
        ">
            <div class="title" style="flex: 1; font-weight: bold;">${status || 'Name Tracker Scan'}${throughputText}</div>
            <div style="margin: 0 10px;">(<span class="progress">${current}</span> / <span class="total">${total}</span>)</div>
            <progress value="${current}" max="${total}" style="flex: 2; margin: 0 10px;"></progress>
            <button class="menu_button fa-solid fa-stop" title="Abort scan" style="padding: 5px 10px;"></button>
        </div>
    `);

    // Add click event to abort the scan
    bar.find('button').on('click', function() {
        abortScan = true;
        hideProgressBar();
        notifications.warning('Scan aborted by user');
    });

    // Append to the main chat area (#sheld)
    $('#sheld').append(bar);
}

/**
 * Hide and remove progress bar
 */
function hideProgressBar() {
    const progressBarId = 'name_tracker_progress';
    const $existing = $(`.${progressBarId}`);
    if ($existing.length > 0) {
        $existing.fadeOut(300, function() {
            $(this).remove();
        });
    }
}

/**
 * Scan entire chat in batches from oldest to newest
 * @returns {Promise<void>}
 */
async function scanEntireChat() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('scanEntireChat', async () => {
        // CRITICAL: Ensure lorebook is initialized BEFORE processing
        console.log('[NT-Processing] 🔧 Ensuring lorebook is initialized before scan...');
        const { initializeLorebook } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 134));
        await initializeLorebook();
        console.log('[NT-Processing] ✅ Lorebook initialization complete');

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        if (!context.chat || context.chat.length === 0) {
            notifications.warning('No chat messages to scan');
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .getLLMConfig */ .eU)();
        if (llmConfig.source === 'sillytavern') {
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const totalMessages = context.chat.length;

        // Calculate optimal batch size based on context window
        const maxPromptResult = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.getMaxPromptLength)();
        const maxPromptTokens = maxPromptResult.maxPrompt;
        const availableTokens = calculateAvailableTokens(maxPromptTokens);

        // Build batches using shared helper with message limit enforcement
        const batches = await createMessageBatches(context.chat, availableTokens, true);

        const numBatches = batches.length;

        const confirmed = confirm(`This will analyze all ${totalMessages} messages in ${numBatches} batches. This may take a while. Continue?`);

        if (!confirmed) {
            return;
        }

        // Reset abort flag
        abortScan = false;

        // Reset throughput tracking
        batchTimestamps = [];

        // Show progress bar
        showProgressBar(0, numBatches, 'Starting batch scan...');

        let successfulBatches = 0;
        let failedBatches = 0;
        let processedMessages = 0;
        const uniqueCharacters = new Set(); // Track unique character names

        // Process from oldest to newest
        for (let i = 0; i < numBatches; i++) {
            // Check if user aborted
            if (abortScan) {
                debug.log();
                break;
            }

            const batchMessages = batches[i];

            // Calculate message range for progress display
            const startIdx = batches.slice(0, i).reduce((sum, b) => sum + b.length, 0);
            const endIdx = startIdx + batchMessages.length;

            try {
                showProgressBar(i + 1, numBatches, `Processing messages ${startIdx + 1}-${endIdx}...`);

                // Build roster of characters found so far
                const characterRoster = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .buildCharacterRoster */ .fR)();

                // Call LLM for analysis with character context
                const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__/* .callLLMAnalysis */ .Kr)(batchMessages, characterRoster);

                // Process the analysis with null safety
                if (!analysis) {
                    console.warn(`[NT-Processing] Batch ${i + 1}: Analysis returned null/undefined, skipping`);
                    failedBatches++;
                    continue;
                }

                if (!analysis.characters) {
                    console.warn(`[NT-Processing] Batch ${i + 1}: Analysis missing characters property, skipping`);
                    failedBatches++;
                    continue;
                }

                if (!Array.isArray(analysis.characters)) {
                    console.warn(`[NT-Processing] Batch ${i + 1}: analysis.characters is not an array (${typeof analysis.characters}), skipping`);
                    failedBatches++;
                    continue;
                }

                // Process valid analysis results
                await processAnalysisResults(analysis.characters);
                // Track unique characters
                analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                processedMessages += batchMessages.length;

                successfulBatches++;

                // Track batch completion time for throughput metrics
                batchTimestamps.push(Date.now());
                if (batchTimestamps.length > THROUGHPUT_WINDOW_SIZE) {
                    batchTimestamps.shift(); // Keep only last N timestamps
                }

                // Small delay between batches
                if (i < numBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`Error processing batch ${i + 1}:`, error);
                failedBatches++;
                notifications.error(`Batch ${i + 1} failed: ${error.message}`);
                // Continue to next batch automatically to avoid blocking popups
            }
        }

        // Hide progress bar
        hideProgressBar();

        // Update scan completion status
        await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('lastScannedMessageId', totalMessages - 1);

        if (processedMessages > 0) {
            const existingCount = await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .get_settings */ .TJ)('messageCounter', 0);
            await (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__/* .set_settings */ .nT)('messageCounter', existingCount + processedMessages);
        }

        // Always update UI after scan (success, partial failure, or abort)
        await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__/* .updateCharacterList */ .L2)();
        await (0,_ui_js__WEBPACK_IMPORTED_MODULE_8__.updateStatusDisplay)();

        // Show summary
        const summary = `Full chat scan complete!\n\nMessages: ${totalMessages}\nBatches: ${successfulBatches}/${numBatches}\nCharacters found: ${uniqueCharacters.size}\nFailed: ${failedBatches}`;

        // Ensure summary is a string (defense against undefined values)
        const safeSummary = String(summary || 'Scan completed');

        if (failedBatches > 0) {
            notifications.warning(safeSummary, 'Scan Complete', { timeOut: 10000 });
        } else {
            notifications.success(safeSummary, 'Scan Complete', { timeOut: 10000 });
        }
    });
}

/**
 * Add task to processing queue
 * @param {Function} task - Async function to execute
 * @returns {Promise<void>}
 */
async function addToQueue(task) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('addToQueue', async () => {
        processingQueue.push(task);

        if (!isProcessing) {
            await processQueue();
        }
    });
}

/**
 * Process queued tasks
 * @returns {Promise<void>}
 */
async function processQueue() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .withErrorBoundary */ .Xc)('processQueue', async () => {
        if (isProcessing || processingQueue.length === 0) {
            return;
        }

        isProcessing = true;

        while (processingQueue.length > 0) {
            const task = processingQueue.shift();
            try {
                await task();
            } catch (error) {
                console.error('Error processing queue task:', error);
            }
        }

        isProcessing = false;
    });
}

/**
 * Handle chat changed event
 * @returns {Promise<void>}
 */
async function onChatChanged() {
    return withErrorBoundary('onChatChanged', async () => {
        debug.log('🔄 Chat changed - clearing and reloading characters from lorebook');

        // Clear processing state
        processingQueue = [];
        isProcessing = false;
        abortScan = false;

        // Reset scan state
        await set_settings('lastScannedMessageId', -1);
        await set_settings('messageCounter', 0);

        // REC-15: Clear in-memory characters and reload from lorebook
        // This ensures each chat has isolated character state persisted in its lorebook
        debug.log('🗑️ Clearing in-memory characters...');
        await setCharacters({});
        
        debug.log('📖 Loading characters from chat lorebook...');
        const lorebookCharacters = await loadCharactersFromLorebook();
        
        if (Object.keys(lorebookCharacters).length > 0) {
            await setCharacters(lorebookCharacters);
            debug.log(`✅ Loaded ${Object.keys(lorebookCharacters).length} characters from lorebook`);
        } else {
            debug.log('ℹ️ No characters in lorebook - starting fresh');
        }

        // Always update UI when chat changes
        await updateCharacterList();
        await updateStatusDisplay();

        debug.log('✅ Chat change complete');
    });
}

/**
 * Clear the processing queue
 */
function clearProcessingQueue() {
    processingQueue = [];
    isProcessing = false;
    debug.log();
}

/**
 * Get processing status
 * @returns {Object} Processing status information
 */
function getProcessingStatus() {
    return {
        isProcessing,
        queueLength: processingQueue.length,
        abortScan,
    };
}

/**
 * Abort current scan operation
 */
function abortCurrentScan() {
    abortScan = true;
    hideProgressBar();
    debug.log();
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// UNUSED EXPORTS: default

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./style.css
var cjs_js_style = __webpack_require__(83);
;// ./style.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(cjs_js_style/* default */.A, options);




       /* harmony default export */ const style = (cjs_js_style/* default */.A && cjs_js_style/* default */.A.locals ? cjs_js_style/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./src/core/debug.js
var debug = __webpack_require__(806);
// EXTERNAL MODULE: ./src/core/errors.js
var errors = __webpack_require__(462);
// EXTERNAL MODULE: ./src/core/context.js
var core_context = __webpack_require__(102);
// EXTERNAL MODULE: ./src/core/settings.js
var settings = __webpack_require__(548);
// EXTERNAL MODULE: ./src/utils/notifications.js
var notifications = __webpack_require__(695);
// EXTERNAL MODULE: ./src/utils/helpers.js
var helpers = __webpack_require__(854);
// EXTERNAL MODULE: ./src/modules/characters.js
var characters = __webpack_require__(551);
// EXTERNAL MODULE: ./src/modules/llm.js + 1 modules
var llm = __webpack_require__(248);
// EXTERNAL MODULE: ./src/modules/processing.js
var processing = __webpack_require__(972);
// EXTERNAL MODULE: ./src/modules/ui.js
var ui = __webpack_require__(897);
;// ./src/index.js
/**
 * Name Tracker Extension for SillyTavern - Modular Version
 * Main entry point and orchestration
 */

// Import CSS


// Core infrastructure





// Utilities



// Feature modules


// initializeLorebook is now called lazily when needed, not during extension load



// Immediate import validation
console.log('[STnametracker] Main index.js: Import validation');
console.log('[STnametracker] Main index.js: initializeUIHandlers import =', typeof ui/* initializeUIHandlers */.Ow, ui/* initializeUIHandlers */.Ow);
console.log('[STnametracker] Main index.js: initializeMenuButtons import =', typeof ui/* initializeMenuButtons */.Fo, ui/* initializeMenuButtons */.Fo);
console.log('[STnametracker] Main index.js: bindSettingsHandlers import =', typeof ui/* bindSettingsHandlers */.oy, ui/* bindSettingsHandlers */.oy);
console.log('[STnametracker] Main index.js: updateUI import =', typeof ui/* updateUI */.AG, ui/* updateUI */.AG);

// Extension name constant - MUST match manifest
const extensionName = 'STnametracker';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

/**
 * Get extension settings - Required for SillyTavern integration
 * This is the pattern that SillyTavern expects
 * @returns {Object} Extension settings object
 */
// Kept for potential future use with SillyTavern API
// eslint-disable-next-line no-unused-vars
function getExtensionSettings() {
    // Use global extension_settings that SillyTavern provides
    return window.extension_settings?.[extensionName] || {};
}

// Create the logger AFTER the getSettings function is defined
const logger = debug/* default.createModuleLogger */.Ay.createModuleLogger('Main');

/**
 * Name Tracker Extension main class
 */
class NameTrackerExtension {
    constructor() {
        this.initialized = false;
        this.modules = new Map();
    }

    /**
     * Initialize the extension
     * @returns {Promise<void>}
     */
    async initialize() {
        console.log('[STnametracker] Enter initialize() method');
        return errors/* errorHandler */.r_.withErrorBoundary('Main', async () => {
            console.log('[STnametracker] Inside error boundary');
            if (this.initialized) {
                console.log('[STnametracker] Already initialized, skipping');
                return;
            }

            console.log('[STnametracker] Starting initialization sequence');
            logger.log('Starting Name Tracker Extension v2.1.0');

            // Initialize core systems
            console.log('[STnametracker] Step 1: Initializing core systems...');
            await this.initializeCore();
            console.log('[STnametracker] Step 1: Core systems completed');

            // Initialize feature modules
            console.log('[STnametracker] Step 2: Initializing feature modules...');
            await this.initializeModules();
            console.log('[STnametracker] Step 2: Feature modules completed');

            // Setup UI
            console.log('[STnametracker] Step 3: Initializing UI...');
            await this.initializeUI();
            console.log('[STnametracker] Step 3: UI completed');

            // Register event listeners
            console.log('[STnametracker] Step 4: Registering event listeners...');
            this.registerEventListeners();
            console.log('[STnametracker] Step 4: Event listeners completed');

            this.initialized = true;
            console.log('[STnametracker] Marking as initialized');
            logger.log('Name Tracker Extension initialized successfully');
            console.log('[STnametracker] Full initialization sequence completed successfully');

        }, {
            retries: 2,
            fallback: async (error) => {
                logger.error('Failed to initialize extension:', error);
                notifications/* default */.A.error('Failed to initialize', 'Extension Error');
                return false;
            },
        });
    }

    /**
     * Initialize core infrastructure
     * @returns {Promise<void>}
     */
    async initializeCore() {
        console.log('[STnametracker] initializeCore: Starting...');
        logger.debug('Initializing core systems...');

        // Connect debug system to settings
        console.log('[STnametracker] initializeCore: Connecting debug system...');
        debug/* default */.Ay.isDebugEnabled = () => (0,settings/* getSetting */.PL)('debugMode', false);
        console.log('[STnametracker] initializeCore: Debug system connected');

        // Settings are auto-initialized when accessed
        console.log('[STnametracker] initializeCore: Settings ready');

        // Setup error recovery strategies
        this.setupErrorRecovery();

        logger.debug('Core systems initialized');
    }

    /**
     * Initialize feature modules
     * @returns {Promise<void>}
     */
    async initializeModules() {
        logger.debug('Initializing feature modules...');
        console.log('[STnametracker] initializeModules: Module initialization skipped');
        console.log('[STnametracker] initializeModules: Lorebook will be initialized when first needed');

        // Note: We no longer initialize lorebook during extension load because
        // context.chatId is undefined at that point. Instead, lorebook initialization
        // happens automatically when scanEntireChat() or other processing functions
        // are called, at which point a chat is guaranteed to be active.

        logger.debug('Feature modules ready (lazy initialization)');
    }

    /**
     * Initialize UI components
     * @returns {Promise<void>}
     */
    async initializeUI() {
        console.log('[STnametracker] initializeUI: Starting UI initialization...');
        logger.debug('Initializing UI...');

        try {
            // Load settings HTML using proper jQuery pattern
            console.log('[STnametracker] initializeUI: Loading settings HTML from:', `${extensionFolderPath}/settings.html`);
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);
            console.log('[STnametracker] initializeUI: Settings HTML loaded, length:', settingsHtml.length);

            console.log('[STnametracker] initializeUI: Finding #extensions_settings element...');
            const targetElement = $('#extensions_settings');
            console.log('[STnametracker] initializeUI: Target element found:', targetElement.length > 0);

            targetElement.append(settingsHtml);
            console.log('[STnametracker] initializeUI: Settings HTML appended');

            // Initialize UI handlers
            console.log('[STnametracker] initializeUI: Initializing UI handlers...');
            await (0,ui/* initializeUIHandlers */.Ow)();
            console.log('[STnametracker] initializeUI: UI handlers initialized');

            console.log('[STnametracker] initializeUI: Initializing menu buttons...');
            await (0,ui/* initializeMenuButtons */.Fo)();
            console.log('[STnametracker] initializeUI: Menu buttons initialized');

            // Bind settings form handlers
            console.log('[STnametracker] initializeUI: Binding settings handlers...');
            await (0,ui/* bindSettingsHandlers */.oy)();
            console.log('[STnametracker] initializeUI: Settings handlers bound');

            // Update UI to reflect current settings
            console.log('[STnametracker] initializeUI: Updating UI...');
            await (0,ui/* updateUI */.AG)();
            console.log('[STnametracker] initializeUI: UI updated');

            logger.debug('UI initialized');
        } catch (error) {
            logger.error('Failed to initialize UI:', error);
            throw error;
        }
    }

    /**
     * Register SillyTavern event listeners
     */
    registerEventListeners() {
        logger.debug('Registering event listeners...');

        try {
            // Get event objects from SillyTavern context
            const context = core_context/* default */.A.getContext();
            const eventSource = context.eventSource;
            const event_types = context.event_types;

            if (!eventSource || !event_types) {
                logger.warn('SillyTavern event system not available');
                return;
            }

            // Register for SillyTavern events
            eventSource.on(event_types.MESSAGE_RECEIVED, async (messageId) => {
                logger.debug('Message received event:', messageId);
                await (0,processing/* onMessageReceived */.Wu)(messageId);
            });

            eventSource.on(event_types.MESSAGE_SENT, async (messageId) => {
                logger.debug('Message sent event:', messageId);
                await (0,processing/* onMessageReceived */.Wu)(messageId);
            });

            eventSource.on(event_types.CHAT_CHANGED, async () => {
                logger.debug('Chat changed event received');
                // Reset chat-level data when chat changes
                await (0,settings/* setChatData */.nF)({ characters: {}, lastScannedMessageId: -1 });
            });

            eventSource.on(event_types.CHAT_LOADED, async () => {
                logger.debug('Chat loaded event received - updating status display');
                // Import updateStatusDisplay dynamically to avoid circular dependency
                const { updateStatusDisplay } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 897));
                await updateStatusDisplay();
            });

            logger.debug('Event listeners registered');
        } catch (error) {
            logger.error('Failed to register event listeners:', error);
        }
    }
    /**
     * Setup error recovery strategies
     */
    setupErrorRecovery() {
        // Network error recovery
        errors/* errorHandler */.r_.registerRecoveryStrategy('NETWORK_ERROR', async (error) => {
            logger.warn('Attempting network error recovery');
            await errors/* errorHandler */.r_.delay(2000);
            notifications/* default */.A.info('Retrying network operation...');
            return null; // Signal to retry original operation
        });

        // Data format error recovery
        errors/* errorHandler */.r_.registerRecoveryStrategy('DATA_FORMAT_ERROR', async (error) => {
            logger.warn('Data format error, clearing cache');
            // TODO: Clear relevant caches when modules are implemented
            return null;
        });

        // Critical error handler
        errors/* errorHandler */.r_.onCriticalError((error) => {
            logger.error('Critical error occurred:', error);
            // TODO: Save state for debugging when modules are implemented
        });
    }

    /**
     * Get extension status for debugging
     * @returns {Promise<Object>} Status information
     */
    async getStatus() {
        return {
            initialized: this.initialized,
            context: core_context/* default */.A.getStatus(),
            settings: { initialized: true, moduleCount: Object.keys(await (0,settings/* get_settings */.TJ)()).length },
            debug: debug/* default */.Ay.getPerformanceSummary(),
            errors: errors/* errorHandler */.r_.getRecentErrors(5).length,
        };
    }

    /**
     * Shutdown the extension
     * @returns {Promise<void>}
     */
    async shutdown() {
        return errors/* errorHandler */.r_.withErrorBoundary('Main', async () => {
            logger.log('Shutting down Name Tracker Extension');

            // TODO: Cleanup modules
            // TODO: Remove event listeners
            // TODO: Save state

            this.initialized = false;
            debug/* default */.Ay.clear();

            logger.log('Extension shutdown complete');
        }, { silent: true });
    }
}

// Create extension instance
const nameTrackerExtension = new NameTrackerExtension();

// Initialize extension when jQuery is ready - SillyTavern pattern
jQuery(async () => {
    console.log('[STnametracker] jQuery ready, starting extension load...');
    try {
        console.log('[STnametracker] Logger available, initializing...');
        logger.log('Name Tracker Extension loading...');

        // Initialize extension_settings for this extension
        console.log('[STnametracker] Setting up extension_settings...');
        if (!window.extension_settings) {
            console.log('[STnametracker] Creating window.extension_settings');
            window.extension_settings = {};
        }
        console.log('[STnametracker] Current extension_settings keys:', Object.keys(window.extension_settings));
        window.extension_settings[extensionName] = window.extension_settings[extensionName] || {};

        // Call get_settings() to trigger default merge and persistence
        console.log('[STnametracker] Initializing defaults...');
        const initialSettings = await (0,settings/* get_settings */.TJ)();
        console.log('[STnametracker] Settings initialized with defaults.');
        console.log('[STnametracker]   llmSource:', initialSettings.llmSource);
        console.log('[STnametracker]   messageFrequency:', initialSettings.messageFrequency);
        console.log('[STnametracker]   lorebookPosition:', initialSettings.lorebookPosition);
        console.log('[STnametracker]   lorebookScanDepth:', initialSettings.lorebookScanDepth);
        console.log('[STnametracker]   lorebookProbability:', initialSettings.lorebookProbability);
        console.log('[STnametracker] Total extension_settings keys:', Object.keys(window.extension_settings[extensionName]).length);
        console.log('[STnametracker] Extension settings keys:', Object.keys(window.extension_settings[extensionName]).slice(0, 10).join(', '));

        console.log('[STnametracker] Starting main initialization...');
        await nameTrackerExtension.initialize();
        console.log('[STnametracker] Main initialization completed');

        // Make extension available globally for debugging
        window.nameTrackerExtension = nameTrackerExtension;

        // Add debug commands to browser console
        window.ntDebug = {
            status: () => nameTrackerExtension.getStatus(),
            errors: () => errors/* errorHandler */.r_.getRecentErrors(),
            settings: async () => await (0,settings/* get_settings */.TJ)(),
            chatData: async () => await (0,settings/* getChatData */.zB)(),
            clear: () => debug/* default */.Ay.clear(),
        };

        logger.log('Name Tracker Extension loaded successfully');
        console.log('[STnametracker] Extension loaded. Use ntDebug.status() for diagnostics.');

    } catch (error) {
        console.error('[STnametracker] Failed to initialize:', error);
        notifications/* default */.A.error('Extension failed to load', 'Critical Error');
    }
});

/* harmony default export */ const src = ((/* unused pure expression or super */ null && (nameTrackerExtension)));

/******/ })()
;
//# sourceMappingURL=index.js.map