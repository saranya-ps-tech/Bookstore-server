const { json } = require('express')
const books = require('../models/bookModel')
const stripe = require('stripe')('sk_test_51SRFUUCqXH3wXOaAA50g2jue43QzBk3ACPJDGv0CNkkyhpCLzV6sxsH9E4gKcQh6H8UhKkCrle38eEKIam4DDa7G001V8N51lQ')


//add book
exports.addBookController = async (req, res) => {
  console.log("Inside addBookController");

  //console.log(req.body);
  //console.log(req.files);


  const {
    title,
    author,
    noOfPages,
    imageUrl,
    price,
    discountPrice,
    abstract,
    publisher,
    language,
    isbn,
    category
  } = req.body;

  const userMail = req.payload; // Assuming you set this in jwtMiddleware
  const uploadImg = [];

  // Push uploaded file names into uploadImg
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      uploadImg.push(file.filename);
    });
  }

  console.log(
    title,
    author,
    noOfPages,
    imageUrl,
    price,
    discountPrice,
    abstract,
    publisher,
    language,
    isbn,
    category,
    uploadImg,
    userMail
  );

  try {
    // Check if book already exists for this user
    const existingBook = await books.findOne({ title, userMail });
    if (existingBook) {
      return res.status(401).json({ message: "You have already added the book" });
    }

    // Create new book
    const newBook = new books({
      title,
      author,
      noOfPages,
      imageUrl,
      price,
      discountPrice,
      abstract,
      publisher,
      language,
      isbn,
      category,
      uploadImg,
      userMail
    });

    await newBook.save();
    res.status(200).json(newBook);

  } catch (err) {
    res.status(500).json(err);
  }



}

//get home books
exports.getHomeBooksController = async (req, res) => {
  console.log("Inside getHomeBooks");
  try {
    const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(allHomeBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// get all books
exports.getAllBooksController = async (req, res) => {
  console.log("Inside getAllBooks");
  const searchKey = req.query.search
  const email = req.payload
  const query = {
    title: { $regex: searchKey, $options: 'i' },
    userMail: { $ne: email }
  }

  try {
    const allBooks = await books.find(query)
    res.status(200).json(allBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

//viewBook
exports.viewBookController = async (req, res) => {
  console.log("Inside viewBookController");
  const { id } = req.params
  console.log(id);
  try {
    const viewBook = await books.findById({ _id: id })
    res.status(200).json(viewBook)
  } catch (err) {
    res.status(500).json(err)
  }
}

// get all user books
exports.getAllUserBooksController = async (req, res) => {
  console.log("Inside getAllUserBooksController");
  const email = req.payload

  try {
    const allUserBooks = await books.find({ userMail: email })
    res.status(200).json(allUserBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// get all user bought books
exports.getAllUserBoughtBooksController = async (req, res) => {
  console.log("Inside getAllUserBoughtBooksController");
  const email = req.payload

  try {
    const allUserBoughtBooks = await books.find({ bought: email })
    res.status(200).json(allUserBoughtBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// removing user upload book
exports.deleteUserBookController = async (req, res) => {
  console.log("inside deleteUserBookController");
  //get book id
  const { id } = req.params
  console.log(id);
  try {
    await books.findByIdAndDelete({ _id: id })
    res.status(200).json("Deleted Successfully!!!")
  } catch (err) {
    res.status(500).json(err)
  }
}

//get all books to admin
exports.getAllBooksAdminController = async (req, res) => {
  console.log("Inside getAllBooksAdminController");
  try {
    const allAdminBooks = await books.find()
    res.status(200).json(allAdminBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}


//update book status
exports.updateBookStatusController = async (req, res) => {
  console.log("Inside updateBookStatusController");
  const { _id, title, author, noOfPages, imageUrl, price, discountPrice, abstract, publisher, language, isbn, category, uploadImg, status, userMail, bought } = req.body
  try {
    const updateBook = await books.findByIdAndUpdate({ _id }, { title, author, noOfPages, imageUrl, price, discountPrice, abstract, publisher, language, isbn, category, uploadImg, status: "approved", userMail, bought }, { new: true })
    await updateBook.save()
    res.status(200).json(updateBook)
  } catch (err) {
    res.status(500).json(err)
  }
}

//make payemnet
exports.makeBookPaymentController = async (req, res) => {
  console.log("Inisde makeBookPaymentController");
  const { _id, title, author, noOfPages, imageUrl, price, discountPrice, abstract, publisher, language, isbn, uploadImg,
    category, userMail } = req.body
  const email = req.payload
  try {
    const updateBookDetails = await books.findByIdAndUpdate({ _id }, {
      title, author, noOfPages, imageUrl, price, discountPrice, abstract, publisher, language, isbn, category,
      uploadImg, status: 'sold', userMail, bought: email
    }, { new: true })
    console.log(updateBookDetails);

    //stripe checkout session
    const line_items = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: title,
          description: `${author} | ${publisher}`,
          images: [imageUrl],
          metadata: {
            title, author, noOfPages, imageUrl, price, discountPrice, abstract, publisher, language, isbn,
            category, status: 'sold', userMail, bought: email
          }
        },
        unit_amount: Math.round(discountPrice * 100)
      },
      quantity: 1
    }]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/payment-success',
      cancel_url: 'http://localhost:5173/payment-error'
    });

    console.log(session);

    res.status(200).json({ checkoutSessionURL: session.url })
  } catch (err) {
    res.status(500).json(err)
  }
}


