const express = require('express');
const router          = express.Router();
const crypto = require('crypto');

/* GET users listing. */
router.route('/member')
.post((req, res)=>{
  const properties = [ "facebookToken", "img"];
  for(var i=0; i< properties.length;i++){
      if(!req.body.hasOwnProperty(properties[i])){
          res.json({
              result: false,
              msg: "req.body."+properties[i]+"이 없습니다."
          });
          return;
      }
  }
  let oauth = req.body.facebookToken;
  oauth = crypto.createHash('sha256').update(oauth).digest('base64');
  console.log('hashed: ' , oauth);

  pool.query('insert into saving_okja.usr(facebook_token,img,id) values(?,?,?)',[  req.body.facebookToken,req.body.img, oauth ], function( err, results ) {

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

router.route('/member/favorite')
.put((req, res)=>{


  pool.query('select favorite_list from saving_okja.usr where id = ?',[ req.body.user_id ], function( err, rows ) {

    if (err){
    	console.log(err);
    	res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }


    console.log(rows[0].favorite_list);

    favoriteUpdate(rows[0].favorite_list);
  });

  const favoriteUpdate = (fv) => {
  	console.log(typeof fv);
  	fv = JSON.parse(fv);
  	console.log(typeof fv);
      fv.push(req.body.company_id);

    let ar = JSON.stringify(fv);
    pool.query('update saving_okja.usr set favorite_list = ? where id = ?;',[ ar, req.body.user_id ], function( err, results ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

      if(results.affectedRows == 1){
        res.json({
          result: true,
          msg: "됬습니다",
        });
      }else{
        res.json({
          result: false,
          msg: "update실패",
        });

      }

    });
  };


})
.get((req, res)=>{

  pool.query('select favorite_list from saving_okja.usr where id=?',[req.query.id], function( err, rows ) {

    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    if(rows[0].length !== 0){
      res.status(200).json({
        result: true,
        msg: "favorite_list 입니다.",
        data: rows[0].favorite_list
      });
    }else{
      res.status(200).json({
        result: true,
        msg: "favorite_list가 없습니다",
      });
    }

  });
});

router.route('/member/history')
.put((req, res)=>{
  pool.query('select history from saving_okja.usr where id = ?',[ req.body.id ], function( err, rows ) {

    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    historyUpdate(rows[0].history);

  });
  const historyUpdate = (hs) => {
    hs = JSON.parse(hs);
    if( hs !== null){

      hs.push(req.body.company_id);
    }

    hs = JSON.stringify(hs);
    pool.query('update saving_okja.usr set favorite_list = ? where id = ?;',[ hs, req.body.id ], function( err, results ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }
      if(results.affectedRows == 1){
        res.json({
          result: true,
          msg: "됬습니다",
        });
      }else{
        res.json({
          result: false,
          msg: "update실패",
        });

      }

    });
  };

})
.get((req, res)=>{

  pool.query('select history from saving_okja.usr where id=?',[req.query.id], function( err, rows ) {

    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    if(rows[0].length !== 0){
      res.status(200).json({
        result: true,
        msg: "history 입니다.",
        data: rows[0].history
      });
    }else{
      res.status(200).json({
        result: true,
        msg: "history가 없습니다",
      });
    }

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
