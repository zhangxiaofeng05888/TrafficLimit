'use strict';

/**
 * @ngdoc directive
 * @name ngWindowManager.directive:wmwindow
 * @description
 * # wmWindow
 */

angular.module('ngWindowManager', []).directive('wmwindow', ['$timeout', function ($timeout) {
    return {
        template: '<div class="wmWindow">' +
            '<div class="wmWindowOverlay"></div>' +
            '<div class="wmWindowBox">' +
            '<div class="wmTitleBar">' +
            '<div class="wmTitle">{{title}}</div>' +
            '<div class="wmButtonBar">' +
            '<button class="wmMinimize" ng-show="!!minimizable && state !== 1">' +
            '<button class="wmRestore" ng-show="state !== 0">' +
            '<button class="wmMaximize" ng-show="!!maximizable && state !== 2">' +
            '<button class="wmClose" ng-show="!!closable"/>' +
            '</div>' +
            '</div>' +
            '<div class="wmContent" ng-transclude></div>' +
            '<button class="wmResize" ng-show="state === 0"/>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            options: '@',
            onOpen: '&',
            onSelect: '&',
            onResizing: '&',
            onMinimized: '&',
            onMaximized: '&',
            onRestored: '&',
            onClosed: '&'
        },
        link: function (scope, element) {
            var parentWindow = element[0].parentElement;
            var overlay = element[0].children[0];
            var windowBox = angular.element(element[0].children[1]);

            var titleBar = windowBox[0].children[0];
            var buttonBar = titleBar.children[1];
            var content = windowBox[0].children[1];
            var resizeButton = windowBox[0].children[2];

            var minimizeButton = buttonBar.children[0];
            var restoreButton = buttonBar.children[1];
            var maximizeButton = buttonBar.children[2];
            var closeButton = buttonBar.children[3];

            // State variables
            var positionState = null;
            var sizeState = null;
            var windowState = null;

            var winHandler = {};
            winHandler.elem = element;

            // Parse the options
            var options = scope.options ? JSON.parse(scope.options) : {};

            // If it's defined a container zone we will use it to bind
            // all the listeners, that way we can fit windows under an element but move in other
            var container = options.container === undefined ? parentWindow : document.getElementById(options.container);
            var viewport;
            if (options.viewport !== 'window') {
                var elem = document.getElementById(options.viewport) || document.getElementsByTagName(options.viewport);
                viewport = options.viewport ? elem : container;
            } else {
                viewport = window;
            }

            // Set some tricky controls to handle the layering
            parentWindow.topZ = parentWindow.topZ || options.initialZIndex || angular.element(parentWindow).css('z-index') || 99;
            if (parentWindow.topZ === 'auto') {
                parentWindow.topZ = 99;
            }

            // 是否显示最小化、最大化、关闭按钮
            scope.maximizable = !!options.maximizable;
            scope.minimizable = !!options.minimizable;
            scope.closable = !!options.closable;
            scope.state = 0; // 0:正常；1:最小化；2:最大化
            scope.modal = !!options.modal;

            // it just makes a postion calculation from the current positon reference passed
            var calculatePos = function (ref) {
                var winX = parseInt(windowBox.prop('offsetLeft'), 10);
                var winY = parseInt(windowBox.prop('offsetTop'), 10);

                return {
                    x: ref.x - winX,
                    y: ref.y - winY
                };
            };

            // it just makes a size calculation from the current positon reference passed
            var calculateSize = function (ref) {
                var winWidth = parseInt(windowBox.prop('offsetWidth'), 10);
                var winHeight = parseInt(windowBox.prop('offsetHeight'), 10);

                return {
                    width: winWidth - ref.width,
                    height: winHeight - ref.height
                };
            };

            // Execute when user moves the mouse after title is clicked
            var dragWindow = function (e) {
                var moveRef = (e.targetTouches && e.targetTouches.length === 1) ? e.targetTouches[0] : e;

                if (positionState) {
                    winHandler.move(
                        moveRef.pageX - positionState.x,
                        moveRef.pageY - positionState.y
                    );
                }

                e.preventDefault();
            };

            // The user ends moving window when mouseup or touchends
            var dragWindowEnds = function (e) {
                var isTouch = (e.targetTouches && e.targetTouches.length === 1);

                if (positionState) {
                    element.removeClass('moving');
                    positionState = null;
                }

                container.removeEventListener(isTouch ? 'touchmove' : 'mousemove', dragWindow);
                container.removeEventListener(isTouch ? 'touchend' : 'mouseup', dragWindowEnds);
                titleBar.removeEventListener('click', winHandler.selectWindow);

                e.preventDefault();
            };

            // Execute when user moves the pointer after resize button is clicked
            var resizeWindow = function (e) {
                var moveRef = (e.targetTouches && e.targetTouches.length === 1) ? e.targetTouches[0] : e;

                if (sizeState) {
                    winHandler.resize(
                        moveRef.pageX + sizeState.width,
                        moveRef.pageY + sizeState.height
                    );
                }

                e.preventDefault();
            };

            // The user ends moving the resize button when mouseup or touchends
            var resizeWindowEnds = function (e) {
                var isTouch = (e.targetTouches && e.targetTouches.length === 1);

                if (sizeState) {
                    element.removeClass('resizing');
                    sizeState = null;
                }

                container.removeEventListener(isTouch ? 'touchmove' : 'mousemove', resizeWindow);
                container.removeEventListener(isTouch ? 'touchend' : 'mouseup', resizeWindowEnds);

                e.preventDefault();
            };

            // Executed when touches or clicks in the title bar
            var startMoving = function (e) {
                var isTouch = (e.targetTouches && e.targetTouches.length === 1);
                var moveRef = isTouch ? e.targetTouches[0] : e;

                positionState = calculatePos({
                    x: moveRef.pageX,
                    y: moveRef.pageY
                });

                element.addClass('moving');

                container.addEventListener(isTouch ? 'touchmove' : 'mousemove', dragWindow);
                container.addEventListener(isTouch ? 'touchend' : 'mouseup', dragWindowEnds);

                winHandler.selectWindow();

                e.preventDefault();
            };

            // Executed when touches or clicks in the resize button
            var startResizing = function (e) {
                var isTouch = (e.targetTouches && e.targetTouches.length === 1);
                var moveRef = isTouch ? e.targetTouches[0] : e;


                sizeState = calculateSize({
                    width: moveRef.pageX,
                    height: moveRef.pageY
                });

                element.addClass('resizing');

                container.addEventListener(isTouch ? 'touchmove' : 'mousemove', resizeWindow);
                container.addEventListener(isTouch ? 'touchend' : 'mouseup', resizeWindowEnds);
                winHandler.selectWindow();

                e.preventDefault();
            };

            var startWindowListeners = function () {
                titleBar.addEventListener('mousedown', startMoving);
                titleBar.addEventListener('touchstart', startMoving);
                content.addEventListener('click', winHandler.selectWindow);
            };

            var stopWindowListeners = function () {
                titleBar.removeEventListener('mousedown', startMoving);
                titleBar.removeEventListener('touchstart', startMoving);
                content.removeEventListener('click', winHandler.selectWindow);
            };

            // set the element in the specified position
            winHandler.move = function (x, y) {
                if (x) {
                    windowBox.css('left', x + 'px');
                }
                if (y) {
                    windowBox.css('top', y + 'px');
                }
            };

            // set the new size of the element
            winHandler.resize = function (width, height) {
                if (width) {
                    windowBox.css('width', width + 'px');
                }
                if (height) {
                    windowBox.css('height', height + 'px');
                }

                scope.onResizing({
                    $dlg: winHandler
                });
            };

            // Move the current window to the highest position
            winHandler.selectWindow = function () {
                parentWindow.topZ += 1;
                element.css('z-index', parentWindow.topZ);

                scope.onSelect({
                    $dlg: winHandler
                });
            };

            // This functions is executed when minimize is executed
            winHandler.minimize = function () {
                // Store the position and the size state
                if (scope.state === 0) {
                    windowState = {
                        x: parseInt(windowBox.prop('offsetLeft'), 10),
                        y: parseInt(windowBox.prop('offsetTop'), 10),
                        width: parseInt(windowBox.prop('offsetWidth'), 10),
                        height: parseInt(windowBox.prop('offsetHeight'), 10),
                        z: element.css('z-index')
                    };
                }

                var minimizeCoords = {
                    x: parseInt(viewport.offsetWidth || 0, 10),
                    y: parseInt(viewport.offsetHeight || 0, 10),
                    width: 200,
                    height: 40
                };

                element.removeClass('maximized');

                // move, set the effect and resize
                winHandler.move(minimizeCoords.x - 200, minimizeCoords.y - 40);
                element.addClass('minimizing');
                winHandler.resize(minimizeCoords.width, minimizeCoords.height);

                // Stop all the window listener (drag,resize...)
                stopWindowListeners();

                scope.state = 1;

                // Program the effect extraction
                $timeout(function () {
                    if (scope.modal) {
                        element.removeClass('modal');
                    }
                    element.removeClass('minimizing');
                    element.removeClass('minimizing');
                    element.addClass('minimized');
                }, 500);

                scope.onMinimized({
                    $dlg: winHandler
                });
            };

            // This functions is executed when maximize is executed
            winHandler.maximize = function () {
                // Store the position and the size state
                if (scope.state === 0) {
                    windowState = {
                        x: parseInt(windowBox.prop('offsetLeft'), 10),
                        y: parseInt(windowBox.prop('offsetTop'), 10),
                        width: parseInt(windowBox.prop('offsetWidth'), 10),
                        height: parseInt(windowBox.prop('offsetHeight'), 10),
                        z: element.css('z-index')
                    };
                }

                var maximizeCoords = {
                    x: parseInt(viewport.offsetLeft || 0, 10),
                    y: parseInt(viewport.offsetTop || 0, 10),
                    width: parseInt(viewport.offsetWidth || viewport.innerWidth, 10),
                    height: parseInt(viewport.offsetHeight || viewport.innerHeight, 10)
                };

                element.removeClass('minimized');

                // move, set the effect and resize
                winHandler.move(maximizeCoords.x + 10, maximizeCoords.y + 10);
                element.addClass('maximizing');
                winHandler.resize(maximizeCoords.width - 20, maximizeCoords.height - 20);

                // Stop all the window listener (drag,resize...)
                stopWindowListeners();

                scope.state = 2;

                // Program the effect extraction
                $timeout(function () {
                    element.removeClass('maximizing');
                    element.addClass('maximized');
                    if (scope.modal) {
                        element.addClass('modal');
                    }
                }, 500);

                scope.onMaximized({
                    $dlg: winHandler
                });
            };

            winHandler.restore = function () {
                // move and resize to previus state
                element.removeClass('maximized');
                element.removeClass('minimized');
                element.addClass('restoring');

                // move and resize to prior state
                winHandler.move(windowState.x, windowState.y);
                winHandler.resize(windowState.width, windowState.height);
                element.css('z-index', windowState.z);

                // start all the window listener (drag,resize...)
                startWindowListeners();

                scope.state = 0;

                // Removes the element some time ago
                $timeout(function () {
                    element.removeClass('restoring');
                    if (scope.modal) {
                        element.addClass('modal');
                    }
                }, 500);

                // Execute restore method if it's provided
                scope.onRestored({
                    $dlg: winHandler
                });
            };

            // This function is executed when close button is pushed
            winHandler.close = function () {
                $timeout(function () {
                    element.addClass('closing');
                    $timeout(function () {
                        element.removeClass('closing');
                        element.remove();

                        scope.onClosed({
                            $dlg: winHandler
                        });
                    }, 300);
                }, 50);
            };

            winHandler.dblclickTitleBar = function () {
                if (scope.state === 0) {
                    winHandler.maximize();
                } else {
                    winHandler.restore();
                }
            };

            winHandler.resetTitle = function (title) {
                scope.title = title;
            };

            // Set and start all the window listener (drag,resize...)
            startWindowListeners();

            // Set buttons listener
            minimizeButton.addEventListener('click', winHandler.minimize);
            minimizeButton.addEventListener('touchstart', winHandler.minimize);
            restoreButton.addEventListener('click', winHandler.restore);
            restoreButton.addEventListener('touchstart', winHandler.restore);
            maximizeButton.addEventListener('click', winHandler.maximize);
            maximizeButton.addEventListener('touchstart', winHandler.maximize);
            closeButton.addEventListener('click', winHandler.close);
            closeButton.addEventListener('touchstart', winHandler.close);
            resizeButton.addEventListener('mousedown', startResizing);
            resizeButton.addEventListener('touchstart', startResizing);
            if (scope.maximizable) {
                titleBar.addEventListener('dblclick', winHandler.dblclickTitleBar);
            }

            var applyWindowOptions = function (wh, opt) {
                if (opt.position) {
                    var position = opt.position;
                    wh.move(position.x, position.y);
                }
                if (opt.size) {
                    var size = opt.size;
                    wh.resize(size.width, size.height);
                }
                if (opt.modal) {
                    element.addClass('modal');
                }
            };

            // apply the options for the window
            applyWindowOptions(winHandler, options);

            // To avoid adding transition listeners we remove tha clas after some time
            setTimeout(function () {
                element.addClass('active');
                element.addClass('opening');
                winHandler.selectWindow();

                setTimeout(function () {
                    element.removeClass('opening');
                    scope.onOpen({
                        $dlg: winHandler
                    });
                }, 400);
            }, 50);
        }
    };
}]);
