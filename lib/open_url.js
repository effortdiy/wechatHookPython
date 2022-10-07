// 功能：用微信浏览器打开指定的url

// call消息的地址
const hook_offset =  "0x1AAA30" //"0x237C9B"
var ModuleAddress = Process.findModuleByName('wechatwin.dll');
var hookAddress = ModuleAddress.base.add(hook_offset)

// edx+8
var edx = Memory.alloc(1024);
edx.add(0x8).writeUInt(0x2);

// edx +34
var url = "https://www.baidu.com";
var p_url = Memory.alloc(1024);
p_url.writeUtf16String(url);
edx.add(0x34).writePointer(p_url);
edx.add(0x38).writeUInt(url.length);
edx.add(0x3C).writeUInt(url.length);

var p_edx = Memory.alloc(4);
p_edx.writePointer(edx);

var ecx = Memory.alloc(1024);
var p_ecx = Memory.alloc(4);
p_ecx.writePointer(ecx);


// 写汇编
const open_url = Memory.alloc(Process.pageSize);
Memory.patchCode(open_url, 128, code => {
    const cw = new X86Writer(code, { pc: open_url });
    cw.putPushNearPtr(p_edx); // push eax
    cw.putMovRegNearPtr('ecx',p_ecx) // exc
    cw.putCallAddress(hookAddress)
    // cw.putMovRegU32('al',0x1) // 不知道为什么报错，算了不搞了
    cw.putPopReg('esi');
    cw.putMovRegReg('ecx','esi')
    cw.putPopReg('ebp');
    cw.putRet();
    cw.flush();
})
const call = new NativeFunction(open_url, 'void', [])
console.log('call - address:',call);
call()

