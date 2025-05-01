const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

/*
    All methods here inside graphql objects are native to sequelize.
    You have to use the API provided by your database provider.
    You have to manually return those data!
*/
module.exports = {
    Query: {
        users: async (_parent, args, context) => {
            let where = args.id ? { id: args.id } : undefined

            return context.models.User.findAll({ where })
        },
        user: async (_parent, args, context) => {
            // If a token is provided, let user in without login
            if(args.token){
                let decoded_token = jwt.verify(args.token, process.env.JWT_SECRET);
                return decoded_token.userId ? true : false
                // context.models.User.findOne({ where: { id: decoded_token.userId } })
            }else if(args.id){
                let user = await context.models.User.findOne({ where: { id: args.id } })
                return user ? true : false
            }

        },
        
        tasks: async (_parent, args, context) => {
            // This will be bugged since this only accepts token now instead of owner.
            let where = args.owner ? { owner: args.owner } : undefined

            // If a token is provided, return tasks by owner
            if(args.token){
                let decoded_token = jwt.verify(args.token, process.env.JWT_SECRET);
                where = { owner: decoded_token.userId }
            }

            return context.models.Task.findAll({ where })
        },
        task: async (_parent, args, context) => context.models.Task.findOne({ where: { id: args.id } }),
    },

    Mutation: {
        // Login. Logout does not need mutation since its jwt.
        login: async(_parent, args, context) => {
            let jwt_secret = process.env.JWT_SECRET

            // Verify first if email exists
            let userData = await context.models.User.findOne({ where: { email: args.user.email } })
            if(!userData) return false

            let isValid = await bcrypt.compare(args.user.password, userData.password)
            if(!isValid) {
                return 'Invalid credentials';
            }

            let token = jwt.sign({ userId: userData.id }, jwt_secret, { expiresIn: '1h' });

            return {
                token,
            }
        },

        // User mutations
        createUser: async(_parent, args, context) => {
            try {
                let hashedPassword = await bcrypt.hash(args.user.password, 10)
                await context.models.User.create({ 
                    name: args.user.name,
                    email: args.user.email,
                    password: hashedPassword
                });

                return { status: true, message: 'Account created successfully' };
            } catch (error) {
                return { status: false, message: error.errors[0].message };
            }
        },

        deleteUser: async(_parent, args, context) => {
            // Verify first the email then the password
            let userData = await context.models.User.findOne({ where: { email: args.user.email } })
            if(!userData) return false

            let isValid = await bcrypt.compare(args.user.password, userData.password)
            if(!isValid) return false

            let deleted = await context.models.User.destroy({ where: { email: args.user.email } })
            return deleted > 0;
        },

        // Task mutations
        createTask: async(_parent, args, context) => {
            try {
                if(args.task.owner){
                    let decoded_token = jwt.verify(args.task.owner, process.env.JWT_SECRET);
                    await context.models.Task.create({ 
                        name: args.task.name,
                        owner: decoded_token.userId,
                        details: args.task.details
                    });
                    return true;
                }

            } catch (error) {
                return false;
            }
        },

        updateTask: async(_parent, args, context) => {
            let task = await context.models.Task.update({ 
                name: args.task.name,
                details: args.task.details
            }, { where : { id : args.task.id }});

            return task > 0
        },

        deleteTask: async(_parent, args, context) => {
            let deleted = await context.models.Task.destroy({ where: { id: args.task.id } })

            return deleted > 0
        },
        
    },
}