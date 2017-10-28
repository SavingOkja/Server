const express = require('express');
const router          = express.Router();
const crypto = require('crypto');

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
  let oauth = req.body.firebaseToken;
  oauth = crypto.createHash('sha256').update(oauth).digest('base64');
  console.log('hashed: ' , oauth);

  pool.query('insert into saving_okja.usr(facebook_token,img,oauth) values(?,?,?)',[  req.body.firebaseToken,req.body.img, oauth ], function( err, results ) {

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
	      data: oauth
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
  pool.query('select * from saving_okja.usr where id=?',[req.query.id], function( err, rows ) {
    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    res.status(200).json({
      result: true,
      msg: "usr 정보 들입니다.",
      data: rows
    });
  });
});

router.route('/company')
.get((req, res)=>{

  if( req.query.id ){
    pool.query('select * from saving_okja.company where id=?',[req.query.id], function( err, rows ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

      res.status(200).json({
        result: true,
        msg: "product 들입니다.",
        data: rows
      });
    });
  }else{
    pool.query('select name,id from saving_okja.company', function( err, rows ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

      res.status(200).json({
        result: true,
        msg: "company 들입니다.",
        data: rows
      });
    });
  }
});
module.exports = router;
