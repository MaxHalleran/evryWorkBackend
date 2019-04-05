import { amazonQuery } from './functions.js';

export const productsDataRef = () => {
  const productsDbText = Assets.getText('beautyProducts.tsv');
  let rows = productsDbText.split('\n');
  //console.log('product fields: ',rows[0].split('\t'));
  let headerCells = rows[0].split('\t');
  for (let h = 0; h < headerCells.length; h++) {
    //console.log(h, headerCells[h]);
  }
  let data = [];
  for (let r = 1; r < rows.length; r++) {
    let rowData = rows[r].split('\t');
    data.push({
      code: rowData[0],
      url: rowData[1],
      creator: rowData[2],
      created_t: rowData[3],
      created_datetime: rowData[4],
      last_modified_t: rowData[5],
      last_modified_datetime: rowData[6],
      product_name: rowData[7],
      generic_name: rowData[8],
      quantity: rowData[9],
      packaging: rowData[10],
      packaging_tags: rowData[11],
      brands: rowData[12],
      brands_tags: rowData[13],
      categories: rowData[14],
      categories_tags: rowData[15],
      categories_en: rowData[16],
      origins: rowData[17],
      origins_tags: rowData[18],
      manufacturing_places: rowData[19],
      manufacturing_places_tags: rowData[20],
      labels: rowData[21],
      labels_tags: rowData[22],
      labels_en: rowData[23],
      emb_codes: rowData[24],
      emb_codes: rowData[25],
      first_packaging_code_geo: rowData[26],
      cities: rowData[27],
      cities_tags: rowData[28],
      purchase_places: rowData[29],
      stores: rowData[30],
      countries: rowData[31],
      countries_tags: rowData[32],
      countries_en: rowData[33],
      ingredients_text: rowData[34],
      allergens: rowData[35],
      allergens_en: rowData[36],
      traces: rowData[37],
      traces_tags: rowData[38],
      traces_en: rowData[39],
      serving_size: rowData[40],
      no_nutriments: rowData[41],
      additives_n: rowData[42],
      additives: rowData[43],
      additives_tags: rowData[44],
      additives_en: rowData[45],
      ingredients_from_palm_oil_n: rowData[46],
      ingredients_from_palm_oil: rowData[47],
      ingredients_from_palm_oil_tags: rowData[48],
      ingredients_that_may_be_from_palm_oil_n: rowData[49],
      ingredients_that_may_be_from_palm_oil: rowData[50],
      ingredients_that_may_be_from_palm_oil_tags: rowData[50],
      main_category: rowData[59],
      main_category_en: rowData[60],
      image_url: rowData[61],
      image_small_url: rowData[62],
    });
  }
  return data;
  //console.log('Example product: ', data[0]);
};

export const linkProductData = (productData, productName) => {
  console.log('Finding data for ', productName);
  for (let p = 0; p < productData.length; p++) {
    if (
      (productData[p].product_name &&
        productData[p].product_name != '' &&
        productData[p].product_name.search(productName) != -1) ||
      (productData[p].generic_name &&
        productData[p].generic_name != '' &&
        productData[p].generic_name.search(productName) != -1)
    ) {
      /*
    if((productData[p].product_name != '' && (productData[p].product_name.search(productName) != -1 || productName.search(productData[p].product_name) != -1))
    || (productData[p].generic_name != '' && (productData[p].generic_name.search(productName) != -1 || productName.search(productData[p].generic_name) != -1))){
    */
      return productData[p];
    }
  }
  return false;
};

export const findProducts = () => {
  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'cleanser',
    //MaximumPrice: '4000',
    //MinimumPrice: '200',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'toner',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'serum',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'essence',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'booster',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'eye%20cream',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'oil',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'sunscreen',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'moisturizer',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'chemical%20peels',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'face%20mask',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'emulsion',
  });

  getAmazonProducts({
    BrowseNode: '14717647011',
    SearchIndex: 'Beauty',
    Sort: 'salesrank',
    Keywords: 'exfoliator',
    //Keywords: 'skin%20care',
    //MaximumPrice: '4000',
    //MinimumPrice: '200',
  });
};

export const getAmazonProducts = queryTerms => {
  let currentPage = 1;
  let addedProducts = [];
  let whileStop = 0;
  let requestTime = new Date();
  while (currentPage <= 10 && whileStop < 1000) {
    if (new Date().getTime() - requestTime.getTime() >= 60000) {
      console.log(`Sending Request for Page ${currentPage} to Amazon...`);
      console.log(
        'Progress: ',
        addedProducts.length,
        ' - ',
        addedProducts.length,
        '%'
      );
      requestTime = new Date();
      whileStop++;
      let products = amazonQuery({
        Operation: 'ItemSearch',
        ItemPage: currentPage,
        ResponseGroup:
          'Images,ItemAttributes,Reviews,EditorialReview,SalesRank,BrowseNodes',
        ...queryTerms,
      });

      currentPage++;
      //console.log('Response: ', products.ItemSearchResponse);
      if (
        products.ItemSearchResponse.Items.Request &&
        products.ItemSearchResponse.Items.Request.TotalPages &&
        products.ItemSearchResponse.Items.Request.TotalPages._text &&
        products.ItemSearchResponse.Items.Request < currentPage
      ) {
        currentPage = 10;
      }
      if (
        products.ItemSearchResponse.Items.Request &&
        products.ItemSearchResponse.Items.Request.Errors
      ) {
        //products.ItemSearchResponse.Items.Request.isValid._text
        //console.log('Response details', products.ItemSearchResponse.Items.Request.Errors.Error.Code, products.ItemSearchResponse.Items.Request.Errors.Error.Message);
      }
      if (
        products &&
        products.ItemSearchResponse &&
        products.ItemSearchResponse.Items &&
        products.ItemSearchResponse.Items.Item
      ) {
        for (
          let p = 0;
          p < products.ItemSearchResponse.Items.Item.length;
          p++
        ) {
          let product = products.ItemSearchResponse.Items.Item[p];
          let newProduct = processAmazonProduct(product);
          addedProducts.push(newProduct);
        }
      }
    }
  }
};

export const processAmazonProduct = product => {
  if (!Products.findOne({ asin: product.ASIN._text })) {
    let titleRexEx = new RegExp(
      `(${
        product.ItemAttributes.Manufacturer._text
      })|((,|-|;) +?[0-9]+(\.[0-9]+)? +?(((fl\.?)? ?oz\.?)|(ounces?\.?)|(pounds?\.?)|count?\.?|lbs?\.?|grams?\.?|mls?\.?|milliliters?\.?)?)`,
      'ig'
    );

    let title = product.ItemAttributes.Title._text.replace(titleRexEx, '');
    console.log('Product Title:', title);

    let features = [];
    if (product.ItemAttributes.Feature) {
      for (let f = 0; f < product.ItemAttributes.Feature.length; f++) {
        features.push(product.ItemAttributes.Feature[f]._text);
      }
    }

    let nodeIds = [];
    if (product.BrowseNodes && product.BrowseNodes.BrowseNode.Ancestors) {
      nodeIds = processAmazonParentNodes(
        product.BrowseNodes.BrowseNode.Ancestors.BrowseNode
      ).nodeIds.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      });
    }

    let newProduct = {
      name: title,
      buyLink: product.DetailPageURL._text,
      asin: product.ASIN._text,
      productGroup: product.ItemAttributes.ProductGroup._text,
      salesRank: product.SalesRank._text,
      images: [{ url: product.LargeImage.URL._text }],
      brand: product.ItemAttributes.Manufacturer._text,
      description: product.EditorialReviews.EditorialReview.Content._text,
      categories: nodeIds,
      features,
    };

    Products.insert(newProduct);
    return newProduct;
  }
};

export const processAmazonParentNodes = (nodeData, childId) => {
  // Check and create category if needed based on nodeData.BrowseNodeId._text, nodeData.Name._text, and childId
  let id = nodeData.BrowseNodeId._text;
  const existingCategory = Categories.findOne({
    browseNode: nodeData.BrowseNodeId._text,
  });
  if (!existingCategory) {
    let newCategory = {
      browseNode: nodeData.BrowseNodeId._text,
      name: nodeData.Name._text,
      children: [],
    };
    if (childId) {
      newCategory.children.push(childId);
    }
    id = Categories.insert(newCategory);
  } else {
    id = existingCategory._id;
    if (childId) {
      let children = existingCategory.children;
      if (!children) {
        children = [];
      }

      if (existingCategory.children.indexOf(childId) == -1) {
        children.push(childId);
      }
      Categories.update(existingCategory._id, { $set: { children } });
    }
  }
  let nodeIds = [id];
  if (nodeData.Ancestors) {
    nodeIds.push(
      ...processAmazonParentNodes(nodeData.Ancestors.BrowseNode).nodeIds,
      id
    );
  }

  return {
    nodeIds,
  };
};

//findProducts();
