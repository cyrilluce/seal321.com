#include "alg.h"
namespace seal{

    const DWORD ck1 = 0xC8A397EF;
    const DWORD ck2 = 0xB209DDC5;
    const DWORD ck3 = 0xF82B796A;

    void encrypt(char *buff,long size,DWORD k1,DWORD k2,DWORD k3){
        signed int orgKey = k3^ck3; // orig key
        signed int imulKey = k1^ck1; // imul key
        signed int addKey = k2^ck2; // add key
        signed int key = orgKey;
//        signed int t=0;
        signed char c = 0;
        for(int i=0;i<size;i++){
                c = buff[i];

                buff[i]=c^(key>>8);

                key += buff[i];
                key = key*imulKey+addKey;
        }
    /*        _asm{
                    push esi;
                    xor esi, esi;
                    cmp len, esi;
                    push edi;
                    mov edi, orgKey;
                    jle end;

    loopbegin:
                    mov eax, buff;
                    add eax, esi;
                    mov cl, [eax];
                    mov edx, edi;
                    sar edx, 8;
                    xor dl, cl;
                    mov [eax], dl;
                    movsx eax, dl;
                    add eax, edi;
                    imul eax, imulKey;
                    add eax, addKey;
                    inc esi;
                    cmp esi, len;
                    mov edi, eax;
                    jl loopbegin;
    end:
                    pop edi;
                    pop esi;
            }*/
    }
    void decrypt(char *buff,long size,DWORD k1,DWORD k2,DWORD k3){
        signed int orgKey = k3^ck3; // orig key
        signed int imulKey = k1^ck1; // imul key
        signed int addKey = k2^ck2; // add key
        signed int key = orgKey;
        signed char c = 0;
        for(int i=0;i<size;i++){
                c = buff[i];

                buff[i]=c^(key>>8);

                key += c;
                key = key*imulKey+addKey;
        }
            /*_asm{
                    push esi;
                    xor esi, esi;
                    cmp len, esi;
                    push edi;
                    mov edi, orgKey;
                    jle end;

    loopbegin:
                    mov eax, buff;
                    add eax, esi;
                    mov cl, [eax];
                    mov edx, edi;
                    sar edx, 8;
                    xor dl, cl;
                    mov [eax], dl;
                    movsx eax, cl;
                    add eax, edi;
                    imul eax, imulKey;
                    add eax, addKey;
                    inc esi;
                    cmp esi, len;
                    mov edi, eax;
                    jl loopbegin;
    end:
                    pop edi;
                    pop esi;
            }*/
    }
    void encrypt(char * buff, long size){
		signed int key = 0x11CFD;
//        signed int t=0;
        signed char c = 0;
        for(int i=0;i<size;i++){
                c = buff[i];

                c=c^(key>>8);
				buff[i]=c;

                key += c;
                key = key*0xce6d+0x58bf;
        }
           /* _asm{
                    push esi;
                    xor esi, esi;
                    cmp len, esi;
                    push edi;
                    mov edi, 0x11CFD;
                    jle end;

    loopbegin:
                    mov eax, buff;
                    add eax, esi;
                    mov cl, [eax];
                    mov edx, edi;
                    sar edx, 8;
                    xor dl, cl;
                    mov [eax], dl;
                    movsx eax, dl;
                    add eax, edi;
                    imul eax, 0x0CE6D;
                    add eax, 0x58BF;
                    inc esi;
                    cmp esi, len;
                    mov edi, eax;
                    jl loopbegin;
    end:
                    pop edi;
                    pop esi;
            }*/
    }

    void decrypt(char * buff, long size){
		signed int key = 0x11CFD;
//        signed int t=0;
        signed char c = 0;
        for(int i=0;i<size;i++){
                c = buff[i];

                buff[i]=c^(key>>8);

                key += c;
                key = key*0xce6d+0x58bf;
        }
            /*_asm{
                    push esi;
                    xor esi, esi;
                    cmp len, esi;
                    push edi;
                    mov edi, 0x11CFD;
                    jle end;

    loopbegin:
                    mov eax, buff;
                    add eax, esi;
                    mov cl, [eax];
                    mov edx, edi;
                    sar edx, 8;
                    xor dl, cl;
                    mov [eax], dl;
                    movsx eax, cl;
                    add eax, edi;
                    imul eax, 0x0CE6D;
                    add eax, 0x58BF;
                    inc esi;
                    cmp esi, len;
                    mov edi, eax;
                    jl loopbegin;
    end:
                    pop edi;
                    pop esi;
            }*/
    }
}
