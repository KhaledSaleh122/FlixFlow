import dotenv from 'dotenv'
dotenv.config();
function isLocalNetworkOrigin(origin) {
    if (origin && origin.startsWith('http://192.168.1.')) {
      return true;
    }
    return false;
}
const allowedOrigins = ['http://localhost:5173',`${process.env.SERVERURL}:5173`,process.env.SERVERURL,`${process.env.SERVERURL}:4000`,`${process.env.SERVERURL}:80`,`${process.env.SERVERURL}:8080`];
  
export const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || isLocalNetworkOrigin(origin) || !origin ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
};