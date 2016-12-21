namespace seal{
    typedef unsigned char BYTE;
    typedef unsigned short int WORD;
    typedef unsigned long DWORD;
    void encrypt(char *buff,long size,DWORD k1,DWORD k2,DWORD k3);
    void decrypt(char *buff,long size,DWORD k1,DWORD k2,DWORD k3);
    void encrypt(char * buff, long size);
    void decrypt(char * buff, long size);
}
