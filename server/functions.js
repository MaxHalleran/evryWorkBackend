import { HTTP } from 'meteor/http';
import crypto from 'crypto';
var convert = require('xml-js');

export const amazonQuery = (params, method = 'GET', url) => {
  const key = Meteor.settings.apiKeys.amazonProducts.accessKey;
  const secret = Meteor.settings.apiKeys.amazonProducts.secret;
  const associateTag = Meteor.settings.apiKeys.amazonProducts.associateTag;
  const time = ISODateString(new Date());

  params = {
    ...params,
    Service: 'AWSECommerceService',
    AssociateTag: associateTag,
    AWSAccessKeyId: key,
    Version: '2013-08-01',
    Timestamp: time,
  };

  params = orderKeys(params);

  const baseUrl = 'webservices.amazon.com';
  const endpoint = '/onca/xml';
  url = 'http://webservices.amazon.com/onca/xml';
  let hash = createHmac(baseUrl, endpoint, params, secret, method);
  params.Signature = hash;
  let res;
  if(method == 'GET'){
    let queryString = Object.keys(params).sort().map(param => {
      return `${param}=${encodeURIComponent(params[param])}`;
    }).join('&');
    url += `?${queryString}`;

    res = HTTP.call(
      method,
      url,
    );
  }
  return JSON.parse(convert.xml2json(res.content, {compact: true, spaces: 4}));
};

export const createHmac = (baseUrl, endpoint, params, secret, method) => {
  let queryString = Object.keys(params).sort().map(param => {
    return `${param}=${encodeURIComponent(params[param])}`;
  }).join('&');
  let unsigned = `${method}\n${baseUrl}\n${endpoint}\n${queryString}`;
  return crypto.createHmac('sha256', secret).update(unsigned).digest('base64');
}

export const parseCSV = data => {
  let rows = data.split('\n');
  for(let r = 0; r<rows.length;r++){
    rows[r] = rows[r].split(',').map(cell=>{
      return cell.slice(1,-1);
    });
  }
  return rows;
}

export const ISODateString = d => {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+'Z'
}

export const orderKeys = obj => {

  var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
      if (k1 < k2) return -1;
      else if (k1 > k2) return +1;
      else return 0;
  });

  var i, after = {};
  for (i = 0; i < keys.length; i++) {
    after[keys[i]] = obj[keys[i]];
    delete obj[keys[i]];
  }

  for (i = 0; i < keys.length; i++) {
    obj[keys[i]] = after[keys[i]];
  }
  return obj;
}

/*amazonQuery({'Operation': 'ItemLookup',
'ResponseGroup': 'Images,ItemAttributes,Offers,Reviews',
'ItemId': '0679722769'});*/
