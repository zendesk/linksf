// https://github.com/inexorabletash/polyfill/blob/master/obsolete/storage.js
var Storage = function(type) {
  function createCookie(name, value, days) {
      var date, expires;

      if (days) {
          date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
      } else {
          expires = "";
      }
      document.cookie = name + "=" + value + expires + "; path=/";
  }

  function readCookie(name) {
      var nameEQ = name + "=",
          ca = document.cookie.split(';'),
          i, c;

      for (i = 0; i < ca.length; i++) {
          c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1, c.length);
          }

          if (c.indexOf(nameEQ) === 0) {
              return c.substring(nameEQ.length, c.length);
          }
      }
      return null;
  }

  function setData(data) {
      data = JSON.stringify(data);
      if (type == 'session') {
          window.name = data;
      } else {
          createCookie('localStorage', data, 365);
      }
  }

  function clearData() {
      if (type == 'session') {
          window.name = '';
      } else {
          createCookie('localStorage', '', 365);
      }
  }

  function getData() {
      var data = type == 'session' ? window.name : readCookie('localStorage');
      return data ? JSON.parse(data) : {};
  }


  // initialise if there's already data
  var data = getData();

  function numKeys() {
      var n = 0;
      for (var k in data) {
          if (data.hasOwnProperty(k)) {
              n += 1;
          }
      }
      return n;
  }

  return {
      clear: function() {
          data = {};
          clearData();
          this.length = numKeys();
      },
      getItem: function(key) {
          key = encodeURIComponent(key);
          return data[key] === undefined ? null : data[key];
      },
      key: function(i) {
          // not perfect, but works
          var ctr = 0;
          for (var k in data) {
              if (ctr == i) return decodeURIComponent(k);
              else ctr++;
          }
          return null;
      },
      removeItem: function(key) {
          key = encodeURIComponent(key);
          delete data[key];
          setData(data);
          this.length = numKeys();
      },
      setItem: function(key, value) {
          key = encodeURIComponent(key);
          data[key] = String(value);
          setData(data);
          this.length = numKeys();
      },
      length: 0
  };
};

module.exports = Storage;
