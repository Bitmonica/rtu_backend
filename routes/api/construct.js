const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');
const axios = require("axios");

const User = require('../../models/User');
const Pool = require('../../models/Pool');

const { update } = require("../../utils/update");
const Pair = require('../../models/Pair');


// /**
//  * @api api/construct
//  * @desc test api
//  */
// router.get('/', async (req, res) => {
//   res.json({ msg: 'test' })
// });

// router.post('/', async (req, res) => {
//   console.log("aaa")
//   try {
//     const response = await axios.get('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
//     const { official, unOfficial } = response.data;
//     const data = [...official, ...unOfficial];
  
//     await Pool.insertMany(data)

//     res.json({"msg": "success"});
//   } catch ( err) {
//     console.log(err);
//     res.json({msg:"err", err: err})
//   }
// });

/**
 * @route api/construct/
 */
router.post('/', async (req, res) => {

  let { index } = req.body;
  index = Number(index);

  const max = await Pool.count();
  
  try {
    
    for (let i = index*300; i < (index+1)*300; i++) {
      if(i*30 > max) break;
      Pool.find().select('id').skip(i*30).limit(30).then(pools => {
        let endpoint = '';
        pools.forEach(({id}) => { endpoint += `${id},` });
        endpoint = endpoint.substring(0, endpoint.length - 1);
        axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${endpoint}`).then(({data}) => {
          // console.log(data.pairs)
          if ( data.pairs ) {
            console.log(data.pairs.length, i);
            const d = data.pairs.map(item => ({ id: item.pairAddress, created: item.pairCreatedAt}));
            try {
              Pair.insertMany(d);
            } catch(e){
              console.log("err")
            }
          } else {
            console.log(null, i);
          }
        })
      });
    }

    res.json({start: index*300*30, end: ((index+1)*300)*30 - 1})

  } catch (err) {
    console.log(err)
  }

});

/**
 * @route api/construct/
 */
router.get('/', async (req, res) => {

  update();

  // const data = await Pool.find().select("id");

  // console.log(data[0])
  // data.map(async({id}, index) => {
  //   const result = await Pair.findOne({id:id});
  //   console.log(id, index);
  //   if(!result) {
  //     console.log("rrr", index);
  //     new Pair({ id:id, created: 0 }).save();
  //   }
  // })
  


});



module.exports = router;

