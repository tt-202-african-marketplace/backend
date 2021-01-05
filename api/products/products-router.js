const router = require('express').Router();
const colors = require('colors');
const dbProducts = require('./products-model.js');

router.get('', async (req, res) => {
    try {
        const all_products = await dbProducts.find();
        res.status(200).json(all_products);
    } catch (error) {
        console.log(error .bgRed);
        res.status(500).json({
            message: 'sever error',
            error
        })
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const found_product = await dbProducts.findById(id);
        if (!found_product) {
            res.status(400).json({
                message: 'product with that id could not be found :('
            })
        } else {
            res.status(200).json(found_product);
        }
    } catch (error) {
        console.log(error .bgRed);
        res.status(500).json({
            message: 'sever error',
            error
        })
    }
})



module.exports = router;