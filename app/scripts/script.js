window.scalear = angular.module('scalear', [])
	.directive('contenteditable', function() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attr, ngModel) {
				var read;
				if (!ngModel) {
					return;
				}

				function trim(str) {
					return str.replace(/^\s*|\s*$/g, '');
				}
				ngModel.$render = function() {
					return element.html(ngModel.$viewValue);
				};
				element.bind('blur', function() {
					if (ngModel.$viewValue !== trim(element.html())) {
						return scope.$apply(read);
					}
				});
				return read = function() {
					return ngModel.$setViewValue(trim(element.html()));
				};
			}
		};
	}).directive('ngRightClick', ['$parse',
		function($parse) {
			document.oncontextmenu = function(e) {
				if (e.target.hasAttribute('ng-right-click')) {
					return false;
				}
			};
			return function(scope, element, attrs) {
				var fn = $parse(attrs.ngRightClick);
				element.on('contextmenu', function(event) {

					scope.$apply(function() {
						event.preventDefault();
						event.stopPropagation();
						fn(scope, {
							$event: event
						});
					});
				});
			};
		}
	]).factory('noteNames', function() {
		return [
			'C', //0
			'C♯', //1
			'D', //2
			'D♯', //3
			'E', //4
			'F', //5
			'F#', //6
			'G', //7
			'G♯', //8
			'A', //9
			'A♯', //10
			'B' //11
		];
	}).controller('neckCtrl', ['$scope', 'noteNames', '$http',
		function($scope, noteNames, $http) {

			$scope.prepareScales = function(data) {
				var i, j, scales = [];

				for (i = 0; i < data.length; i++) {
					scales.push({
						originalScale: data[i],
						rootNote: function() {
							for (var j = 0; j < data[i].notes.length; j++) {
								if (data[i].notes[j].root) {
									return data[i].notes[j];
								}
							}
						}(),
						frets: function getFrets(scale, data) {
							var i, frets = [],
								tunning = data[scale].instrument.tunning;

							for (i = 0; i < data[scale].instrument.neckLength; i++) {
								frets.push({
									notes: function() {
										var notes = [];
										for (j = 0; j < tunning.length; j++) {
											notes.push({
												originalNote: data[scale].notes[(tunning[j] + i) % noteNames.length]
											});
										}
										return notes;
									}()
								});
							}
							return frets;
						}(i, data)
					});
				}
				return scales;
			};

			$scope.save = function() {
				localStorage.scales = angular.toJson($scope.originalData);
			};


			(function load($scope) {
				if (localStorage.scales) {
					$scope.originalData = angular.fromJson(localStorage.scales);
				} else {
					$scope.originalData = [{
						"name": "Ionian",
						"instrument": {
							"name": "Guitar",
							"tunning": [4, 11, 7, 2, 9, 4],
							"neckLength": 23,
							"stringCount": 6
						},
						"notes": [{
							"id": 0,
							"root": true,
							"visible": true
						}, {
							"id": 1,
							"visible": false
						}, {
							"id": 2,
							"visible": true
						}, {
							"id": 3,
							"visible": false
						}, {
							"id": 4,
							"visible": true
						}, {
							"id": 5,
							"visible": true
						}, {
							"id": 6,
							"visible": false
						}, {
							"id": 7,
							"visible": true
						}, {
							"id": 8,
							"visible": false
						}, {
							"id": 9,
							"visible": true
						}, {
							"id": 10,
							"visible": false
						}, {
							"id": 11,
							"visible": true
						}]
					}];
				}
				$scope.scales = $scope.prepareScales($scope.originalData);
				$scope.save();
			})($scope);


			$scope.getNoteName = function(note) {
				return noteNames[note.id];
			};

			$scope.markRoot = function(note, scale) {
				for (var i = 0; i < scale.originalScale.notes.length; i++) {
					scale.originalScale.notes[i].root = false;
				}
				scale.rootNote = note;
				note.root = true;
				$scope.save();
			};

			$scope.toggle = function(note) {
				if (!note.root) {
					note.visible = !note.visible;
					$scope.save();
				}
			};

			/**
			 1
			 2
			 3
			 4
			 5
			 6
			 7
			 */
			$scope.parseDefiniton = function(def) {
				def = def || '';
				var splitted = def.split(',');

				for (i = 0; i < splitted.length; i++ ) {
					splitted[i] = parseInt(splitted[i], 10);
				}
				console.log(splitted);
			};
			$scope.defintion = '1,3,5,8',
			$scope.parseDefiniton($scope.defintion);
		}
	]);