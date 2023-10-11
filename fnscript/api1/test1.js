async function main() {
       ctx.set('ETag', 'bbbbb');
	   //dd dddd
       const [rows]= await  db.execute("select * from device where id='00001'");
       return rows;
};