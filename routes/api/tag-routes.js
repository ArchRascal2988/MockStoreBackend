const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/',async (req, res) => {
  try{
    const data= await Tag.findAll({inlcude:[{
      model: Product,
      through: ProductTag,
      as: "associated_products"
    }]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.get('/:id',async (req, res) => {
  try{
    const data= await Tag.findByPk(req.params.id,{inlcude:[{
      model: Product,
      through: ProductTag,
      as: "associated_products"
    }]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.post('/',async (req, res) => {
  try{
    const data= await Tag.create({tag_name: req.body.tag_name});
    res.status(200).json(data);
  }catch(err){
    res.status(400).json(err);
  }
});

router.put('/:id',async (req, res) => {
  try{
    const data= await Tag.update(
      {
      tag_name: req.body.tag_name
      },
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

router.delete('/:id',async (req, res) => {
  try{
    const data= await Tag.destroy(
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
