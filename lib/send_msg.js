// 功能：发送消息hook

// call消息的地址
const hook_offset =  "0x5CD2E0" //"0x237C9B"
var ModuleAddress = Process.findModuleByName('wechatwin.dll');
var hookAddress = ModuleAddress.base.add(hook_offset)

// 接收者结构体 wx_id,len(wx_id),len(wx_id)

// 1. 申请12个字节
var sturc_wxid = Memory.alloc(3*4)

// 2. 写入wxid
var wxid = 'filehelper'
var p_wxid = Memory.allocUtf16String(wxid)
sturc_wxid.writePointer(p_wxid)
// 写长度
sturc_wxid.add(0x4).writeUInt(wxid.length)
sturc_wxid.add(0x8).writeUInt(wxid.length)
var p_sturc_wxid = Memory.alloc(4)
p_sturc_wxid.writePointer(sturc_wxid)


// 发送内容的结构体 msg,len(msg),len(msg)
// 3. 写发送文本内容
var msg = 'nihao'
var sturc_msg = Memory.alloc(3*4)
var p_msg = Memory.allocUtf16String(msg)
sturc_msg.writePointer(p_msg)
 
// 写长度
sturc_msg.add(0x4).writeUInt(msg.length)
sturc_msg.add(0x8).writeUInt(msg.length)
var p_sturc_msg = Memory.alloc(4)
p_sturc_msg.writePointer(sturc_msg)

// 写buffer
var p_ecx = Memory.alloc(4)
var buffer = Memory.alloc(1024)
p_ecx.writePointer(buffer);

// 写汇编
const sendMsg_func = Memory.alloc(Process.pageSize);
Memory.patchCode(sendMsg_func, 128, code => {
    const cw = new X86Writer(code, { pc: sendMsg_func });

    cw.putPushU32(0) // esi+4

    cw.putPushU32(0) // 0x0
    cw.putPushU32(1) // 0x1
    cw.putPushU32(0) // eax  
    cw.putPushNearPtr(p_sturc_msg)  // edi

    cw.putMovRegNearPtr('edx',p_sturc_wxid) // edx wxid
    cw.putMovRegNearPtr('ecx',p_ecx) // exc

    cw.putCallAddress(hookAddress)
    cw.putAddRegImm('esp', 0x14)

    cw.putRet();
    cw.flush();
})
const call = new NativeFunction(sendMsg_func, 'void', [])
console.log('call - address:',call);
call()

