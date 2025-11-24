const express=require('express')
const userController=require('../controllers/userController')
const bookController=require('../controllers/bookController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')
const multerConfig = require('../middlewares/imageMulterMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')
const router=express.Router()
const jobController=require('../controllers/jobController')
const applicationController=require('../controllers/applicationController')
const pdfMulterConfig = require('../middlewares/pdfMulterMiddleware')

//register
router.post('/register',userController.registerController)


//login
router.post('/login',userController.loginController)

//googlelogin
router.post('/google-login',userController.googleLoginController)

//add-book
router.post('/add-book',jwtMiddleware,multerConfig.array('uploadImges',3),bookController.addBookController)

//home-books
router.get('/home-books',bookController.getHomeBooksController)

//all-books
router.get('/all-books',jwtMiddleware, bookController.getAllBooksController)

//view-book
router.get('/books/:id/view',jwtMiddleware, bookController.viewBookController)

//get user books
router.get('/user-books',jwtMiddleware,bookController.getAllUserBooksController)

//get user bought books
router.get('/user-bought-books',jwtMiddleware,bookController.getAllUserBoughtBooksController)

//delete user books
router.delete('/user-books/:id/remove',jwtMiddleware,bookController.deleteUserBookController)

//user profile update
router.put('/user-profile/edit', jwtMiddleware,multerConfig.single('profile'), userController.userProfileEditController)

//get-jobs
router.get('/all-jobs', jobController.getAllJobController)

//add-application
router.post('/application/add', jwtMiddleware, pdfMulterConfig.single('resume'), applicationController.addApplicationController)

//make payment
router.post('/make-payment', jwtMiddleware, bookController.makeBookPaymentController)


//--------------------------------authorised user - ADMIN--------------------------------
router.get('/all-user',adminJwtMiddleware,userController.getAllUsersController)

//all book list
router.get('/admin-all-books',adminJwtMiddleware,bookController.getAllBooksAdminController)

//approve-book
router.put('/admin/book/approve',adminJwtMiddleware,bookController.updateBookStatusController)

//admin profile update
router.put('/admin-profile/edit',adminJwtMiddleware,multerConfig.single('profile'),
userController.adminProfileEditController)

//add job
router.post('/add-job', adminJwtMiddleware, jobController.addJobController)

//remove job
router.delete('/job/:id/remove', adminJwtMiddleware, jobController.removeJobController)

//get-application
router.get('/all-applications', adminJwtMiddleware, applicationController.getApplicationController)






module.exports = router





