---
layout: post
title: nginx的网站跨域设置
author: 一朵云
tags: nginx,跨域
---
　　本文适用于用nginx服务器来转发web请求的场景。  
　　web应用通常会碰到跨域请求的问题。一种情况是一个域名向另一个不同域名请求资源。 比如：我当前的域名是http://a.abc.com，我现在要去请求http://b.def.com下的资源，这就是一种跨域请求。  
　　另一种情况，在同一域名下也可能出现跨域请求。如：在顶级域名下请求二级域名的资源，http://www.abc.com 访问 http://cdn.abc.com的资源。  
　　以下就是第二种情况:  
　　我们的资源文件是放在主站域名的二级域名下:cdn.xxx.com，其中包括字体文件，当主站使用了字体文件就会向cdn.xxx.com发送请求，这就形成了跨域，浏览器会报如下错误警告：
    
    Font from origin 'http://cdn.xxxx.com' has been blocked from loading by Cross-Origin Resource   Sharing policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://www.xxxx.com' is therefore not allowed access.
    
说是 http://www.xxxx.com 不被 http://cdn.xxxx.com 服务跨域允许。我们的请求都是通过nginx来进行转发的, 因此可以在 nginx 的 cdn.xxxx.com 服务的配置中加上跨域允许的配置：

    add_header Access-Control-Allow-Origin http://www.xxxx.com;
    add_header Access-Control-Allow-Headers Origin,X-Requested-With,Content-    Type,Accept;
    add_header Access-Control-Allow-Methods POST,GET;
    add_header Access-Control-Allow-Credentials true;
    
    
　　重启nginx就能解决这个问题。以上配置是在请求的返回response的header中添加了  
    
    Access-Control-Allow-Origin http://www.xxxx.com;//允许该域名被访问。
    
    
    也可以允许所有域名访问
    
    
    Access-Control-Allow-Origin *;//允许所有域名访问该资源。
    
　　   
　　另外附上所有跨域访问的条件图：
<img src="http://images.cnitblog.com/blog/451114/201310/16103043-5beb9c6503144f86b41569805be88eec.png">

