const Order = require('../models/OrderSchema');
const { Types: { ObjectId } } = require('mongoose');

const getLastTenDaysSales = async () => {
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);  // Get the date 10 days ago

        // Aggregate orders from the last 10 days
        const sales = await Order.aggregate([
            {
                $match: {
                    date: { $gte: tenDaysAgo }  // Filter orders by date (last 10 days)
                }
            },
            {
                $group: {
                    _id: null,  // You can group by different fields if needed (e.g., date or author)
                    totalSales: { $sum: '$totalPrice' },  // Sum of total prices (total sales)
                    totalOrders: { $count: {} }  // Count of total orders
                }
            }
        ]);

        return sales[0] || { totalSales: 0, totalOrders: 0 };  // Return the result or default to 0 if no sales
    } catch (error) {
        console.error('Error retrieving sales from the last 10 days:', error);
        throw new Error(error.message);
    }
};








const getMonthlyAveragePurchases = async () => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: { 
                        month: { $month: "$date" }, 
                        year: { $year: "$date" }
                    },
                    totalBooksPurchased: { $sum: { $size: "$books" } }  // Sum of books in each order
                }
            },
            
            {
                $group: {
                    _id: null, // 
                    averagePurchasesPerMonth: { $avg: "$totalBooksPurchased" }
                }
            }
        ]);

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error in aggregation: ", error);
    }
};



const getOrdersByAuthor = async (author) => {
    if (!author) {
        throw new Error('Author is required');
    }

    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'books', 
                    localField: 'books', 
                    foreignField: '_id', 
                    as: 'orderedBooks' 
                }
            },
            {
                $unwind: '$orderedBooks' // Deconstructs the orderedBooks array
            },
            {
                $match: {
                    'orderedBooks.author': author 
                }
            },
            {
                $group: {
                    _id: '$_id', 
                    books: { $push: '$orderedBooks' }, 
                    date: { $first: '$date' } 
                }
            }
        ]);

        return orders;
    } catch (error) {
        console.error('Error retrieving orders by author: ', error);
        throw new Error(error.message);
    }
};


const getMonthlyOrders = async () => {
    try {
        const sales = await Order.aggregate([
            {
                $project: {
                    month: { $month: '$date' },  // Extract month from the order date
                    year: { $year: '$date' }    // Extract year from the order date
                }
            },
            {
                $group: {
                    _id: { year: '$year', month: '$month' },  // Group by year and month
                    totalOrders: { $sum: 1 }  // Count the number of orders for each month
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }  // Sort by most recent months
            }
        ]);

        return sales;
    } catch (error) {
        console.error('Error retrieving monthly orders:', error);
        throw new Error(error.message);
    }
};

const getSalesPerBook = async () => {
    try {
        // Aggregate to count the number of times each book has been ordered
        const salesData = await Order.aggregate([
            {
                $unwind: '$books' // Unwind the books array in each order
            },
            {
                $group: {
                    _id: '$books', // Group by the bookId
                    count: { $sum: 1 } // Count the number of occurrences
                }
            },
            {
                $lookup: {
                    from: 'books', // The collection to join with
                    localField: '_id', // The field from the input documents
                    foreignField: '_id', // The field from the documents of the "from" collection
                    as: 'bookDetails' // The name of the new array field to add to the input documents
                }
            },
            {
                $unwind: '$bookDetails' // Unwind the bookDetails array to get a single object
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the output
                    bookName: '$bookDetails.name', // Include the book name
                    count: 1 // Include the count
                }
            }
        ]);

        // Transform the result into an array of objects
        const salesPerBook = salesData.map(({ bookName, count }) => ({
            bookName,
            count
        }));

        return salesPerBook;
    } catch (error) {
        console.error('Error retrieving sales data for books: ', error);
        throw new Error(error.message);
    }
}

module.exports = {
    getMonthlyAveragePurchases,
    getOrdersByAuthor,
    getSalesPerBook,
    getLastTenDaysSales,
    getMonthlyOrders
}
