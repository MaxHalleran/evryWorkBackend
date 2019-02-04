import { parseCSV } from '/server/functions';

Meteor.methods({
  'product.create': product => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Products.insert(product);
  },
  'product.edit': (productId, product) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Products.update(productId, {$set: product});
  },
  'product.delete': (productId) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    return Products.remove(productId);
  },
  'products.search': (searchTerm, options = {limit: 40}) => {
    return Products.find({$text: {$search: searchTerm}}, options).fetch();
  },
  'products.get': (query, options = {limit: 40}) => {
    return {
      products: Products.find(query, options).fetch(),
      totalProductLength: Products.find(query).count(),
    };
  },
  'products.export': () => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    let products = Meteor.call('products.get', {}, {limit: 0}).products;

    let data = [
      ['Product Id', 'Name', 'Highlighted', 'Buy Link', 'Ingredients', 'asin',
      'Product Group', 'Sales Rank', 'Features', 'Images', 'Categories', 'Brand', 'Tags', 'Description'],
    ];
    for(let p = 0; p<products.length; p++){
      let product = products[p];
      let categories = '',
          images = '',
          features = '',
          tags = '';

      if(product.categories){
        for(let c = 0; c<product.categories.length; c++){
          categories += `${product.categories[c]}, `;
        }
        categories = categories.slice(0, -2);
      }

      if(product.images){
        for(let i = 0; i<product.images.length; i++){
          images += `${product.images[i].url}, `;
        }
        images = images.slice(0, -2);
      }

      if(product.features){
        for(let f = 0; f<product.features.length; f++){
          features += `${product.features[f]} <br/> `;
        }
        features = features.slice(0, -7);
      }

      if(product.tags){
        for(let t = 0; t<product.tags.length; t++){
          tags += `${product.tags[t]}, `;
        }
        tags = tags.slice(0, -2);
      }

      data.push([product._id, product.name, product.highlight, product.buyLink, product.ingredients, product.asin,
        product.productGroup, product.salesRank, features, images, categories, product.brand, tags, product.description ])
    }
    return data;
  },
  'products.import': (productsData) => {
    if(!Meteor.user() || !Meteor.user().isAdmin()){
      throw new Meteor.Error('access-denied', 'You do not have permission to do this');
    }
    if(!productsData){
      throw new Meteor.Error('invalid-request', 'Data not supplied');
    }
    productsData = parseCSV(productsData);
    if(/product id/i.test(productsData[0])){
      productsData.shift();
    }
    for(let p = 0; p<productsData.length;p++){
      let product = productsData[p];

      let features = [];
      if(product[8]){
        features = product[8].split('<br/>').map(feature=>{
          return feature.trim();
        });
      }

      let images = [];
      if(product[9]){
        images = product[9].split(',').map(image=>{
          return {url: image.trim()};
        });
      }

      let categories = [];
      if(product[10]){
        categories = product[10].split(',').map(category=>{
          return category.trim();
        });
      }

      let tags = [];
      if(product[12]){
        tags = product[12].split(',').map(tag=>{
          return tag.trim();
        });
      }

      let highlight = false;


      let productObj = {
        name: product[1],
        highlight: product[2]?true:false,
        buyLink: product[3],
        ingredients: product[4],
        asin: product[5],
        productGroup: product[6],
        salesRank: product[7],
        features: features,
        images: images,
        categories: categories,
        brand: product[11],
        tags: tags,
        description: product[13],
      };

      if(product[0] && product[0] != '' && Products.findOne(product[0])){
        //Is existing product. Update, don't insert new.
        Products.update(product[0], {$set: productObj });
      }else{
        //Not an existing product. Lets insert a new product.
        Products.insert(productObj);
      }
    }
    return true;
  },
});
