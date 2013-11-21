/* globals document */

function decode(s) {
  return decodeURIComponent((s || '').replace( /\+/g, " " ));
}

module.exports = function(queryString) {
  var result = {}, keyAndValue, key, value;

  queryString = queryString || ( document.location.search || '' ).slice( 1 );
  if ( queryString.indexOf( '=' ) < 0 ) { return result; }

  var keyValuePairs = queryString.split( '&' );

  for ( var i = 0; i < keyValuePairs.length; i++ ) {
    keyAndValue = keyValuePairs[ i ].split( '=' );
    key   = decode( keyAndValue[ 0 ] );
    value = decode( keyAndValue[ 1 ] );
    result[ key ] = value;
  }

  return result;
};
