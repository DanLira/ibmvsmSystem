const proxy = [
    {
      context: '/api',
      target: 'http://localhost:5001'
    }
  ];
  module.exports = proxy;