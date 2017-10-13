/**
 * Created by wuzhen on 2016/5/4.
 */
// 方式一在表单的各个输入域中定义指令
angular.module('fastmap.uikit').directive('fmEditView', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $element) {
            $scope.$on('clearAttrStyleDown', function () {
                var label = $($element).parents('li').find('label:first');
                label.removeClass('modifiedInfo');
            });
        },
        link: function ($scope, $element, attrs) {
            var label = $($element).parents('li').find('label:first');
            $element.bind('change', function () {
                label.addClass('modifiedInfo');
            });
        }
    };
});
/**
 * 控制form内容是否可编辑
 */
angular.module('fastmap.uikit').directive('fmFormControl', function ($timeout) {
    return {
        restrict: 'A',
        replace: false,
        scope: true,
        link: function (scope, elem, attrs) {
            var doDisable = function (elems) {
                for (let i = 0; i < elems.length; i++) {
                    let el = angular.element(elems[i]);
                    if (!el.attr('disabled')) {
                        el.attr('fm-editable', 'disabled');
                        el.attr('disabled', 'disabled');
                    }
                }
            };

            var doEnable = function (elems) {
                for (let i = 0; i < elems.length; i++) {
                    let el = angular.element(elems[i]);
                    if (el.attr('fm-editable')) {
                        el.attr('fm-editable', null);
                        el.attr('disabled', null);
                    }
                }
            };

            var hideImgBtn = function (elems) {
                for (let i = 0; i < elems.length; i++) {
                    let el = angular.element(elems[i]);
                    if (el.attr('ng-click')) {
                        el.attr('fm-editable', 'hid');
                        el.hide();
                    }
                }
            };

            var showImgBtn = function (elems) {
                for (let i = 0; i < elems.length; i++) {
                    let el = angular.element(elems[i]);
                    if (el.attr('fm-editable')) {
                        el.attr('fm-editable', null);
                        el.show();
                    }
                }
            };

            var switchEditable = function (newVal, oldVal) {
                if (newVal) { // 可编辑
                    doEnable(elem.find('input'));
                    doEnable(elem.find('textarea'));
                    doEnable(elem.find('select'));
                    doEnable(elem.find('button'));
                    showImgBtn(elem.find('img'));
                } else { // 不可编辑
                    doDisable(elem.find('input'));
                    doDisable(elem.find('textarea'));
                    doDisable(elem.find('select'));
                    doDisable(elem.find('button'));
                    hideImgBtn(elem.find('img'));
                }
            };

            // 监听状态的变化
            scope.$watch('fmFormEditable', function (newVal, oldVal) {
                $timeout(function () {
                    switchEditable(newVal);
                });
            });

            // 监听子页面的加载
            // 子页面加载后默认都是可编辑的，因此只有在不可编辑的情况下，加载子页面后才需要设置为不可编辑
            scope.$on('$includeContentLoaded', function () {
                var editable = !!scope.fmFormEditable;
                if (!editable) {
                    $timeout(function () {
                        switchEditable(editable);
                    });
                }
            });
        }
    };
});
/**
 * 用于ng-table表格cell编辑
 */
angular.module('fastmap.uikit').directive('fmBindCompiledHtml', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs, $compile) {
            $scope.$watch($attrs.fmBindCompiledHtml, function (html) {
                var compiledElements = $compile(html)($scope);
                $element.empty();
                $element.append(compiledElements);
            }, true);
        }
    };
});
/**
 * 限制输入字符
 */
angular.module('fastmap.uikit').directive('fmInputControl', function () {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            objectmodel: '='
        },
        link: function (scope, elem, attrs) {
            var re = new RegExp('^[0-9]*$');
            elem.bind('change', function () {
                if (!re.test(scope.objectmodel)) {
                    scope.objectmodel = 0;
                    scope.$apply();
                }
            });
        }
    };
});
/**
 * 图片缩放
 */
angular.module('fastmap.uikit').directive('imgShow', function () {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, element, attr) {
            wheelzoom(element);
        }
    };
});
/**
 * 图片404时加默认图片
 */
angular.module('fastmap.uikit').directive('image404', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            var notFoundCount = 0;

            function getDefaultImagePlaceholder() {
                var width = angular.element(element[0]).attr('max-width') || element[0].offsetWidth || 120;
                var height = angular.element(element[0]).attr('max-height') || element[0].offsetHeight || 120;
                var bgcolor = attributes.fbBgcolor ? attributes.fbBgcolor.replace('#', '') : '';
                var color = attributes.fbColor ? attributes.fbColor.replace('#', '') : '';
                var text = attributes.fbText || '';
                var result = '';
                var protocol = window.location.href.split('://').shift();
                if (!protocol) protocol = 'http';
                result = protocol + '://dummyimage.com/' + width + 'x' + height;
                if (bgcolor && color) {
                    result += '/' + bgcolor + '/' + color;
                }
                if (text) {
                    result += '&text=' + text;
                }
                return result;
            }

            function changeSCR() {
                var newIamgeUrl = attributes.image404;
                if (notFoundCount >= 3 || !newIamgeUrl) {
                    newIamgeUrl = getDefaultImagePlaceholder();
                }
                element.attr('src', newIamgeUrl);
                notFoundCount++;
            }
            if (!attributes.src) {
                changeSCR();
            }
            element.on('error', changeSCR);
        }
    };
});
/**
 *
 */
angular.module('fastmap.uikit').directive('fmAutoFocus', function ($timeout) {
    return {
        restrict: 'A',
        replace: false,
        link: function ($scope, element, attrs) {},
        controller: function ($scope, $element) {
            $scope.selectFirstNum = function () {
                $timeout(function () {
                    angular.element($element).find('input[name=fmFocus]:eq(0)').focus();
                }, 200);
            };
        }
    };
});

angular.module('fastmap.uikit').directive('setFocus', function () {
    return {
        scope: true,
        link: function (scope, element) {
            element.bind('click', function (event) {
                this.select();
            });
        }
    };
});

/**
 * 右键事件指令
 */
angular.module('fastmap.uikit').directive('fmRightClick', function ($parse) {
    return {
        restrict: 'A',
        replace: false,
        controller: function ($scope, $element, $attrs) {
            var fn = $parse($attrs.fmRightClick);
            $element.bind('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    fn($scope, {
                        $event: event
                    });
                });
            });
        }
    };
});
