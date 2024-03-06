import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/userModel';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "Testing?";

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in .env file');
}

// Configuration for JWT strategy
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  }, async (payload, done) => {
    try {
      // Find the user specified in token
      const user = await UserModel.findOne({ id: payload.id });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }}
));

passport.serializeUser((user, cb) => {
    process.nextTick(function() {
        return cb(null, user)
    })
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserModel.findOne({ id });

    if (!user) {
      return done(new Error('User not found'));
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

// passport.use(new LocalStrategy({...});
// passport.use(new GoogleStrategy({...});
// passport.use(new FacebookStrategy({...});
