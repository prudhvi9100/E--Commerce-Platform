const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    console.log("--- GOOGLE AUTH CONFIG ---");
    console.log("ClientID:", process.env.GOOGLE_CLIENT_ID);
    console.log("ClientSecret:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded (Hidden)" : "MISSING");
    console.log("CallbackURL:", 'http://localhost:5000/api/auth/google/callback');
    console.log("--------------------------");

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/auth/google/callback` : 'http://localhost:5000/api/auth/google/callback'
                },
                async (accessToken, refreshToken, profile, done) => {
                    console.log("Google Strategy Initialized");
                    try {
                        let user = await User.findOne({ googleId: profile.id });
                        if (user) return done(null, user);

                        if (profile.emails && profile.emails.length > 0) {
                            const email = profile.emails[0].value;
                            user = await User.findOne({ email: email });
                            if (user) {
                                user.googleId = profile.id;
                                if (!user.avatar || user.avatar.includes('placeholder')) {
                                    user.avatar = profile.photos[0].value;
                                }
                                await user.save();
                                return done(null, user);
                            }
                        }

                        const newUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            avatar: profile.photos[0].value,
                            password: 'generated-google-password-' + Date.now(),
                            role: 'customer'
                        };
                        user = await User.create(newUser);
                        done(null, user);
                    } catch (err) {
                        console.error(err);
                        done(err, null);
                    }
                }
            )
        );
    } else {
        console.log("Skipping Google OAuth - Missing credentials");
    }

    const GitHubStrategy = require('passport-github2').Strategy;
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/auth/github/callback` : "http://localhost:5000/api/auth/github/callback"
                },
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await User.findOne({ githubId: profile.id });
                        if (user) return done(null, user);

                        if (profile.emails && profile.emails.length > 0) {
                            const email = profile.emails[0].value;
                            user = await User.findOne({ email: email });
                            if (user) {
                                user.githubId = profile.id;
                                if (!user.avatar || user.avatar.includes('placeholder')) {
                                    user.avatar = profile.photos[0].value;
                                }
                                await user.save();
                                return done(null, user);
                            }
                        }

                        const newUser = {
                            githubId: profile.id,
                            name: profile.displayName || profile.username,
                            email: (profile.emails && profile.emails[0].value) || `${profile.username}@github.com`,
                            avatar: profile.photos[0].value,
                            password: 'generated-github-password-' + Date.now(),
                            role: 'customer'
                        };
                        user = await User.create(newUser);
                        done(null, user);
                    } catch (err) {
                        console.error(err);
                        done(err, null);
                    }
                }
            )
        );
    } else {
        console.log("Skipping GitHub OAuth - Missing credentials");
    }
};
