---
layout: post
title: logstash简介
date: 2016-11-10 22:33
author: 一朵云
categories: linux
tags: logstash 日志收集
---
logstash是一个开源的，用来实时收集、处理、监控、分析日志的工具引擎。

####logstash框架图：  
<img src="/images/logstash.png">  

>从图中可以看出，logstash分为３大模块，也可以说是分成３大步:input(输入)->filter(过滤，加工)->output(输出)。图中各模块右边是各种plugins(插件)。正是因为有了这些插件，才使得logstash可以收集不同数据源的数据，解析、组装不同格式的复杂的数据结构，输出到不同的媒介(数据库、搜索引擎、应用程序等)。


官方网站:[https://www.elastic.co/products/logstash](https://www.elastic.co/products/logstash)  

安装运行步骤：  
1.下载并解压logstash，也可以用APT或YUM下载安装，详细查看[https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#package-repositories);  
2.编写配置文件,如取配置文件名为logstash.conf，则logstash.conf的内容大致为:  
    
    input{
        stdin｛ //命令行输入，一般用来作为测试用
            
        ｝
    }
    filter{  //也可以没有，表示不进行任何解析和处理
    
    }
    output{ //输出
        elasticsearch { hosts => ["localhost:9200"] }  
        stdout { codec => rubydebug }  //命令行输出，一般用来做测试用
    }
3.执行命令:bin/logstash -f lostash.conf [-l logfile]。

