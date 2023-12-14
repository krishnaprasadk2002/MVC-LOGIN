

const is_login = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in
            next();
        } else {
            // User is not logged in
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
        // Handle the error, 
        res.status(500).send('Internal Server Error');
    }
};

const is_logout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in
            res.redirect('/admin/dashboard');
        } else {
            // User is not logged in
            next();
        }
    } catch (error) {
        console.log(error.message);
        // Handle the error
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { is_login, is_logout };
