#define BUILDING_NODE_EXTENSION
#include <node.h>
#include <node_buffer.h>
#include <string.h>
#include "alg.cc"

using namespace v8;
using namespace node;


Handle<Value> decrypt(const Arguments& args) {
  HandleScope scope;

  Local<Object> inputBuffer = args[0]->ToObject();
  char *input = node::Buffer::Data(inputBuffer);
  size_t length = node::Buffer::Length(inputBuffer);

  node::Buffer *outputBuffer = node::Buffer::New(length);
  char *buff = node::Buffer::Data(outputBuffer);
  memcpy(buff, input, length);

  if(args.Length()>1){
      seal::decrypt(buff, length, args[1]->Uint32Value(), args[2]->Uint32Value(), args[3]->Uint32Value());
  }else{
      seal::decrypt(buff, length);
  }

  return scope.Close(outputBuffer->handle_);
}

Handle<Value> encrypt(const Arguments& args) {
  HandleScope scope;

  Local<Object> inputBuffer = args[0]->ToObject();
  char *input = node::Buffer::Data(inputBuffer);
  size_t length = node::Buffer::Length(inputBuffer);

  node::Buffer *outputBuffer = node::Buffer::New(length);
  char *buff = node::Buffer::Data(outputBuffer);
  memcpy(buff, input, length);

  if(args.Length()>1){
      seal::encrypt(buff, length, args[1]->Uint32Value(), args[2]->Uint32Value(), args[3]->Uint32Value());
  }else{
      seal::encrypt(buff, length);
  }

  return scope.Close(outputBuffer->handle_);
}

void Initialize(Handle<Object> target) {
  target->Set(String::NewSymbol("decrypt"),
      FunctionTemplate::New(decrypt)->GetFunction());
  target->Set(String::NewSymbol("encrypt"),
      FunctionTemplate::New(encrypt)->GetFunction());
}

NODE_MODULE(SealUtil, Initialize)