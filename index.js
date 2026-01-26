/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./style.css"
/*!*********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style.css ***!
  \*********************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
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


`, "",{"version":3,"sources":["webpack://./style.css"],"names":[],"mappings":"AAAA,0CAA0C;;AAE1C;IACI,YAAY;AAChB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,mBAAmB;IACnB,iBAAiB;AACrB;;AAEA,mBAAmB;AACnB;IACI,gDAAgD;IAChD,8CAA8C;IAC9C,kBAAkB;IAClB,aAAa;AACjB;;AAEA;IACI,iBAAiB;IACjB,iCAAiC;IACjC,YAAY;IACZ,kBAAkB;AACtB;;AAEA,mBAAmB;AACnB;IACI,iBAAiB;IACjB,gBAAgB;IAChB,8CAA8C;IAC9C,kBAAkB;IAClB,YAAY;IACZ,eAAe;AACnB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,8CAA8C;IAC9C,kBAAkB;IAClB,gDAAgD;AACpD;;AAEA;IACI,gBAAgB;AACpB;;AAEA,gFAAgF;AAChF;IACI,8BAA8B;IAC9B,yCAAyC;AAC7C;;AAEA;IACI,aAAa;IACb,8BAA8B;IAC9B,mBAAmB;IACnB,kBAAkB;AACtB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;IAChB,iCAAiC;AACrC;;AAEA;IACI,cAAc;IACd,iBAAiB;AACrB;;AAEA;IACI,kCAAkC;IAClC,6BAA6B;AACjC;;AAEA;IACI,qBAAqB;IACrB,gBAAgB;IAChB,kBAAkB;IAClB,iBAAiB;IACjB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,yBAAyB;IACzB,WAAW;AACf;;AAEA;IACI,sBAAsB;IACtB,WAAW;AACf;;AAEA;IACI,yBAAyB;IACzB,WAAW;AACf;;AAEA,gCAAgC;AAChC;IACI,aAAa;IACb,mBAAmB;IACnB,iCAAiC;AACrC;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;IACd,iBAAiB;IACjB,kBAAkB;IAClB,iCAAiC;AACrC;;AAEA;IACI,cAAc;IACd,eAAe;IACf,kCAAkC;IAClC,iBAAiB;AACrB;;AAEA;;IAEI,WAAW;IACX,sBAAsB;AAC1B;;AAEA;IACI,gBAAgB;IAChB,kCAAkC;IAClC,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,qBAAqB;IACrB,iBAAiB;IACjB,gBAAgB;IAChB,0CAA0C;IAC1C,8CAA8C;IAC9C,kBAAkB;IAClB,sBAAsB;IACtB,iBAAiB;IACjB,kBAAkB;IAClB,kCAAkC;AACtC;;AAEA;IACI,iBAAiB;IACjB,iCAAiC;IACjC,aAAa;IACb,YAAY;IACZ,0CAA0C;IAC1C,mDAAmD;IACnD,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,QAAQ;IACR,eAAe;IACf,eAAe;AACnB;;AAEA;IACI,OAAO;IACP,gBAAgB;IAChB,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,kCAAkC;IAClC,kBAAkB;IAClB,kBAAkB;IAClB,aAAa;AACjB;;AAEA,oBAAoB;AACpB;IACI,gDAAgD;IAChD,mDAAmD;IACnD,aAAa;IACb,eAAe;IACf,kBAAkB;AACtB;;AAEA,iBAAiB;AACjB;IACI,aAAa;AACjB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,iCAAiC;IACjC,iBAAiB;AACrB;;AAEA;IACI,cAAc;IACd,gBAAgB;IAChB,gBAAgB;IAChB,aAAa;IACb,wCAAwC;IACxC,8BAA8B;IAC9B,kBAAkB;AACtB;;AAEA,kBAAkB;AAClB;IACI,YAAY;IACZ,mBAAmB;AACvB;;AAEA,mBAAmB;AACnB;IACI,QAAQ;AACZ;;AAEA;IACI,OAAO;AACX;;AAEA,uBAAuB;AACvB;IACI,cAAc;IACd,aAAa;IACb,gDAAgD;IAChD,8CAA8C;IAC9C,kBAAkB;IAClB,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;IAClB,iBAAiB;AACrB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,iCAAiC;IACjC,mBAAmB;IACnB,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,6CAA6C;IAC7C,2BAA2B;AAC/B;;AAEA,yDAAyD;AACzD;IACI,aAAa;IACb,gBAAgB;IAChB,aAAa;IACb,iCAAiC;IACjC,kBAAkB;IAClB,gBAAgB;AACpB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,iBAAiB;IACjB,kCAAkC;IAClC,iBAAiB;AACrB;;AAEA,2BAA2B;AAC3B;IACI;QACI,sBAAsB;IAC1B;;IAEA;QACI,WAAW;IACf;AACJ;;AAEA,iCAAiC;AACjC;IACI;QACI,UAAU;QACV,4BAA4B;IAChC;IACA;QACI,UAAU;QACV,wBAAwB;IAC5B;AACJ;;AAEA;IACI,2BAA2B;AAC/B;;AAEA,yBAAyB;AACzB;IACI,aAAa;IACb,mBAAmB;IACnB,iCAAiC;AACrC;;AAEA;IACI,mBAAmB;IACnB,kCAAkC;IAClC,gBAAgB;AACpB;;AAEA;IACI,gDAAgD;IAChD,iCAAiC;IACjC,8CAA8C;IAC9C,kBAAkB;IAClB,aAAa;IACb,gBAAgB;AACpB;;AAEA;IACI,aAAa;IACb,sCAAsC;AAC1C;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,kBAAkB;AACtB","sourcesContent":["/* Styles for the Name Tracker extension */\r\n\r\n.name-tracker-settings {\r\n    padding: 5px;\r\n}\r\n\r\n.name-tracker_block {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.name-tracker_block h4 {\r\n    margin-top: 10px;\r\n    margin-bottom: 10px;\r\n    font-weight: bold;\r\n}\r\n\r\n/* Status Display */\r\n.name-tracker-status-block {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    padding: 10px;\r\n}\r\n\r\n.name-tracker-status {\r\n    font-weight: bold;\r\n    color: var(--SmartThemeBodyColor);\r\n    padding: 5px;\r\n    text-align: center;\r\n}\r\n\r\n/* Character List */\r\n.name-tracker-character-list {\r\n    max-height: 400px;\r\n    overflow-y: auto;\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    padding: 5px;\r\n    margin-top: 5px;\r\n}\r\n\r\n.name-tracker-character {\r\n    padding: 10px;\r\n    margin-bottom: 10px;\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n}\r\n\r\n.name-tracker-character:last-child {\r\n    margin-bottom: 0;\r\n}\r\n\r\n/* Active/loaded character styling (characters that are loaded in SillyTavern) */\r\n.name-tracker-character.main-character {\r\n    border-left: 3px solid #4CAF50;\r\n    background-color: rgba(76, 175, 80, 0.05);\r\n}\r\n\r\n.character-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.character-name {\r\n    font-weight: bold;\r\n    font-size: 1.1em;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.character-name .fa-user {\r\n    color: #4CAF50;\r\n    margin-right: 5px;\r\n}\r\n\r\n.character-name.ignored {\r\n    color: var(--SmartThemeQuoteColor);\r\n    text-decoration: line-through;\r\n}\r\n\r\n.character-badge {\r\n    display: inline-block;\r\n    padding: 2px 8px;\r\n    border-radius: 3px;\r\n    font-size: 0.75em;\r\n    font-weight: bold;\r\n    margin-left: 5px;\r\n}\r\n\r\n.character-badge.main-char {\r\n    background-color: #4CAF50;\r\n    color: #fff;\r\n}\r\n\r\n.character-badge.ignored {\r\n    background-color: #666;\r\n    color: #fff;\r\n}\r\n\r\n.character-badge.unresolved {\r\n    background-color: #ff9800;\r\n    color: #000;\r\n}\r\n\r\n/* Lorebook entry editor modal */\r\n.lorebook-entry-editor h3 {\r\n    margin-top: 0;\r\n    margin-bottom: 20px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.editor-section {\r\n    margin-bottom: 15px;\r\n}\r\n\r\n.editor-section label {\r\n    display: block;\r\n    font-weight: bold;\r\n    margin-bottom: 5px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.editor-section small {\r\n    display: block;\r\n    margin-top: 3px;\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-size: 0.85em;\r\n}\r\n\r\n.editor-section input,\r\n.editor-section textarea {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.character-aliases {\r\n    font-size: 0.9em;\r\n    color: var(--SmartThemeQuoteColor);\r\n    margin-bottom: 8px;\r\n    font-style: italic;\r\n}\r\n\r\n.lorebook-entry-id {\r\n    display: inline-block;\r\n    margin-left: 10px;\r\n    padding: 2px 6px;\r\n    background: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    font-family: monospace;\r\n    font-size: 0.85em;\r\n    font-style: normal;\r\n    color: var(--SmartThemeQuoteColor);\r\n}\r\n\r\n.character-details {\r\n    font-size: 0.85em;\r\n    color: var(--SmartThemeBodyColor);\r\n    margin: 8px 0;\r\n    padding: 8px;\r\n    background: var(--SmartThemeBlurTintColor);\r\n    border-left: 2px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    line-height: 1.4;\r\n}\r\n\r\n.character-actions {\r\n    display: flex;\r\n    gap: 5px;\r\n    flex-wrap: wrap;\r\n    margin-top: 8px;\r\n}\r\n\r\n.character-actions .menu_button {\r\n    flex: 1;\r\n    min-width: 100px;\r\n    padding: 5px 10px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n.menu_button.compact {\r\n    padding: 5px 10px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n.name-tracker-empty {\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-style: italic;\r\n    text-align: center;\r\n    padding: 20px;\r\n}\r\n\r\n/* Ollama Settings */\r\n.ollama-settings {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border-left: 3px solid var(--SmartThemeBorderColor);\r\n    padding: 10px;\r\n    margin-top: 5px;\r\n    border-radius: 5px;\r\n}\r\n\r\n/* Merge Dialog */\r\n.merge-dialog {\r\n    padding: 15px;\r\n}\r\n\r\n.merge-dialog p {\r\n    margin-bottom: 10px;\r\n}\r\n\r\n.merge-dialog strong {\r\n    color: var(--SmartThemeBodyColor);\r\n    font-weight: bold;\r\n}\r\n\r\n.merge-warning {\r\n    color: #ff9800;\r\n    font-size: 0.9em;\r\n    margin-top: 10px;\r\n    padding: 10px;\r\n    background-color: rgba(255, 152, 0, 0.1);\r\n    border-left: 3px solid #ff9800;\r\n    border-radius: 3px;\r\n}\r\n\r\n/* Button states */\r\nbutton:disabled {\r\n    opacity: 0.5;\r\n    cursor: not-allowed;\r\n}\r\n\r\n/* Flex utilities */\r\n.flexGap5 {\r\n    gap: 5px;\r\n}\r\n\r\n.flex1 {\r\n    flex: 1;\r\n}\r\n\r\n/* Progress indicator */\r\n.name-tracker-progress {\r\n    margin: 10px 0;\r\n    padding: 10px;\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 5px;\r\n    text-align: center;\r\n}\r\n\r\n.name-tracker-progress .progress-text {\r\n    margin-bottom: 5px;\r\n    font-weight: bold;\r\n}\r\n\r\n.name-tracker-progress .progress-bar {\r\n    width: 100%;\r\n    height: 20px;\r\n    background-color: var(--black50a);\r\n    border-radius: 10px;\r\n    overflow: hidden;\r\n}\r\n\r\n.name-tracker-progress .progress-fill {\r\n    height: 100%;\r\n    background-color: var(--SmartThemeQuoteColor);\r\n    transition: width 0.3s ease;\r\n}\r\n\r\n/* Character details preview (for potential future use) */\r\n.character-details {\r\n    display: none;\r\n    margin-top: 10px;\r\n    padding: 10px;\r\n    background-color: var(--black30a);\r\n    border-radius: 5px;\r\n    font-size: 0.9em;\r\n}\r\n\r\n.character-details.expanded {\r\n    display: block;\r\n}\r\n\r\n.character-details-section {\r\n    margin-bottom: 8px;\r\n}\r\n\r\n.character-details-section:last-child {\r\n    margin-bottom: 0;\r\n}\r\n\r\n.character-details-label {\r\n    font-weight: bold;\r\n    color: var(--SmartThemeQuoteColor);\r\n    margin-right: 5px;\r\n}\r\n\r\n/* Responsive adjustments */\r\n@media (max-width: 768px) {\r\n    .character-actions {\r\n        flex-direction: column;\r\n    }\r\n    \r\n    .character-actions .menu_button {\r\n        width: 100%;\r\n    }\r\n}\r\n\r\n/* Animation for new characters */\r\n@keyframes fadeIn {\r\n    from {\r\n        opacity: 0;\r\n        transform: translateY(-10px);\r\n    }\r\n    to {\r\n        opacity: 1;\r\n        transform: translateY(0);\r\n    }\r\n}\r\n\r\n.name-tracker-character.new {\r\n    animation: fadeIn 0.3s ease;\r\n}\r\n\r\n/* System Prompt Editor */\r\n.system-prompt-editor h3 {\r\n    margin-top: 0;\r\n    margin-bottom: 10px;\r\n    color: var(--SmartThemeBodyColor);\r\n}\r\n\r\n.system-prompt-editor p {\r\n    margin-bottom: 10px;\r\n    color: var(--SmartThemeQuoteColor);\r\n    font-size: 0.9em;\r\n}\r\n\r\n#system_prompt_editor {\r\n    background-color: var(--SmartThemeBlurTintColor);\r\n    color: var(--SmartThemeBodyColor);\r\n    border: 1px solid var(--SmartThemeBorderColor);\r\n    border-radius: 3px;\r\n    padding: 10px;\r\n    resize: vertical;\r\n}\r\n\r\n#system_prompt_editor:focus {\r\n    outline: none;\r\n    border-color: var(--SmartThemeEmColor);\r\n}\r\n\r\n.system-prompt-actions button {\r\n    min-width: 100px;\r\n}\r\n\r\n#system_prompt_reset {\r\n    margin-right: auto;\r\n}\r\n\r\n\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
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

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js"
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
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

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
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

/***/ "./src/core/context.js"
/*!*****************************!*\
  !*** ./src/core/context.js ***!
  \*****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   stContext: () => (/* binding */ sillyTavernContext)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug.js */ "./src/core/debug.js");
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors.js */ "./src/core/errors.js");
/**
 * SillyTavern context abstraction layer for Name Tracker extension
 * Provides a thin wrapper around SillyTavern.getContext() with error handling
 */




const logger = _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].createModuleLogger('Context');

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
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
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
    async saveChatMetadata() {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (context.saveMetadata) {
                await context.saveMetadata();
            } else {
                logger.warn('saveMetadata not available');
            }
        }, { silent: true });
    }

    /**
     * Generate quiet prompt (background LLM call)
     * @param {Object} options - Generation options
     * @returns {Promise<string>} Generated text
     */
    async generateQuietPrompt(options) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.generateQuietPrompt) {
                throw new Error('generateQuietPrompt not available');
            }
            return await context.generateQuietPrompt(options);
        }, { retries: 1 });
    }

    /**
     * Load world info (lorebook)
     * @param {string} lorebookName - Name of lorebook to load
     * @returns {Promise<Object|null>} Lorebook data
     */
    async loadWorldInfo(lorebookName) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.loadWorldInfo) {
                throw new Error('loadWorldInfo not available');
            }
            return await context.loadWorldInfo(lorebookName);
        });
    }

    /**
     * Save world info (lorebook)
     * @param {string} lorebookName - Name of lorebook
     * @param {Object} data - Lorebook data
     * @param {boolean} create - Create if doesn't exist
     * @returns {Promise<void>}
     */
    async saveWorldInfo(lorebookName, data, create = false) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.saveWorldInfo) {
                throw new Error('saveWorldInfo not available');
            }
            return await context.saveWorldInfo(lorebookName, data, create);
        });
    }

    /**
     * Save world info entry
     * @param {string} lorebookName - Lorebook name
     * @param {Object} entryData - Entry data
     * @returns {Promise<void>}
     */
    async saveWorldInfoEntry(lorebookName, entryData) {
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
            const context = this.getContext();
            if (!context.saveWorldInfoEntry) {
                throw new Error('saveWorldInfoEntry not available');
            }
            return await context.saveWorldInfoEntry(lorebookName, entryData);
        });
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
        return _errors_js__WEBPACK_IMPORTED_MODULE_1__.errorHandler.withErrorBoundary('Context', async () => {
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
                detailedBreakdown: {}
            };

            // Add detailed breakdown of key properties
            const keyProps = [
                'maxContext', 'maxTokens', 'amount_gen', 'token_limit',
                'extensionSettings', 'settings', 'chat', 'chatMetadata',
                'characters', 'world_info', 'botId', 'characterId', 'chatId',
                'impersonate', 'groups'
            ];

            for (const prop of keyProps) {
                if (prop in context) {
                    dump.detailedBreakdown[prop] = {
                        type: typeof context[prop],
                        value: context[prop],
                        isNull: context[prop] === null,
                        isUndefined: context[prop] === undefined
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

/***/ "./src/core/debug.js"
/*!***************************!*\
  !*** ./src/core/debug.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addTrace: () => (/* binding */ addTrace),
/* harmony export */   createModuleLogger: () => (/* binding */ createModuleLogger),
/* harmony export */   debugLogger: () => (/* binding */ debugLogger),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endTimer: () => (/* binding */ endTimer),
/* harmony export */   startTimer: () => (/* binding */ startTimer)
/* harmony export */ });
/**
 * Debug and logging utilities for Name Tracker extension
 * Provides module-specific logging, performance monitoring, and state inspection
 */

const MODULE_NAME = 'STnametracker';

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

/***/ "./src/core/errors.js"
/*!****************************!*\
  !*** ./src/core/errors.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NameTrackerError: () => (/* binding */ NameTrackerError),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   errorHandler: () => (/* binding */ errorHandler),
/* harmony export */   withErrorBoundary: () => (/* binding */ withErrorBoundary)
/* harmony export */ });
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug.js */ "./src/core/debug.js");
/**
 * Error handling and recovery system for Name Tracker extension
 * Provides error boundaries, graceful degradation, and transaction rollback
 */



const logger = _debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].createModuleLogger('ErrorHandler');

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
                console.log(`[STnametracker] Error caught in ${moduleName}:`, error);
                lastError = error;

                if (attempt < retries) {
                    console.log(`[STnametracker] Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    logger.warn(`Retrying operation in ${moduleName}, attempt ${attempt + 1}/${retries + 1}:`, error.message);
                    await this.delay(Math.pow(2, attempt) * 100); // Exponential backoff
                    continue;
                }
            }
        }

        // All retries failed
        console.log(`[STnametracker] All retries failed in ${moduleName}, tracking error:`, lastError);
        const trackedError = this.trackError(lastError, moduleName, {
            operation: operation.name || 'anonymous',
            duration: Date.now() - startTime,
            retries: retries,
            operationId: operationId,
        });

        if (!silent) {
            console.log(`[STnametracker] Notifying user of error in ${moduleName}`);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (errorHandler);


/***/ },

/***/ "./src/core/settings.js"
/*!******************************!*\
  !*** ./src/core/settings.js ***!
  \******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_CHAT_DATA: () => (/* binding */ DEFAULT_CHAT_DATA),
/* harmony export */   DEFAULT_SETTINGS: () => (/* binding */ DEFAULT_SETTINGS),
/* harmony export */   MODULE_NAME: () => (/* binding */ MODULE_NAME),
/* harmony export */   addCharacter: () => (/* binding */ addCharacter),
/* harmony export */   getCharacter: () => (/* binding */ getCharacter),
/* harmony export */   getCharacters: () => (/* binding */ getCharacters),
/* harmony export */   getChatData: () => (/* binding */ getChatData),
/* harmony export */   getLLMConfig: () => (/* binding */ getLLMConfig),
/* harmony export */   getLorebookConfig: () => (/* binding */ getLorebookConfig),
/* harmony export */   getSetting: () => (/* binding */ getSetting),
/* harmony export */   getSettings: () => (/* binding */ getSettings),
/* harmony export */   get_chat_metadata: () => (/* binding */ get_chat_metadata),
/* harmony export */   get_settings: () => (/* binding */ get_settings),
/* harmony export */   removeCharacter: () => (/* binding */ removeCharacter),
/* harmony export */   setCharacter: () => (/* binding */ setCharacter),
/* harmony export */   setCharacters: () => (/* binding */ setCharacters),
/* harmony export */   setChatData: () => (/* binding */ setChatData),
/* harmony export */   setSetting: () => (/* binding */ setSetting),
/* harmony export */   set_chat_metadata: () => (/* binding */ set_chat_metadata),
/* harmony export */   set_settings: () => (/* binding */ set_settings)
/* harmony export */ });
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ "./src/core/errors.js");
/* harmony import */ var _debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debug.js */ "./src/core/debug.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./context.js */ "./src/core/context.js");
/**
 * Simplified settings management for Name Tracker extension
 * Uses SillyTavern standard patterns with preserved error handling
 */





const MODULE_NAME = 'STnametracker';
const debug = (0,_debug_js__WEBPACK_IMPORTED_MODULE_1__.createModuleLogger)('Settings');

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
    lorebookCooldown: 5,
    lorebookScanDepth: 1,
    lorebookProbability: 100,
    lorebookEnabled: true,
    debugMode: false,
    systemPrompt: null, // null means use default
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
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        // Ensure extension_settings exists
        if (typeof extension_settings === 'undefined') {
            console.warn('[STnametracker] extension_settings not available');
            return { ...DEFAULT_SETTINGS };
        }

        // Initialize if not exists
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Merge with defaults to ensure all properties exist
        const settings = { ...DEFAULT_SETTINGS, ...extension_settings[MODULE_NAME] };
        return settings;
    }, { ...DEFAULT_SETTINGS });
}

/**
 * Update settings and save
 * @param {Object} newSettings - Settings to update
 */
function set_settings(newSettings) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        // Ensure extension_settings exists
        if (typeof extension_settings === 'undefined') {
            console.warn('[STnametracker] extension_settings not available for saving');
            return;
        }

        // Initialize if not exists
        if (!extension_settings[MODULE_NAME]) {
            extension_settings[MODULE_NAME] = { ...DEFAULT_SETTINGS };
        }

        // Update settings
        Object.assign(extension_settings[MODULE_NAME], newSettings);

        // Save to SillyTavern
        if (typeof saveSettingsDebounced !== 'undefined') {
            saveSettingsDebounced();
        }
    });
}

/**
 * Get current chat characters
 * @returns {Object} Chat characters data
 */
function getCharacters() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
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
function setCharacters(characters) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update characters
            metadata[MODULE_NAME].characters = characters;

            // Save to SillyTavern
            _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveChatMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set characters:', error.message);
        }
    });
}

/**
 * Get chat-level data
 * @returns {Object} Chat metadata
 */
function getChatData() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
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
function setChatData(data) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            // Initialize if not exists
            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            // Update data
            Object.assign(metadata[MODULE_NAME], data);

            // Save to SillyTavern
            _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveChatMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set chat data:', error.message);
        }
    });
}

/**
 * Add a character to the current chat
 * @param {string} name - Character name
 * @param {Object} characterData - Character data
 */
function addCharacter(name, characterData) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        const characters = getCharacters();
        characters[name] = characterData;
        setCharacters(characters);
    });
}

/**
 * Remove a character from the current chat
 * @param {string} name - Character name to remove
 */
function removeCharacter(name) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        const characters = getCharacters();
        delete characters[name];
        setCharacters(characters);
    });
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
function getSetting(key, defaultValue) {
    const settings = get_settings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
}

/**
 * Set a specific setting value
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 */
function setSetting(key, value) {
    const update = {};
    update[key] = value;
    set_settings(update);
}

/**
 * Get a single character by name
 * @param {string} name - Character name
 * @returns {Object|null} Character data or null if not found
 */
function getCharacter(name) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            console.warn('[STnametracker] Invalid character name:', name);
            return null;
        }
        const chars = getCharacters();
        return chars[name] || null;
    }, null);
}

/**
 * Set a character by name
 * @param {string} name - Character name
 * @param {Object} character - Character data
 */
function setCharacter(name, character) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        if (!name || typeof name !== 'string') {
            throw new Error('Character name must be a non-empty string');
        }
        if (!character || typeof character !== 'object') {
            throw new Error('Character data must be an object');
        }
        const chars = { ...getCharacters() };
        chars[name] = character;
        setCharacters(chars);
        debug.log(`Set character: ${name}`);
    });
}

/**
 * Get LLM configuration
 * @returns {Object} LLM configuration object
 */
function getLLMConfig() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        return {
            source: getSetting('llmSource'),
            ollamaEndpoint: getSetting('ollamaEndpoint'),
            ollamaModel: getSetting('ollamaModel'),
            systemPrompt: getSetting('systemPrompt'),
        };
    }, { source: 'sillytavern', ollamaEndpoint: 'http://localhost:11434', ollamaModel: '', systemPrompt: null });
}

/**
 * Get lorebook configuration
 * @returns {Object} Lorebook configuration object
 */
function getLorebookConfig() {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        return {
            position: getSetting('lorebookPosition'),
            depth: getSetting('lorebookDepth'),
            cooldown: getSetting('lorebookCooldown'),
            scanDepth: getSetting('lorebookScanDepth'),
            probability: getSetting('lorebookProbability'),
            enabled: getSetting('lorebookEnabled'),
        };
    }, { position: 0, depth: 1, cooldown: 5, scanDepth: 1, probability: 100, enabled: true });
}

/**
 * Alias for get_settings for compatibility
 * @returns {Object} Current settings
 */
function getSettings() {
    return get_settings();
}

/**
 * Get chat metadata value
 * @param {string} key - Metadata key
 * @returns {any} Metadata value
 */
function get_chat_metadata(key) {
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

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
    return _errors_js__WEBPACK_IMPORTED_MODULE_0__.errorHandler.withErrorBoundary('Settings', () => {
        try {
            const metadata = _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.getChatMetadata();

            if (!metadata[MODULE_NAME]) {
                metadata[MODULE_NAME] = { ...DEFAULT_CHAT_DATA };
            }

            metadata[MODULE_NAME][key] = value;
            debug.log(`Updated chat data ${key}`);

            _context_js__WEBPACK_IMPORTED_MODULE_2__.stContext.saveChatMetadata().catch(err => {
                debug.warn('Failed to save chat metadata:', err.message);
            });
        } catch (error) {
            debug.warn('Failed to set chat metadata:', error.message);
        }
    });
}




/***/ },

/***/ "./src/modules/characters.js"
/*!***********************************!*\
  !*** ./src/modules/characters.js ***!
  \***********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateNameSimilarity: () => (/* binding */ calculateNameSimilarity),
/* harmony export */   cleanAliases: () => (/* binding */ cleanAliases),
/* harmony export */   clearUndoHistory: () => (/* binding */ clearUndoHistory),
/* harmony export */   createCharacter: () => (/* binding */ createCharacter),
/* harmony export */   createNewCharacter: () => (/* binding */ createNewCharacter),
/* harmony export */   detectMergeOpportunities: () => (/* binding */ detectMergeOpportunities),
/* harmony export */   exportCharacters: () => (/* binding */ exportCharacters),
/* harmony export */   findExistingCharacter: () => (/* binding */ findExistingCharacter),
/* harmony export */   findPotentialMatch: () => (/* binding */ findPotentialMatch),
/* harmony export */   getUndoHistory: () => (/* binding */ getUndoHistory),
/* harmony export */   hasUnresolvedRelationships: () => (/* binding */ hasUnresolvedRelationships),
/* harmony export */   importCharacters: () => (/* binding */ importCharacters),
/* harmony export */   isIgnoredCharacter: () => (/* binding */ isIgnoredCharacter),
/* harmony export */   mergeCharacters: () => (/* binding */ mergeCharacters),
/* harmony export */   purgeAllCharacters: () => (/* binding */ purgeAllCharacters),
/* harmony export */   toggleIgnoreCharacter: () => (/* binding */ toggleIgnoreCharacter),
/* harmony export */   undoLastMerge: () => (/* binding */ undoLastMerge),
/* harmony export */   updateCharacter: () => (/* binding */ updateCharacter),
/* harmony export */   updateCharacterProcessingState: () => (/* binding */ updateCharacterProcessingState)
/* harmony export */ });
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lorebook.js */ "./src/modules/lorebook.js");
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/notifications.js */ "./src/utils/notifications.js");
/**
 * Character Management Module
 *
 * Handles character CRUD operations, merging, alias detection, relationship management,
 * and per-character processing state tracking for the Name Tracker extension.
 */







const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_1__.createModuleLogger)('characters');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__.NotificationManager('Character Management');

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
// CONFIGURATION CONSTANTS - Merge confidence thresholds and detection parameters
// ============================================================================

// Merge Confidence Tiers (as percentages: 0-100)
const MERGE_CONFIDENCE_HIGH = 0.9;      // 90%+ - Automatic merge (e.g., exact substring: "Jazz"/"Jasmine")
const MERGE_CONFIDENCE_MEDIUM = 0.7;    // 70%+ - User prompt required (e.g., phonetic similarity)
// eslint-disable-next-line no-unused-vars
const MERGE_CONFIDENCE_LOW = 0.5;       // 50%+ - No automatic action (may indicate false positives)

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
 * @property {string} lastInteraction - Last interaction with user
 * @property {string[]} relationships - Relationships with other characters
 * @property {boolean} ignored - Whether character is ignored
 * @property {number} confidence - Confidence score (0-100)
 * @property {string|null} lorebookEntryId - Associated lorebook entry ID
 * @property {number} lastUpdated - Timestamp of last update
 * @property {boolean} isMainChar - Whether this is the main character
 * @property {number} lastMessageProcessed - ID of last message processed for this character
 */

/**
 * Check if a character is in the ignored list
 * @param {string} name - Character name to check
 * @returns {boolean} True if character is ignored
 */
function isIgnoredCharacter(name) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('isIgnoredCharacter', () => {
        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
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
function findExistingCharacter(name) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('findExistingCharacter', () => {
        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
        const found = Object.values(chars).find(
            char => char.preferredName === name || char.aliases.includes(name),
        ) || null;
        debugLog(`[FindChar] Searching for '${name}': ${found ? 'FOUND as ' + found.preferredName : 'NOT FOUND'}`);
        return found;
    });
}

/**
 * Find potential match for a new character based on confidence threshold
 * @param {Object} analyzedChar - Character data from LLM analysis
 * @returns {Promise<CharacterData|null>} Potential match if found
 */
async function findPotentialMatch(analyzedChar) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('findPotentialMatch', async () => {
        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
        const threshold = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.get_settings)('confidenceThreshold', 70);

        debug.log();

        // Simple matching logic - can be enhanced with LLM-based similarity
        for (const existingChar of Object.values(chars)) {
            // Check for name similarity (simple approach)
            const similarity = calculateNameSimilarity(analyzedChar.name, existingChar.preferredName);

            if (similarity >= threshold) {
                debug.log();
                return existingChar;
            }

            // Check aliases
            for (const alias of existingChar.aliases) {
                const aliasSimilarity = calculateNameSimilarity(analyzedChar.name, alias);
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('calculateNameSimilarity', () => {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('cleanAliases', () => {
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
function detectMergeOpportunities(newCharacterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('detectMergeOpportunities', () => {
        debugLog(`[MergeDetect] Checking merge opportunities for: ${newCharacterName}`);

        const potentialMatches = [];
        const existingCharacters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('createCharacter', async () => {
        debug.log();

        // Clean and filter aliases
        const aliases = cleanAliases(analyzedChar.aliases || [], analyzedChar.name);

        const character = {
            preferredName: analyzedChar.name,
            aliases: aliases,
            physicalAge: analyzedChar.physicalAge || '',
            mentalAge: analyzedChar.mentalAge || '',
            physical: analyzedChar.physical || '',
            personality: analyzedChar.personality || '',
            sexuality: analyzedChar.sexuality || '',
            raceEthnicity: analyzedChar.raceEthnicity || '',
            roleSkills: analyzedChar.roleSkills || '',
            lastInteraction: analyzedChar.lastInteraction || '',
            relationships: analyzedChar.relationships || [],
            ignored: false,
            confidence: analyzedChar.confidence || 50,
            lorebookEntryId: null,
            lastUpdated: Date.now(),
            isMainChar: isMainChar || false,
            lastMessageProcessed: -1,  // Track processing state per character
        };

        debug.log();

        // Store character in settings
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(character.preferredName, character);

        // Create lorebook entry
        await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_0__.updateLorebookEntry)(character, character.preferredName);

        debug.log();

        return character;
    });
}

/**
 * Update character's lastMessageProcessed tracking field
 * Called after successful processing of a character to track progress
 * @param {string} characterName - Name of the character
 * @param {number} messageId - ID of the last processed message for this character
 * @returns {boolean} True if successfully updated
 */
function updateCharacterProcessingState(characterName, messageId) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('updateCharacterProcessingState', () => {
        const character = findExistingCharacter(characterName);

        if (!character) {
            debug.log(`Character not found for state update: ${characterName}`);
            return false;
        }

        character.lastMessageProcessed = messageId;
        character.lastUpdated = Date.now();

        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(character.preferredName, character);

        debug.log(`Updated processing state for ${characterName}: messageId=${messageId}`);
        return true;
    }, false);
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('updateCharacter', async () => {
        debug.log();

        // Mark as main character if detected
        if (isMainChar) {
            existingChar.isMainChar = true;
        }

        // If adding as alias, add the analyzed name to aliases if not already present
        if (addAsAlias && analyzedChar.name !== existingChar.preferredName) {
            if (!existingChar.aliases) existingChar.aliases = [];
            if (!existingChar.aliases.includes(analyzedChar.name) &&
                analyzedChar.name.toLowerCase() !== existingChar.preferredName.toLowerCase()) {
                existingChar.aliases.push(analyzedChar.name);
            }
        }

        // Clean up all aliases using the helper function
        existingChar.aliases = cleanAliases(existingChar.aliases || [], existingChar.preferredName);

        // Update consolidated fields (new data takes precedence if not empty)
        if (analyzedChar.physicalAge) existingChar.physicalAge = analyzedChar.physicalAge;
        if (analyzedChar.mentalAge) existingChar.mentalAge = analyzedChar.mentalAge;
        if (analyzedChar.physical) existingChar.physical = analyzedChar.physical;
        if (analyzedChar.personality) existingChar.personality = analyzedChar.personality;
        if (analyzedChar.sexuality) existingChar.sexuality = analyzedChar.sexuality;
        if (analyzedChar.raceEthnicity) existingChar.raceEthnicity = analyzedChar.raceEthnicity;
        if (analyzedChar.roleSkills) existingChar.roleSkills = analyzedChar.roleSkills;

        // lastInteraction is always updated (most recent)
        if (analyzedChar.lastInteraction) existingChar.lastInteraction = analyzedChar.lastInteraction;

        // Merge relationships array - deduplicate
        if (analyzedChar.relationships && Array.isArray(analyzedChar.relationships)) {
            if (!existingChar.relationships) existingChar.relationships = [];
            for (const rel of analyzedChar.relationships) {
                if (!existingChar.relationships.includes(rel)) {
                    existingChar.relationships.push(rel);
                }
            }
        }

        // Update confidence (average of old and new)
        if (analyzedChar.confidence) {
            existingChar.confidence = Math.round((existingChar.confidence + analyzedChar.confidence) / 2);
        }

        existingChar.lastUpdated = Date.now();

        // Update character in settings
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(existingChar.preferredName, existingChar);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('mergeCharacters', async () => {
        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();

        const sourceChar = chars[sourceName];
        const targetChar = chars[targetName];

        if (!sourceChar || !targetChar) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.NameTrackerError('One or both characters not found');
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
        if (sourceChar.lastInteraction && !targetChar.lastInteraction) targetChar.lastInteraction = sourceChar.lastInteraction;

        // Merge relationships
        for (const rel of sourceChar.relationships) {
            if (!targetChar.relationships.includes(rel)) {
                targetChar.relationships.push(rel);
            }
        }

        // Update timestamp
        targetChar.lastUpdated = Date.now();

        // Update target character and delete source
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(targetChar.preferredName, targetChar);
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.removeCharacter)(sourceName);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('undoLastMerge', async () => {
        if (undoHistory.length === 0) {
            notifications.warning('No merge operations to undo');
            return false;
        }

        const lastOp = undoHistory.pop();

        if (lastOp.operation !== 'merge') {
            notifications.error('Last operation was not a merge');
            return false;
        }

        // Restore source character
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(lastOp.sourceName, lastOp.sourceData);

        // Restore target character to pre-merge state
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(lastOp.targetName, lastOp.targetDataBefore);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('toggleIgnoreCharacter', async () => {
        const character = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacter)(characterName);

        if (!character) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.NameTrackerError('Character not found');
        }

        character.ignored = !character.ignored;

        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(characterName, character);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('createNewCharacter', async () => {
        if (!characterName || !characterName.trim()) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.NameTrackerError('Character name is required');
        }

        const trimmedName = characterName.trim();

        // Check if character already exists
        if ((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacter)(trimmedName)) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.NameTrackerError(`Character "${trimmedName}" already exists`);
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
            lastInteraction: '',
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('purgeAllCharacters', async () => {
        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
        const characterCount = Object.keys(chars).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return 0;
        }

        // Clear all character data
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.set_chat_metadata)('characters', {});

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
function hasUnresolvedRelationships(character) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('hasUnresolvedRelationships', () => {
        if (!character.relationships || character.relationships.length === 0) {
            return false;
        }

        const chars = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
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
function exportCharacters() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('exportCharacters', () => {
        return (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacters)();
    });
}

/**
 * Import characters from JSON
 * @param {Object} characterData - Character data to import
 * @param {boolean} merge - Whether to merge with existing characters
 * @returns {Promise<number>} Number of characters imported
 */
async function importCharacters(characterData, merge = false) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_2__.withErrorBoundary)('importCharacters', async () => {
        if (!characterData || typeof characterData !== 'object') {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.NameTrackerError('Invalid character data');
        }

        let importCount = 0;

        for (const [name, character] of Object.entries(characterData)) {
            if (merge || !(0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.getCharacter)(name)) {
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_3__.setCharacter)(name, character);
                importCount++;
            }
        }

        debug.log();
        notifications.success(`Imported ${importCount} characters`);

        return importCount;
    });
}


/***/ },

/***/ "./src/modules/llm.js"
/*!****************************!*\
  !*** ./src/modules/llm.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildCharacterRoster: () => (/* binding */ buildCharacterRoster),
/* harmony export */   calculateMessageTokens: () => (/* binding */ calculateMessageTokens),
/* harmony export */   callLLMAnalysis: () => (/* binding */ callLLMAnalysis),
/* harmony export */   callOllama: () => (/* binding */ callOllama),
/* harmony export */   callSillyTavern: () => (/* binding */ callSillyTavern),
/* harmony export */   clearAnalysisCache: () => (/* binding */ clearAnalysisCache),
/* harmony export */   getCacheStats: () => (/* binding */ getCacheStats),
/* harmony export */   getMaxPromptLength: () => (/* binding */ getMaxPromptLength),
/* harmony export */   getOllamaModelContext: () => (/* binding */ getOllamaModelContext),
/* harmony export */   getOllamaModels: () => (/* binding */ getOllamaModels),
/* harmony export */   loadOllamaModels: () => (/* binding */ loadOllamaModels),
/* harmony export */   parseJSONResponse: () => (/* binding */ parseJSONResponse)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/context.js */ "./src/core/context.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/utils/helpers.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/notifications.js */ "./src/utils/notifications.js");
/**
 * LLM Integration Module
 *
 * Handles LLM API calls to SillyTavern and Ollama for character analysis.
 * Includes conservative parameter settings, token management, context window handling,
 * and JSON parsing for deterministic character extraction.
 */








const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__.createModuleLogger)('llm');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__.NotificationManager('LLM Integration');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = true; // Set to false in production after testing

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

/**
 * JSON Schema for structured character extraction
 * Enforces strict JSON structure for reliable parsing
 * Per: https://docs.sillytavern.app/for-contributors/writing-extensions/#structured-outputs
 */
const CHARACTER_EXTRACTION_SCHEMA = {
    name: 'CharacterAnalysis',
    description: 'Structured character information extracted from chat messages',
    strict: true,
    value: {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        'type': 'object',
        'properties': {
            'characters': {
                'type': 'array',
                'description': 'Array of character objects',
                'items': {
                    'type': 'object',
                    'properties': {
                        'name': {
                            'type': 'string',
                            'description': 'Character\'s preferred name (first and last if provided)',
                        },
                        'aliases': {
                            'type': 'array',
                            'description': 'Alternative names, nicknames, titles',
                            'items': { 'type': 'string' },
                        },
                        'physicalAge': {
                            'type': 'string',
                            'description': 'Apparent age in years or ??? if unknown',
                        },
                        'mentalAge': {
                            'type': 'string',
                            'description': 'Actual age (can differ for immortals) or ??? if unknown',
                        },
                        'physical': {
                            'type': 'string',
                            'description': 'Physical description (2-3 paragraphs)',
                        },
                        'personality': {
                            'type': 'string',
                            'description': 'Personality traits, quirks, habits (2-3 paragraphs)',
                        },
                        'sexuality': {
                            'type': 'string',
                            'description': 'Sexual orientation, preferences if mentioned',
                        },
                        'raceEthnicity': {
                            'type': 'string',
                            'description': 'Race/species/ethnicity if mentioned',
                        },
                        'roleSkills': {
                            'type': 'string',
                            'description': 'Occupation, abilities, talents',
                        },
                        'lastInteraction': {
                            'type': 'string',
                            'description': 'Most recent interaction with user',
                        },
                        'relationships': {
                            'type': 'array',
                            'description': 'Relationships with other characters',
                            'items': { 'type': 'string' },
                        },
                        'confidence': {
                            'type': 'integer',
                            'description': 'Confidence score 0-100 (90+=explicit, 70-89=clear, 50-69=mentioned, <50=vague)',
                            'minimum': 0,
                            'maximum': 100,
                        },
                    },
                    'required': ['name', 'aliases', 'physicalAge', 'mentalAge', 'physical', 'personality',
                        'sexuality', 'raceEthnicity', 'roleSkills', 'lastInteraction', 'relationships', 'confidence'],
                    'additionalProperties': false,
                },
            },
        },
        'required': ['characters'],
        'additionalProperties': false,
    },
};

/**
 * Default system prompt for character analysis
 */
const DEFAULT_SYSTEM_PROMPT = `Extract character information from messages and return ONLY a JSON object.

CRITICAL: Your entire response must be a single JSON object starting with { and ending with }

DO NOT include:
- Any text before the JSON
- Any text after the JSON  
- Code block markers
- Explanations or commentary

REQUIRED JSON structure (copy this exact format):
{
  "characters": [
    {
      "name": "Character name",
      "aliases": ["Other names"],
      "physicalAge": "Age if mentioned",
      "mentalAge": "Mental age if different",
      "physical": "Physical description",
      "personality": "Personality traits",
      "sexuality": "Sexual orientation if mentioned",
      "raceEthnicity": "Race/ethnicity if mentioned",
      "roleSkills": "Job/role/skills",
      "lastInteraction": "Recent interaction with user",
      "relationships": ["Relationships with other characters"],
      "confidence": 75
    }
  ]
}

Rules:
- Only extract clearly named speaking characters
- Skip generic references ("the waiter", "a woman")
- Use most recent information for conflicts
- Empty array if no clear characters: {"characters":[]}
- Confidence: 90+ (explicit), 70-89 (clear), 50-69 (mentioned), <50 (vague)

Your response must start with { immediately.`;

/**
 * Get the system prompt for analysis
 * @returns {string} System prompt text
 */
function getSystemPrompt() {
    return (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('systemPrompt') || DEFAULT_SYSTEM_PROMPT;
}

/**
 * Load available Ollama models
 * @returns {Promise<Array>} Array of available models
 */
async function loadOllamaModels() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('loadOllamaModels', async () => {
        const ollamaEndpoint = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('ollamaEndpoint', 'http://localhost:11434');
        debugLog(`[OllamaModels] Loading models from ${ollamaEndpoint}`);

        try {
            const response = await fetch(`${ollamaEndpoint}/api/tags`);

            if (!response.ok) {
                throw new Error(`Failed to connect to Ollama: ${response.statusText}`);
            }

            const data = await response.json();
            ollamaModels = data.models || [];
            debugLog(`[OllamaModels] Found ${ollamaModels.length} models: ${ollamaModels.map(m => m.name).join(', ')}`);

            return ollamaModels;
        } catch (error) {
            console.error('Error loading Ollama models:', error);
            notifications.error('Failed to load Ollama models. Check endpoint and try again.');
            throw error;
        }
    });
}

/**
 * Get Ollama model context size
 * @param {string} modelName - Name of the Ollama model
 * @returns {Promise<number>} Context size in tokens, or default 4096
 */
async function getOllamaModelContext(modelName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('getOllamaModelContext', async () => {
        const ollamaEndpoint = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('ollamaEndpoint', 'http://localhost:11434');

        if (!modelName) {
            debug.log();
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
                        debug.log();
                        return contextSize;
                    }
                }
            }

            // Fallback: check if it's in model details
            if (data.model_info && data.model_info.num_ctx) {
                const contextSize = parseInt(data.model_info.num_ctx);
                debug.log();
                return contextSize;
            }

            debug.log();
            return 4096;
        } catch (error) {
            console.error('Error fetching Ollama model context:', error);
            debug.log();
            return 4096;
        }
    });
}

/**
 * Build a roster of known characters for context
 * @returns {string} Formatted roster text
 */
function buildCharacterRoster() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('buildCharacterRoster', () => {
        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();
        const characterNames = Object.keys(characters);

        if (characterNames.length === 0) {
            return '';
        }

        const roster = characterNames.map(name => {
            const char = characters[name];
            const aliases = char.aliases && char.aliases.length > 0
                ? ` (also known as: ${char.aliases.join(', ')})`
                : '';
            const relationships = char.relationships && char.relationships.length > 0
                ? `\\n    Relationships: ${char.relationships.join('; ')}`
                : '';
            return `  - ${name}${aliases}${relationships}`;
        }).join('\\n');

        return `\\n\\n[KNOWN CHARACTERS]\\nThe following characters have already been identified. If you encounter them again, use the same name and add any new details:\\n${roster}\\n`;
    });
}

/**
 * Get the maximum safe prompt length based on API context window
 * Uses actual token counts from messages when available
 * @returns {Promise<number>} Maximum prompt length in tokens
 */
async function getMaxPromptLength() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('getMaxPromptLength', async () => {
        try {
            const llmConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLLMConfig)();
            let maxContext = 4096; // Default
            let maxGenTokens = 2048; // Default generation limit

            if (llmConfig.source === 'ollama' && llmConfig.ollamaModel) {
                // Get Ollama model's context size
                maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
            } else {
                // Use SillyTavern's context
                let context = null;
                
                try {
                    context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
                } catch (error) {
                    debug.log(`Failed to get context: ${error.message}, using fallback`);
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
                            k.toLowerCase().includes('prompt')
                        );
                        debug.log(`Available context properties: ${relevantKeys.join(', ')}`);
                    } catch (e) {
                        debug.log(`Error analyzing context keys: ${e.message}`);
                    }
                }

                // Try multiple possible paths for max context
                let detectedMaxContext = null;

                // Method 1: Direct maxContext property
                if (context && typeof context.maxContext === 'number' && context.maxContext > 0) {
                    detectedMaxContext = context.maxContext;
                    debug.log(`Method 1 SUCCESS (context.maxContext): ${detectedMaxContext}`);
                }

                // Method 2: extensionSettings.common.maxContext path
                if (!detectedMaxContext && context?.extensionSettings?.common) {
                    if (typeof context.extensionSettings.common.maxContext === 'number' && context.extensionSettings.common.maxContext > 0) {
                        detectedMaxContext = context.extensionSettings.common.maxContext;
                        debug.log(`Method 2 SUCCESS (context.extensionSettings.common.maxContext): ${detectedMaxContext}`);
                    }
                }

                // Method 3: chat.maxContextSize path
                if (!detectedMaxContext && context?.chat && typeof context.chat === 'object' && !Array.isArray(context.chat)) {
                    if (typeof context.chat.maxContextSize === 'number' && context.chat.maxContextSize > 0) {
                        detectedMaxContext = context.chat.maxContextSize;
                        debug.log(`Method 3 SUCCESS (context.chat.maxContextSize): ${detectedMaxContext}`);
                    }
                }

                // Method 4: token_limit
                if (!detectedMaxContext && context && typeof context.token_limit === 'number' && context.token_limit > 0) {
                    detectedMaxContext = context.token_limit;
                    debug.log(`Method 4 SUCCESS (context.token_limit): ${detectedMaxContext}`);
                }

                // Method 5: amount_gen (maximum generation tokens)
                if (!detectedMaxContext && context && typeof context.amount_gen === 'number' && context.amount_gen > 0) {
                    // amount_gen is typically small (generation limit), not context size
                    // Use as indicator if no other value found
                    detectedMaxContext = context.amount_gen * 4; // Rough estimate
                    debug.log(`Method 5 FALLBACK (context.amount_gen): ${context.amount_gen}, estimated context: ${detectedMaxContext}`);
                }

                // Method 6: Check settings object directly
                if (!detectedMaxContext && context && typeof context.settings === 'object') {
                    if (typeof context.settings.max_context === 'number' && context.settings.max_context > 0) {
                        detectedMaxContext = context.settings.max_context;
                        debug.log(`Method 6 SUCCESS (context.settings.max_context): ${detectedMaxContext}`);
                    }
                }

                // Final check: is detected value reasonable?
                if (detectedMaxContext && (typeof detectedMaxContext !== 'number' || detectedMaxContext < 100)) {
                    debug.log(`WARNING: Detected maxContext is not valid: ${detectedMaxContext}, type: ${typeof detectedMaxContext}`);
                    detectedMaxContext = null;
                }

                // Check if context is fully loaded
                if (!context || !detectedMaxContext) {
                    debug.log(`WARNING: Could not detect maxContext from any path, using fallback (4096)`);
                    debug.log(`Context exists: ${!!context}, detectedMaxContext: ${detectedMaxContext}`);
                    if (context) {
                        try {
                            const allKeys = Object.keys(context).sort();
                            debug.log(`Full context object keys: ${allKeys.slice(0, 20).join(', ')}${allKeys.length > 20 ? '...' : ''}`);
                        } catch (e) {
                            debug.log(`Could not enumerate context keys: ${e.message}`);
                        }
                    }
                    maxContext = 4096;
                    maxGenTokens = 1024;
                } else {
                    maxContext = Math.floor(detectedMaxContext);
                    debug.log(`Detected maxContext: ${maxContext} (type: ${typeof maxContext})`);

                    // For our extension's background analysis, we set our own max_tokens in generateRaw()
                    // We don't use amount_gen (that's for user chat messages)
                    // Reserve a reasonable amount for our structured JSON responses
                    maxGenTokens = Math.min(4096, Math.floor(maxContext * 0.15)); // 15% or 4096, whichever is lower

                    debug.log(`Extension will request max ${maxGenTokens} tokens for analysis responses (15% of context, capped at 4096)`);
                }
            }

            // Reserve space for: system prompt (500 tokens) + max generation (maxGenTokens) + safety margin (500)
            const reservedTokens = 500 + maxGenTokens + 500;
            const tokensForPrompt = Math.max(1000, maxContext - reservedTokens);

            debug.log(`Token allocation: maxContext=${maxContext}, reserved=${reservedTokens}, available=${tokensForPrompt}`);

            // Return at least 1000 tokens, max 50000 tokens (raised from 25000)
            return Math.max(1000, Math.min(tokensForPrompt, 50000));
        } catch (error) {
            debug.log(`ERROR in getMaxPromptLength: ${error.message}`);
            // Return conservative fallback on any error
            return 3276; // Based on default 4096 context with reserves
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('calculateMessageTokens', async () => {
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
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
                        debug.log();
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
 * Call SillyTavern's LLM with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * These settings override the user's chat settings to ensure reliable parsing
 * @param {string} prompt - The complete prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
async function callSillyTavern(prompt) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('callSillyTavern', async () => {
        debug.log();

        // Use SillyTavern.getContext() as recommended in official docs
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        // Check if we have an active API connection
        if (!context.onlineStatus) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('No API connection available. Please connect to an API first.');
        }

        // Get token count for the prompt

        let promptTokens;
        try {
            promptTokens = await context.getTokenCountAsync(prompt);
            debug.log();
            // eslint-disable-next-line no-unused-vars
        } catch (_error) {
            debug.log();
            promptTokens = Math.ceil(prompt.length / 4);
            debug.log();
        }

        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        // This scales with the model's context window for better headroom
        const maxContext = context.maxContext || 4096;
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debug.log();

        // Use generateRaw as documented in:
        // https://docs.sillytavern.app/for-contributors/writing-extensions/#raw-generation
        // With structured outputs per: https://docs.sillytavern.app/for-contributors/writing-extensions/#structured-outputs
        const result = await context.generateRaw({
            prompt: prompt,  // Can be string (Text Completion) or array (Chat Completion)
            systemPrompt: '',  // Empty, we include instructions in prompt
            prefill: '',  // No prefill needed for analysis
            // Override generation settings for structured output
            // These hardcoded conservative settings ensure consistent, deterministic JSON
            // regardless of user's chat settings - critical for reliable character extraction
            temperature: GENERATION_TEMPERATURE,     // Very low for deterministic output
            top_p: GENERATION_TOP_P,                 // Focused sampling
            top_k: GENERATION_TOP_K,                 // Standard focused token selection
            rep_pen: GENERATION_REP_PEN,             // Slight repetition penalty
            max_tokens: maxTokens,  // Dynamic: 25% of context, min 4000 (prevents truncation)
            stop: [],           // No custom stop sequences needed
            // JSON Schema for structured output (Chat Completion APIs only)
            // This enforces valid JSON structure - if API doesn't support it, will be ignored
            jsonSchema: CHARACTER_EXTRACTION_SCHEMA,
        });

        debug.log();

        // The result should be a string
        if (!result) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('Empty response from SillyTavern LLM');
        }

        return parseJSONResponse(result);
    });
}

/**
 * Call Ollama API with optimized parameters for JSON extraction
 * Uses low temperature and focused sampling for deterministic, structured output
 * @param {string} prompt - The complete prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
async function callOllama(prompt) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('callOllama', async () => {
        const llmConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLLMConfig)();

        if (!llmConfig.ollamaModel) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('No Ollama model selected');
        }

        debug.log();

        // Calculate max_tokens dynamically: 1/4 of context size, minimum 4000
        const maxContext = await getOllamaModelContext(llmConfig.ollamaModel);
        const calculatedMaxTokens = Math.floor(maxContext * 0.25);
        const maxTokens = Math.max(4000, calculatedMaxTokens);
        debug.log();

        const response = await fetch(`${llmConfig.ollamaEndpoint}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmConfig.ollamaModel,
                prompt: prompt,
                stream: false,
                format: 'json',
                // Ollama-specific generation parameters for structured output
                // Using same conservative settings as SillyTavern for consistency
                options: {
                    temperature: GENERATION_TEMPERATURE,      // Very low for deterministic output
                    top_p: GENERATION_TOP_P,                  // Focused sampling
                    top_k: GENERATION_TOP_K,                  // Standard focused sampling
                    repeat_penalty: GENERATION_REP_PEN,       // Slight repetition penalty
                    num_predict: maxTokens,  // Dynamic: 25% of context, min 4000 (prevents truncation)
                },
            }),
        });

        if (!response.ok) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        debug.log();
        debug.log();

        return parseJSONResponse(data.response);
    });
}

/**
 * Parse JSON response from LLM, handling various formats
 * @param {string} text - Raw text response from LLM
 * @returns {Object} Parsed JSON object
 */
function parseJSONResponse(text) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('parseJSONResponse', () => {
        if (!text || typeof text !== 'string') {
            console.error('Invalid response text:', text);
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('LLM returned empty or invalid response');
        }

        // Remove any leading/trailing whitespace
        text = text.trim();

        // Try to extract JSON from markdown code blocks (```json or ```)
        const jsonMatch = text.match(/```(?:json)?\\s*([\\s\\S]*?)```/);
        if (jsonMatch) {
            text = jsonMatch[1].trim();
        }

        // Try to find JSON object in the text (look for first { to last })
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        // Remove common prefixes that LLMs add
        text = text.replace(/^(?:Here's the analysis:|Here is the JSON:|Result:|Output:)\\s*/i, '');

        // Clean up common formatting issues
        text = text.trim();

        try {
            const parsed = JSON.parse(text);

            // Validate structure
            if (!parsed.characters || !Array.isArray(parsed.characters)) {
                console.warn('Response missing characters array, returning empty:', parsed);
                return { characters: [] };
            }

            return parsed;
        } catch (error) {
            console.error('Failed to parse JSON response. Original text:', text);
            console.error('Parse error:', error.message);

            // Check if response was truncated (common issue with long responses)
            if (text.includes('"characters"') && !text.trim().endsWith('}')) {
                debug.log();
                debug.log();

                // Try to salvage partial data by attempting to close the JSON
                let salvaged = text;

                // Count open vs closed braces to determine how many we need
                const openBraces = (text.match(/\{/g) || []).length;
                const closeBraces = (text.match(/\}/g) || []).length;
                const openBrackets = (text.match(/\[/g) || []).length;
                const closeBrackets = (text.match(/\]/g) || []).length;

                // Try to close incomplete strings and objects
                if (salvaged.match(/"[^"]*$/)) {
                    // Has unclosed quote
                    salvaged += '"';
                }

                // Close missing brackets/braces
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    salvaged += ']';
                }
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    salvaged += '}';
                }

                try {
                    const recovered = JSON.parse(salvaged);
                    debug.log();
                    return recovered;
                } catch (e) {
                    debug.log();
                }
            }

            // Try one more time with more aggressive extraction
            const fallbackMatch = text.match(/\\{[\\s\\S]*"characters"[\\s\\S]*\\}/);
            if (fallbackMatch) {
                try {
                    parsed = JSON.parse(fallbackMatch[0]);
                } catch (parseError) {
                    debug.log();
                    // Give up
                }
            }

            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('Failed to parse LLM response as JSON. The response may be too long or truncated. Try analyzing fewer messages at once.');
        }
    });
}

/**
 * Call LLM for character analysis with automatic batch splitting if prompt is too long
 * @param {Array} messageObjs - Array of message objects (with .mes property) or strings
 * @param {string} knownCharacters - Roster of previously identified characters
 * @param {number} depth - Recursion depth (for logging)
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<Object>} Analysis result with merged characters
 */
async function callLLMAnalysis(messageObjs, knownCharacters = '', depth = 0, retryCount = 0) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('callLLMAnalysis', async () => {
        const llmConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLLMConfig)();
        const maxPromptTokens = await getMaxPromptLength(); // Dynamic based on API context window
        const MAX_RETRIES = 3;

        debug.log();

        // Extract message text
        const messages = messageObjs.map(msg => {
            if (typeof msg === 'string') return msg;
            if (msg.mes) return msg.mes;
            if (msg.message) return msg.message;
            return JSON.stringify(msg);
        });

        // Create cache key
        const cacheKey = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.simpleHash)(messages.join('\\n') + llmConfig.source + llmConfig.ollamaModel);

        // Check cache
        if (analysisCache.has(cacheKey)) {
            debug.log();
            return analysisCache.get(cacheKey);
        }

        // Build the prompt
        const messagesText = messages.map((msg, idx) => `Message ${idx + 1}:\\n${msg}`).join('\\n\\n');
        const systemInstructions = `[SYSTEM INSTRUCTION - DO NOT ROLEPLAY]\\n${getSystemPrompt()}${knownCharacters}\\n\\n[DATA TO ANALYZE]`;
        const fullPrompt = `${systemInstructions}\\n${messagesText}\\n\\n[RESPOND WITH JSON ONLY - NO STORY CONTINUATION]`;

        // Calculate actual token count for the prompt
        let promptTokens;
        try {
            promptTokens = await calculateMessageTokens([{ mes: fullPrompt }]);
            debug.log();
        } catch (tokenError) {
            debug.log();
            // Fallback to character-based estimate
            promptTokens = Math.ceil(fullPrompt.length / 4);
        }

        // If prompt is too long, split into sub-batches
        if (promptTokens > maxPromptTokens && messageObjs.length > 1) {
            const indent = '  '.repeat(depth);
            debug.log();

            // Split roughly in half
            const midpoint = Math.floor(messageObjs.length / 2);
            const firstHalf = messageObjs.slice(0, midpoint);
            const secondHalf = messageObjs.slice(midpoint);

            debug.log();

            // Analyze both halves in parallel
            const [result1, result2] = await Promise.all([
                callLLMAnalysis(firstHalf, knownCharacters, depth + 1),
                callLLMAnalysis(secondHalf, knownCharacters, depth + 1),
            ]);

            // Merge the results
            const mergedResult = {
                characters: [
                    ...(result1.characters || []),
                    ...(result2.characters || []),
                ],
            };

            debug.log();
            return mergedResult;
        }

        // Prompt is acceptable length, proceed with analysis
        let result;

        try {
            if (llmConfig.source === 'ollama') {
                result = await callOllama(fullPrompt);
            } else {
                result = await callSillyTavern(fullPrompt);
            }
        } catch (error) {
            // Retry on JSON parsing errors or empty responses
            if (retryCount < MAX_RETRIES &&
                (error.message.includes('JSON') ||
                 error.message.includes('empty') ||
                 error.message.includes('truncated'))) {

                debug.log();

                // Add exponential backoff delay
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay));

                // Retry the same call
                return await callLLMAnalysis(messageObjs, knownCharacters, depth, retryCount + 1);
            }

            // Max retries exceeded or non-retryable error
            throw error;
        }

        // Cache the result
        if (analysisCache.size > 50) {
            // Clear oldest entries if cache is getting too large
            const firstKey = analysisCache.keys().next().value;
            analysisCache.delete(firstKey);
        }
        analysisCache.set(cacheKey, result);

        debug.log();
        return result;
    });
}

/**
 * Clear the analysis cache
 */
function clearAnalysisCache() {
    analysisCache.clear();
    debug.log();
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

/**
 * Get available Ollama models
 * @returns {Array} Array of available models
 */
function getOllamaModels() {
    return [...ollamaModels];
}


/***/ },

/***/ "./src/modules/lorebook.js"
/*!*********************************!*\
  !*** ./src/modules/lorebook.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adoptExistingEntries: () => (/* binding */ adoptExistingEntries),
/* harmony export */   createLorebookContent: () => (/* binding */ createLorebookContent),
/* harmony export */   deleteLorebookEntry: () => (/* binding */ deleteLorebookEntry),
/* harmony export */   getCurrentLorebookName: () => (/* binding */ getCurrentLorebookName),
/* harmony export */   getLorebookStats: () => (/* binding */ getLorebookStats),
/* harmony export */   initializeLorebook: () => (/* binding */ initializeLorebook),
/* harmony export */   purgeLorebookEntries: () => (/* binding */ purgeLorebookEntries),
/* harmony export */   resetLorebookState: () => (/* binding */ resetLorebookState),
/* harmony export */   updateLorebookEntry: () => (/* binding */ updateLorebookEntry),
/* harmony export */   viewInLorebook: () => (/* binding */ viewInLorebook)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/context.js */ "./src/core/context.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/utils/helpers.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/notifications.js */ "./src/utils/notifications.js");
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
console.log('[LOREBOOK] createModuleLogger:', typeof _core_debug_js__WEBPACK_IMPORTED_MODULE_0__.createModuleLogger);
console.log('[LOREBOOK] withErrorBoundary:', typeof _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary);
console.log('[LOREBOOK] NameTrackerError:', typeof _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError);

// Try to create debug logger with explicit error handling
let debug;
try {
    console.log('[LOREBOOK] About to call createModuleLogger...');
    debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__.createModuleLogger)('lorebook');
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
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__.NotificationManager('Lorebook Management');

// Lorebook state
let lorebookName = null;

/**
 * Initialize or get the lorebook for this chat
 * @returns {Promise<string|null>} Lorebook name if successful, null if no chat
 */
async function initializeLorebook() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('initializeLorebook', async () => {
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        if (!context.chatId) {
            debug.log('No active chat, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        const METADATA_KEY = 'world_info';
        const chatMetadata = context.chatMetadata;

        if (!chatMetadata) {
            debug.log('No chat metadata available, skipping lorebook initialization');
            lorebookName = null;
            return null;
        }

        // Check if chat already has a bound lorebook
        if (chatMetadata[METADATA_KEY]) {
            lorebookName = chatMetadata[METADATA_KEY];
            debug.log(`Using existing chat lorebook: ${lorebookName}`);
            return lorebookName;
        }

        // Create a new chat-bound lorebook name
        const bookName = `NameTracker_${context.chatId}`
            .replace(/[^a-z0-9 -]/gi, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 64);

        debug.log(`Creating new chat lorebook: ${bookName}`);
        lorebookName = bookName;

        // Bind it to the chat metadata
        chatMetadata[METADATA_KEY] = lorebookName;

        // Save chat metadata using context API
        try {
            await context.saveMetadata();
            debug.log(`Bound lorebook to chat: ${lorebookName}`);

            // Ensure the lorebook file exists (create empty if needed)
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (!worldInfo) {
                debug.log();
                await context.saveWorldInfo(lorebookName, { entries: {} }, true);
            }

            // Notify user
            notifications.info(`Chat lorebook "${lorebookName}" created and bound to this chat`, { timeOut: 5000 });
        } catch (error) {
            console.error('Failed to initialize lorebook:', error);
            lorebookName = null;
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`Failed to initialize lorebook: ${error.message}`);
        }

        return lorebookName;
    });
}

/**
 * Update or create lorebook entry for a character
 * @param {Object} character - Character data
 * @param {string} characterName - Character name
 * @returns {Promise<void>}
 */
async function updateLorebookEntry(character, characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('updateLorebookEntry', async () => {
        debug.log(`updateLorebookEntry called for: ${characterName}`);
        debug.log('  Character data:', character);

        if (!lorebookName) {
            debug.log('No lorebook initialized, skipping entry update');
            return;
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const lorebookConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLorebookConfig)();

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

        // Last Interaction
        if (character.lastInteraction) {
            contentParts.push(`\n**Last Interaction with {{user}}:**\n${character.lastInteraction}`);
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

        // Load the world info to check if entry exists
        let worldInfo = await context.loadWorldInfo(lorebookName);

        if (!worldInfo) {
            debug.log();
            // Match SillyTavern's world info structure
            worldInfo = {
                entries: {},
            };
        }

        // Calculate dynamic cooldown
        const messageFreq = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('messageFrequency', 10);
        const calculatedCooldown = Math.max(1, Math.floor(messageFreq * 0.75));

        let existingUid = null;

        // Check if this character already has a lorebook entry
        if (character.lorebookEntryId && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
            // Update existing entry
            existingUid = character.lorebookEntryId;
            const existingEntry = worldInfo.entries[existingUid];

            existingEntry.key = keys;
            existingEntry.content = content;
            existingEntry.enabled = lorebookConfig.enabled;
            existingEntry.position = lorebookConfig.position;
            existingEntry.probability = lorebookConfig.probability;
            existingEntry.depth = lorebookConfig.depth;
            existingEntry.scanDepth = lorebookConfig.scanDepth;
            existingEntry.cooldown = calculatedCooldown;

            debug.log();
        } else {
            // Create new entry
            const newUid = (0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.generateUID)();

            const newEntry = {
                uid: newUid,
                key: keys,
                keysecondary: [],
                comment: `Auto-generated entry for ${character.preferredName}`,
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
                automationId: '',
                role: 0,
                vectorized: false,
                sticky: 0,
                cooldown: calculatedCooldown,
                delay: 0,
            };

            // World info entries are stored as an object with UID as key
            worldInfo.entries[newUid] = newEntry;
            character.lorebookEntryId = newUid;

            debug.log();
        }

        // Save the lorebook
        try {
            await context.saveWorldInfo(lorebookName, worldInfo, true);

            // Verify the save worked by reloading
            const verifyWorldInfo = await context.loadWorldInfo(lorebookName);
            const targetUid = existingUid || character.lorebookEntryId;

            if (verifyWorldInfo && verifyWorldInfo.entries && verifyWorldInfo.entries[targetUid]) {
                debug.log();
            } else {
                console.error('[Name Tracker] WARNING: Lorebook verification failed - entries may not have been saved!');
            }

            debug.log();
        } catch (error) {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('createLorebookContent', () => {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('viewInLorebook', async () => {
        const character = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacter)(characterName);

        if (!character) {
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError('Character not found');
        }

        if (!lorebookName) {
            notifications.warning('No active chat or lorebook');
            return;
        }

        // Import the openWorldInfoEditor function from SillyTavern
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        // Open the lorebook editor
        if (typeof context.openWorldInfoEditor === 'function') {
            await context.openWorldInfoEditor(lorebookName);
            notifications.success(`Opened lorebook for ${characterName}`);
        } else {
            // Fallback: show the world info panel if openWorldInfoEditor doesn't exist
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('deleteLorebookEntry', async () => {
        if (!lorebookName || !character.lorebookEntryId) {
            debug.log();
            return false;
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);
            if (worldInfo && worldInfo.entries && worldInfo.entries[character.lorebookEntryId]) {
                delete worldInfo.entries[character.lorebookEntryId];
                await context.saveWorldInfo(lorebookName, worldInfo, true);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('purgeLorebookEntries', async () => {
        if (!lorebookName) {
            debug.log();
            return 0;
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
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
                await context.saveWorldInfo(lorebookName, worldInfo, true);
            }
        } catch (error) {
            console.error('Error purging lorebook entries:', error);
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`Failed to purge lorebook entries: ${error.message}`);
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('adoptExistingEntries', async () => {
        if (!lorebookName) {
            debug.log();
            return 0;
        }

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        let adoptedCount = 0;

        try {
            const worldInfo = await context.loadWorldInfo(lorebookName);

            if (!worldInfo || !worldInfo.entries) {
                debug.log();
                return 0;
            }

            const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();

            // Look for entries that might belong to our extension
            for (const [entryId, entry] of Object.entries(worldInfo.entries)) {
                if (!entry.key || !Array.isArray(entry.key) || entry.key.length === 0) {
                    continue;
                }

                const primaryName = entry.key[0];

                // Check if this entry represents a character we should track
                if (!characters[primaryName] && entry.comment?.includes('Auto-generated entry for')) {
                    // Try to parse the content to recreate character data
                    const character = {
                        preferredName: primaryName,
                        aliases: entry.key.slice(1),
                        physical: '',
                        personality: '',
                        sexuality: '',
                        raceEthnicity: '',
                        roleSkills: '',
                        lastInteraction: '',
                        relationships: [],
                        ignored: false,
                        confidence: 50,
                        lorebookEntryId: entryId,
                        lastUpdated: Date.now(),
                        isMainChar: false,
                    };

                    // Store the adopted character
                    (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setCharacter)(primaryName, character);
                    adoptedCount++;

                    debug.log();
                }
            }

            if (adoptedCount > 0) {
                notifications.success(`Adopted ${adoptedCount} existing lorebook entries`);
            }

        } catch (error) {
            console.error('Error adopting existing entries:', error);
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`Failed to adopt existing entries: ${error.message}`);
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('getLorebookStats', async () => {
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
            const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();

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

/***/ "./src/modules/processing.js"
/*!***********************************!*\
  !*** ./src/modules/processing.js ***!
  \***********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abortCurrentScan: () => (/* binding */ abortCurrentScan),
/* harmony export */   addToQueue: () => (/* binding */ addToQueue),
/* harmony export */   clearProcessingQueue: () => (/* binding */ clearProcessingQueue),
/* harmony export */   getProcessingStatus: () => (/* binding */ getProcessingStatus),
/* harmony export */   harvestMessages: () => (/* binding */ harvestMessages),
/* harmony export */   onChatChanged: () => (/* binding */ onChatChanged),
/* harmony export */   onMessageReceived: () => (/* binding */ onMessageReceived),
/* harmony export */   processAnalysisResults: () => (/* binding */ processAnalysisResults),
/* harmony export */   processPhaseTwoAnalysis: () => (/* binding */ processPhaseTwoAnalysis),
/* harmony export */   processQueue: () => (/* binding */ processQueue),
/* harmony export */   scanEntireChat: () => (/* binding */ scanEntireChat),
/* harmony export */   scanForNewNames: () => (/* binding */ scanForNewNames)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/context.js */ "./src/core/context.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/notifications.js */ "./src/utils/notifications.js");
/* harmony import */ var _llm_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./llm.js */ "./src/modules/llm.js");
/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./characters.js */ "./src/modules/characters.js");
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lorebook.js */ "./src/modules/lorebook.js");
/**
 * Message Processing Module
 *
 * Handles two-phase character detection (lightweight name scan → focused LLM processing),
 * batch processing with character-specific context windows, and SillyTavern event integration.
 */










const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__.createModuleLogger)('processing');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_4__.NotificationManager('Message Processing');

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================
const DEBUG_LOGGING = true; // Set to false in production after testing

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
const BATCH_TIMEOUT_MS = 30000;         // Maximum time for a single batch to process
const MAX_RETRY_ATTEMPTS = 3;           // Maximum retries before halting processing
const CONTEXT_REDUCTION_STEP = 5;       // Percentage to reduce context target on each failure

// Batch Size Constraints (token-based, but with message-count limits for safety)
const MIN_MESSAGES_PER_BATCH = 5;       // Never create batches smaller than this (unless last batch)
const MAX_MESSAGES_PER_BATCH = 50;      // Cap batches at this size even if tokens allow more
const TARGET_MESSAGES_PER_BATCH = 30;   // Aim for this size when possible (balance: not too small, not too large)

// Error Recovery
const ENABLE_AUTO_RECOVERY = true;      // Enable automatic context reduction on failure
const PRESERVE_PROCESSING_STATE = true; // Always save character state even on errors

// Processing state
let processingQueue = [];
let isProcessing = false;
let abortScan = false;
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('processAnalysisResults', async () => {
        if (!analyzedCharacters || !Array.isArray(analyzedCharacters)) {
            debug.log();
            return;
        }

        debug.log();

        for (const analyzedChar of analyzedCharacters) {
            try {
                await processCharacterData(analyzedChar);
            } catch (error) {
                console.error(`Error processing character ${analyzedChar.name}:`, error);
                // Continue with other characters
            }
        }
    });
}

/**
 * Process individual character data from LLM analysis
 * @param {Object} analyzedChar - Character data from LLM
 * @returns {Promise<void>}
 */
async function processCharacterData(analyzedChar) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('processCharacterData', async () => {
        if (!analyzedChar.name || analyzedChar.name.trim() === '') {
            debug.log();
            return;
        }

        const characterName = analyzedChar.name.trim();

        // Check if character is ignored
        if ((0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.isIgnoredCharacter)(characterName)) {
            debug.log();
            return;
        }

        // Check for main character detection
        const isMainChar = characterName.toLowerCase().includes('{{char}}') ||
                          analyzedChar.isMainCharacter === true ||
                          analyzedChar.role === 'main';

        // Check if character already exists
        const existingChar = (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.findExistingCharacter)(characterName);

        if (existingChar) {
            // Update existing character
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.updateCharacter)(existingChar, analyzedChar, false, isMainChar);
            await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(existingChar, existingChar.preferredName);
            debug.log();
        } else {
            // Check for potential matches (similar names)
            const potentialMatch = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.findPotentialMatch)(analyzedChar);

            if (potentialMatch) {
                // Update potential match and add as alias
                await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.updateCharacter)(potentialMatch, analyzedChar, true, isMainChar);
                await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(potentialMatch, potentialMatch.preferredName);
                debug.log();
            } else {
                // Create new character
                const newCharacter = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.createCharacter)(analyzedChar, isMainChar);
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
function scanForNewNames(messages) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('scanForNewNames', () => {
        debugLog(`[PHASE 1] Starting name scan on ${messages.length} messages`);

        if (!Array.isArray(messages) || messages.length === 0) {
            debugLog('[PHASE 1] No messages to scan');
            return [];
        }

        const foundNames = new Set();
        const existingCharacters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('processPhaseTwoAnalysis', async () => {
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
                            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(
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
                        const existingChar = (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.findExistingCharacter)(charName);
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
        throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`No context found for character: ${name}`, 'NO_CONTEXT');
    }

    // Analyze the character with LLM
    debugLog(`[P2-NewChar] Calling LLM for ${name}`);
    const characterData = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.callLLMAnalysis)([{ mes: characterContext }], [name], currentProcessingState.contextTarget);

    if (!characterData || characterData.length === 0) {
        debugLog(`[P2-NewChar] FAILED: LLM returned no data for ${name}`);
        throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`LLM returned no data for character: ${name}`, 'LLM_EMPTY_RESPONSE');
    }

    debugLog(`[P2-NewChar] LLM returned data: ${JSON.stringify(characterData[0]).substring(0, 200)}...`);

    // Check for merge opportunities before creating
    const potentialMerges = (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.detectMergeOpportunities)(name);
    if (potentialMerges && potentialMerges.length > 0) {
        debugLog(`[P2-NewChar] Merge opportunities: ${potentialMerges.map(m => m.targetName).join(', ')}`);
        results.mergesDetected.push({ source: name, targets: potentialMerges });
    }

    // Create the character
    const newCharacter = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.createCharacter)(characterData[0], false);
    await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(newCharacter, newCharacter.preferredName);

    results.newCharactersCreated.push(newCharacter.preferredName);
    debugLog(`[P2-NewChar] Successfully created: ${newCharacter.preferredName}`);
}

/**
 * Process existing character: build context from last processed message → update entry
 * @private
 */
async function processExistingCharacter(existingChar, messages, results) {
    debug.log(`Updating existing character: ${existingChar.preferredName}`);

    // Get character's last processed message ID (from state tracking)
    const lastProcessedId = existingChar.lastMessageProcessed || -1;

    // Build context starting from overlap before last processed message
    const characterContext = buildCharacterContextFromPoint(
        existingChar.preferredName,
        messages,
        lastProcessedId,
        OVERLAP_SIZE,
    );

    if (!characterContext || characterContext.length === 0) {
        debug.log(`No new context for character ${existingChar.preferredName} since last processing`);
        return;
    }

    // Analyze with LLM
    const updates = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.callLLMAnalysis)([{ mes: characterContext }], [existingChar.preferredName], currentProcessingState.contextTarget);

    if (updates && updates.length > 0) {
        await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.updateCharacter)(existingChar, updates[0], false, existingChar.isMainChar);
        await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_7__.updateLorebookEntry)(existingChar, existingChar.preferredName);

        results.existingCharactersUpdated.push(existingChar.preferredName);
        debug.log(`Updated character: ${existingChar.preferredName}`);
    }
}

/**
 * Build character-specific context from all messages mentioning the character
 * @private
 */
function buildCharacterContext(characterName, messages, overlapSize) {
    const contextMessages = [];

    for (const msg of messages) {
        if (!msg.mes) continue;

        // Check if this message mentions the character
        if (msg.mes.includes(characterName) || msg.mes.includes(characterName.split(' ')[0])) {
            contextMessages.push(msg);
        }
    }

    if (contextMessages.length === 0) return '';

    // Add overlap messages before and after mentions for context
    const contextWindow = [];
    const indices = contextMessages.map(m => messages.indexOf(m));
    const minIdx = Math.max(0, Math.min(...indices) - overlapSize);
    const maxIdx = Math.min(messages.length - 1, Math.max(...indices) + overlapSize);

    for (let i = minIdx; i <= maxIdx; i++) {
        if (messages[i]) {
            contextWindow.push(messages[i].mes);
        }
    }

    return contextWindow.join('\n\n');
}

/**
 * Build context starting from a specific message point (for continuing character updates)
 * @private
 */
function buildCharacterContextFromPoint(characterName, messages, lastProcessedId, overlapSize) {
    const allText = [];
    let startIdx = 0;

    // Find where we left off
    if (lastProcessedId >= 0) {
        const lastIdx = messages.findIndex(m => m.id === lastProcessedId);
        startIdx = Math.max(0, lastIdx - overlapSize);
    }

    for (let i = startIdx; i < messages.length; i++) {
        if (messages[i] && messages[i].mes) {
            allText.push(messages[i].mes);
        }
    }

    return allText.length > 0 ? allText.join('\n\n') : '';
}

/**
 * Harvest and analyze messages
 * @param {number} messageCount - Number of recent messages to analyze
 * @param {boolean} showProgress - Whether to show progress notifications
 * @returns {Promise<void>}
 */
async function harvestMessages(messageCount, showProgress = true) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('harvestMessages', async () => {
        if (!(0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('enabled', true)) {
            debug.log();
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLLMConfig)();
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

        // Check if messages fit in context window
        const maxPromptTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.getMaxPromptLength)();
        const availableTokens = maxPromptTokens - 1000; // Reserve for system prompt and response

        debugLog(`[Batching] Token budget: maxPromptTokens=${maxPromptTokens}, reserved=1000, availableTokens=${availableTokens}`);
        debugLog(`[Batching] Context target: ${currentProcessingState.contextTarget}%`);

        // Calculate actual token count for the requested messages
        const messageTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.calculateMessageTokens)(messagesToAnalyze);

        debugLog(`[Batching] Total tokens for ${messagesToAnalyze.length} messages: ${messageTokens} tokens`);

        // If too large, split into batches
        if (messageTokens > availableTokens) {
            debugLog(`[Batching] Messages exceed token limit (${messageTokens} > ${availableTokens}), creating batches`);

            // Calculate optimal batch size based on tokens AND message count constraints
            const batches = [];
            let currentBatch = [];
            let currentTokens = 0;
            const batchDetails = []; // Track batch composition for logging

            // Build batches by adding messages until token limit OR message count limit
            for (const msg of messagesToAnalyze) {
                const msgTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.calculateMessageTokens)([msg]);

                // Check if batch would exceed token limit OR message count limit
                const wouldExceedTokens = currentTokens + msgTokens > availableTokens;
                const wouldExceedMessageCount = currentBatch.length >= MAX_MESSAGES_PER_BATCH;

                if ((wouldExceedTokens || wouldExceedMessageCount) && currentBatch.length > 0) {
                    // Current batch is full, start new one
                    const reason = wouldExceedTokens ? 'token limit' : 'message count limit';
                    debugLog(`[Batching] Batch ${batches.length + 1} complete: ${currentBatch.length} messages, ${currentTokens} tokens (split by ${reason})`);
                    batches.push(currentBatch);
                    batchDetails.push({ size: currentBatch.length, tokens: currentTokens, reason: reason });
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
                batchDetails.push({ size: currentBatch.length, tokens: currentTokens, reason: 'final batch' });
                debugLog(`[Batching] Final batch ${batches.length}: ${currentBatch.length} messages, ${currentTokens} tokens`);
            }

            // Log comprehensive batch summary
            const batchSummary = batchDetails.map((b, i) => `Batch ${i + 1}: ${b.size}msg/${b.tokens}tok (${b.reason})`).join(' | ');
            debugLog(`[Batching] Created ${batches.length} total batches: ${batchSummary}`);
            debugLog(`[Batching] Constraints applied: MIN=${MIN_MESSAGES_PER_BATCH}, TARGET=${TARGET_MESSAGES_PER_BATCH}, MAX=${MAX_MESSAGES_PER_BATCH}, TokenLimit=${availableTokens}`);

            // Reset abort flag
            abortScan = false;

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
                    const characterRoster = (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.buildCharacterRoster)();

                    // Call LLM for analysis
                    const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.callLLMAnalysis)(batch, characterRoster);

                    // Process the analysis
                    if (analysis.characters && Array.isArray(analysis.characters)) {
                        await processAnalysisResults(analysis.characters);
                        analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                    }

                    successfulBatches++;

                    // Small delay between batches to avoid rate limiting
                    if (i < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                } catch (error) {
                    debugLog(`[BatchProcessing] ERROR in batch ${i + 1}: ${error.message}`);
                    debugLog(`[BatchProcessing] Context: messages ${batchStart}-${batchEnd - 1}, batch size ${batch.length}, token count calc error`);
                    console.error(`Error processing batch ${i + 1}:`, error);
                    failedBatches++;

                    // Ask user if they want to continue
                    const continueOnError = confirm(`Batch ${i + 1} failed.

Error: ${error.message}

Continue with remaining batches?`);
                    if (!continueOnError) {
                        debugLog(`[BatchProcessing] User chose not to continue after error on batch ${i + 1}/${batches.length}`);
                        break;
                    } else {
                        debugLog(`[BatchProcessing] User chose to continue despite error on batch ${i + 1}/${batches.length}`);
                    }
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

            return;
        }

        // Messages fit in one batch - process normally
        if (showProgress) {
            notifications.info(`Analyzing ${messagesToAnalyze.length} messages for character information...`);
        }

        try {
            // Build roster of characters found so far
            const characterRoster = (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.buildCharacterRoster)();

            // Call LLM for analysis with character context
            const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.callLLMAnalysis)(messagesToAnalyze, characterRoster);

            debug.log();

            // Process the analysis
            if (analysis.characters && Array.isArray(analysis.characters)) {
                await processAnalysisResults(analysis.characters);

                if (showProgress) {
                    notifications.success(`Found ${analysis.characters.length} character(s) in messages`);
                }
            } else {
                debug.log();
            }

        } catch (error) {
            console.error('Error during harvest:', error);
            notifications.error(`Analysis failed: ${error.message}`);
        }
    });
}

/**
 * Handle new message event
 * @param {number} messageId - ID of the new message
 * @returns {Promise<void>}
 */
async function onMessageReceived(messageId) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('onMessageReceived', async () => {
        if (!(0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('enabled', true) || !(0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('autoAnalyze', true)) {
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
        const lastScannedId = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('lastScannedMessageId', -1);
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
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('lastScannedMessageId', shouldRescan.fromMessage - 1);

                // Queue a full scan from the specified message
                addToQueue(async () => {
                    await harvestMessages(currentMessageIndex - shouldRescan.fromMessage + 1, true);
                });

                return;
            } else {
                // Reset to current position without scanning
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('lastScannedMessageId', currentMessageIndex);
                return;
            }
        }

        // Check if we've reached the next scan milestone
        const messageFreq = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)('messageFrequency', 10);
        const messagesSinceLastScan = currentMessageIndex - lastScannedId;

        if (messagesSinceLastScan >= messageFreq) {
            debug.log();

            // Queue harvest
            addToQueue(async () => {
                await harvestMessages(messageFreq, true);
                // Update last scanned message ID after successful harvest
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('lastScannedMessageId', currentMessageIndex);
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
 * Show progress bar for batch scanning
 * @param {number} current - Current batch number (1-indexed)
 * @param {number} total - Total number of batches
 * @param {string} status - Status message
 */
function showProgressBar(current, total, status = '') {
    const progressBarId = 'name_tracker_progress';
    const $existing = $(`.${progressBarId}`);

    if ($existing.length > 0) {
        // Update existing progress bar
        if (status) $existing.find('.title').text(status);
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
            <div class="title" style="flex: 1; font-weight: bold;">${status || 'Name Tracker Scan'}</div>
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('scanEntireChat', async () => {
        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();

        if (!context.chat || context.chat.length === 0) {
            notifications.warning('No chat messages to scan');
            return;
        }

        // Check API connection for SillyTavern mode
        const llmConfig = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getLLMConfig)();
        if (llmConfig.source === 'sillytavern') {
            if (!context.onlineStatus) {
                notifications.warning('Please connect to an API (OpenAI, Claude, etc.) before analyzing messages');
                return;
            }
        }

        const totalMessages = context.chat.length;

        // Calculate optimal batch size based on context window
        const maxPromptTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.getMaxPromptLength)();
        const availableTokens = maxPromptTokens - 1000;

        // Build batches dynamically based on token counts
        const batches = [];
        let currentBatch = [];
        let currentTokens = 0;

        for (let i = 0; i < totalMessages; i++) {
            const msg = context.chat[i];
            const msgTokens = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.calculateMessageTokens)([msg]);

            if (currentTokens + msgTokens > availableTokens && currentBatch.length > 0) {
                // Current batch is full, save it and start new one
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

        const numBatches = batches.length;

        const confirmed = confirm(`This will analyze all ${totalMessages} messages in ${numBatches} batches. This may take a while. Continue?`);

        if (!confirmed) {
            return;
        }

        // Reset abort flag
        abortScan = false;

        // Show progress bar
        showProgressBar(0, numBatches, 'Starting batch scan...');

        let successfulBatches = 0;
        let failedBatches = 0;
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
                const characterRoster = (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.buildCharacterRoster)();

                // Call LLM for analysis with character context
                const analysis = await (0,_llm_js__WEBPACK_IMPORTED_MODULE_5__.callLLMAnalysis)(batchMessages, characterRoster);

                // Process the analysis
                if (analysis.characters && Array.isArray(analysis.characters)) {
                    await processAnalysisResults(analysis.characters);
                    // Track unique characters
                    analysis.characters.forEach(char => uniqueCharacters.add(char.name));
                }

                successfulBatches++;

                // Small delay between batches
                if (i < numBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`Error processing batch ${i + 1}:`, error);
                failedBatches++;

                // Auto-retry logic could be added here
                const continueOnError = confirm(`Batch ${i + 1} failed.

Error: ${error.message}

Continue with remaining batches?`);
                if (!continueOnError) {
                    break;
                }
            }
        }

        // Hide progress bar
        hideProgressBar();

        // Update scan completion status
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('lastScannedMessageId', totalMessages - 1);

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('addToQueue', async () => {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('processQueue', async () => {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('onChatChanged', async () => {
        debug.log();

        // Clear processing state
        processingQueue = [];
        isProcessing = false;
        abortScan = false;

        // Reset scan state
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('lastScannedMessageId', -1);
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.set_settings)('messageCounter', 0);

        debug.log();
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


/***/ },

/***/ "./src/modules/ui.js"
/*!***************************!*\
  !*** ./src/modules/ui.js ***!
  \***************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMenuButton: () => (/* binding */ addMenuButton),
/* harmony export */   bindSettingsHandlers: () => (/* binding */ bindSettingsHandlers),
/* harmony export */   initializeMenuButtons: () => (/* binding */ initializeMenuButtons),
/* harmony export */   initializeUIHandlers: () => (/* binding */ initializeUIHandlers),
/* harmony export */   loadSettingsHTML: () => (/* binding */ loadSettingsHTML),
/* harmony export */   openChatLorebook: () => (/* binding */ openChatLorebook),
/* harmony export */   showCharacterListModal: () => (/* binding */ showCharacterListModal),
/* harmony export */   showCreateCharacterModal: () => (/* binding */ showCreateCharacterModal),
/* harmony export */   showMergeDialog: () => (/* binding */ showMergeDialog),
/* harmony export */   showPurgeConfirmation: () => (/* binding */ showPurgeConfirmation),
/* harmony export */   showSystemPromptEditor: () => (/* binding */ showSystemPromptEditor),
/* harmony export */   toggleAutoHarvest: () => (/* binding */ toggleAutoHarvest),
/* harmony export */   updateCharacterList: () => (/* binding */ updateCharacterList),
/* harmony export */   updateStatusDisplay: () => (/* binding */ updateStatusDisplay),
/* harmony export */   updateUI: () => (/* binding */ updateUI)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/context.js */ "./src/core/context.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/helpers.js */ "./src/utils/helpers.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/notifications.js */ "./src/utils/notifications.js");
/* harmony import */ var _characters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./characters.js */ "./src/modules/characters.js");
/* harmony import */ var _llm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./llm.js */ "./src/modules/llm.js");
/* harmony import */ var _processing_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./processing.js */ "./src/modules/processing.js");
/* harmony import */ var _lorebook_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lorebook.js */ "./src/modules/lorebook.js");
/**
 * UI Management Module
 *
 * Handles user interface components, settings panel management, character lists,
 * modal dialogs, and progress indicators for the Name Tracker extension.
 */












const debug = (0,_core_debug_js__WEBPACK_IMPORTED_MODULE_0__.createModuleLogger)('ui');
const notifications = new _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__.NotificationManager('UI Management');

/**
 * Update character list display in settings
 * @returns {void}
 */
function updateCharacterList() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('updateCharacterList', () => {
        const $container = $('#name_tracker_character_list');
        if ($container.length === 0) {
            debug.log();
            return;
        }

        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();
        const characterNames = Object.keys(characters);

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
            const reviewBadge = (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.hasUnresolvedRelationships)(character) ? '<span class="char-review-badge">NEEDS REVIEW</span>' : '';

            const aliasText = character.aliases && character.aliases.length > 0
                ? `<div class="char-aliases">Aliases: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.aliases.join(', '))}</div>`
                : '';

            const relationshipText = character.relationships && character.relationships.length > 0
                ? `<div class="char-relationships">Relationships: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.relationships.join('; '))}</div>`
                : '';

            const lastUpdated = character.lastUpdated
                ? new Date(character.lastUpdated).toLocaleString()
                : 'Never';

            html += `
                <div class="name_tracker_character_item" data-character="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}">
                    <div class="char-header">
                        <span class="char-name">
                            ${charIcon}
                            ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}
                            ${ignoreIcon}
                            ${reviewBadge}
                        </span>
                        <div class="char-actions">
                            <button class="char-action-btn char-action-edit" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}" title="Edit lorebook entry">
                                <i class="fa-solid fa-edit"></i>
                            </button>
                            <button class="char-action-btn char-action-view" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}" title="View in lorebook">
                                <i class="fa-solid fa-book"></i>
                            </button>
                            <button class="char-action-btn char-action-merge" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}" title="Merge with another character">
                                <i class="fa-solid fa-code-merge"></i>
                            </button>
                            <button class="char-action-btn char-action-ignore" data-name="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.preferredName)}" title="${character.ignored ? 'Unignore' : 'Ignore'} character">
                                <i class="fa-solid ${character.ignored ? 'fa-eye' : 'fa-eye-slash'}"></i>
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('updateStatusDisplay', () => {
        const $statusContainer = $('#name_tracker_status_display');
        if ($statusContainer.length === 0) {
            return;
        }

        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();
        const characterCount = Object.keys(characters).length;
        const messageCounter = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('messageCounter', 0);
        const lastScannedId = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lastScannedMessageId', -1);
        const messageFreq = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('messageFrequency', 10);

        const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.getContext();
        const currentMessageId = context?.chat?.length || 0;
        const pendingMessages = Math.max(0, currentMessageId - lastScannedId);
        const progressText = messageCounter > 0 ? ` (${messageCounter} analyzed)` : '';
        const currentChatLength = context.chat ? context.chat.length : 0;
        const messagesToNextScan = Math.max(0, messageFreq - (currentChatLength - lastScannedId));

        const statusHtml = `
            <div class="name_tracker_status">
                <div class="status-item">
                    <strong>Characters tracked:</strong> ${characterCount}${progressText}
                </div>
                <div class="status-item">
                    <strong>Messages in chat:</strong> ${currentChatLength}
                </div>
                <div class="status-item">
                    <strong>Last scanned message:</strong> ${lastScannedId >= 0 ? lastScannedId + 1 : 'None'}
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showMergeDialog', async () => {
        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();

        // Create list of other characters
        const otherChars = Object.keys(characters).filter(name => name !== sourceName);

        if (otherChars.length === 0) {
            notifications.warning('No other characters to merge with');
            return;
        }

        // Simple prompt for target character
        const targetName = prompt(`Merge "${sourceName}" into which character? Available: ${otherChars.join(', ')}`);
        if (targetName && characters[targetName]) {
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.mergeCharacters)(sourceName, targetName);
            updateCharacterList();
            updateStatusDisplay();
        } else if (targetName) {
            notifications.error('Invalid target character name');
        }
    });
}

/**
 * Show character creation modal
 * @returns {Promise<void>}
 */
async function showCreateCharacterModal() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showCreateCharacterModal', async () => {
        const characterName = prompt('Enter character name:');

        if (!characterName || !characterName.trim()) {
            return;
        }

        try {
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.createNewCharacter)(characterName.trim());
            updateCharacterList();
            updateStatusDisplay();
        } catch (error) {
            notifications.error(error.message);
        }
    });
}

/**
 * Show purge confirmation dialog
 * @returns {Promise<void>}
 */
async function showPurgeConfirmation() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showPurgeConfirmation', async () => {
        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();
        const characterCount = Object.keys(characters).length;

        if (characterCount === 0) {
            notifications.info('No characters to purge');
            return;
        }

        const confirmed = confirm(`This will delete all ${characterCount} tracked characters and their lorebook entries.\\n\\nThis action cannot be undone!\\n\\nContinue?`);

        if (confirmed) {
            try {
                const deletedCount = await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.purgeAllCharacters)();
                updateCharacterList();
                updateStatusDisplay();
                notifications.success(`Purged ${deletedCount} characters`);
            } catch (error) {
                notifications.error(`Failed to purge characters: ${error.message}`);
            }
        }
    });
}

/**
 * Show system prompt editor modal
 * @returns {Promise<void>}
 */
async function showSystemPromptEditor() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showSystemPromptEditor', async () => {
        const currentPrompt = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('systemPrompt') || '';

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
                          placeholder="Enter custom system prompt or leave blank for default...">${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(currentPrompt)}</textarea>
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

        modal.find('#system_prompt_save').on('click', () => {
            const newPrompt = modal.find('#system_prompt_editor').val().trim();
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('systemPrompt', newPrompt || null);
            notifications.success('System prompt updated');
            removeModal();
        });

        modal.find('#system_prompt_reset').on('click', () => {
            modal.find('#system_prompt_editor').val('');
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('systemPrompt', null);
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
function showCharacterListModal() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showCharacterListModal', () => {
        const characters = Object.values((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)() || {});

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
                if ((0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.hasUnresolvedRelationships)(char)) badges.push('<span style="background: var(--crimsonDark); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; margin-left: 5px;">NEEDS REVIEW</span>');

                const aliasText = char.aliases && char.aliases.length > 0
                    ? `<div style="font-size: 0.9em; color: var(--SmartThemeQuoteColor); margin-top: 3px;">Aliases: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(char.aliases.join(', '))}</div>`
                    : '';

                charactersHtml += `
                    <div style="padding: 10px; margin: 5px 0; background: var(--SmartThemeBlurTintColor); border: 1px solid var(--SmartThemeBorderColor); border-radius: 5px;">
                        <div style="font-weight: bold;">
                            ${char.isMainChar ? '<i class="fa-solid fa-user" style="margin-right: 5px;"></i>' : ''}
                            ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(char.preferredName)}
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('initializeUIHandlers', () => {
        // Character action handlers
        $(document).on('click', '.char-action-merge', async function() {
            const sourceName = $(this).data('name');
            await showMergeDialog(sourceName);
        });

        $(document).on('click', '.char-action-ignore', async function() {
            const name = $(this).data('name');
            await (0,_characters_js__WEBPACK_IMPORTED_MODULE_6__.toggleIgnoreCharacter)(name);
            updateCharacterList();
            updateStatusDisplay();
        });

        $(document).on('click', '.char-action-view', async function() {
            const name = $(this).data('name');
            await (0,_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.viewInLorebook)(name);
        });

        $(document).on('click', '.char-action-edit', async function() {
            const name = $(this).data('name');
            await showEditLorebookModal(name);
        });

        debug.log();
    });
}

/**
 * Show edit lorebook entry modal
 * @param {string} characterName - Name of character to edit
 * @returns {Promise<void>}
 */
async function showEditLorebookModal(characterName) {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showEditLorebookModal', async () => {
        const character = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacter)(characterName);

        if (!character) {
            notifications.error('Character not found');
            return;
        }

        // Build edit dialog
        const currentKeys = [characterName, ...(character.aliases || [])].join(', ');

        const dialogHtml = `
            <div class="lorebook-entry-editor">
                <h3>Edit Lorebook Entry: ${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(characterName)}</h3>
                
                <div class="editor-section">
                    <label for="entry-keys">Keys (comma-separated):</label>
                    <input type="text" id="entry-keys" class="text_pole" value="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(currentKeys)}" 
                           placeholder="${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(characterName)}, aliases, nicknames">
                    <small>These words trigger this entry in the chat context</small>
                </div>
                
                <div class="editor-section">
                    <label for="entry-content">Entry Content:</label>
                    <textarea id="entry-content" rows="10" class="text_pole" 
                              placeholder="Description, personality, background, relationships...">${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)(character.notes || '')}</textarea>
                    <small>This will be injected into context when keys are mentioned</small>
                </div>
                
                <div class="editor-section">
                    <label for="entry-relationships">Relationships:</label>
                    <textarea id="entry-relationships" rows="3" class="text_pole" 
                              placeholder="Friend of Alice; Enemy of Bob; Works for XYZ Corp">${(0,_utils_helpers_js__WEBPACK_IMPORTED_MODULE_4__.escapeHtml)((character.relationships || []).join('; '))}</textarea>
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
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.removeCharacter)(characterName);
            }
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setCharacter)(preferredName, character);

            updateCharacterList();
            updateStatusDisplay();

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('addMenuButton', () => {
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
 * @returns {void}
 */
function toggleAutoHarvest() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('toggleAutoHarvest', () => {
        const currentValue = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('autoAnalyze', true);
        (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('autoAnalyze', !currentValue);

        // Update the settings UI
        $('#name_tracker_auto_analyze').prop('checked', !currentValue);

        // Update menu button icon to reflect state
        const $menuButton = $('#extensionsMenu .name-tracker-toggle-harvest');
        if (!currentValue) {
            $menuButton.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        } else {
            $menuButton.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        }

        updateStatusDisplay();

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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('openChatLorebook', async () => {
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('initializeMenuButtons', () => {
        // Add toggle auto-harvest button with visual state
        const autoAnalyze = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('autoAnalyze', true);
        const toggleIcon = autoAnalyze ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off';
        addMenuButton(
            'Toggle Auto-Harvest',
            toggleIcon,
            toggleAutoHarvest,
            'Toggle automatic character harvesting on/off',
            'name-tracker-toggle-harvest',
        );

        // Add character list button
        addMenuButton(
            'View Characters',
            'fa-solid fa-users',
            showCharacterListModal,
            'View all tracked characters',
        );

        // Add open lorebook button
        addMenuButton(
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('bindSettingsHandlers', () => {
        // Main settings handlers
        $('#name_tracker_enabled').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('enabled', event.target.checked);
            updateStatusDisplay();
        });

        $('#name_tracker_auto_analyze').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('autoAnalyze', event.target.checked);
            updateStatusDisplay();
        });

        $('#name_tracker_message_frequency').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('messageFrequency', parseInt(event.target.value) || 10);
            updateStatusDisplay();
        });

        $('#name_tracker_llm_source').on('change', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('llmSource', event.target.value);
        });

        $('#name_tracker_ollama_endpoint').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('ollamaEndpoint', event.target.value);
        });

        $('#name_tracker_ollama_model').on('change', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('ollamaModel', event.target.value);
        });

        $('#name_tracker_load_models').on('click', async () => {
            try {
                await (0,_llm_js__WEBPACK_IMPORTED_MODULE_7__.loadOllamaModels)();
                notifications.success('Ollama models loaded');
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                debug.log();
                notifications.error('Failed to load Ollama models');
            }
        });

        $('#name_tracker_confidence_threshold').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('confidenceThreshold', parseInt(event.target.value) || 70);
        });

        // Lorebook settings handlers
        $('#name_tracker_lorebook_position').on('change', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('lorebookPosition', parseInt(event.target.value) || 0);
        });

        $('#name_tracker_lorebook_depth').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('lorebookDepth', parseInt(event.target.value) || 1);
        });

        $('#name_tracker_lorebook_cooldown').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('lorebookCooldown', parseInt(event.target.value) || 5);
        });

        $('#name_tracker_lorebook_probability').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('lorebookProbability', parseInt(event.target.value) || 100);
        });

        $('#name_tracker_lorebook_enabled').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('lorebookEnabled', event.target.checked);
        });

        $('#name_tracker_debug_mode').on('input', (event) => {
            (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.setSetting)('debugMode', event.target.checked);
        });

        // Action button handlers
        $('#name_tracker_manual_analyze').on('click', async () => {
            const messageFreq = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('messageFrequency', 10);
            await (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__.harvestMessages)(messageFreq, true);
            updateCharacterList();
            updateStatusDisplay();
        });

        $('#name_tracker_scan_all').on('click', async () => {
            await (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__.scanEntireChat)();
            updateCharacterList();
            updateStatusDisplay();
        });

        $('#name_tracker_create_character').on('click', () => {
            showCreateCharacterModal();
        });

        $('#name_tracker_clear_cache').on('click', () => {
            (0,_processing_js__WEBPACK_IMPORTED_MODULE_8__.clearProcessingQueue)();
            notifications.info('Cache and processing queue cleared');
        });

        $('#name_tracker_undo_merge').on('click', async () => {
            const { undoLastMerge } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./characters.js */ "./src/modules/characters.js"));
            const success = await undoLastMerge();
            if (success) {
                updateCharacterList();
                updateStatusDisplay();
            }
        });

        $('#name_tracker_purge_entries').on('click', () => {
            showPurgeConfirmation();
        });

        $('#name_tracker_edit_prompt').on('click', () => {
            showSystemPromptEditor();
        });

        $('#name_tracker_debug_status').on('click', () => {
            showDebugStatus();
        });

        $('#name_tracker_dump_context').on('click', () => {
            dumpContextToConsole();
        });

        debug.log();
    });
}

/**
 * Show debug status popup with all relevant variables
 * @returns {void}
 */
function showDebugStatus() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('showDebugStatus', async () => {
        const settings = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.get_settings)();
        const characters = (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getCharacters)();

        // Reusable builder: compute debug info + HTML
        const buildDebugContent = async () => {
            // Get LLM context info
            let llmConfig = {};
            let maxPromptTokens = 4096;
            let contextDetails = {};

            try {
                const { getLLMConfig, getMaxPromptLength } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./llm.js */ "./src/modules/llm.js"));
                const { stContext } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../core/context.js */ "./src/core/context.js"));

                // Force a fresh SillyTavern context read (bypass 1s cache)
                stContext.clearCache();

                llmConfig = getLLMConfig();
                maxPromptTokens = await getMaxPromptLength();

                // Get raw context info (retry briefly if not yet ready)
                let context = stContext.getContext();
                if (!context || typeof context.maxContext === 'undefined') {
                    for (let i = 0; i < 3; i++) {
                        await new Promise(r => setTimeout(r, 200));
                        stContext.clearCache();
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
                debug.log('Could not load LLM config:', _error);
                contextDetails = {
                    totalContext: 'Error loading',
                    maxGeneration: 'Error',
                    maxGenerationNote: 'Check console for details',
                    modelName: 'unknown',
                };
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
            const maxGenTokens = typeof contextDetails.maxGeneration === 'number' ? contextDetails.maxGeneration : 2048;
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
                htmlContent += `<strong style=\"color: #90EE90; font-size: 13px;\">${section}</strong><br>`;
                for (const [key, value] of Object.entries(values)) {
                    const displayValue = value === true ? '✓' : (value === false ? '✗' : value);
                    htmlContent += `<div style=\"margin-left: 10px; padding: 2px 0;\">\n                        <span style=\"color: #87CEEB;\">${key}:</span> \n                        <span style=\"color: #FFFF99;\">${displayValue}</span>\n                    </div>`;
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
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('loadSettingsHTML', async () => {
        try {
            // Load the settings HTML
            const settingsHtml = await $.get(`${extensionFolderPath}/settings.html`);

            // Append to the extensions settings panel
            $('#extensions_settings').append(settingsHtml);

            debug.log();
        } catch (error) {
            console.error('Failed to load settings HTML:', error);
            throw new _core_errors_js__WEBPACK_IMPORTED_MODULE_1__.NameTrackerError(`Failed to load settings HTML: ${error.message}`);
        }
    });
}

/**
 * Dump entire SillyTavern context to console for debugging
 * Shows all properties, values, and structure in readable format
 * @returns {void}
 */
function dumpContextToConsole() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('dumpContextToConsole', () => {
        try {
            const dump = _core_context_js__WEBPACK_IMPORTED_MODULE_3__.stContext.dumpContextToConsole();
            notifications.success('Context dumped to console - Press F12 to view', 'Context Dump');
            
            // Also show a brief summary in a dialog
            const summary = {
                'Total Properties': dump.availableProperties.length,
                'Key Properties Found': Object.keys(dump.detailedBreakdown).filter(k => k in dump.detailedBreakdown).length,
                'Timestamp': dump.timestamp
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
 * @returns {void}
 */
function updateUI() {
    return (0,_core_errors_js__WEBPACK_IMPORTED_MODULE_1__.withErrorBoundary)('updateUI', () => {
        // Update all form elements with current settings
        $('#name_tracker_enabled').prop('checked', (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('enabled', true));
        $('#name_tracker_auto_analyze').prop('checked', (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('autoAnalyze', true));
        $('#name_tracker_message_frequency').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('messageFrequency', 10));
        $('#name_tracker_llm_source').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('llmSource', 'sillytavern'));
        $('#name_tracker_ollama_endpoint').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('ollamaEndpoint', 'http://localhost:11434'));
        $('#name_tracker_ollama_model').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('ollamaModel', ''));
        $('#name_tracker_confidence_threshold').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('confidenceThreshold', 70));
        $('#name_tracker_lorebook_position').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lorebookPosition', 0));
        $('#name_tracker_lorebook_depth').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lorebookDepth', 1));
        $('#name_tracker_lorebook_cooldown').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lorebookCooldown', 5));
        $('#name_tracker_lorebook_probability').val((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lorebookProbability', 100));
        $('#name_tracker_lorebook_enabled').prop('checked', (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('lorebookEnabled', true));
        $('#name_tracker_debug_mode').prop('checked', (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_2__.getSetting)('debugMode', false));

        // Update character list and status
        updateCharacterList();
        updateStatusDisplay();

        debug.log();
    });
}


/***/ },

/***/ "./src/utils/helpers.js"
/*!******************************!*\
  !*** ./src/utils/helpers.js ***!
  \******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateSimilarity: () => (/* binding */ calculateSimilarity),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   deepClone: () => (/* binding */ deepClone),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   formatTimestamp: () => (/* binding */ formatTimestamp),
/* harmony export */   generateUID: () => (/* binding */ generateUID),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   normalizeName: () => (/* binding */ normalizeName),
/* harmony export */   simpleHash: () => (/* binding */ simpleHash),
/* harmony export */   throttle: () => (/* binding */ throttle),
/* harmony export */   truncate: () => (/* binding */ truncate)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/**
 * Utility functions for Name Tracker extension
 * Common helpers and shared functionality
 */



const logger = _core_debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].createModuleLogger('Utils');

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
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

/***/ "./src/utils/notifications.js"
/*!************************************!*\
  !*** ./src/utils/notifications.js ***!
  \************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationManager: () => (/* binding */ NotificationManager),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/debug.js */ "./src/core/debug.js");
/**
 * Notification utilities for Name Tracker extension
 * Centralizes toastr notifications with consistent styling
 */



const logger = _core_debug_js__WEBPACK_IMPORTED_MODULE_0__["default"].createModuleLogger('Notifications');

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

/***/ "./style.css"
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../style.css */ "./style.css");
/* harmony import */ var _core_debug_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/debug.js */ "./src/core/debug.js");
/* harmony import */ var _core_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/errors.js */ "./src/core/errors.js");
/* harmony import */ var _core_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/context.js */ "./src/core/context.js");
/* harmony import */ var _core_settings_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/settings.js */ "./src/core/settings.js");
/* harmony import */ var _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/notifications.js */ "./src/utils/notifications.js");
/* harmony import */ var _utils_helpers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/helpers.js */ "./src/utils/helpers.js");
/* harmony import */ var _modules_characters_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/characters.js */ "./src/modules/characters.js");
/* harmony import */ var _modules_llm_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/llm.js */ "./src/modules/llm.js");
/* harmony import */ var _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/lorebook.js */ "./src/modules/lorebook.js");
/* harmony import */ var _modules_processing_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/processing.js */ "./src/modules/processing.js");
/* harmony import */ var _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/ui.js */ "./src/modules/ui.js");
/**
 * Name Tracker Extension for SillyTavern - Modular Version
 * Main entry point and orchestration
 */

// Import CSS


// Core infrastructure





// Utilities



// Feature modules






// Immediate import validation
console.log('[STnametracker] Main index.js: Import validation');
console.log('[STnametracker] Main index.js: initializeLorebook import =', typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook, _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);
console.log('[STnametracker] Main index.js: initializeUIHandlers import =', typeof _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeUIHandlers, _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeUIHandlers);
console.log('[STnametracker] Main index.js: initializeMenuButtons import =', typeof _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeMenuButtons, _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeMenuButtons);
console.log('[STnametracker] Main index.js: bindSettingsHandlers import =', typeof _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.bindSettingsHandlers, _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.bindSettingsHandlers);
console.log('[STnametracker] Main index.js: updateUI import =', typeof _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.updateUI, _modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.updateUI);

if (typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook !== 'function') {
    console.error('[STnametracker] Main index.js: CRITICAL ERROR - initializeLorebook import failed!');
    console.error('[STnametracker] Main index.js: Expected function, got:', typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook, _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);
}

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
const logger = _core_debug_js__WEBPACK_IMPORTED_MODULE_1__["default"].createModuleLogger('Main');

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
        return _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.withErrorBoundary('Main', async () => {
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
                _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__["default"].error('Failed to initialize', 'Extension Error');
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
        _core_debug_js__WEBPACK_IMPORTED_MODULE_1__["default"].isDebugEnabled = () => (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_4__.getSetting)('debugMode', false);
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
        console.log('[STnametracker] initializeModules: Starting module initialization');

        // Add extensive debugging for imports
        console.log('[STnametracker] initializeModules: Checking import of initializeLorebook...');
        console.log('[STnametracker] initializeModules: initializeLorebook =', typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook, _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);

        if (typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook !== 'function') {
            console.error('[STnametracker] initializeModules: CRITICAL - initializeLorebook is not a function!');
            console.error('[STnametracker] initializeModules: Type:', typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);
            console.error('[STnametracker] initializeModules: Value:', _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);
            throw new Error('initializeLorebook is not a function: ' + typeof _modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook);
        }

        try {
            // Initialize lorebook for current chat
            console.log('[STnametracker] initializeModules: About to call initializeLorebook()...');
            await (0,_modules_lorebook_js__WEBPACK_IMPORTED_MODULE_9__.initializeLorebook)();
            console.log('[STnametracker] initializeModules: initializeLorebook() completed successfully');

            logger.debug('Feature modules initialized');
        } catch (error) {
            console.error('[STnametracker] initializeModules: Error in initializeLorebook:', error);
            logger.error('Failed to initialize feature modules:', error);
            throw error;
        }
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
            (0,_modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeUIHandlers)();
            console.log('[STnametracker] initializeUI: UI handlers initialized');

            console.log('[STnametracker] initializeUI: Initializing menu buttons...');
            (0,_modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.initializeMenuButtons)();
            console.log('[STnametracker] initializeUI: Menu buttons initialized');

            // Bind settings form handlers
            console.log('[STnametracker] initializeUI: Binding settings handlers...');
            (0,_modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.bindSettingsHandlers)();
            console.log('[STnametracker] initializeUI: Settings handlers bound');

            // Update UI to reflect current settings
            console.log('[STnametracker] initializeUI: Updating UI...');
            (0,_modules_ui_js__WEBPACK_IMPORTED_MODULE_11__.updateUI)();
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
            const context = _core_context_js__WEBPACK_IMPORTED_MODULE_3__["default"].getContext();
            const eventSource = context.eventSource;
            const event_types = context.event_types;

            if (!eventSource || !event_types) {
                logger.warn('SillyTavern event system not available');
                return;
            }

            // Register for SillyTavern events
            eventSource.on(event_types.MESSAGE_RECEIVED, async (messageId) => {
                logger.debug('Message received event:', messageId);
                await (0,_modules_processing_js__WEBPACK_IMPORTED_MODULE_10__.onMessageReceived)(messageId);
            });

            eventSource.on(event_types.MESSAGE_SENT, async (messageId) => {
                logger.debug('Message sent event:', messageId);
                await (0,_modules_processing_js__WEBPACK_IMPORTED_MODULE_10__.onMessageReceived)(messageId);
            });

            eventSource.on(event_types.CHAT_CHANGED, async () => {
                logger.debug('Chat changed event received');
                // Reset chat-level data when chat changes
                (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_4__.setChatData)({ characters: {}, lastScannedMessageId: -1 });
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
        _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.registerRecoveryStrategy('NETWORK_ERROR', async (error) => {
            logger.warn('Attempting network error recovery');
            await _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.delay(2000);
            _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__["default"].info('Retrying network operation...');
            return null; // Signal to retry original operation
        });

        // Data format error recovery
        _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.registerRecoveryStrategy('DATA_FORMAT_ERROR', async (error) => {
            logger.warn('Data format error, clearing cache');
            // TODO: Clear relevant caches when modules are implemented
            return null;
        });

        // Critical error handler
        _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.onCriticalError((error) => {
            logger.error('Critical error occurred:', error);
            // TODO: Save state for debugging when modules are implemented
        });
    }

    /**
     * Get extension status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            context: _core_context_js__WEBPACK_IMPORTED_MODULE_3__["default"].getStatus(),
            settings: { initialized: true, moduleCount: Object.keys((0,_core_settings_js__WEBPACK_IMPORTED_MODULE_4__.get_settings)()).length },
            debug: _core_debug_js__WEBPACK_IMPORTED_MODULE_1__["default"].getPerformanceSummary(),
            errors: _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.getRecentErrors(5).length,
        };
    }

    /**
     * Shutdown the extension
     * @returns {Promise<void>}
     */
    async shutdown() {
        return _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.withErrorBoundary('Main', async () => {
            logger.log('Shutting down Name Tracker Extension');

            // TODO: Cleanup modules
            // TODO: Remove event listeners
            // TODO: Save state

            this.initialized = false;
            _core_debug_js__WEBPACK_IMPORTED_MODULE_1__["default"].clear();

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
        console.log('[STnametracker] Extension settings initialized');

        console.log('[STnametracker] Starting main initialization...');
        await nameTrackerExtension.initialize();
        console.log('[STnametracker] Main initialization completed');

        // Make extension available globally for debugging
        window.nameTrackerExtension = nameTrackerExtension;

        // Add debug commands to browser console
        window.ntDebug = {
            status: () => nameTrackerExtension.getStatus(),
            errors: () => _core_errors_js__WEBPACK_IMPORTED_MODULE_2__.errorHandler.getRecentErrors(),
            settings: () => (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_4__.get_settings)(),
            chatData: () => (0,_core_settings_js__WEBPACK_IMPORTED_MODULE_4__.getChatData)(),
            clear: () => _core_debug_js__WEBPACK_IMPORTED_MODULE_1__["default"].clear(),
        };

        logger.log('Name Tracker Extension loaded successfully');
        console.log('[STnametracker] Extension loaded. Use ntDebug.status() for diagnostics.');

    } catch (error) {
        console.error('[STnametracker] Failed to initialize:', error);
        _utils_notifications_js__WEBPACK_IMPORTED_MODULE_5__["default"].error('Extension failed to load', 'Critical Error');
    }
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nameTrackerExtension);

})();

/******/ })()
;
//# sourceMappingURL=index.js.map