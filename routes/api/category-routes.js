const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/',async (req, res) => {
  try{
    const data= await Category.findAll({inlcude:[Product]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.get('/:id',async (req, res) => {
  try{
    const data= await Category.findByPk(req.params.id,{inlcude:[{inlcude:[Product]}]});
    res.status(200).json(data);
  } catch(err){
    res.status(400).json(err);
  }
});

router.post('/',async (req, res) => {
  try{
    const data= await Category.create(req.body);
    res.status(200).json(data);
  }catch(err){
    res.status(400).json(err);
  }
});

router.put('/:id',async (req, res) => {
  try{
    const data= await Category.update(
      {
      category_name: req.body.category_name
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
    const data= await Category.destroy(
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
