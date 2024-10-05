const userServiceFunctionality = require('../functions/users.service');
const jsonWebToken = require('jsonwebtoken');

const getUserById = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.getUserById(request.params.userId);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const getAllUsers = async (request, response) => {
    try {
        const userList = await userServiceFunctionality.getAllUsers();
        response.status(200).json(userList);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const getUserByEmail = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.getUserByEmail(request.body.email);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const getUserByName = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.getUserByName(request.params.name);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const getUserDetails = async (request, response) => {
    try {
        const { token } = request.body;
        const decodedToken = jsonWebToken.decode(token);
        const userId = decodedToken.id;
        const userEntity = await userServiceFunctionality.getUserById(userId);
        userEntity.password = undefined;
        userEntity.books = undefined;
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const createUser = async (request, response) => {
    try {
        const newUser = { ...request.body };
        newUser.name = newUser.name.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ');
        newUser.email = newUser.email.toLowerCase();
        const createdUser = await userServiceFunctionality.createUser(newUser);
        response.status(201).json(createdUser);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
const deleteUser = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.deleteUser(request.params.userId);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
const updateUser = async (request, response) => {
    try {

        const userIdParams = request.params.userId;
        const { token, updatedUserDetails } = request.body;
        const decodedToken = jsonWebToken.decode(token);
        const userId = userIdParams ? userIdParams : decodedToken.id;
        const userEntity = await userServiceFunctionality.getUserById(userId);
        if (userEntity.isAdmin && decodedToken.id === userId) {
            updatedUserDetails.isAdmin = true;
        }
        updatedUserDetails.name = updatedUserDetails.name.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(' ');
        updatedUserDetails.email = updatedUserDetails.email.toLowerCase();
        const updatedUser = await userServiceFunctionality.updateUser(userId, updatedUserDetails);
        updatedUser.password = undefined;
        response.status(200).json({ message: "User updated successfully" });
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const userLogin = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.getUserByEmail(request.body.email.toLowerCase());
        if (!userEntity) {
            return response.status(400).json({ error: "Email not found" });
        }
        if (userEntity.password !== request.body.password) {
            return response.status(400).json({ error: "Password is incorrect" });
        }
        const token = jsonWebToken.sign({ id: userEntity._id, isAdmin: userEntity.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '365d',
        });
        response.status(200).json({ token: token });
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const login = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.login(request.body);
        request.session.user = userEntity;
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
const logout = async (request, response) => {
    try {
        request.session.destroy();
        response.status(200).json({ message: 'User logged out' });
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const getUserBooks = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.getUserBooks(request.params.id);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
const addBookToUser = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.addBooksToUser(request.params.id, request.body);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
const removeBookFromUser = async (request, response) => {
    try {
        const userEntity = await userServiceFunctionality.removeBookFromUser(request.params.id, request.body);
        response.status(200).json(userEntity);
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}

const isBookExist = async (request, response) => {
    try {
        const { token } = request.body;
        const { userId } = request.params;
        const decodedToken = jsonWebToken.decode(token);
        const userEntity = await userServiceFunctionality.getUserById(decodedToken.id);
        const book = userEntity.books.find(book => book._id == userId);
        if (book) {
            response.status(200).json({ isExist: true });
        } else {
            response.status(200).json({ isExist: false });
        }
    } catch (errorInstance) {
        response.status(500).json({ message: errorInstance.message });
    }
}
module.exports = {
    getAllUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    getUserDetails,
    createUser,
    deleteUser,
    updateUser,
    login,
    logout,
    getUserBooks,
    addBookToUser,
    removeBookFromUser,
    userLogin,
    isBookExist
}