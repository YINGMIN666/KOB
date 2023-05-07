package com.kob.backend.consumer;


import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.Game;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;


@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {


    //静态变量存储所有链接，每个实列在线程里，所以公共用线程安全的
    //静态变量就是对所有的实列都可以见，访问同一个哈希表
    //加static相当于全局变量，不加static相当于局部变量
    final private static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    final private static CopyOnWriteArraySet<User> matchpool = new CopyOnWriteArraySet<>();
    //将session存在每一个user（用户信息）中，user持有session，成员变量
    private User user;
    //websocket的API, 每个链接是session维护
    private Session session = null;
    // 下面要查询userId对应的数据，所以要注入一个usermapper，
    private static UserMapper userMapper;

    //spring里面组件都是单列模式，websocket不是spring里的，所以注入方式不一样，WebSocket不是一个单例模式
    //特殊注入，把autowired，加到set函数里
    //单例就是每个类同一时间就一个实列

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }



    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // 建立连接
        this.session = session;//将session存入
        System.out.println("connected!");
        //建立链接时候需要从token读取当前的id是谁
        // 取出userId
        Integer userId = JwtAuthentication.getUserId(token);
        //查数据库
        this.user = userMapper.selectById(userId);

        if (this.user != null) {
            users.put(userId, this);//存下用户
        } else {
            this.session.close();
        }

        System.out.println(users);


    }

    public void onClose() {
        System.out.println("disconnected!");
        if (this.user != null) {
            users.remove(this.user.getId());
            matchpool.remove(this.user);
        }
    }

    private void startMatching() {
        System.out.println("start matching!");
        matchpool.add(this.user);

        while (matchpool.size() >= 2) {
            Iterator<User> it = matchpool.iterator();
            User a = it.next(), b = it.next();
            matchpool.remove(a);
            matchpool.remove(b);

            //先存在局部变量里
            Game game = new Game(13, 14, 20);
            game.createMap();//触发地图

            JSONObject respA = new JSONObject();
            respA.put("event", "start-matching");
            respA.put("opponent_username", b.getUsername());
            respA.put("opponent_photo", b.getPhoto());
            respA.put("gamemap", game.getG());//返回地图
            users.get(a.getId()).sendMessage(respA.toJSONString());

            JSONObject respB = new JSONObject();
            respB.put("event", "start-matching");
            respB.put("opponent_username", a.getUsername());
            respB.put("opponent_photo", a.getPhoto());
            respB.put("gamemap", game.getG());//返回地图
            users.get(b.getId()).sendMessage(respB.toJSONString());
        }
    }

    private void stopMatching() {
        System.out.println("stop matching");
        matchpool.remove(this.user);
    }





    @OnMessage
    public void onMessage(String message, Session session) {  // 当做路由
        // 从Client接收消息
        System.out.println("receive message!");
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if ("start-matching".equals(event)) {
            startMatching();
        } else if ("stop-matching".equals(event)) {
            stopMatching();
        }

    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    //后端向前端发送信息
    public void sendMessage(String message) {
        // 异步通信过程，要加锁
        synchronized (this.session) {
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
