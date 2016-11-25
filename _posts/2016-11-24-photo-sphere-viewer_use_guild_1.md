---
layout: post
title: Photo Sphere Viewer使用指南(一)
date: 2016-11-24 21:18
author: 一朵云
categories: javascript
tags: javascript 3d
---
###是什么？
[Photo Sphere Viewer](http://photo-sphere-viewer.js.org/)是一个用来渲染360°球面全景图的javascript库。它基于[Three.js](http://threejs.org)，在支持WebGL和HTML Canvas的浏览器上都有非常好的表现,而且还支持触摸屏。
###体验一下
在[github](https://github.com/mistic100/Photo-Sphere-Viewer)上下载源码，并按照README中将源码build并运行体验example中的例子。
###自己搭建一个项目
将上一步build之后生成了photo-sphere-viewer.min.js,photo-sphere-viewer.min.css拷贝过来，photo-sphere-viewer.min.js需要依赖以下几个js库:  

    <script src="three.js/three.min.js"></script>
    <script src="D.js/lib/D.min.js"></script>
    <script src="uevent/uevent.min.js"></script>
    <script src="doT/doT.min.js"></script>  
如果浏览器不支持WebGL，还需要引入几个Three.js的examples:  
    
    <script src="three.js-examples/renderers/CanvasRenderer.js"></script>
    <script src="three.js-examples/renderers/Projector.js"></script>  
    
如果需要用到场景转换效果(transition.blur属性)，需要以下js文件:  
    
    <script src="three.js-examples/postprocessing/EffectComposer.js"></script>
    <script src="three.js-examples/postprocessing/RenderPass.js"></script>
    <script src="three.js-examples/postprocessing/ShaderPass.js"></script>
    <script src="three.js-examples/postprocessing/MaskPass.js"></script>
    <script src="three.js-examples/shaders/CopyShader.js"></script>
    
为了回应设备回转仪(gyroscope属性),需要以下js文件  
    
    <script src="three.js-examples/controls/DeviceOrientationControls.js"></script>

页面除了引入以上js文件外，当然还需要引入photo-sphere-viewer.min.js,photo-sphere-viewer.min.css:
    
    <link rel="stylesheet" href="Photo-Sphere-Viewer/photo-sphere-viewer.min.css">
    <script src="Photo-Sphere-Viewer/photo-sphere-viewer.min.js"></script>
    
然后html中还需要一个展现图形场景的dom元素及一段创建视图的代码:
    
    <div id="photosphere"></div>
    <script>
         var PSV = new PhotoSphereViewer({ /* ... */});
    </script>  
然后就是配置PhotoSphereViewer对象的参数。
###参数属性说明
| Name | type | default | description |
|---|---|---|:---|
| container| HTMLElement&#124;string | <span class="label label-danger">必填</span> | 显示全景图的html元素id值(没有前缀＃) |
|panorama|string|<span class="label label-danger">必填</span>|全景图的路径|
|caption|string|null|标题,若不为空则展现在navbar上(即使navbar属性为false,也会出现navbar)|
|markers|Array|[]|markers(标记)数组|
|autoload|boolean|true|自动加载全景图.设置成false，需要后面调用.load方法加载图片|
|min_fov|integer|30|视野夹角度数最小值(相当于镜头拉到最近),范围1-179|
|max_fov|integer|90|视野夹角度数最大值(相当于镜头拉到最远),范围1-179|
|default_fov|integer|max_fov|默认视图角度,范围min_fov到max_fov之间|
|fisheye|boolean&#124;integer|false|设置true或者效果强度(true=1.0).<font style="color:red">这个效果会影响marker的渲染效果</font>|
|default_long|double|0|初始经度,范围0到2π|
|default_lat|double|0|初始维度,范围-π/2到π/2|
|longitude_range|double[]||可见的经度范围,例如:[0,Math.PI],[-3π/4]|
|latitude_range|double[]|[π/2, -π/2]|维度可见范围|
|time_anim|integer&#124;boolean|2000|全景图自动旋转前等待的时间.设置为false使他不自动选转|
|anim_speed|string|'2rpm'|自动旋转速度. radians/degrees/revolutions per second/minute .可选值:-rpm revolutions per minute <br>rps revolutions per second<br>dpm degrees per minute<br>dps degrees per second<br>radians per minute<br>radians per second|
|anim_lat|double|default_lat|绕着某个维度自动旋转|
|navbar|boolean&#124;array||是否使用导航栏,并且可以选择某些按钮显示，甚至自定义按钮.下面有例子|
|lang|Object|见下面|navbar上的按钮文本提示定义|
|loading_img|string|null|视图中间加载圆形区域的图片地址|
|loading_txt|string|'Loading...'|视图中间加载圆形区域的文本显示，只有在loading_img没有提供的情况下才会显示|
|mousewheel|boolean|true|是否监听鼠标的放大缩小事件|
|mousemove|boolean|true|监听用鼠标click+move转动视图的事件|
|keyboard|boolean|true|允许在全屏模式下使用键盘|
|gyroscope|boolean|false|当设备支持的情况下使陀螺仪生效并且添加一个导航按钮|
|size|object|null|全景图的大小.例如:{width: 500, height: 300}.默认根据container的大小来显示|
|transition|object|见下面|场景切换时候的效果|
>navbar属性设置例子:  
    
    new PhotoSphereViewer({
      /* ..... */,
      navbar: [
        'autorotate',
        'zoom',
        'markers',
        {
          id: 'my-button',
          title: 'Hello world',
          className: 'custom-button',
          content: 'Custom',
          onClick: function() {
           alert('Hello from custom button');
          }
        },
        'caption',
        'fullscreen'
      }
    );

>lang的默认配置:  

    lang: {
        autorotate: 'Automatic rotation',
        zoom: 'Zoom',
        zoomOut: 'Zoom out',
        zoomIn: 'Zoom in',
        download: 'Download',
        fullscreen: 'Fullscreen',
        markers: 'Markers',
        gyroscope: 'Gyroscope'
    }
    
>transition的默认配置:  
    
    transition: {
        duration: 1500,
        loader: true,
        blur: false
    }

下次再介绍高级属性，方法，及markers的相关内容.  
附上我写的[demo源码](https://github.com/yunzhongshu/fly-sky)


