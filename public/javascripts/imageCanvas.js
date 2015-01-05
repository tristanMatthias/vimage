var app = angular.module("app");

app.directive('imageCanvas', function(){
    return {
        scope: {
            image: "=image"
        },
        restrict: "E",
        link: function($scope, elem, attrs, ctrl) {
            $scope.$watch("image", function(newval, oldval) {
                if (newval.url) ctrl.createImage();
            }, true);
        },
        templateUrl: "/view/image-canvas",
        controller: function($scope, $element, $window) {
            var self     = this;
            this.c       = $element.children()[0];
            this.ctx     = self.c.getContext("2d");
            this.drawing = false;

            $scope.tools = ["hand", "draw"];
            $scope.tool  = $scope.tools[1];
            $scope.scale = 1;

            registerTransforms(self.ctx);


            angular.element($window).bind('resize', function() {
                  resize();
                  $scope.$apply();
            });

            this.createImage = function() {
                $scope._img = new Image;
                $scope._img.src = $scope.image.url;   
                draw();
            }

            var oldTool;
            var keysDown = [];
            this.c.addEventListener("keydown", function(evt) {
                // Stop the key from being triggered when it is held down
                if (keysDown.indexOf(evt.keyCode) > -1) return;

                if (evt.keyCode === 32) { //spacebar
                    oldTool = $scope.tool;
                    $scope.tool = "hand";
                }
                $scope.$apply();
                keysDown.push(evt.keyCode);
            });
            this.c.addEventListener("keyup", function(evt) {
                if (evt.keyCode === 32) { //spacebar
                    // console.log(oldTool)
                    $scope.tool = oldTool;
                }
                $scope.$apply();
                // Remove it from keys that are currently pressed
                keysDown.splice(keysDown.indexOf(evt.keyCode), 1);
            });
            
            
            var lastX=self.c.width/2, lastY=self.c.height/2;
            var dragStart,dragged;

            self.c.addEventListener('mousedown',function(evt){
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                lastX = evt.offsetX;
                lastY = evt.offsetY;
                dragStart = self.ctx.transformedPoint(lastX,lastY);
                dragStartAbsoluteX = lastX;
                dragStartAbsoluteY = lastY;
                dragged = false;
            },false);
            self.c.addEventListener('mousemove',function(evt){
                lastX = evt.offsetX;
                lastY = evt.offsetY;
                
                dragged = true;
                if (dragStart && ($scope.tool == "hand")){
                    var pt = self.ctx.transformedPoint(lastX,lastY);
                    self.ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                }
                draw();
            },false);
            self.c.addEventListener('mouseup',function(evt){
                dragStart = null;
                if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
            },false);

            var scaleFactor = 1.1;
            var zoom = function(clicks){
                var pt = self.ctx.transformedPoint(lastX,lastY);
                self.ctx.translate(pt.x,pt.y);
                var factor = Math.pow(scaleFactor,clicks);
                $scope.scale *= factor;
                $scope.$apply();

                self.ctx.scale(factor,factor);
                self.ctx.translate(-pt.x,-pt.y);
                draw();
            }

            var handleScroll = function(evt){
                var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
                if (delta) zoom(delta);
                return evt.preventDefault() && false;
            };
            self.c.addEventListener('DOMMouseScroll',handleScroll,false);
            self.c.addEventListener('mousewheel',handleScroll,false);
            
            function registerTransforms(ctx){
                var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
                var xform = svg.createSVGMatrix();
                ctx.getTransform = function(){ return xform; };
                
                var savedTransforms = [];
                var save = ctx.save;
                ctx.save = function(){
                    savedTransforms.push(xform.translate(0,0));
                    return save.call(ctx);
                };
                var restore = ctx.restore;
                ctx.restore = function(){
                    xform = savedTransforms.pop();
                    return restore.call(ctx);
                };

                var scale = ctx.scale;
                ctx.scale = function(sx,sy){
                    xform = xform.scaleNonUniform(sx,sy);
                    return scale.call(ctx,sx,sy);
                };
                var rotate = ctx.rotate;
                ctx.rotate = function(radians){
                    xform = xform.rotate(radians*180/Math.PI);
                    return rotate.call(ctx,radians);
                };
                var translate = ctx.translate;
                ctx.translate = function(dx,dy){
                    xform = xform.translate(dx,dy);
                    return translate.call(ctx,dx,dy);
                };
                var transform = ctx.transform;
                ctx.transform = function(a,b,c,d,e,f){
                    var m2 = svg.createSVGMatrix();
                    m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
                    xform = xform.multiply(m2);
                    return transform.call(ctx,a,b,c,d,e,f);
                };
                var setTransform = ctx.setTransform;
                ctx.setTransform = function(a,b,c,d,e,f){
                    xform.a = a;
                    xform.b = b;
                    xform.c = c;
                    xform.d = d;
                    xform.e = e;
                    xform.f = f;
                    return setTransform.call(ctx,a,b,c,d,e,f);
                };
                var pt  = svg.createSVGPoint();
                ctx.transformedPoint = function(x,y){
                    pt.x=x; pt.y=y;
                    return pt.matrixTransform(xform.inverse());
                }
            }
            
            function reset() {
                self.ctx.clearRect( 0 , 0 ,10000,100000);
            }
            function draw(){
                // Clear the entire canvas
                var p1 = self.ctx.transformedPoint(0,0);
                var p2 = self.ctx.transformedPoint(self.c.width,self.c.height);
                self.ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
                
                
                if($scope._img) self.ctx.drawImage($scope._img, 0, 0);

                // Draw dragging rectangle
                if ($scope.tool == "draw" && dragStart) {
                    var start = self.ctx.transformedPoint(dragStartAbsoluteX, dragStartAbsoluteY);
                    self.ctx.beginPath();
                    self.ctx.rect(start.x, start.y, lastX - dragStartAbsoluteX, lastY  - dragStartAbsoluteY);
                    self.ctx.lineWidth = 1;
                    self.ctx.strokeStyle = 'blue';
                    self.ctx.stroke();
                }
            }
            function resize() {

                var pStyle        = window.getComputedStyle($element[0].parentElement);
                var toolbarHeight = window.getComputedStyle($element[0].children[1]).height.slice(0,-2);
                var headerHeight  = window.getComputedStyle(document.body.children[0]).height.slice(0,-2);
                
                
                self.c.width = parseInt(pStyle.width.slice(0,-2)) + 1;
                self.c.height = window.innerHeight - toolbarHeight - headerHeight - 10;
                draw();
            }
            resize();
            console.log("GOT HERE");
            $scope.selectTool = function(tool) {
                $scope.tool = tool
            }

        }
    };
});