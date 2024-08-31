export default () => ({
  environment: process.env.NODE_ENV || `development`,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABSE_PORT, 10) || 5433,
  },
});
