/*
    This is function which just gives details about products and call callback along with the details.
*/
module.exports.getProductDetails = function(productId, callback) {
  var request = require('request');
  var options = {
    uri: 'https://affiliate-api.flipkart.net/affiliate/1.0/product.json?id=' + productId,
    method: 'GET',
    headers: require('./flipkart_credentials.json')
  };
  var data;
  request(options, function(error, response, body) {
    if (!error && response != undefined && response.statusCode == 200) {
      data = JSON.parse(body);
      console.log(data)
    } else {
      console.log("Got an error: ", error, ", status code: ", response);
    }
  }).on('complete', function() {
    if (data != undefined)
      callback(data);
  });
}
app.get('/product', function(req, res) {
  helper.getProductDetails(req.param('productId'), function(data) {
    var details = {
      'productId': req.param('productId'),
      'price': data.productBaseInfoV1.flipkartSpecialPrice.amount,
      'name': data.productBaseInfoV1.title,
      'imageurls': data.productBaseInfoV1.imageUrls
    }
    res.send(details);
  });
});
var Appbase = require('appbase-js');
var appbaseCredentials = require('./appbase_credentials.json')
/*
  Function for indexing the product detail into appbase.
*/
module.exports.indexProduct = function(productId) {
  this.getProductDetails(productId, function(data) {
    var price = data.productBaseInfo.productAttributes.sellingPrice.amount;
    var name = data.productBaseInfo.productAttributes.productBrand
    var appbaseRef = new Appbase(appbaseCredentials);
    appbaseRef.index({
      type: appbaseCredentials.type,
      id: productId,
      body: {
        'price': price,
        'productId': productId,
        'name': name
      }
    }).on('data', function(response) {
      console.log(response);
    }).on('error', function(error) {
      console.log(error);
    });
  });
}
app.get('/alert', function(req, res) {
  /* Starting polling for the requested product */
  var mailBody = "You have set the price alert for flipkart product {{{name}}}. Your condition has been matched and Price has reached to {{{price}}}";

  var requestObject = {
    type: appbaseCredentials.type,
    body: {
      "query": {
        "filtered": {
          "query": {
            "match": { "productId": req.param('productId') }
          },
          "filter": {
            "range": {
              "price": {
                "lt": req.param('lte'),
                "gte": req.param('gte')
              }
            }
          }
        }
      }
    }
  }

  var webhookObject = {
    'method': 'POST',
    'url': 'https://api.sendgrid.com/api/mail.send.json',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + sendgrid_api_key
    },
    "count": 1,
    'string_body': 'to=' + req.param('email') + '&subject=Your Flipkart product price Alert&text=' + mailBody + '&from=yash@appbase.io'
  }
  /* Starting stream search for the user condition */
  appbase.searchStreamToURL(requestObject, webhookObject).on('data', function(response) {
    console.log("Webhook has been configured : ", response);
  }).on('error', function(error) {
    console.log("searchStreamToURL() failed with: ", error)
  })
  helper.indexProduct(req.param('productId'));
});
app.get('/alert', function(req, res) {
  /* Starting polling for the requested product */
  var mailBody = "You have set the price alert for flipkart product {{{name}}}. Your condition has been matched and Price has reached to {{{price}}}";

  var requestObject = {
    type: appbaseCredentials.type,
    body: {
      "query": {
        "filtered": {
          "query": {
            "match": { "productId": req.param('productId') }
          },
          "filter": {
            "range": {
              "price": {
                "lt": req.param('lte'),
                "gte": req.param('gte')
              }
            }
          }
        }
      }
    }
  }

  var webhookObject = {
    'method': 'POST',
    'url': 'https://api.sendgrid.com/api/mail.send.json',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + sendgrid_api_key
    },
    "count": 1,
    'string_body': 'to=' + req.param('email') + '&subject=Your Flipkart product price Alert&text=' + mailBody + '&from=yash@appbase.io'
  }
  /* Starting stream search for the user condition */
  appbase.searchStreamToURL(requestObject, webhookObject).on('data', function(response) {
    console.log("Webhook has been configured : ", response);
  }).on('error', function(error) {
    console.log("searchStreamToURL() failed with: ", error)
  })
  helper.indexProduct(req.param('productId'));
});