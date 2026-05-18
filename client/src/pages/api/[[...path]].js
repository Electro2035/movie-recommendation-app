// Memanggil aplikasi Express dari folder server
import app from '../../../server/index';

// Mematikan parser bawaan Next.js agar Express bisa menangani JSON/Body sendiri
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

// Meneruskan request dari Next.js ke mesin Express
export default function handler(req, res) {
  return app(req, res);
}