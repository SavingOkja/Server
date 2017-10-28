const express = require('express');
const router          = express.Router();


/* GET users listing. */
router.route('/member')
.post((req, res)=>{
  const properties = [ "firebaseToken", "img"];
  for(var i=0; i< properties.length;i++){
      if(!req.body.hasOwnProperty(properties[i])){
          res.json({
              result: false,
              msg: "req.body."+properties[i]+"이 없습니다."
          });
          return;
      }
  }
  pool.query('insert into saving_okja.usr(facebook_token,img) values(?,?)',[  req.body.firebaseToken,req.body.img ], function( err, results ) {
    if (err){
    	console.log(err);
    	res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    console.log(results);
    if( results.affectedRows > 0 ){
      res.status(201).json({
        result: true,
        msg: "업데이트가 완료되었습니다.",
      });
    }else{
      res.status(201).json({
        result: false,
        msg: "업데이트가 실패되었습니다.",
      });
    }


  });

})
.get((req, res)=>{

});

module.exports = router;
