// 功能：获取微信内跳转打开的网页

const receWebURL_offset = "0x68F558"

var ModuleAddress = Process.findModuleByName('wechatwin.dll');
var hookAddress = ModuleAddress.base.add(receWebURL_offset)
Interceptor.attach(hookAddress, {
    onEnter: function (args) {        
        var edx = this.context.edx;
        var p_edx = Memory.readPointer(edx)
        // 微信浏览器的url
        var url = Memory.readUtf8String(p_edx);
        // 把消息传到方法
        send({'url': url,'p_edx':p_edx})


        var eax = this.context.eax;
        var p_eax8 = Memory.readPointer(eax.add('0x8'))
        // 微信浏览器的url
        var url = Memory.readUtf8String(p_eax8);
        // 把消息传到方法
        send({'url': url,'p_eax8':p_eax8})
    }
})