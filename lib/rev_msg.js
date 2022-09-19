var ModuleAddress = Process.findModuleByName('wechatwin.dll');
//console.log('ModAdress:' + ModAddress.base);
var hookAddress = ModuleAddress.base.add('0x759654')
//console.log('hookAdress' + hookAddress.base)
Interceptor.attach(hookAddress, {
    onEnter: function (args) {        
        var edi = this.context.esi;
        var edi1 = Memory.readPointer(edi)
        // 发送消息类型
        var type = Memory.readPointer(edi1.add('0x38')).toInt32();
        // 发送者微信id
        var wxid = Memory.readUtf16String(Memory.readPointer(edi1.add('0x48')));
        // 发送消息内容
        var content = Memory.readUtf16String(Memory.readPointer(edi1.add('0x70')));
        // 群聊时 发送人的wxid
        var wxid2 = Memory.readUtf16String(Memory.readPointer(edi1.add('0x174')));

        // 把消息传到方法
        send({'wxid': wxid, 'content': content, 'wxid2': wxid2, 'type': type, 'self': self})
    }
})