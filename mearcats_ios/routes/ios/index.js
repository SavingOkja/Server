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
})
.put((req, res)=>{
  pool.query('update saving_okja.usr set value_0 = ?,value_1 = ?,value_2=?,value_3=?,value_4=?,value_5=?,value_6=?,value_7=?,value_8=? where id = ?;',
  [ req.body.value_0, req.body.value_1,req.body.value_2,req.body.value_3,req.body.value_4,req.body.value_5,req.body.value_6,req.body.value_7,req.body.value_8, req.body.id ], function( err, results ) {
    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    if( results.affectedRows > 0){
      res.status(200).json({
        result: true,
        msg: "됬습니다",
      });
    }
    else{
      res.status(200).json({
        result: false,
        msg: "실패",
      });
    }


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
    fv = JSON.parse(fv);
    if( fv !== null){
      fv.push(req.body.company_id);
    }


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

router.route('/matching')
.get((req, res)=>{

  pool.query('select kinds from saving_okja.company where id=?',
  [req.query.company_id], function( err, rows ) {

    if (err){
      console.log(err);
      res.json({
        result: false,
        msg: "db 접속 에러",
        qry: this.sql
      });
      return;
    }

    if( rows[0].kinds === 0 ){
      FOOD();
    }else if (rows[0].kinds === 1) {
      COSMETIC();
    }else if (rows[0].kinds === 2) {
      CLOTHING();
    }

  });

  const FOOD = ()=>{//1-5,7-9
    pool.query('select value_0,value_1,value_2,value_3,value_4,value_6,value_7,value_8 from saving_okja.usr where id=?',
    [req.query.user_id], function( err, rows ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

      rows = rows[0];

      let arr=[];
      for(let i = 0; i<=4; i++)
        arr.push(rows["value_"+i]);

      for(let d=6; d<=8; d++)
        arr.push(rows["value_"+d]);

      console.log("arr",arr);
      let zeroArr = arr.filter((item) => item === 0 );
      let oneArr = arr.length - zeroArr.length;
	console.log("newArr.length", zeroArr.length);
	console.log("array",oneArr);      



    });
  };

  const COSMETIC = ()=>{//1-6
    pool.query('select value_0,value_1,value_2,value_3,value_4,value_5 from saving_okja.usr where id=?',
    [req.query.user_id], function( err, rows ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

    });
  };

  const CLOTHING = ()=>{//1-5
    pool.query('select value_0,value_1,value_2,value_3,value_4 from saving_okja.usr where id=?',
    [req.query.user_id], function( err, rows ) {

      if (err){
        console.log(err);
        res.json({
          result: false,
          msg: "db 접속 에러",
          qry: this.sql
        });
        return;
      }

    });

  };


});




module.exports = router;
