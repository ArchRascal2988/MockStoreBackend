const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/',async (req, res) => {
  try{
    const data= await Product.findAll({inlcude:[{
      model: Tag,
      through: ProductTag,
      as: "associated_tags"
    },
    {
      model: Category,
      through: Product,
      as: "category_id"
    }
  ]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.get('/:id',async (req, res) => {
  try{
    const data= await Product.findByPk(req.params.id,{inlcude:[{
      model: Tag,
      through: ProductTag,
      as: "associated_tags"
    },
    {
      model: Category,
      through: Product,
      as: "category_id"
    }
  ]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      let tagArr= req.body.tagIds;
      if (tagArr.length) {
        const productTagIdArr = tagArr.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { product_id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id',async (req, res) => {
    try{
    const data= await Product.destroy(
      {
        where:{
          id: req.params.id
        }
      });
    res.status(200).json(data);
  }catch(err){
    res.status(400).json(err);
  }
});

module.exports = router;
