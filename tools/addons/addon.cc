#include <nan.h>
#include "alg.h"

using namespace v8;

void decrypt(const Nan::FunctionCallbackInfo<v8::Value>& info) {

  Local<Object> inputBuffer = info[0]->ToObject();
  char *input = node::Buffer::Data(inputBuffer);
  size_t length = node::Buffer::Length(inputBuffer);

  char *buff = (char *)malloc(length);
  memcpy(buff, input, length);

  if(info.Length()>1){
      seal::decrypt(buff, length, info[1]->Uint32Value(), info[2]->Uint32Value(), info[3]->Uint32Value());
  }else{
      seal::decrypt(buff, length);
  }

  info.GetReturnValue().Set(Nan::NewBuffer(buff, length).ToLocalChecked());
}

void encrypt(const Nan::FunctionCallbackInfo<v8::Value>& info) {

  Local<Object> inputBuffer = info[0]->ToObject();
  char *input = node::Buffer::Data(inputBuffer);
  size_t length = node::Buffer::Length(inputBuffer);

  char *buff = (char *)malloc(length);
  memcpy(buff, input, length);

  if(info.Length()>1){
      seal::encrypt(buff, length, info[1]->Uint32Value(), info[2]->Uint32Value(), info[3]->Uint32Value());
  }else{
      seal::encrypt(buff, length);
  }

  info.GetReturnValue().Set(Nan::NewBuffer(buff, length).ToLocalChecked());
}

void InitAll(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("decrypt").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(decrypt)->GetFunction());

  exports->Set(Nan::New("encrypt").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(encrypt)->GetFunction());
}

NODE_MODULE(SealUtil, InitAll)