
baseaddr=0x673D9654
hookaddr =0x66c80000
offset = 0x759654

import frida
import sys
import codecs


def on_message(message, data):
    if message['payload']['wxid2'] is None:
        print('[个人消息]: ' + message['payload']['wxid'] + ': ' + message['payload']['content'])
    else:
        print('[群消息]: ' + message['payload']['wxid'] + ': ' + message['payload']['wxid2'] + ': ' +
              message['payload']['content'])


def main(target_process):
    session = frida.attach(target_process)
    with codecs.open('lib/rev_msg.js', 'r', 'utf-8') as f:
        source = f.read()
    script = session.create_script(source)
    script.on('message', on_message)
    script.load()
    print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
    sys.stdin.read()
    session.detach()


if __name__ == '__main__':
    main('wechat.exe')