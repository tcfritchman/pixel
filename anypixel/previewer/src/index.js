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

var config = require('anypixel').config;
var renderer = require('./display/renderer');
var input = require('./input');
var DebugCanvas = require('./ui/debug-canvas');
var Button = require('./ui/button');
var CursorPointer = require('./input/cursor');
var CursorHand = require('./input/cursor-hand');

var displayDebugCanvas = false;
var enableColorCorrection = true;

document.addEventListener('DOMContentLoaded', function() {
	renderer.init();

	// Get the app canvas
	var canvas = document.getElementById(config.canvasId);

	// Set the renderer's display canvas as the input event source
	input.setEventSource(renderer.getOutput());

	// Create a DebugCanvas for the input to draw to
	var debug = new DebugCanvas();
	input.setDebugCanvas(debug);

	// Create UI buttons
	var btnCursorSelectPointer = new Button('cursor-pointer', true);
	var btnCursorSelectHand = new Button('cursor-hand', false);
	var btnToggleColorEmu = new Button('color-toggle', false);
	var btnToggleDebugVis = new Button('vis-toggle', true);

	// Listener for pointer cursor selection button. Toggle state and set cursor to pointer
	btnCursorSelectPointer.el.addEventListener('click', function() {
		btnCursorSelectPointer.setSelected(true);
		btnCursorSelectHand.setSelected(false);
		input.setCursorObject(CursorPointer);
	});

	// Listener for hand cursor selection button. Toggle state and set cursor to hand
	btnCursorSelectHand.el.addEventListener('click', function() {
		btnCursorSelectPointer.setSelected(false);
		btnCursorSelectHand.setSelected(true);
		input.setCursorObject(CursorHand);
	});

	// Listener for event debug visiblity button. Toggle visibility of the event debug canavs
	btnToggleDebugVis.el.addEventListener('click', function() {
		displayDebugCanvas = !displayDebugCanvas;
		btnToggleDebugVis.setSelected(displayDebugCanvas);
	});

	// Listener for color correction toggle
	btnToggleColorEmu.el.addEventListener('click', function() {
		enableColorCorrection = !enableColorCorrection;
		btnToggleColorEmu.setSelected(enableColorCorrection);
	})

	// Update the renderer every frame
	function update(t) {
		renderer.render(
			canvas,
			displayDebugCanvas ? debug.getCanvas() : undefined,
			enableColorCorrection
		);
		window.requestAnimationFrame(update);
	}

	window.requestAnimationFrame(update);

}, false);
