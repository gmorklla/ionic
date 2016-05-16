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

        // Fn para crear proyecto
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


        // Carga proyectos
        $scope.projects = Projects.all();

        // Fn que pide nombre de proyecto y luego llama fn para crear proyecto
        $scope.newProject = function() {
            var projectTitle = prompt('Nombre del Proyecto');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Fn para seleccionar proyecto
        $scope.selectProject = function(project) {
            $scope.activeProject = project;
            //$ionicSideMenuDelegate.toggleLeft(false);
        };

        // Aquí se crea el modal que se ocupa para crear task
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        // Fn para crear task
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

        // Fn que muestra modal para crear task
        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        // Fn que cierra modal para crear task
        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        // Fn para abrir menú de Proyectos
        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        // Fn para remover proyectos
        $scope.removeProject = function () {
            Projects.delete($scope.activeProject).then(function (ref) {
                if($scope.projects.length > 0) {
                    $scope.activeProject = $scope.projects[0];
                } else {
                    console.info('Ya no hay proyectos!');
                }
            });
        }

        // Una vez cargados los datos checa si ya existe algún proyecto
        $scope.projects.$loaded().then(function(projects) {
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

        // Fn para establecer task completada
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

        // Fn para borrar task
        $scope.borrarTask = function (task) {
            if(task) {
                task = null;
            }
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                console.log('Cambio guardado en base');
            });
        }

    }]);
