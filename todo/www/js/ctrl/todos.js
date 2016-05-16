'use strict';

/**
 * @ngdoc function
 * @name starter.controller:TodoCtrl
 * @description
 * # TodoCtrl
 * Controller of the starter
 */
angular.module('starter')
    .controller('TodoCtrl', ['$scope', '$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {
            var newProject = {
                title: projectTitle
            };
            Projects.save(newProject).then(function (ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                //$scope.projects.$indexFor(id); // returns location in the array
            })
        }


        // Load or initialize projects
        $scope.projects = Projects.all();

        // Called to create a new project
        $scope.newProject = function() {
            var projectTitle = prompt('Nombre del Proyecto');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Called to select the given project
        $scope.selectProject = function(project) {
            $scope.activeProject = project;
            //$ionicSideMenuDelegate.toggleLeft(false);
        };

        // Create our modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.createTask = function(task) {
            if (!$scope.activeProject || !task) {
                return;
            }

            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            if(queGuardar.tasks){
                queGuardar.tasks.push({
                    title: task.title,
                    completada: false,
                    fechaInicio: Firebase.ServerValue.TIMESTAMP
                });
            } else {
                var tasks = [
                    {
                        title: task.title,
                        completada: false,
                        fechaInicio: Firebase.ServerValue.TIMESTAMP
                    }            
                ];
                queGuardar.tasks = tasks;                
            }
            $scope.projects.$save(queGuardar);
            $scope.taskModal.hide();

            task.title = "";
        };

        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.removeProject = function () {
            Projects.delete($scope.activeProject).then(function (ref) {
                if($scope.projects.length > 0) {
                    $scope.activeProject = $scope.projects[0];
                } else {
                    console.info('Ya no hay proyectos!');
                }
            });
        }

        $scope.onDoubleTap = function () {
            console.info('Double tap');
        }

        $scope.projects.$loaded().then(function(projects) {
           console.log(projects.length); // data is loaded here
            if ($scope.projects.length == 0) {
                while (true) {
                    var projectTitle = prompt('Your first project title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            } else {
                $scope.activeProject = $scope.projects[0];
            }
        });

        $scope.terminada = function (task) {
            if(task.completada) {
                task.fechaFin = Firebase.ServerValue.TIMESTAMP;
            } else {
                task.fechaFin = null;
            }
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                //var referencia = ref.key();
                console.log('Cambio guardado en base');
            });
        }

    }]);
