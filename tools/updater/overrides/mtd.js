/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
const Rx = require('rx')
const fs = require('fs')
const _ = require('lodash')
const createFD = require('./createFD')
const initMTD = require('./initMTD')
const initParams = require('./initParams')
const downloadMTD = require('./downloadMTD')

class Download {
  constructor (ob, options) {
    this.options = initParams(options)
    this.ob = ob
    this.fd = createFD(ob, this.options.mtdPath)
    this.stats = new Rx.BehaviorSubject()
    this.toStat = _.curry((event, message) => this.stats.onNext({event, message}))
    this.toStat('INIT', this.options)
  }

  start () {
    return this
      .init()
      .flatMap(() => this.download())
  }

  init () {
      var _fd;
      const ob = this.ob
      const fd = this.fd('w')
        .do(x=>_fd=x)
    return initMTD(this.ob, fd, this.options)
      .tap(this.toStat('CREATE'))
        .tapOnCompleted(() => ob.fsClose(_fd))
  }

  download () {
      var _fd;
    const fd = this.fd('r+')
      .do(x=>_fd=x)
    const options = this.options
    const ob = this.ob

    return downloadMTD(ob, fd)
      .tap(this.toStat('DATA'))
      .last()
      .flatMap(x => ob.fsTruncate(options.mtdPath, x.totalBytes))
      .tap(this.toStat('TRUNCATE'))
      .flatMap(() => ob.fsRename(options.mtdPath, options.path))
      .tap(this.toStat('RENAME'))
      .flatMap(() => ob.fsClose(_fd))
      .tapOnCompleted(x => this.stats.onCompleted())
  }

  stop () {}
}
module.exports = Download
