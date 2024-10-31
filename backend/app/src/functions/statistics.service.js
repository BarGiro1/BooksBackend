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



const getSalesPerBook = async () => {
    try {
        const salesData = await Order.aggregate([
            {
                $lookup: {
                    from: 'books', 
                    localField: 'books', 
                    foreignField: '_id',
                    as: 'orderedBooks' 
                }
            },
            {
                $unwind: '$orderedBooks' // Deconstruct the orderedBooks array
            },
            {
                $group: {
                    _id: '$orderedBooks._id', 
                    name: { $first: '$orderedBooks.name' },
                    totalSales: { $sum: 1 } 
                }
            },
            {
                $sort: { totalSales: -1 } 
            }
        ]);

        return salesData;
    } catch (error) {
        console.error('Error retrieving sales per book: ', error);
        throw new Error(error.message);
    }
};

module.exports = {
    getMonthlyAveragePurchases,
    getOrdersByAuthor,
    getSalesPerBook,
}
