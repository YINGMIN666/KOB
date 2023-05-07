package com.kob.backend.pojo.controller.pk;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

    @RequestMapping("/")
    public String Index(){
        return "pk/index.html";
    }
}
