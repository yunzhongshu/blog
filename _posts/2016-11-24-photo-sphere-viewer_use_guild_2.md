---
layout: post
title: Photo Sphere Viewer使用指南(二)
date: 2016-11-26 21:18
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
    
