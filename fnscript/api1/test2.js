async function main() {
  const { location = 'guang zhou' } = ctx.query;
  const url = `http://api.weatherstack.com/current?access_key=95f5ee664befefc1c49fa0dac0da19c7&query=${location}`;
  
  const res = await ctx.curl(url, { dataType: 'json' });
  
  return res.data;
};