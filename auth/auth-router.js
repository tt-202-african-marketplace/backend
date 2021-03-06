const router = require('express').Router();
const colors = require('colors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secrets = require('./secrets.js');
const dbAuth = require('../auth/auth-model.js');
const dbProducts = require('../api/products/products-model.js')
const { validateLoginBody, giveRoleId, restricted } = require('./middleware.js');

router.get('/users', async (req, res) => {
    try {
        const all_users = await dbAuth.find();
        res.status(200).json(all_users);
    } catch (error) {
        console.log(error .bgRed);
        res.status(500).json({
            message: 'sever error',
            error
        })
    }
})

router.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const found = await dbAuth.findUserById(id);
        if (!found) {
            res.status(400).json({
                message: 'User with that id does not exist!'
            })
        } else {
            res.status(200).json(found);
        }
    } catch (error) {
        console.log(error .bgRed);
        res.status(500).json({
            message: 'sever error',
            error
        })
    }
})

router.post('/register/:role', giveRoleId, async (req, res) => {
    const new_user = req.body;
    if (!new_user.email || !new_user.password || !new_user.first_name || !new_user.last_name || !new_user.role_id || !new_user.shop_name || !new_user.location_id) {
        res.status(401).json({
            message: 'Please check that all fields are not empty!',
        });
    } else {
        try {
            const hash = bcrypt.hashSync(new_user.password, 10);
            new_user.password = hash;
            const registration = await dbAuth.register(new_user);
            console.log(`registered new user!` .bgMagenta);
            res.status(201).json({
                message: `Thank you for registering, ${registration.first_name}!`, 
                email: registration.email,
                shop_name: registration.shop_name,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'server error - registration'
            })
        }
    }
    
})
// -------------------- //
// POST /login 
// -------------------- //
/* 
 request :
    {
        email: samsam3@email.com,
        password: 1234
    }

response: 
    {
        message: 'Welcome, Sam',
        id: found_user.id,
        token: <realy long hash>
    }
*/
router.post('/login', validateLoginBody, async (req, res) => {
    const {email, password} = req.body;
    try {    
        const found_user = await dbAuth.findByEmail(email);
        if (found_user && bcrypt.compareSync(password, found_user.password)) {
            const token = await jwtGenerator(found_user);
            res.status(200).json({
                message: `Welcome, ${found_user.first_name}`,
                id: found_user.id,
                token,
            })
        } else {
        res.status(401).json({
            message: 'invalid credentials'
        }) 
        }
    } catch (error) {
        console.log(error .bgRed);
        res.status(500).json({
            message: 'server error - login',
            error,
        });
    }
})


router.post('/add-product', async (req, res) => {
    const body = req.body;
    body.user_id = 1;
    const {item_name, category_id, price, user_id} = body;
    if (!item_name || !category_id || !price || !user_id) {
        res.status(400).json({
            message: 'please include all required product info!'
        })
    } else {
        try {
            const ids =  await dbAuth.addProduct(req.body)
            res.status(201).json({
                message: 'product added!', 
                product: await dbProducts.findById(ids[0]) 
            })
        } catch (error) {
            console.log(error .bgRed);
            res.status(500).json({
                message: 'server error - add product',
                error,
            })
        }
    }
    
})

router.delete('/remove-product/:id', restricted, async (req, res) => {
    const {id} = req.params;
    const found_product = await dbProducts.findById(id);
    if (!found_product) {
        res.status(400).json({
            message: `Cannot find product with id: ${id}!`
        })
    } else {
        try {
            const ids =  await dbAuth.removeProduct(id);
            res.status(200).json({
                message: 'product deleted!',
                deleted: {...found_product}
        
            })
        } catch (error) {
            console.log(error .bgRed);
            res.status(500).json({
                message: 'server error - remove product',
                error,
            })
        } 
    }
})

router.put('/edit-product/:id', restricted, async (req, res) => {
    const {id} = req.params;
    const edits = req.body
    const found_product = await dbProducts.findById(id);
    if (!found_product) {
        res.status(400).json({
            message: `product with id: ${id} does not exist!`
        })
    } else if (!edits) {
        res.status(400).json({
            message: `please verify info being edited!`
        })
    } else {
        try {
            const updated = await dbAuth.editProduct(id, edits);
            res.status(201).json({
                message: 'updated product info!',
                changes: `${edits}`
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'server error - edit product',
                error,
            })
        }
    }
})

// -------------------- //
// WEB TOKEN GEN
// -------------------- //
function jwtGenerator(user) {
    const payload = {
      subject: user.id,
      first_name: user.first_name,
      role: user.role_id
    }
    const secret = secrets.jwt_secret;
    const options = {
      expiresIn: 60
    };
  
    return jwt.sign(payload, secret, options);
  } 



module.exports = router;