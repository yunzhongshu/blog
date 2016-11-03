---
layout: post
title: javascript节流器
date: 2016-11-04 07:15
author: 一朵云
categories: javascript
tags: javascript
---
　　在web页面开发中某些事件会一直执行一段重复的业务逻辑。如：scroll事件、keydown事件等等，这些事件往往会在进行页面拖动、每按下一次按键的同事会多次触发，造成抖动或者页面闪烁的情况，如果这些事件是要进行一些耗资源的操作（ajax请求）那么对性能也会有一定的影响，要解决这个问题就要用到节流器（throttle）。  
　　对重复的业务逻辑进行节流控制，执行最后一次操作并取消其他操作，以提高性能，这就是节流器的作用。以下是节流器的javascript代码:  
    
        //节流器
    var throttle = (function f() {

        //获取第一个参数
        var isclear = arguments[0], fn;
        //如果第一个参数是boolean类型那么第一个参数则表示是否清除计时器
        if(typeof isclear === 'boolean') {
            //第二个参数为函数
            fn = arguments[1];
            //函数的计时器句柄存在，则清除该计时器
            fn._throttleID && clearTimeout(fn._throttleID);

        } else {
            //第一个参数为函数
            fn = isclear;
            //第二个参数为函数执行时的参数
            var param = arguments[1];
            //参数适配默认值
            var p = angular.extend({
                context : null,
                args : [],
                time : 300  //执行函数延迟执行的时间
            }, param);
            //清除并执行函数计时器句柄，跑一遍 带boolean的throttle 函数
            f(true, fn);

            //为函数绑定计时器句柄，延迟执行函数
            fn._throttleID = setTimeout(function(){

                fn.apply(p.context, p.args);

            }, p.time);

        }


    });
  
使用方法：  
    
    throttle(fn, {args:[]});  
    
有这样一个场景：根据input文本框的输入内容模糊查询城市名称，列表中展现匹配城市的列表。没有用到节流器的时候的方法是:  
    
    $("#inputId").keydown(function(){
        var text = $(this).val();
        queryByCityName(text);
    });
    
使用节流器后则是：  
    
    $("#inputId").keydown(function(){
        var text = $(this).val();
        throttle(
            queryByCityName, //延迟执行的函数
            {
                args:[text], //传入文本框内容的参数
                time:500   //根据实际情况调节延迟的时间
            }
        );
         
    });
    
本文参考自 张容铭的《javascript设计模式》。
