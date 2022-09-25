// 功能：用于获取当前聊天窗口的用户信息

const hook_offset = "0x236dd0"
var ModuleAddress = Process.findModuleByName('wechatwin.dll');
var hookAddress = ModuleAddress.base.add(hook_offset)

const mmhead_offset = "0x128"

Interceptor.attach(hookAddress, {
    onEnter: function (args) {        
        var eax = this.context.eax;
        var p_eax = Memory.readPointer(eax);

        // wxid
        var wxid = Memory.readUtf16String(p_eax);

        // 自己定的微信id
        var n_wxid = Memory.readUtf16String(Memory.readPointer(eax.add('0x3C')));

        // nickname
        var nickname = Memory.readUtf16String(Memory.readPointer(eax.add('0x84')));

        // 备注名
        var note_nickname = Memory.readUtf16String(Memory.readPointer(eax.add('0x70')));

        // 头像
        var mmhead = Memory.readUtf16String(Memory.readPointer(eax.add(mmhead_offset)));

        // CN
        var nation = Memory.readUtf16String(Memory.readPointer(eax.add('0x1c8')));

        // 省
        var provinces = Memory.readUtf16String(Memory.readPointer(eax.add('0x1DC')));

        // 市
        var city = Memory.readUtf16String(Memory.readPointer(eax.add('0x1F0')));

        // 把消息传到方法
        send({'wxid': wxid,'n_wxid':n_wxid,'nickname':nickname,'note_nickname':note_nickname, 'mmhead': mmhead, 'nation': nation, 'provinces': provinces,'city':city})
    }
})

