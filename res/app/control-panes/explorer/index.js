require('./explorer.css')

const S_IFMT  = 0o0170000
const S_IFDIR = 0o040000
const S_IFLNK = 0o120000

module.exports = angular.module('stf.explorer', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('control-panes/explorer/explorer.pug',
      require('./explorer.pug')
    )
  }])
  .filter('formatPermissionMode', function() {
    return function(mode) {
      if (mode !== null) {
        var res = []
        var s = ['x', 'w', 'r']
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            if ((mode >> (i * 3 + j)) & 1 !== 0) {
              res.unshift(s[j])
            } else {
              res.unshift('-')
            }
          }
        }
        res.unshift((mode & S_IFMT) === S_IFDIR ? 'd' : ((mode & S_IFMT) === S_IFLNK ? 'l' : '-'))
        return res.join('')
      }
    }
  })
  .filter('fileIsDir', function() {
    return function(m) {
      var mode = m
      if (mode !== null) {
        mode = parseInt(mode, 10)
        return ((mode & S_IFMT) === S_IFDIR) || ((mode & S_IFMT) === S_IFLNK)
      }
    }
  })
  .filter('formatFileSize', function() {
    return function(size) {
      var formattedSize
      if (size < 1024) {
        formattedSize = size + ' B'
      } else if (size >= 1024 && size < 1024 * 1024) {
        formattedSize = Math.round(size / 1024, 1) + ' Kb'
      } else {
        formattedSize = Math.round(size / (1024 * 1024), 1) + ' Mb'
      }
      return formattedSize
    }
  })
  .filter('formatFileDate', function() {
    return function(inputString) {
      var input = new Date(inputString)
      return input instanceof Date ?
        input.toISOString().substring(0, 19).replace('T', ' ') :
        (input.toLocaleString || input.toString).apply(input)
    }
  })

  .controller('ExplorerCtrl', require('./explorer-controller'))
