---
layout: post
title: Photo Sphere Viewer使用指南(二)
date: 2016-11-26 15:23
author: 一朵云
categories: javascript
tags: javascript 3d
---
###高级属性
|属性名|类型|默认值|描述|
|:---|:---|:---|:---|
|move_speed|double|1|手动移动的速率|
|sphere_segments|integer(2的倍数)|64|球体水平和垂直分割的块数,如果遇到表现不佳，可以减小这个值|
|usexmpdata|boolean|true|从XMPdata中读真实图片的大小,如果全景图裁切不正，该属性值必须为true|
|pano_data|object||手工定义裁剪配置(如果usexmpdata=false或者没有找到XMP标签).配置列子在下面|
|cache_texture|integer|5|缓存在内存中的3d数据对象的个数.当多次执行setPanorama方法时候防止重复加载图片,减少网络负荷|
|tooltip|object|见下面|提示框配置.|
|move_inertia|boolean|true|使手动移动的动画更平滑|
|click_event_on_marker|boolean|false|点击marker产生一个类似'select-marker'这样的点击事件|
>pano_data配置:  
    
    //In this example a 4000x2000 image is used as a portion of a 6000x3000 panorama, the remaining space will be rendered black.
    pano_data: {
      full_width: 6000,
      full_height: 3000,
      cropped_width: 4000,
      cropped_height: 2000,
      cropped_x: 1000,
      cropped_y: 500
    }
    
>tooltip的默认配置:  
    
    tooltip: {
        offset: 5,
        arrow_size: 7,
        delay: 100
    }
    
    
###方法
[看官方文档](http://photo-sphere-viewer.js.org/#methods)


###事件
[看官方文档](http://photo-sphere-viewer.js.org/#events)

##使用markers
markers有４种类型  
*HTML*:用html属性定义  
*图片*:用image属性定义  
*SVGs*: 用rect,circle,ellipse,path属性定义  
*动态多边形*: 用polygon\_px 或 polygon\_rad属性定义

###markers　属性说明
|名称|类型|默认值|描述|
|:---|:---|:---|:---|
|id|string|<span class="label label-danger">必填</span>|marker的唯一标识|
|image|string||图片marker的路径,需要指定width和height|
|html|string||marker的html内容|
|rect|int[] Object||矩形的尺寸,如:[10,5]或者{width:10,height:5}|
|circle|int||圆圈的半径|
|ellipse|int[] Object||椭圆的半径.如:[10,5]或者{cx:10,cy:5}|
|path|string||Definition of the path (0,0 will be placed at the defined x/y or longitude/latitude).|
|polygon_px|int[][]||多边形在全景图中的各个坐标点(像素为单位)|
|polygon_rad|double[][]||多边形在全景图中的坐标(经纬度为单位)|
|width & height|int|推荐 images<span class="label label-danger">必填</span>|marker的尺寸|
|x & y|int| |marker在纹理中的坐标位置(像素)|
|latitude & longitude| double||marker在球体中的坐标(弧度)|
|className|string||marker元素可选的CSS(es)|
|anchor|string|'center center'|marker在它所在位置的方位定义.如:bottom center或者20% 80%|
|visible|boolean|true|当marker被添加的时候是否显示。如果设置hidden,则之后需要通过<font style="color:red">getMarker</font>方法来编辑|
|tooltip|string|Object||marker的提示文本或者提示配置{content:'xx',position}|
|tooltip.content|string||提示内容|
|tooltip.position|string|'top center'|提示在marker的方位位置,Accepted values are combinations of top, center, bottom and left, center, right with the exception of center center.|
|style|Object||marker的Css属性|
|svgStyle|Object||SVG类marker的SVG属性样式|
|content|string||当marker被点击时在侧边板上显示的内容|
>以上image,html,rect,circle,ellipse,path,polygon_px,polygon_rad等只能选一个

###操作marker的方法
[参考](http://photo-sphere-viewer.js.org/markers.html#methods)
<span class="label label-warning">.addMarker(properties [, render])</span>  
添加一个新的标签到viewer中.render　设置为false，表示不马上渲染到视图中，需要调用 .render()方法
    
    viewer.addMarker({
      id: 'marker-1',
      image: 'path/to/pin.png',
      width: 32,
      height: 32,
      x: 500,
      y: 1000
    });
<span class="label label-warning">.updateMarker(marker [, render])</span>
通过id更新一个存在的marker.注意:除了类型(image,html..)之外，其他属性都可以修改
    
        // update by defining new properties
    viewer.updateMarker({
      id: 'marker-1',
      x: 1000
    });
    
    // update via reference
    var marker = viewer.addMarker({ ... });
    marker.x = 1000;
    viewer.updateMarker(marker);
    
<span class="label label-warning">.getMarker(markerId)</span>  
通过id获取marker的配置
    
    var marker = viewer.getMarker('marker-1');

    
<span class="label label-warning">.removeMarker(marker | markerId [, render])</span>  
从视图中删除一个marker
    
    viewer.removeMarker('marker-1');
    
<span class="label label-warning">.gotoMarker(marker | markerId [, duration | speed])</span>  
转动到marker所在的位置.  
    
    viewer.gotoMarker('marker-1', 1500);
    
<span class="label label-warning">.gotoMarker(marker | markerId [, duration | speed])</span>  
清除所有markers

另外还有
.hideMarker(marker | markerId)  
.showMarker(marker | markerId)  
.toggleMarker(marker | markerId)  

###markers事件
<span class="label label-warning">select-marker [marker]</span>  
当点击一个marker的时候会触发  
    
    viewer.on('select-marker', function(marker) {
      alert('Select ' + marker.id);
    });
    
<span class="label label-warning">unselect-marker [marker]</span>  
当一个marker被选中，然后再点击其他地方会触发该marker的unselect-marker事件  
    
    viewer.on('unselect-marker', function(marker) {
      alert(marker.id + ' was selected');
    });
    
<span class="label label-warning">render-markers-list [markers]</span>  
用来改变在侧边栏显示的markers列表  
    
    viewer.on('render-markers-list', function(markers) {
      return markers.slice(0, 5);
    });
    

