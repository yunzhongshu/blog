---
layout: post
title: logstash同步数据库数据
date: 2016-12-08 08:10
author: 一朵云
categories: linux
tags: logstash 日志收集
---
###业务背景
有一张记录用户通讯录信息的mysql表数据需要实时(相对实时)地同步到elasticsearch中。通讯录表的字段大概如下:  
    
    |id|fr_name|phone|user_id|create_time|update_time|  
通讯录的数据是业务过程中收集过来的先存到mysql表中,并且这些数据可能会随时更新某些数据，更新的信息也要进行同步。
###实现方案
我们想到了用logstash来实现数据同步，它的input插件中有jdbc,output插件中有elasticsearch，是比较理想的选择。
###jdbc插件介绍

jdbc插件实现了logtash从任何支持jdbc的数据库中进行数据获取的途径。我们可以定义一个cron表达式周期性定时查询数据，也可以一次性导入数据到logstash。每条数据表中的记录都将成为一个单独的event,数据格式也将会转化为属性－值的方式。下面是input配置的内容:  
    
    input{
        jdbc{
         jdbc_driver_library => "mysql-connector-java-5.1.35.jar"  #驱动jar的路径
         jdbc_driver_class => "com.mysql.jdbc.Driver"
         jdbc_connection_string => "jdbc:mysql://xx.xx.xx.xx:3306/mydb"
         jdbc_user => "xxxx"
         jdbc_password => "xxxx"
         schedule => "* * * * *"   #定时cron的表达式,这里是每分钟执行一次
         #clean_run => true   #是否保存上一次的查询状态
         last_run_metadata_path => "/xxxx/.logstash_jdbc_last_run_contact/contact_0" #当前查询条件(如下面sql语句中的:sql_last_value值)的记录文件.开始设置一个起始值，以后每次shecule后都会根据当前获取到的最新的"tracking_column"的值　若修改该文件的内容，需要重启logstash才能生效(它每次都有缓存，并不是每次都从该文件获取)
         statement => "SELECT * FROM user_contacts_info_0 WHERE update_time > DATE_ADD(:sql_last_value,INTERVAL 8 HOUR) LIMIT 10000" #根据update_time的值来进行搜索
         jdbc_fetch_size => 1000  #jdbc获取数据的数量大小
         jdbc_page_size => 1000 #jdbc一页的大小，
         jdbc_paging_enabled => true  #和jdbc_page_size组合，将statement的查询分解成多个查询,如:SELECT * FROM (SELECT * FROM user_contacts_info_0 WHERE update_time > DATE_ADD('2016-11-07 04:44:39',INTERVAL 8 HOUR) LIMIT 10000) AS `t1` LIMIT 1000 OFFSET 4000 
         use_column_value => true  #用一个增加的字段查询，而不用timestamp,和tracking_column配合使用
         tracking_column => "update_time"
         codec => "json"  #将resultSet转化为json的event消息
         type => "user_contact" #　给event消息加上字段'type',值为user_contact
        }
    }
>注:  
>1. /xxxx/.logstash_jdbc_last_run_contact/contact\_0的内容为:  "--- 2016-11-13 06:43:43.000000000 Z"  
2. 查询语句中：DATE_ADD(:sql_last_value,INTERVAL 8 HOUR)是因为logstash获取到的时间时区比我们北京时间快了8小时，所以这里加上８小时。

以上流程就是根据update_time(更新时间)来获取需要同步的数据,这里的tracking\_column当然也可以用id或create_time，但是对已经同步过但是数据表中后来更新的数据就没有办法再进行获取了。  
###filter过程
filter阶段的配置如下:
    
    filter{

    	ruby{  # ruby插件
    		code => "event['@timestamp']=event['create_time']" # (code中直接写ruby语句,其中event表示logstash的event对象，可以理解为从input中输入的一条条数据). 这里是将event的@timestamp赋值为 event的create_time属性值
    	}
    
    	mutate {  #mutate插件
    		 gsub => ["phone", "\+86", ""]    #类似java中的 replace操作
    		 gsub => ["phone", "[\+\-(\s)]", ""]
    		 gsub => ["phone", ";", ","]
    		 split => { "phone" => "," }
    	}
    
    	ruby {
    		code => "event['hash']=(event['user_id'].to_i) % 10"  #event增加hash属性，并用属性为"user_id"的值除于10的余数作为值
    	}
    }

###output阶段
output的配置如下:
    
    output{
    	elasticsearch {  # elasticsearch插件
    
            hosts => ["10.160.30.148:10200"] # elasticsearch服务器的http接口地址
    
           # index => "llqdw-contact-%{+YYYY.MM.dd}"  # 目标indices名称，开始用日期作为名称，发现这样会生成好多indices（相当于数据库中的库），我们搜索的时候由于没有办法定位到指定的indices,需要对所有的indices(库)进行遍历搜索，　严重影响我们的查询效率
    	   index => "llqdw-contact-%{hash}"	  # 后来改成了用user_id除于10的余数作为分indices的标准，最多只产生10个indices,而且我们大部分搜索的条件都是含有user_id的，所以每次都可以在查询之前指定要查询的目标indices，大大缩小了搜索的范围
    
            action => "update"　 # 操作执行的动作,可选值有["index", "delete", "create", "update"]
    
            document_id => "contact_%{id}"　＃自定义id值,不指定的话就是一个uuid字符串
    
            doc_as_upsert => true  #支持update模式
        }
  
    }


最终，只要mysql数据表中的记录update_time有更新，就会在１分钟内将这些数据同步到elasticsearch中，非常高效稳定。