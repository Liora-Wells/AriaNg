(function () {
    'use strict';

    angular.module('ariaNg').controller('NewTaskController', ['$rootScope', '$scope', '$location', '$timeout', '$window', 'ariaNgCommonService', 'ariaNgLogService', 'ariaNgKeyboardService', 'ariaNgFileService', 'ariaNgSettingService', 'aria2TaskService', 'aria2SettingService', function ($rootScope, $scope, $location, $timeout, $window, ariaNgCommonService, ariaNgLogService, ariaNgKeyboardService, ariaNgFileService, ariaNgSettingService, aria2TaskService, aria2SettingService) {
        var tabStatusItems = [
            {
                name: 'links',
                show: true
            },
            {
                name: 'options',
                show: true
            }
        ];
        var parameters = $location.search();

        var getVisibleTabOrders = function () {
            var items = [];

            for (var i = 0; i < tabStatusItems.length; i++) {
                if (tabStatusItems[i].show) {
                    items.push(tabStatusItems[i].name);
                }
            }

            return items;
        };

        var setTabItemShow = function (name, status) {
            for (var i = 0; i < tabStatusItems.length; i++) {
                if (tabStatusItems[i].name === name) {
                    tabStatusItems[i].show = status;
                    break;
                }
            }
        };

        var saveDownloadPath = function (options) {
            if (!options || !options.dir) {
                return;
            }

            aria2SettingService.addSettingHistory('dir', options.dir);
        };

        var getDownloadTasksByLinks = function (options) {
            var urls = ariaNgCommonService.parseUrlsFromOriginInput($scope.context.urls);
            var tasks = [];

            if (!options) {
                options = angular.copy($scope.context.options);
            }

            for (var i = 0; i < urls.length; i++) {
                if (urls[i] === '' || urls[i].trim() === '') {
                    continue;
                }

                tasks.push({
                    urls: [urls[i].trim()],
                    options: options
                });
            }

            return tasks;
        };

        var downloadByLinks = function (pauseOnAdded, responseCallback) {
            var options = angular.copy($scope.context.options);
            
            // 应用临时下载路径，基于全局配置的dir
            if ($scope.context.downloadPath) {
                if ($scope.context.baseDownloadDir) {
                    // 使用适合当前操作系统的路径分隔符
                    var pathSeparator = $window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\\\' : '/';
                    // 确保路径分隔符正确拼接
                    options.dir = $scope.context.baseDownloadDir.replace(/[\/\\]$/, '') + pathSeparator + $scope.context.downloadPath.replace(/^[\/\\]/, '');
                } else {
                    // 否则直接使用提供的路径
                    options.dir = $scope.context.downloadPath;
                }
            }

            // 应用文件重命名并处理特殊字符
            if ($scope.context.fileName) {
                options.out = ariaNgCommonService.encodeFileName($scope.context.fileName);
            }
            
            var tasks = getDownloadTasksByLinks(options);

            saveDownloadPath(options);

            return aria2TaskService.newUriTasks(tasks, pauseOnAdded, responseCallback);
        };

        var downloadByTorrent = function (pauseOnAdded, responseCallback) {
            var options = angular.copy($scope.context.options);

            // 应用临时下载路径，基于全局配置的dir
            if ($scope.context.downloadPath) {
                if ($scope.context.baseDownloadDir) {
                    // 使用适合当前操作系统的路径分隔符
                    var pathSeparator = $window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\\\' : '/';
                    // 确保路径分隔符正确拼接
                    options.dir = $scope.context.baseDownloadDir.replace(/[\/\\]$/, '') + pathSeparator + $scope.context.downloadPath.replace(/^[\/\\]/, '');
                } else {
                    // 否则直接使用提供的路径
                    options.dir = $scope.context.downloadPath;
                }
            }

            // 应用文件重命名并处理特殊字符
            if ($scope.context.fileName) {
                options.out = ariaNgCommonService.encodeFileName($scope.context.fileName);
            }

            var task = {
                content: $scope.context.uploadFile.base64Content,
                options: options
            };

            saveDownloadPath(task.options);

            return aria2TaskService.newTorrentTask(task, pauseOnAdded, responseCallback);
        };

        var downloadByMetalink = function (pauseOnAdded, responseCallback) {
            var options = angular.copy($scope.context.options);

            // 应用临时下载路径，基于全局配置的dir
            if ($scope.context.downloadPath) {
                if ($scope.context.baseDownloadDir) {
                    // 使用适合当前操作系统的路径分隔符
                    var pathSeparator = $window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\\\' : '/';
                    // 确保路径分隔符正确拼接
                    options.dir = $scope.context.baseDownloadDir.replace(/[\/\\]$/, '') + pathSeparator + $scope.context.downloadPath.replace(/^[\/\\]/, '');
                } else {
                    // 否则直接使用提供的路径
                    options.dir = $scope.context.downloadPath;
                }
            }

            // 应用文件重命名并处理特殊字符
            if ($scope.context.fileName) {
                options.out = ariaNgCommonService.encodeFileName($scope.context.fileName);
            }

            var task = {
                content: $scope.context.uploadFile.base64Content,
                options: options
            };

            saveDownloadPath(task.options);

            return aria2TaskService.newMetalinkTask(task, pauseOnAdded, responseCallback);
        };

        $scope.context = {
            currentTab: 'links',
            taskType: 'urls',
            urls: '',
            downloadPath: '',
            fileName: '',
            uploadFile: null,
            availableOptions: (function () {
                var keys = aria2SettingService.getNewTaskOptionKeys();

                return aria2SettingService.getSpecifiedOptions(keys, {
                    disableRequired: true
                });
            })(),
            globalOptions: null,
            options: {},
            optionFilter: {
                global: true,
                http: false,
                bittorrent: false
            },
            exportCommandApiOptions: null,
            // 基础下载目录，来自aria2全局配置
            baseDownloadDir: ''
        };

        // 获取全局下载路径
        $rootScope.loadPromise = aria2SettingService.getGlobalOption(function (response) {
            if (response.success) {
                $scope.context.globalOptions = response.data;
                $scope.context.baseDownloadDir = response.data.dir || '';
                // 确保路径末尾没有分隔符
                $scope.context.baseDownloadDir = $scope.context.baseDownloadDir.replace(/[\/\\]$/, '');
            }
        });

        if (parameters.url) {
            try {
                $scope.context.urls = ariaNgCommonService.base64UrlDecode(parameters.url);
            } catch (ex) {
                ariaNgLogService.error('[NewTaskController] base64 decode error, url=' + parameters.url, ex);
            }
        }

        $scope.changeTab = function (tabName) {
            if (tabName === 'options') {
                $scope.loadDefaultOption();
            }

            $scope.context.currentTab = tabName;
        };

        $rootScope.swipeActions.extendLeftSwipe = function () {
            var tabItems = getVisibleTabOrders();
            var tabIndex = tabItems.indexOf($scope.context.currentTab);

            if (tabIndex < tabItems.length - 1) {
                $scope.changeTab(tabItems[tabIndex + 1]);
                return true;
            } else {
                return false;
            }
        };

        $rootScope.swipeActions.extendRightSwipe = function () {
            var tabItems = getVisibleTabOrders();
            var tabIndex = tabItems.indexOf($scope.context.currentTab);

            if (tabIndex > 0) {
                $scope.changeTab(tabItems[tabIndex - 1]);
                return true;
            } else {
                return false;
            }
        };

        $scope.loadDefaultOption = function () {
            if ($scope.context.globalOptions) {
                return;
            }

            $rootScope.loadPromise = aria2SettingService.getGlobalOption(function (response) {
                if (response.success) {
                    $scope.context.globalOptions = response.data;
                }
            });
        };

        $scope.openTorrent = function () {
            ariaNgFileService.openFileContent({
                scope: $scope,
                fileFilter: '.torrent',
                fileType: 'binary'
            }, function (result) {
                $scope.context.uploadFile = result;
                $scope.context.taskType = 'torrent';
                $scope.changeTab('options');
            }, function (error) {
                ariaNgCommonService.showError(error);
            }, angular.element('#file-holder'));
        };

        $scope.openMetalink = function () {
            ariaNgFileService.openFileContent({
                scope: $scope,
                fileFilter: '.meta4,.metalink',
                fileType: 'binary'
            }, function (result) {
                $scope.context.uploadFile = result;
                $scope.context.taskType = 'metalink';
                $scope.changeTab('options');
            }, function (error) {
                ariaNgCommonService.showError(error);
            }, angular.element('#file-holder'));
        };

        $scope.isNewTaskValid = function () {
            if (!$scope.context.uploadFile) {
                return $scope.newTaskForm.$valid;
            }

            return true;
        };

        $scope.startDownload = function (pauseOnAdded) {
            var responseCallback = function (response) {
                if (!response.hasSuccess && !response.success) {
                    return;
                }

                var firstTask = null;

                if (response.results && response.results.length > 0) {
                    firstTask = response.results[0];
                } else if (response) {
                    firstTask = response;
                }

                if (ariaNgSettingService.getAfterCreatingNewTask() === 'task-detail' && firstTask && firstTask.data) {
                    $location.path('/task/detail/' + firstTask.data);
                } else {
                    if (pauseOnAdded) {
                        $location.path('/waiting');
                    } else {
                        $location.path('/downloading');
                    }
                }
            };

            if ($scope.context.taskType === 'urls') {
                $rootScope.loadPromise = downloadByLinks(pauseOnAdded, responseCallback);
            } else if ($scope.context.taskType === 'torrent') {
                $rootScope.loadPromise = downloadByTorrent(pauseOnAdded, responseCallback);
            } else if ($scope.context.taskType === 'metalink') {
                $rootScope.loadPromise = downloadByMetalink(pauseOnAdded, responseCallback);
            }
        };

        $scope.showExportCommandAPIModal = function () {
            $scope.context.exportCommandApiOptions = {
                type: 'new-task',
                data: getDownloadTasksByLinks()
            };
        };

        $scope.setOption = function (key, value, optionStatus) {
            if (value !== '' || !aria2SettingService.isOptionKeyRequired(key)) {
                $scope.context.options[key] = value;
            } else {
                delete $scope.context.options[key];
            }

            optionStatus.setReady();
        };

        $scope.urlTextboxKeyDown = function (event) {
            if (!ariaNgSettingService.getKeyboardShortcuts()) {
                return;
            }

            if (ariaNgKeyboardService.isCtrlEnterPressed(event) && $scope.newTaskForm.$valid) {
                if (event.preventDefault) {
                    event.preventDefault();
                }

                $scope.startDownload();

                return false;
            }
        };

        $scope.getValidUrlsCount = function () {
            var urls = ariaNgCommonService.parseUrlsFromOriginInput($scope.context.urls);
            return urls ? urls.length : 0;
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
