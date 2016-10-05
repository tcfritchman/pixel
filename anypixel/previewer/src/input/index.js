/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

'use strict';
var mouse = require('./mouse');
var touch = require('./touch');
var Cursor = require('./cursor');
var stateMap = require('./stateMap');
var dispatch = require('./dispatch');
var diff = require('../util/diff');

/**
 * Provides an abstraction of mouse and touch events for simulating button presses with custom
 * cursors. Cursors are tracked by id, allowing for both software-simulated and hardware multitouch 
 */
var input = exports = module.exports = {};

var cursors = {};
var eventSource = null;
var debugCanvas;

// The default cursor is a single point
var cursorObject = Cursor;

/**
 * Adds input event callbacks on a given DOM element.
 */
input.setEventSource = function setEventSource(domEventSource) {
	eventSource = domEventSource;

	// Set mouse callbacks 
	mouse.setEventSource(eventSource);
	mouse.onMouseDown(onInputStart);
	mouse.onMouseMove(onInputMove);
	mouse.onMouseUp(onInputEnd);

	// Set touch callbacks
	touch.setEventSource(eventSource);
	touch.onTouchStart(onInputStart);
	touch.onTouchMove(onInputMove);
	touch.onTouchEnd(onInputEnd);

	window.requestAnimationFrame(update);
}

/**
 * Sets the DebugCanvas to use for plotting button state changes
 */
input.setDebugCanvas = function setDebugCanvas(canvas) {
	debugCanvas = canvas;
}

/**
 * Sets the cursor object to be used for all new inputs
 */
input.setCursorObject = function setCursorObject(cursorObj) {
	cursorObject = cursorObj;
}

/**
 * Callback for starting a new input cursor. Creates a new cursor and adds it to the list.
 */
function onInputStart(inputId, position) {
	var newCursor = new cursorObject(inputId);
	cursors[inputId] = newCursor;
	newCursor.onInputStart(position);
}

/**
 * Callback for moving an existing input cursor
 */
function onInputMove(inputId, previousPos, currentPos) {
	var currentCursor = cursors[inputId];
	if (currentCursor) {
		currentCursor.onInputMove(previousPos, currentPos);
	}
}

/**
 * Callback for ending an existing input cursor. Removes the cursor from the list.
 */
function onInputEnd(inputId, position) {
	var oldCursor = cursors[inputId];
	oldCursor.onInputEnd(position);
	delete cursors[inputId];
}

/**
 * Compares the current frame's button states with the previous frame's. Any changes are converted
 * to buttonState events 
 */
function update(t) {
	if (stateMap.hasChanged()) {
		var diffPoints = diff(stateMap.getLastStates(), stateMap.getCurrentStates());

		// New points added trigger down events
		diffPoints.added.forEach(function(key) {
			var position = stateMap.keyToPosition(key);
			dispatch(position, true);
			tryDebugPlot(position, true);
		});

		// Old points removed trigger up events
		diffPoints.removed.forEach(function(key) {
			var position = stateMap.keyToPosition(key);
			dispatch(position, false);
			tryDebugPlot(position, false);
		});
	}

	// Set the current state to the previous state
	stateMap.save();

	window.requestAnimationFrame(update);
}

/**
 * Attempt to plot a point on the debugCanvas, if there is one
 */
function tryDebugPlot(position, state) {
	if (debugCanvas) {
		debugCanvas.plot(position, state);
	}
}