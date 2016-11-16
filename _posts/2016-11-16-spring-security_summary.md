---
layout: post
title: spring-security配置权限
date: 2016-11-16 23:27
author: 一朵云
categories: java
tags: spring-security 权限管理
---
>权限管理模型  

<img src="/images/authority.png">  

利用spring-security来配置以上权限管理模型。用maven引入相关jar：  
    
            <dependency>
                <groupId>org.springframework.security</groupId>
                <artifactId>spring-security-web</artifactId>
                <version>4.2.0.RELEASE</version>
            </dependency>
            <dependency>
                <groupId>org.springframework.security</groupId>
                <artifactId>spring-security-config</artifactId>
                <version>4.2.0.RELEASE</version>
            </dependency>
 
>以下是spring-security.xml的配置:  
    
    <beans:beans xmlns="http://www.springframework.org/schema/security"
             xmlns:beans="http://www.springframework.org/schema/beans"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.springframework.org/schema/beans
		http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/security
		http://www.springframework.org/schema/security/spring-security.xsd">




    <http auto-config="true"> <!-- entry-point-ref="loginUrlAuthenticationEntryPoint" 用了form-login就不需要这个配置了-->

        <intercept-url pattern="/login.html" access="IS_AUTHENTICATED_ANONYMOUSLY" />
        <logout logout-success-url="/login.html" logout-url="/logout.do"  delete-cookies="JSESSIONID"/>
        <!-- 退出登陆时，删除session对应的cookie -->


        <form-login login-page="/login.html"
                    login-processing-url="/login.do"
                    username-parameter="username"
                    password-parameter="password"
                    default-target-url="/index.html"
                    always-use-default-target="true"
                    authentication-failure-handler-ref="exceptionMappingAuthenticationFailureHandler"
                />

        <!--
            session管理
            invalid-session-url=session过期之后跳转到的链接
            session-fixation-protection:session-fixation攻击防御
        -->
        <session-management invalid-session-url="/login.html" session-fixation-protection="migrateSession">
            <concurrency-control max-sessions="1" error-if-maximum-exceeded="true" />
        </session-management>

        <!-- ExceptionTranslationFilter捕获AccessDeniedException -->
        <access-denied-handler ref="myAccessDeniedHandler" />

        <!--
        添加 FILTER_SECURITY_INTERCEPTOR 到 FilterChain
        FILTER_SECURITY_INTERCEPTOR: 保护web资源，并且在访问被拒绝时抛出异常　
        -->
        <custom-filter position="FILTER_SECURITY_INTERCEPTOR" ref="filterSecurityInterceptor" />
    </http>



    <!--
        该类指定了登陆的入口,若ExceptionTranslationFilter中捕获了AuthenticationException或者AccessDeniedException
        则会跳转到该入口
     -->
    <!--<beans:bean id="loginUrlAuthenticationEntryPoint"-->
                <!--class="org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint">-->
        <!--<beans:constructor-arg name="loginFormUrl" value="/login.html" />-->
    <!--</beans:bean>-->





    <!-- 定位登陆认证过程中的异常 -->
    <beans:bean id="exceptionMappingAuthenticationFailureHandler"
            class="org.springframework.security.web.authentication.ExceptionMappingAuthenticationFailureHandler">
        <beans:property name="exceptionMappings">
            <beans:map>
                <beans:entry
                        key="org.springframework.security.core.userdetails.UsernameNotFoundException"
                        value="/login.html?errType=authentication" />
                <beans:entry
                        key="org.springframework.security.authentication.BadCredentialsException"
                        value="/login.html?errType=authentication" />
                <beans:entry
                        key="org.springframework.security.authentication.DisabledException"
                        value="/login.html?errType=disabled" />
                <beans:entry key="org.springframework.security.core.AuthenticationException"
                         value="/login.html?errType=authentication" />
            </beans:map>
        </beans:property>
    </beans:bean>


    <!-- 处理ExceptionTranslationFilter捕获的AccessDeniedException -->
    <beans:bean id="myAccessDeniedHandler" class="com.zyy.scenery.web.security.MyAccessDeniedHandler" />


    <!--
    FilterSecurityInterceptor 是用于保护 Http 资源的，  (另外还有MethodSecurityInterceptor是保护方法的)
    它需要一个 AccessDecisionManager 和一个 AuthenticationManager 的引用。
    它会从 SecurityContextHolder 获取 Authentication，
    然后通过 SecurityMetadataSource 可以得知当前请求是否在请求受保护的资源。
    对于请求那些受保护的资源，如果 Authentication.isAuthenticated()返回 false
    或者 FilterSecurityInterceptor 的 alwaysReauthenticate 属性为 true，
    那么将会使用其引用的 AuthenticationManager 再认证一次，认证之后再使用认证后的 Authentication 替换 SecurityContextHolder 中拥有的那个。
    然后就是利用 AccessDecisionManager 进行权限的检查。
    -->
    <beans:bean id="filterSecurityInterceptor"
            class="org.springframework.security.web.access.intercept.FilterSecurityInterceptor">
        <beans:property name="authenticationManager" ref="authenticationManager" />
        <beans:property name="accessDecisionManager" ref="accessDecisionManager" />
        <beans:property name="securityMetadataSource" ref="myFilterInvocationSecurityMetadataSource" />
    </beans:bean>


    <!--
    处理认证请求
    creates a ProviderManager and registers the authentication providers with it
    -->
    <authentication-manager alias="authenticationManager">
        <authentication-provider ref="daoAuthenticationProvider"></authentication-provider>
    </authentication-manager>


    <beans:bean id="daoAuthenticationProvider"
            class="org.springframework.security.authentication.dao.DaoAuthenticationProvider">
        <beans:property name="hideUserNotFoundExceptions" value="false" />
        <beans:property name="userDetailsService" ref="myUserDetailsService" />
        <beans:property name="passwordEncoder" ref="passwordEncoder" />
    </beans:bean>

    <!--
        返回UserDetails，其中包括用户名、密码、和他拥有的权限及账号的可用状态
        Returned UserDetails is an interface that provides getters that guarantee non-null
        provision of authentication information such as the username, password, granted authorities
        and whether the user account is enabled or disabled.
    -->
    <beans:bean id="myUserDetailsService" class="com.zyy.scenery.web.security.MyUserDetailServiceImpl" />

    <!-- blowfish算法加密 -->
    <beans:bean id="passwordEncoder" class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder"/>


    <!--  鉴权管理，　若没有通过授权，抛出AccessDeniedException -->
    <beans:bean id="accessDecisionManager" class="org.springframework.security.access.vote.AffirmativeBased">
        <beans:constructor-arg name="decisionVoters">
            <!-- 鉴权策略 -->
            <beans:list>
                <beans:bean class="org.springframework.security.access.vote.RoleVoter" />
                <beans:bean class="org.springframework.security.access.vote.AuthenticatedVoter" />
            </beans:list>
        </beans:constructor-arg>
    </beans:bean>

    <!--
    维持了资源和拥有该资源权限据色色的对应关系　以及web资源匹配规则
    若访问某个web链接，匹配得到该web链接对应资源的角色集合，提供给accessDecisionManager进行权限的判断
    -->
    <beans:bean id="myFilterInvocationSecurityMetadataSource"
            class="com.zyy.scenery.web.security.MyFilterInvocationSecurityMetadataSource" />
    </beans:beans>


参考资料:  
1.官方文档:[http://docs.spring.io/spring-security/site/docs/4.2.0.RELEASE/reference/htmlsingle/](http://docs.spring.io/spring-security/site/docs/4.2.0.RELEASE/reference/htmlsingle/);  
2.极客学院文档:[http://wiki.jikexueyuan.com/project/spring-security/](http://wiki.jikexueyuan.com/project/spring-security/);  
3.我的代码demo:[https://github.com/yunzhongshu/spring-security-demo](https://github.com/yunzhongshu/spring-security-demo)。  


